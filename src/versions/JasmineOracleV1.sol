// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.17;

import {
  Ownable2StepUpgradeable
} from "@openzeppelin/contracts-upgradeable/access/Ownable2StepUpgradeable.sol";
import {
  UUPSUpgradeable
} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {IJasmineOracle} from "../interfaces/IJasmineOracle.sol";

/// @dev This contract is upgradeable. You can only append new contracts to the list of bases. You cannot delete bases or reorder them.
/// @notice This contract stores the machine-readable metadata about each EAT series. This is used to determine whether a particular EAT is eligible for certain on-chain uses (e.g. membership in a solar-only EAT pool).
/// @custom:security-contact kai.aldag@jasmine.energy
contract JasmineOracleV1 is Ownable2StepUpgradeable, UUPSUpgradeable, IJasmineOracle {
  /// @dev We use the `Ownable` owner for upgrades, not the ERC1967 admin. The ERC1967 admin is not used by this contract.
  function _authorizeUpgrade(address) internal override onlyOwner {}

  /// @notice This address is the mint authorization checker. The minter is controlled by the bridge.
  address public minter;

  function _checkMinter() internal view {
    require(minter == _msgSender(), "JasmineOracle: caller is not the minter");
  }

  modifier onlyMinter() {
    _checkMinter();
    _;
  }

  event MinterChanged(address indexed newMinter);

  /// @notice In the event of a minter migration (not just an upgrade), the owner has the ability to set the minter address.
  function setMinter(address newMinter) external onlyOwner {
    minter = newMinter;
    emit MinterChanged(newMinter);
  }

  function initialize(address initialMinter, address initialOwner) external initializer onlyProxy {
    _transferOwnership(initialOwner);
    __UUPSUpgradeable_init();
    minter = initialMinter;
    emit MinterChanged(initialMinter);
  }

  struct EATMetadata {
    uint8 _version;
    uint32 fuel;
    uint32 certificateType;
    uint32 endorsement;
  }

  mapping(uint256 => EATMetadata) internal _metadata;

  function _destructureId(uint256 id)
    internal
    pure
    returns (
      uint256 uuid,
      uint256 registry,
      uint256 vintage
    )
  {
    uint256 pad;
    (uuid, registry, vintage, pad) = (
      id >> 128,
      (id >> 96) & type(uint32).max,
      (id >> 56) & type(uint40).max,
      id & type(uint56).max
    );
    require(pad == 0, "JasmineOracle: invalid ID");
  }

  /// @notice Each EAT series has a UUID associated with it. This has no structure, but serves to identify the series to an off-chain database.
  function getUUID(uint256 id) external pure returns (uint128) {
    (uint256 uuid, , ) = _destructureId(id);
    return uint128(uuid);
  }

  /// @notice Each EAT is traded on an EAT registry. EATs cannot generally be moved between registries. The registry id is opaque, but can be checked for an exact match.
  function hasRegistry(uint256 id, uint256 query) external pure returns (bool) {
    (, uint256 registry, ) = _destructureId(id);
    return registry == query;
  }

  /// @notice The vintage of an EAT identifies the time at which it was generated. The vintage is represented as a UNIX timestamp. The granularity of an EAT's vintage depends on the conventions of its registry and generator.
  function hasVintage(
    uint256 id,
    uint256 min,
    uint256 max
  ) external pure returns (bool) {
    (, , uint256 vintage) = _destructureId(id);
    return vintage >= min && vintage <= max;
  }

  /// @notice The fuel type of an EAT identifies the source of the energy used to generate the corresponding electrical power. This is an opaque value that can only be checked for an exact match. Future EATs may have more than 1 fuel type.
  function hasFuel(uint256 id, uint256 query) external view returns (bool) {
    return _metadata[id].fuel == query;
  }

  function hasCertificateType(uint256 id, uint256 query) external view returns (bool) {
    return _metadata[id].certificateType == query;
  }

  function hasEndorsement(uint256 id, uint256 query) external view returns (bool) {
    return _metadata[id].endorsement == query;
  }

  /// @notice The encodedMetadata is structured as the ABI encoding the metadata fields
  // | position | name             | bit length |
  // | :------- | :--------------- | :--------- |
  // | 0        | version          | 8          |
  // | 1        | uuid             | 128        |
  // | 2        | registry         | 32         |
  // | 3        | vintage          | 40         |
  // | 4        | fuel             | 32         |
  // | 5        | certificate type | 32         |
  // | 6        | endorsement      | 32         |
  // The version is currently always 1. A change to the version version corresponds to an update to the metadata format.
  function updateSeries(uint256 id, bytes memory encodedMetadata)
    public
    virtual
    override
    onlyMinter
  {
    (uint256 uuid, uint256 registry, uint256 vintage) = _destructureId(id);
    (
      uint8 version,
      uint128 metaUuid,
      uint32 metaRegistry,
      uint40 metaVintage,
      uint32 fuel,
      uint32 certificateType,
      uint32 endorsement
    ) = abi.decode(
        encodedMetadata,
        (uint8, uint128, uint32, uint40, uint32, uint32, uint32)
      );
    require(version == 1, "JasmineOracle: invalid metadata version");
    require(uuid == metaUuid, "JasmineOracle: UUID mismatch");
    require(registry == metaRegistry, "JasmineOracle: registry mismatch");
    require(vintage == metaVintage, "JasmineOracle: vintage mismatch");
    _metadata[id] = EATMetadata(version, fuel, certificateType, endorsement);
  }

  /// @dev Reserved storage gap. LINK: https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
  uint256[50] private __gap;
}
