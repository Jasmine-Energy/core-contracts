// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.17;

interface IERC1155Mintable {
  function mint(
    address to,
    uint256 id,
    uint256 amount,
    bytes memory data
  ) external;

  function mintBatch(
    address to,
    uint256[] memory ids,
    uint256[] memory amounts,
    bytes memory data
  ) external;
}
