// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.17;

import "forge-std/Test.sol";
import {JasmineOracleV1} from "src/versions/JasmineOracleV1.sol";
import {JasmineOracleV2} from "src/JasmineOracleV2.sol";
import {ERC1967UUPSProxy} from "src/ERC1967UUPSProxy.sol";

contract JasmineOracleTest is Test {
  JasmineOracleV1 internal oracle;

  bytes32 internal constant _IMPLEMENTATION_SLOT =
    bytes32(uint256(keccak256("eip1967.proxy.implementation")) - 1);
  address internal constant minter = address(uint160(uint256(keccak256("minter"))));
  address internal constant nobody = address(uint160(uint256(keccak256("nobody"))));

  function setUp() external {
    vm.label(minter, "minter");
    vm.label(nobody, "nobody");

    JasmineOracleV1 impl = new JasmineOracleV1();
    vm.label(address(impl), "JasmineOracle implementation");
    oracle = JasmineOracleV1(
      ERC1967UUPSProxy.create(address(impl), abi.encodeCall(impl.initialize, (minter, address(this))))
    );
    vm.label(address(oracle), "JasmineOracle");
  }

  event Upgraded(address indexed implementation);

  function testUpgrade() external {
    JasmineOracleV2 newImpl = new JasmineOracleV2();
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

  function testV2UpdateSeries() external {
    JasmineOracleV2 newImpl = new JasmineOracleV2();
    vm.label(address(newImpl), "JasmineOracle new implementation");
    oracle.upgradeTo(address(newImpl));

    JasmineOracleV2 oracleV2 = JasmineOracleV2(address(oracle));

    uint128 uuid = uint128(uint256(keccak256("uuid")));
    uint32 registry = 1;
    uint40 vintage = uint40(block.timestamp);
    uint256 id = (uint256(uuid) << 128) |
      (uint256(registry) << 96) |
      (uint256(vintage) << 56);
    
    uint8 version = 2;
    uint16 countryCode = 42;
    uint16 regionCode = 42;
    uint16 subRegionCode = 42;
    bytes memory metadata = abi.encode(
      version,
      uuid,
      registry,
      vintage,
      uint32(1),
      uint32(1),
      uint32(1),
      countryCode,
      regionCode,
      subRegionCode
    );

    vm.prank(minter); oracleV2.updateSeries(id, metadata);
    assertEq(oracleV2.getUUID(id), uuid);
    assertEq(oracleV2.getFuelType(id), 1);
    assertEq(oracleV2.getCertificateType(id), 1);
    assertEq(oracleV2.getEndorsement(id), 1);
    assertEq(oracleV2.getRegistry(id), registry);
    assertEq(oracleV2.getVintage(id), vintage);
    (uint16 actualCountryCode, uint16 actualRegionCode, uint16 actualSubRegionCode) = oracleV2.getLocationData(id);
    assertEq(actualCountryCode, countryCode);
    assertEq(actualRegionCode, regionCode);
    assertEq(actualSubRegionCode, subRegionCode);
  }
}
