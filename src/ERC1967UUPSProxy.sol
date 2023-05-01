// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.17;

/*

      /// from https://eips.ethereum.org/EIPS/eip-1967
      /// bytes32 implSlot = bytes32(uint256(keccak256('eip1967.proxy.implementation')) - 1);
      /// implSlot == 0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc;

      /// from runtime code below
      /// bytes11 runtime0 = 0x3d3d3d3d363d3d37363d7f;
      /// bytes14 runtime1 = 0x545af43d3d93803e603757fd5bf3;

      PC | OP | Arg | Mnemonic      | [Stack]                                                                     | {Memory}
      ----------------------------------------------------------------------------------------------------------------------
      // prepare some of the arguments for runtime RETURN
      00 | 60 | 39 | PUSH1          | [runtimeSize]                                                               | {}
      02 | 60 | 15 | PUSH1          | [15 runtimeSize]                                                            | {}
      04 | 6a | runtime0 | PUSH11   | [runtime0 15 runtimeSize]                                                   | {}
      10 | 3d |    | RETURNDATASIZE | [0 runtime0 15 runtimeSize]                                                 | {}
      11 | 7f | implSlot | PUSH32   | [implSlot 0 runtime0 15 runtimeSize]                                        | {}

      // get the implementation address from code; store it in the ERC1967 slot
      32 | 60 | 14 | PUSH1          | [14 implSlot 0 runtime0 15 runtimeSize]                                     | {}
      34 | 60 | 79 | PUSH1          | [initCodeEnd 14 implSlot 0 runtime0 15 runtimeSize]                         | {}
      36 | 60 | 0c | PUSH1          | [0c initCodeEnd 14 implSlot 0 runtime0 15 runtimeSize]                      | {}
      38 | 39 |    | CODECOPY       | [implSlot 0 runtime0 15 runtimeSize]                                        | {impl}
      39 | 3d |    | RETURNDATASIZE | [0 implSlot 0 runtime0 15 runtimeSize]                                      | {impl}
      3a | 51 |    | MLOAD          | [impl implSlot 0 runtime0 15 runtimeSize]                                   | {impl}
      3b | 80 |    | DUP1           | [impl impl implSlot 0 runtime0 15 runtimeSize]                              | {impl}
      3c | 82 |    | DUP3           | [implSlot impl impl implSlot 0 runtime0 15 runtimeSize]                     | {impl}
      3d | 55 |    | SSTORE         | [impl implSlot 0 runtime0 15 runtimeSize]                                   | {impl}

      // prepare the empty returndata space for initializer DELEGATECALL
      3e | 3d |    | RETURNDATASIZE | [0 impl implSlot 0 runtime0 15 runtimeSize]                                 | {impl}
      3f | 3d |    | RETURNDATASIZE | [0 0 impl implSlot 0 runtime0 15 runtimeSize]                               | {impl}

      // copy initializer into memory and prepare calldata space for DELEGATECALL
      40 | 60 | 8d | PUSH1          | [initStart 0 0 impl implSlot 0 runtime0 15 runtimeSize]                     | {impl}
      42 | 80 |    | DUP1           | [initStart initStart 0 0 impl implSlot 0 runtime0 15 runtimeSize]           | {impl}
      43 | 38 |    | CODESIZE       | [codesize initStart initStart 0 0 impl implSlot 0 runtime0 15 runtimeSize]  | {impl}
      44 | 03 |    | SUB            | [initSize initStart 0 0 impl implSlot 0 runtime0 15 runtimeSize]            | {impl}
      45 | 80 |    | DUP1           | [initSize initSize initStart 0 0 impl implSlot 0 runtime0 15 runtimeSize]   | {impl}
      46 | 91 |    | SWAP2          | [initStart initSize initSize 0 0 impl implSlot 0 runtime0 15 runtimeSize]   | {impl}
      47 | 3d |    | RETURNDATASIZE | [0 initStart initSize initSize 0 0 impl implSlot 0 runtime0 15 runtimeSize] | {impl}
      48 | 39 |    | CODECOPY       | [initSize 0 0 impl implSlot 0 runtime0 15 runtimeSize]                      | {init}
      49 | 3d |    | RETURNDATASIZE | [0 initSize 0 0 impl implSlot 0 runtime0 15 runtimeSize]                    | {init}

      // do the initializer DELEGATECALL
      4a | 84 |    | DUP5           | [impl 0 initSize 0 0 impl implSlot 0 runtime0 15 runtimeSize]               | {init}
      4b | 5a |    | GAS            | [gas impl 0 initSize 0 0 impl implSlot 0 runtime0 15 runtimeSize]           | {init}
      4c | f4 |    | DELEGATECALL   | [success impl implSlot 0 runtime0 15 runtimeSize]                           | {init}

      // check for revert
  /-< 4d | 60 | 53 | PUSH1          | [target success impl implSlot 0 runtime0 15 runtimeSize]                    | {init}
  |   4f | 57 |    | JUMPI          | [impl implSlot 0 runtime0 15 runtimeSize]                                   | {init}
  |   50 | 82 |    | DUP3           | [0 impl implSlot 0 runtime0 15 runtimeSize]                                 | {init}
  |   51 | 80 |    | DUP1           | [0 0 impl implSlot 0 runtime0 15 runtimeSize]                               | {init}
  |   52 | fd |    | REVERT         | X                                                                           | X
  |
  |   // check that the implementation exists
  \-> 53 | 5b |    | JUMPDEST       | [impl implSlot 0 runtime0 15 runtimeSize]                                   | {init}
      54 | 3d |    | RETURNDATASIZE | [rds impl implSlot 0 runtime0 15 runtimeSize]                               | {init}
  /-< 55 | 60 | 5f | PUSH1          | [target rds impl implSlot 0 runtime0 15 runtimeSize]                        | {init}
  |   57 | 57 |    | JUMPI          | [impl implSLot 0 runtime0 15 runtimeSize]                                   | {init}
  |   58 | 3b |    | EXTCODESIZE    | [implSize implSlot 0 runtime0 15 runtimeSize]                               | {init}
/-+-< 59 | 60 | 61 | PUSH1          | [target implSize implSlot 0 runtime0 15 runtimeSize]                        | {init}
| |   5b | 57 |    | JUMPI          | [implSlot 0 runtime0 15 runtimeSize]                                        | {init}
| |
| |   // revert if the implementation doesn't exist
| |   5c | 50 |    | POP            | [0 runtime0 15 runtimeSize]                                                 | {init}
| |   5d | 80 |    | DUP1           | [0 0 runtime0 15 runtimeSize]                                               | {init}
| |   5e | fd |    | REVERT         | X
| |
| |   // return the runtime
| \-> 5f | 5b |    | JUMPDEST       | [impl implSlot 0 runtime0 15 runtimeSize]                                   | {init}
|     60 | 50 |    | POP            | [implSlot 0 runtime0 15 runtimeSize]                                        | {init}
\---> 61 | 5b |    | JUMPDEST       | [implSlot 0 runtime0 15 runtimeSize]                                        | {init}
      62 | 6d | runtime1 | PUSH14   | [runtime1 implSlot 0 runtime0 15 runtimeSize]                               | {init}
      71 | 60 | 2e | PUSH1          | [2e runtime1 implSlot 0 runtime0 15 runtimeSize]                            | {init}
      73 | 52 |    | MSTORE         | [implSlot 0 runtime0 15 runtimeSize]                                        | {.. runtime1}
      74 | 60 | 20 | PUSH1          | [20 implSlot 0 runtime0 15 runtimeSize]                                     | {.. runtime1}
      76 | 52 |    | MSTORE         | [0 runtime0 15 runtimeSize]                                                 | {.. implSlot runtime1}
      77 | 52 |    | MSTORE         | [15 runtimeSize]                                                            | {.. runtime0 implSlot runtime1}
      78 | f3 |    | RETURN         | X                                                                           | X
      79 | <implementation address>
      8d | <initializer ...>

===

      /// Runtime code adapted from the "The More-Minimal Proxy" (ERC-1167) by 0age
      /// https://web.archive.org/web/20200502182542/https://medium.com/coinmonks/the-more-minimal-proxy-5756ae08ee48

      PC | OP | Arg | Mnemonic      | [Stack]                      | {Memory}
      ---------------------------------------------------------------------------------------------------
      // push a bunch of zeroes, ultimately needed for DELEGATECALL, RETURNDATACOPY, and RETURN/REVERT
      00 | 3d |    | RETURNDATASIZE | [0]                          | {}
      01 | 3d |    | RETURNDATASIZE | [0 0]                        | {}
      02 | 3d |    | RETURNDATASIZE | [0 0 0]                      | {}
      03 | 3d |    | RETURNDATASIZE | [0 0 0 0]                    | {}

      // copy calldata into memory
      04 | 36 |    | CALLDATASIZE   | [cds 0 0 0 0]                | {}
      05 | 3d |    | RETURNDATASIZE | [0 cds 0 0 0 0]              | {}
      06 | 3d |    | RETURNDATASIZE | [0 0 cds 0 0 0 0]            | {}
      07 | 37 |    | CALLDATACOPY   | [0 0 0 0]                    | {calldata}
      08 | 36 |    | CALLDATASIZE   | [cds 0 0 0 0]                | {calldata}
      09 | 3d |    | RETURNDATASIZE | [0 cds 0 0 0 0]              | {calldata}

      // load the implementation from the ERC1967 slot
      0a | 7f | implSlot | PUSH32   | [implSlot 0 cds 0 0 0 0]     | {calldata}
      2b | 54 |    | SLOAD          | [impl 0 cds 0 0 0 0]         | {calldata}

      // DELEGATECALL to the implementation
      2c | 5a |    | GAS            | [gas impl 0 cds 0 0 0 0]     | {calldata}
      2d | f4 |    | DELEGATECALL   | [success 0 0]                | {calldata}

      // copy returndata into memory
      2e | 3d |    | RETURNDATASIZE | [rds success 0 0]            | {calldata}
      2f | 3d |    | RETURNDATASIZE | [rds rds success 0 0]        | {calldata}
      30 | 93 |    | SWAP4          | [0 rds success 0 rds]        | {calldata}
      31 | 80 |    | DUP1           | [0 0 rds success 0 rds]      | {calldata}
      32 | 3e |    | RETURNDATACOPY | [success 0 rds]              | {returnData}

      // check if the call reverted, bubble up
  /-< 33 | 60 | 37 | PUSH1          | [returnTarget success 0 rds] | {returnData}
  |   35 | 57 |    | JUMPI          | [0 rds]                      | {returnData}
  |   36 | fd |    | REVERT         | X                            | X
  \-> 37 | 5b |    | JUMPDEST       | [0 rds]                      | {returnData}
      38 | f3 |    | RETURN         | X                            | X
      39

*/

library ERC1967UUPSProxy {
  bytes private constant _INITCODE =
    hex"6039_6015_6a3d3d3d3d363d3d37363d7f_3d_7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc_6014_6079_600c_39_3d_51_80_82_55_3d_3d_608d_80_38_03_80_91_3d_39_3d_84_5a_f4_6053_57_82_80_fd_5b_3d_605f_57_3b_6061_57_50_80_fd_5b_50_5b_6d545af43d3d93803e603757fd5bf3_602e_52_6020_52_52_f3";

  function _packArgs(address payable implementation, bytes memory initializer)
    private
    pure
    returns (bytes memory)
  {
    return abi.encodePacked(_INITCODE, implementation, initializer);
  }

  function create(address implementation, bytes memory initializer)
    internal
    returns (address)
  {
    return create(payable(implementation), initializer, 0);
  }

  function create(
    address payable implementation,
    bytes memory initializer,
    uint256 value
  ) internal returns (address result) {
    require(address(this).balance >= value, "ERC1967UUPSProxy: insufficient balance");
    bytes memory initcode = _packArgs(implementation, initializer);
    assembly ("memory-safe") {
      result := create(value, add(0x20, initcode), mload(initcode))
    }
    require(result != address(0), "ERC1967UUPSProxy: create failed");
  }

  function createDeterministic(
    address implementation,
    bytes memory initializer,
    bytes32 salt
  ) internal returns (address) {
    return createDeterministic(payable(implementation), initializer, salt, 0);
  }

  function createDeterministic(
    address payable implementation,
    bytes memory initializer,
    bytes32 salt,
    uint256 value
  ) internal returns (address result) {
    require(address(this).balance >= value, "ERC1967UUPSProxy: insufficient balance");
    bytes memory initcode = _packArgs(implementation, initializer);
    assembly ("memory-safe") {
      result := create2(value, add(0x20, initcode), mload(initcode), salt)
    }
    require(result != address(0), "ERC1967UUPSProxy: create2 failed");
  }

  function predictDeterministic(
    address implementation,
    bytes memory initializer,
    bytes32 salt,
    address deployer
  ) internal pure returns (address result) {
    return
      address(
        uint160(
          uint256(
            keccak256(
              abi.encodePacked(
                bytes1(0xff),
                deployer,
                salt,
                keccak256(_packArgs(payable(implementation), initializer))
              )
            )
          )
        )
      );
  }

  function predictDeterministic(
    address implementation,
    bytes memory initializer,
    bytes32 salt
  ) internal view returns (address result) {
    return predictDeterministic(implementation, initializer, salt, address(this));
  }
}
