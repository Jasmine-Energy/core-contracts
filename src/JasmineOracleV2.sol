// SPDX-License-Identifier: BUSL-1.1

pragma solidity 0.8.17;

import {JasmineOracleV1} from "./versions/JasmineOracleV1.sol";

contract JasmineOracleV2 is JasmineOracleV1 {
    //  ─────────────────────────────────────────────────────────────────────────────
    //  Custom Errors
    //  ─────────────────────────────────────────────────────────────────────────────

    error InvalidMetadataVersion(uint8 version);

    //  ─────────────────────────────────────────────────────────────────────────────
    //  Types
    //  ─────────────────────────────────────────────────────────────────────────────

    struct LocationData {
        uint16 countryCode; // ISO 3166-1 alpha-2. See: https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes
        uint16 regionCode; // Optional regional code (e.g. US state)
        uint16 subRegionCode; // Optional sub-regional code (e.g. US county)
    }

    //  ─────────────────────────────────────────────────────────────────────────────
    //  Fields
    //  ─────────────────────────────────────────────────────────────────────────────

    mapping(uint256 => LocationData) internal _locationData;

    //  ─────────────────────────────────────────────────────────────────────────────
    //  IJasmineOracle Implementation
    //  ─────────────────────────────────────────────────────────────────────────────

    function updateSeries(
        uint256 id,
        bytes memory encodedMetadata
    ) public override onlyMinter {
        uint8 version = _decodeMetadataVersion(encodedMetadata);
        if (version == 1) {
            super.updateSeries(id, encodedMetadata);
            return;
        } else if (version != 2) {
            revert InvalidMetadataVersion(version);
        }

        (uint256 uuid, uint256 registry, uint256 vintage) = _destructureId(id);
        (
            uint8 metaVersion,
            uint128 metaUuid,
            uint32 metaRegistry,
            uint40 metaVintage,
            uint32 fuel,
            uint32 certificateType,
            uint32 endorsement,
            uint16 countryCode,
            uint16 regionCode,
            uint16 subRegionCode
        ) = abi.decode(
                encodedMetadata,
                (
                    uint8,
                    uint128,
                    uint32,
                    uint40,
                    uint32,
                    uint32,
                    uint32,
                    uint16,
                    uint16,
                    uint16
                )
            );

        require(uuid == metaUuid, "JasmineOracle: UUID mismatch");
        require(registry == metaRegistry, "JasmineOracle: registry mismatch");
        require(vintage == metaVintage, "JasmineOracle: vintage mismatch");

        _metadata[id] = EATMetadata(
            metaVersion,
            fuel,
            certificateType,
            endorsement
        );
        _locationData[id] = LocationData(
            countryCode,
            regionCode,
            subRegionCode
        );
    }

    //  ─────────────────────────────────────────────────────────────────────────────
    //  Getters
    //  ─────────────────────────────────────────────────────────────────────────────

    function getLocationData(
        uint256 id
    )
        external
        view
        returns (uint16 countryCode, uint16 regionCode, uint16 subRegionCode)
    {
        LocationData memory locationData = _locationData[id];
        return (
            locationData.countryCode,
            locationData.regionCode,
            locationData.subRegionCode
        );
    }

    function getFuelType(uint256 id) external view returns (uint32) {
        return _metadata[id].fuel;
    }

    function getCertificateType(uint256 id) external view returns (uint32) {
        return _metadata[id].certificateType;
    }

    function getEndorsement(uint256 id) external view returns (uint32) {
        return _metadata[id].endorsement;
    }

    function getRegistry(uint256 id) external pure returns (uint256 registry) {
        (, registry, ) = _destructureId(id);
    }

    function getVintage(uint256 id) external pure returns (uint256 vintage) {
        (, , vintage) = _destructureId(id);
    }

    //  ─────────────────────────────────────────────────────────────────────────────
    //  Internal Utilities
    //  ─────────────────────────────────────────────────────────────────────────────

    /// @dev Parses the metadata version from the encoded metadata.
    function _decodeMetadataVersion(
        bytes memory encodedMetadata
    ) internal pure returns (uint8) {
        return abi.decode(encodedMetadata, (uint8));
    }
}
