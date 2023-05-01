// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.17;

import "forge-std/Test.sol";
import {JasmineOracle} from "src/JasmineOracle.sol";
import {ERC1967UUPSProxy} from "src/ERC1967UUPSProxy.sol";

contract JasmineOracleTest is Test {
  JasmineOracle internal oracle;

  bytes32 internal constant _IMPLEMENTATION_SLOT =
    bytes32(uint256(keccak256("eip1967.proxy.implementation")) - 1);
  address internal constant minter = address(uint160(uint256(keccak256("minter"))));
  address internal constant nobody = address(uint160(uint256(keccak256("nobody"))));

  function setUp() external {
    vm.label(minter, "minter");
    vm.label(nobody, "nobody");

    JasmineOracle impl = new JasmineOracle();
    vm.label(address(impl), "JasmineOracle implementation");
    oracle = JasmineOracle(
      ERC1967UUPSProxy.create(address(impl), abi.encodeCall(impl.initialize, (minter, address(this))))
    );
    vm.label(address(oracle), "JasmineOracle");
  }

  event Upgraded(address indexed implementation);

  function testUpgrade() external {
    JasmineOracle newImpl = new JasmineOracle();
    vm.label(address(newImpl), "JasmineOracle new implementation");
    bytes32 originalImpl = vm.load(address(oracle), _IMPLEMENTATION_SLOT);
    assertLe(uint256(originalImpl), type(uint160).max);
    bytes32 slotValue = bytes32(uint256(uint160(address(newImpl))));
    assertFalse(originalImpl == slotValue);
    vm.expectEmit(true, true, true, true, address(oracle));
    emit Upgraded(address(newImpl));
    oracle.upgradeTo(address(newImpl));
    assertEq(vm.load(address(oracle), _IMPLEMENTATION_SLOT), slotValue);
    vm.expectRevert("Ownable: caller is not the owner");
    vm.prank(nobody); oracle.upgradeTo(address(uint160(uint256(originalImpl))));
  }

  event MinterChanged(address indexed newMinter);

  function testSetMinter() external {
    assertEq(oracle.minter(), minter);
    vm.expectEmit(true, true, true, true, address(oracle));
    emit MinterChanged(address(this));
    oracle.setMinter(address(this));
    assertEq(oracle.minter(), address(this));
    vm.expectRevert("Ownable: caller is not the owner");
    vm.prank(nobody); oracle.setMinter(address(this));
  }

  function testUpdateSeries() external {
    uint128 uuid = uint128(uint256(keccak256("uuid")));
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
    vm.prank(minter); oracle.updateSeries(id, metadata);
    assertEq(oracle.getUUID(id), uuid);
    assertTrue(oracle.hasRegistry(id, registry));
    assertTrue(oracle.hasVintage(id, vintage, vintage));
    assertTrue(oracle.hasFuel(id, 1));
    assertTrue(oracle.hasCertificateType(id, 1));
    assertTrue(oracle.hasEndorsement(id, 1));
  }
}
