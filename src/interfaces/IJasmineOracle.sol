// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.17;

interface IJasmineOracle {
  // This function takes a `bytes` instead of something more structure to allow
  // the minter and the oracle to be upgraded separately. If desire, future
  // upgrades can apply more structure here.
  function updateSeries(uint256 id, bytes memory encodedMetadata) external;
}
