// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.17;

interface IERC1155Burnable {
  function burn(
    address account,
    uint256 id,
    uint256 value
  ) external;

  function burnBatch(
    address account,
    uint256[] memory ids,
    uint256[] memory values
  ) external;
}
