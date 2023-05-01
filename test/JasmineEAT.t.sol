// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.17;

import "forge-std/Test.sol";
import {JasmineEAT} from "src/JasmineEAT.sol";
import {ERC1967UUPSProxy} from "src/ERC1967UUPSProxy.sol";

contract JasmineEATTest is Test {
  JasmineEAT internal token;

  bytes32 internal constant _IMPLEMENTATION_SLOT =
  bytes32(uint256(keccak256("eip1967.proxy.implementation")) - 1);
  address internal constant minter = address(uint160(uint256(keccak256("minter"))));
  address internal constant receiver = address(uint160(uint256(keccak256("receiver"))));
  address internal constant nobody = address(uint160(uint256(keccak256("nobody"))));

  function setUp() external {
    vm.label(minter, "minter");
    vm.label(receiver, "receiver");
    vm.label(nobody, "nobody");

    JasmineEAT impl = new JasmineEAT();
    vm.label(address(impl), "JasmineEAT implementation");
    token = JasmineEAT(
      ERC1967UUPSProxy.create(
        address(impl),
        abi.encodeCall(impl.initialize, ("", address(minter), address(this)))
      )
    );
    vm.label(address(token), "JasmineEAT");
  }

  event Upgraded(address indexed implementation);

  function testUpgrade() external {
    JasmineEAT newImpl = new JasmineEAT();
    vm.label(address(newImpl), "JasmineEAT new implementation");
    bytes32 originalImpl = vm.load(address(token), _IMPLEMENTATION_SLOT);
    assertLe(uint256(originalImpl), type(uint160).max);
    bytes32 slotValue = bytes32(uint256(uint160(address(newImpl))));
    assertFalse(originalImpl == slotValue);
    vm.expectEmit(true, true, true, true, address(token));
    emit Upgraded(address(newImpl));
    token.upgradeTo(address(newImpl));
    assertEq(vm.load(address(token), _IMPLEMENTATION_SLOT), slotValue);
    vm.expectRevert("Ownable: caller is not the owner");
    vm.prank(nobody); token.upgradeTo(address(uint160(uint256(originalImpl))));
  }

  event MinterChanged(address indexed newMinter);

  function testSetMinter() external {
    assertEq(token.minter(), minter);
    vm.expectEmit(true, true, true, true, address(token));
    emit MinterChanged(address(this));
    token.setMinter(address(this));
    assertEq(token.minter(), address(this));
    vm.expectRevert("Ownable: caller is not the owner");
    vm.prank(nobody); token.setMinter(address(this));
  }

  event TransferSingle(
    address indexed operator,
    address indexed from,
    address indexed to,
    uint256 id,
    uint256 value
  );
  event TransferBatch(
    address indexed operator,
    address indexed from,
    address indexed to,
    uint256[] ids,
    uint256[] values
  );

  function testMint() external {
    vm.expectEmit(true, true, true, true, address(token));
    emit TransferSingle(minter, address(0), receiver, 1, 1);
    vm.prank(minter); token.mint(receiver, 1, 1, "");
    assertEq(token.balanceOf(receiver, 1), 1);
    uint256[] memory ids = new uint256[](2);
    ids[0] = 2;
    ids[1] = 3;
    vm.expectEmit(true, true, true, true, address(token));
    emit TransferBatch(minter, address(0), receiver, ids, ids);
    vm.prank(minter); token.mintBatch(receiver, ids, ids, "");
    assertEq(token.balanceOf(receiver, 2), 2);
    assertEq(token.balanceOf(receiver, 3), 3);
    vm.expectRevert("JasmineEAT: caller is not the minter");
    token.mint(receiver, 1, 1, "");
  }

  event Frozen(uint256 indexed id);
  event Thawed(uint256 indexed id);

  function testFreeze() external {
    vm.prank(minter); token.mint(receiver, 1, 1, "");
    assertFalse(token.frozen(1));
    vm.expectEmit(true, true, true, true, address(token));
    emit Frozen(1);
    token.freeze(1);
    vm.expectRevert("JasmineEAT: frozen series");
    vm.prank(receiver); token.safeTransferFrom(receiver, nobody, 1, 1, "");
    vm.expectEmit(true, true, true, true, address(token));
    emit Thawed(1);
    token.thaw(1);
    vm.prank(receiver); token.safeTransferFrom(receiver, nobody, 1, 1, "");
    assertEq(token.balanceOf(nobody, 1), 1);
  }

  function testSlash() external {
    vm.prank(minter); token.mint(receiver, 1, 3, "");
    assertFalse(token.frozen(1));
    vm.expectRevert("JasmineEAT: series not frozen");
    token.slash(receiver, 1, 1);
    token.freeze(1);
    vm.expectRevert("Ownable: caller is not the owner");
    vm.prank(nobody); token.slash(receiver, 1, 1);
    vm.expectEmit(true, true, true, true, address(token));
    emit TransferSingle(address(this), receiver, address(0), 1, 1);
    token.slash(receiver, 1, 1);
    assertEq(token.balanceOf(receiver, 1), 2);
    vm.expectEmit(true, true, true, true, address(token));
    emit TransferSingle(receiver, receiver, address(0), 1, 1);
    vm.prank(receiver); token.burn(receiver, 1, 1);
    assertEq(token.balanceOf(receiver, 1), 1);
    token.thaw(1);
    assertEq(token.balanceOf(receiver, 1), 1);
    vm.expectRevert("JasmineEAT: series not frozen");
    token.slash(receiver, 1, 1);
  }
}
