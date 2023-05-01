// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.17;

import "forge-std/Test.sol";
import {console} from "forge-std/console.sol";
import {JasmineMinter} from "src/JasmineMinter.sol";
import {JasmineEAT} from "src/JasmineEAT.sol";
import {JasmineOracle} from "src/JasmineOracle.sol";
import {ERC1967UUPSProxy} from "src/ERC1967UUPSProxy.sol";

contract JasmineMinterTest is Test {
  address internal bridge;
  JasmineEAT internal token;
  JasmineMinter internal minter;
  JasmineOracle internal oracle;

  bytes32 internal constant _IMPLEMENTATION_SLOT =
    bytes32(uint256(keccak256("eip1967.proxy.implementation")) - 1);
  address internal constant receiver = address(uint160(uint256(keccak256("receiver"))));
  address internal constant nobody = address(uint160(uint256(keccak256("nobody"))));
  uint256 internal constant bridgePrivKey = uint256(keccak256("bridge"));

  bytes32 domainTypeHash =
    keccak256(
      "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
    );

  function predict(address deployer, uint8 nonce) internal pure returns (address) {
    return
      address(
        uint160(
          uint256(
            keccak256(
              abi.encodePacked(bytes1(0xd6), bytes1(0x94), deployer, bytes1(nonce))
            )
          )
        )
      );
  }

  function setUp() external {
    vm.label(receiver, "receiver");
    vm.label(nobody, "nobody");

    bridge = vm.addr(bridgePrivKey);
    vm.label(bridge, "bridge");

    address minterPrediction = predict(address(this), 6);

    JasmineEAT eatImpl = new JasmineEAT();
    vm.label(address(eatImpl), "JasmineEAT implementation");
    token = JasmineEAT(
      ERC1967UUPSProxy.create(
        address(eatImpl),
        abi.encodeCall(eatImpl.initialize, ("", minterPrediction, address(this)))
      )
    );
    vm.label(address(token), "JasmineEAT");

    JasmineOracle oracleImpl = new JasmineOracle();
    vm.label(address(oracleImpl), "JasmineOracle implementation");
    oracle = JasmineOracle(
      ERC1967UUPSProxy.create(
        address(oracleImpl),
        abi.encodeCall(oracleImpl.initialize, (minterPrediction, address(this)))
      )
    );
    vm.label(address(oracle), "JasmineOracle");

    JasmineMinter minterImpl = new JasmineMinter(address(token), address(oracle));
    vm.label(address(minterImpl), "JasmineMinter implementation");
    minter = JasmineMinter(
      ERC1967UUPSProxy.create(
        address(minterImpl),
        abi.encodeCall(minterImpl.initialize, ("JasmineMinter", "1", bridge, address(this)))
      )
    );
    vm.label(address(minter), "JasmineMinter");
    assertEq(address(minter), minterPrediction);
  }

  event Upgraded(address indexed implementation);

  function testUpgrade() external {
    JasmineMinter newImpl = new JasmineMinter(address(token), address(oracle));
    vm.label(address(newImpl), "JasmineMinter new implementation");
    bytes32 originalImpl = vm.load(address(minter), _IMPLEMENTATION_SLOT);
    assertLe(uint256(originalImpl), type(uint160).max);
    bytes32 slotValue = bytes32(uint256(uint160(address(newImpl))));
    assertFalse(originalImpl == slotValue);
    vm.expectEmit(true, true, true, true, address(minter));
    emit Upgraded(address(newImpl));
    minter.upgradeTo(address(newImpl));
    assertEq(vm.load(address(minter), _IMPLEMENTATION_SLOT), slotValue);
    vm.expectRevert("Ownable: caller is not the owner");
    vm.prank(nobody); minter.upgradeTo(address(uint160(uint256(originalImpl))));
  }

  event BridgeChanged(address indexed newBridge);

  function testSetBridge() external {
    vm.expectEmit(true, true, true, true, address(minter));
    emit BridgeChanged(nobody);
    minter.setBridge(nobody);
    vm.expectRevert("Ownable: caller is not the owner");
    vm.prank(bridge); minter.setBridge(nobody);
  }

  function typedData(bytes32 domain, bytes32 _struct) internal pure returns (bytes32) {
    return keccak256(abi.encodePacked("\x19\x01", domain, _struct));
  }

  function testDomainSeparator() external {
    assertEq(minter.name(), "JasmineMinter");
    assertEq(minter.version(), "1");
    bytes32 _struct = keccak256(
      abi.encode(
        domainTypeHash,
        keccak256("JasmineMinter"),
        keccak256("1"),
        block.chainid,
        address(minter)
      )
    );
    assertEq(minter.DOMAIN_SEPARATOR(), _struct);
  }

  function getOracleData(uint256 series) internal view returns (uint256, bytes memory) {
    uint256 uuid = uint128(
      uint256(keccak256(bytes.concat("EAT UUID\x00", bytes32(series))))
    );
    uint32 registry = 1;
    uint40 vintage = uint40(block.timestamp);
    uint256 id = (uint256(uuid) << 128) |
      (uint256(registry) << 96) |
      (uint256(vintage) << 56);
    bytes memory metadata = abi.encode(
      uint8(1),
      uuid,
      registry,
      vintage,
      uint32(1),
      uint32(1),
      uint32(1)
    );
    return (id, metadata);
  }

  event NonceConsumed(bytes32 indexed nonce);
  event TransferSingle(
    address indexed operator,
    address indexed from,
    address indexed to,
    uint256 id,
    uint256 value
  );

  function testMint() external {
    bytes32 nonce = bytes32(uint256(1));
    (uint256 id, bytes memory oracleData) = getOracleData(1);
    uint256 deadline = block.timestamp + 1 days;
    bytes32 structHash = keccak256(
      abi.encode(
        minter.MINT_TYPEHASH(),
        nobody,
        id,
        uint256(1),
        keccak256(oracleData),
        deadline,
        nonce
      )
    );
    bytes32 sigHash = typedData(minter.DOMAIN_SEPARATOR(), structHash);
    (uint8 v, bytes32 r, bytes32 s) = vm.sign(bridgePrivKey, sigHash);

    vm.expectEmit(true, true, true, true, address(minter));
    emit NonceConsumed(nonce);
    vm.expectEmit(true, true, true, true, address(token));
    emit TransferSingle(address(minter), address(0), receiver, id, 1);

    vm.prank(nobody); minter.mint(receiver, id, 1, "", oracleData, deadline, nonce, abi.encodePacked(r, s, v));
    assertEq(token.balanceOf(receiver, id), 1);
    assertTrue(minter.consumedNonces(nonce));

    vm.expectRevert("JasmineMinter: nonce replay");
    vm.prank(nobody); minter.mint(receiver, id, 1, "", oracleData, deadline, nonce, abi.encodePacked(r, s, v));

    vm.expectRevert("JasmineMinter: bad signature/wrong signer");
    minter.mint(receiver, id, 1, "", oracleData, deadline, nonce, abi.encodePacked(r, s, v));

    vm.expectRevert("JasmineMinter: bad signature/wrong signer");
    vm.prank(nobody); minter.mint(receiver, 1, 1, "", oracleData, deadline, nonce, abi.encodePacked(r, s, v));

    vm.expectRevert("JasmineMinter: bad signature/wrong signer");
    vm.prank(nobody); minter.mint(receiver, id, 2, "", oracleData, deadline, nonce, abi.encodePacked(r, s, v));

    vm.expectRevert("JasmineMinter: bad signature/wrong signer");
    vm.prank(nobody); minter.mint(receiver, id, 1, "", "", deadline, nonce, abi.encodePacked(r, s, v));

    vm.expectRevert("JasmineMinter: bad signature/wrong signer");
    vm.prank(nobody);
    minter.mint(
      receiver,
      id,
      1,
      "",
      oracleData,
      deadline,
      bytes32(uint256(nonce) + 1),
      abi.encodePacked(r, s, v)
    );

    // The optimizer does bad things to the value of `deadline` in the presence
    // of a call to `vm.warp`. Therefore, we don't use `vm.warp` and instead
    // just pass a bad `deadline`. Because the deadline check happens before the
    // signature check, this fails as expected, but it is a ideologically
    // unsatisfying test.
    vm.expectRevert("JasmineMinter: expired");
    vm.prank(nobody); minter.mint(receiver, id, 1, "", oracleData, block.timestamp - 1, nonce, abi.encodePacked(r, s, v));

    vm.expectRevert("JasmineMinter: bad signature/wrong signer");
    vm.prank(nobody); minter.mint(receiver, id, 1, "", oracleData, deadline + 1, nonce, abi.encodePacked(r, s, v));
  }

  event TransferBatch(
    address indexed operator,
    address indexed from,
    address indexed to,
    uint256[] ids,
    uint256[] values
  );

  function testMintBatch() external {
    bytes32 nonce = bytes32(uint256(2));
    uint256[] memory ids = new uint256[](2);
    bytes[] memory oracleDatas = new bytes[](2);
    (ids[0], oracleDatas[0]) = getOracleData(2);
    (ids[1], oracleDatas[1]) = getOracleData(3);
    uint256[] memory amounts = new uint256[](2);
    amounts[0] = 2;
    amounts[1] = 3;
    uint256 deadline = block.timestamp + 1 days;
    bytes32 structHash = keccak256(
      abi.encode(
        minter.MINTBATCH_TYPEHASH(),
        nobody,
        keccak256(abi.encode(ids[0], ids[1])),
        keccak256(abi.encode(amounts[0], amounts[1])),
        keccak256(abi.encode(keccak256(oracleDatas[0]), keccak256(oracleDatas[1]))),
        deadline,
        nonce
      )
    );
    bytes32 sigHash = typedData(minter.DOMAIN_SEPARATOR(), structHash);
    (uint8 v, bytes32 r, bytes32 s) = vm.sign(bridgePrivKey, sigHash);

    vm.expectEmit(true, true, true, true, address(minter));
    emit NonceConsumed(nonce);
    vm.expectEmit(true, true, true, true, address(token));
    emit TransferBatch(address(minter), address(0), receiver, ids, amounts);

    vm.prank(nobody);
    minter.mintBatch(
      receiver,
      ids,
      amounts,
      "",
      oracleDatas,
      deadline,
      nonce,
      abi.encodePacked(r, s, v)
    );
    assertEq(token.balanceOf(receiver, ids[0]), amounts[0]);
    assertEq(token.balanceOf(receiver, ids[1]), amounts[1]);
    assertTrue(minter.consumedNonces(nonce));

    vm.expectRevert("JasmineMinter: nonce replay");
    vm.prank(nobody);
    minter.mintBatch(
      receiver,
      ids,
      amounts,
      "",
      oracleDatas,
      deadline,
      nonce,
      abi.encodePacked(r, s, v)
    );

    vm.expectRevert("JasmineMinter: bad signature/wrong signer");
    minter.mintBatch(
      receiver,
      ids,
      amounts,
      "",
      oracleDatas,
      deadline,
      nonce,
      abi.encodePacked(r, s, v)
    );

    vm.expectRevert("JasmineMinter: bad signature/wrong signer");
    ids[0] += 1;
    vm.prank(nobody);
    minter.mintBatch(
      receiver,
      ids,
      amounts,
      "",
      oracleDatas,
      deadline,
      nonce,
      abi.encodePacked(r, s, v)
    );
    ids[0] -= 1;

    vm.expectRevert("JasmineMinter: bad signature/wrong signer");
    amounts[0] += 1;
    vm.prank(nobody);
    minter.mintBatch(
      receiver,
      ids,
      amounts,
      "",
      oracleDatas,
      deadline,
      nonce,
      abi.encodePacked(r, s, v)
    );
    amounts[0] -= 1;

    vm.expectRevert("JasmineMinter: bad signature/wrong signer");
    vm.prank(nobody);
    minter.mintBatch(
      receiver,
      ids,
      amounts,
      "",
      oracleDatas,
      deadline,
      bytes32(uint256(nonce) + 1),
      abi.encodePacked(r, s, v)
    );

    // The optimizer does bad things to the value of `deadline` in the presence
    // of a call to `vm.warp`. Therefore, we don't use `vm.warp` and instead
    // just pass a bad `deadline`. Because the deadline check happens before the
    // signature check, this fails as expected, but it is a ideologically
    // unsatisfying test.
    vm.expectRevert("JasmineMinter: expired");
    vm.prank(nobody);
    minter.mintBatch(
      receiver,
      ids,
      amounts,
      "",
      oracleDatas,
      block.timestamp - 1,
      nonce,
      abi.encodePacked(r, s, v)
    );

    vm.expectRevert("JasmineMinter: bad signature/wrong signer");
    vm.prank(nobody);
    minter.mintBatch(
      receiver,
      ids,
      amounts,
      "",
      oracleDatas,
      deadline + 1,
      nonce,
      abi.encodePacked(r, s, v)
    );

    vm.expectRevert("JasmineMinter: bad signature/wrong signer");
    oracleDatas[0] = "";
    vm.prank(nobody);
    minter.mintBatch(
      receiver,
      ids,
      amounts,
      "",
      oracleDatas,
      deadline,
      nonce,
      abi.encodePacked(r, s, v)
    );
  }

  function testConsumeNonce() external {
    bytes32 nonce = bytes32(uint256(3));
    bytes32 structHash = keccak256(abi.encode(minter.CONSUMENONCE_TYPEHASH(), nonce));
    bytes32 sigHash = typedData(minter.DOMAIN_SEPARATOR(), structHash);
    (uint8 v, bytes32 r, bytes32 s) = vm.sign(bridgePrivKey, sigHash);

    vm.expectEmit(true, true, true, true, address(minter));
    emit NonceConsumed(nonce);

    minter.consumeNonce(nonce, abi.encodePacked(r, s, v));

    assertTrue(minter.consumedNonces(nonce));

    vm.expectRevert("JasmineMinter: nonce replay");
    minter.consumeNonce(nonce, abi.encodePacked(r, s, v));

    vm.expectRevert("JasmineMinter: bad signature/wrong signer");
    minter.consumeNonce(bytes32(uint256(nonce) + 1), abi.encodePacked(r, s, v));
  }

  event BurnedSingle(address indexed owner, uint256 id, uint256 amount, bytes metadata);

  function testBurn() external {
    vm.prank(address(minter)); token.mint(address(receiver), 1, 2, "");
    vm.prank(receiver); token.setApprovalForAll(address(minter), true);

    vm.expectEmit(true, true, true, true, address(minter));
    emit BurnedSingle(receiver, 1, 1, "some metadata");
    vm.expectEmit(true, true, true, true, address(token));
    emit TransferSingle(address(minter), receiver, address(0), 1, 1);

    vm.prank(receiver); minter.burn(1, 1, "some metadata");

    token.freeze(1);
    vm.expectRevert("JasmineMinter: frozen series");
    vm.prank(receiver); minter.burn(1, 1, "");
  }

  event BurnedBatch(
    address indexed owner,
    uint256[] ids,
    uint256[] amounts,
    bytes metadata
  );

  function testBurnBatch() external {
    uint256[] memory ids = new uint256[](2);
    ids[0] = 2;
    ids[1] = 3;
    vm.prank(address(minter)); token.mintBatch(address(receiver), ids, ids, "");
    vm.prank(receiver); token.setApprovalForAll(address(minter), true);

    vm.expectEmit(true, true, true, true, address(minter));
    emit BurnedBatch(receiver, ids, ids, "some metadata");
    vm.expectEmit(true, true, true, true, address(token));
    emit TransferBatch(address(minter), receiver, address(0), ids, ids);

    vm.prank(receiver); minter.burnBatch(ids, ids, "some metadata");

    token.freeze(2);
    vm.expectRevert("JasmineMinter: frozen series");
    vm.prank(receiver); minter.burnBatch(ids, ids, "");

    token.thaw(2);
    token.freeze(3);
    vm.expectRevert("JasmineMinter: frozen series");
    vm.prank(receiver); minter.burnBatch(ids, ids, "");
  }
}
