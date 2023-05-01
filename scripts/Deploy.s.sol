// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "forge-std/Script.sol";

import {JasmineOracle} from "src/JasmineOracle.sol";
import {JasmineEAT} from "src/JasmineEAT.sol";
import {JasmineMinter} from "src/JasmineMinter.sol";
import {ERC1967UUPSProxy} from "src/ERC1967UUPSProxy.sol";

contract DeployScript is Script {
    function setUp() public {}

    function predict(
        address deployer,
        uint256 nonce
    ) internal pure returns (address) {
        require(nonce <= 127);
        return
            address(
                uint160(
                    uint256(
                        keccak256(
                            abi.encodePacked(
                                bytes1(0xd6),
                                bytes1(0x94),
                                deployer,
                                bytes1(uint8(nonce))
                            )
                        )
                    )
                )
            );
    }

    // For best results with this script use `--ledger` and
    // `--mnemonic-derivation-paths` to configure a hardware wallet and use
    // `--slow` to avoid errors with nonce synchronization. You must also set the
    // `JASMINE_OWNER` and `JASMINE_BRIDGE` environment variables. You can use
    // `--verify` and `--verifier-url` during deployment or `forge
    // verify-contract` after.

    function run() public {
        console.log(block.chainid);

        address owner;
        address bridge;
        address deployer = msg.sender;

        if (block.chainid == 137) {
              owner = vm.envAddress("POLYGON_JASMINE_OWNER");
              bridge = vm.envAddress("POLYGON_JASMINE_BRIDGE");
        } else if (block.chainid == 80001) {
              owner = vm.envAddress("MUMBAI_JASMINE_OWNER");
              bridge = vm.envAddress("MUMBAI_JASMINE_BRIDGE");
        } else if (block.chainid == 31337) {
            owner = vm.envAddress("LOCAL_JASMINE_OWNER");
            bridge = vm.envAddress("LOCAL_JASMINE_BRIDGE");
        } else {
            revert("Unknown network");
        }

        vm.label(deployer, "deployer");
        console.log("Deploying from", deployer);

        vm.label(owner, "owner");
        console.log("Contract owner", owner);

        vm.label(bridge, "bridge");
        console.log("Bridge signer", bridge);

        address minterPrediction = predict(deployer, vm.getNonce(deployer) + 5);
        vm.label(minterPrediction, "JasmineMinter");
        console.log("minter prediction", minterPrediction);

        console.log("preflight nonce:", vm.getNonce(deployer));

        string memory tokenURI = "https://api.jasmine.energy/v1/eat/{id}.json";
        vm.startBroadcast();

        // Deploy JasmineEAT
        JasmineEAT tokenImpl = new JasmineEAT();
        vm.label(address(tokenImpl), "JasmineEAT implementation");
        JasmineEAT token = JasmineEAT(
            ERC1967UUPSProxy.create(
                address(tokenImpl),
                abi.encodeCall(
                    tokenImpl.initialize,
                    (tokenURI, minterPrediction, owner)
                )
            )
        );
        vm.label(address(token), "JasmineEAT");
        console.log("post EAT nonce:", vm.getNonce(deployer));

        // Deploy JasmineOracle
        JasmineOracle oracleImpl = new JasmineOracle();
        vm.label(address(oracleImpl), "JasmineOracle implementation");
        JasmineOracle oracle = JasmineOracle(
            ERC1967UUPSProxy.create(
                address(oracleImpl),
                abi.encodeCall(oracleImpl.initialize, (minterPrediction, owner))
            )
        );
        vm.label(address(oracle), "JasmineOracle");
        console.log("post Oracle nonce:", vm.getNonce(deployer));

        // Deploy JasmineMinter to the predicted address
        JasmineMinter minterImpl = new JasmineMinter(
            address(token),
            address(oracle)
        );
        vm.label(address(minterImpl), "JasmineMinter implementation");
        JasmineMinter minter = JasmineMinter(
            ERC1967UUPSProxy.create(
                address(minterImpl),
                abi.encodeCall(
                    minterImpl.initialize,
                    ("JasmineMinter", "1", bridge, owner)
                )
            )
        );
        vm.label(address(minter), "JasmineMinter");
        console.log("post Minter nonce:", vm.getNonce(deployer));

        console.log("Minter deployed to: ", address(minter));
        vm.stopBroadcast();

        assert(address(minter) == minterPrediction);
    }
}
