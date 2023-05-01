// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.17;

import {
  Ownable2StepUpgradeable
} from "@openzeppelin/contracts-upgradeable/access/Ownable2StepUpgradeable.sol";
import {
  UUPSUpgradeable
} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {
  EIP712Upgradeable
} from "@openzeppelin/contracts-upgradeable/utils/cryptography/EIP712Upgradeable.sol";
import {
  ECDSAUpgradeable
} from "@openzeppelin/contracts-upgradeable/utils/cryptography/ECDSAUpgradeable.sol";
import {IJasmineOracle} from "./interfaces/IJasmineOracle.sol";
import {IERC1155Burnable} from "./interfaces/IERC1155Burnable.sol";
import {IERC1155Mintable} from "./interfaces/IERC1155Mintable.sol";
import {IJasmineEATExtensions} from "./interfaces/IJasmineEATExtensions.sol";

/// @dev This contract is upgradeable. You can only append new contracts to the list of bases. You cannot delete bases or reorder them.
/// @notice This contract is responsible for validating that the bridge has authorized an EAT mint.
/// @notice This contract also updates the oracle with EAT metadata during each mint.
/// @custom:security-contact kai.aldag@jasmine.energy
contract JasmineMinter is Ownable2StepUpgradeable, UUPSUpgradeable, EIP712Upgradeable {
  /// @dev We use the `Ownable` owner for upgrades, not the ERC1967 admin. The ERC1967 admin is not used by this contract.
  function _authorizeUpgrade(address) internal override onlyOwner {}

  address public immutable token;
  address public immutable oracle;

  constructor(address _token, address _oracle) {
    token = _token;
    oracle = _oracle;
  }

  /// @dev This is the wallet/EOA address that authorizes minting new EATs. This is a separate authority from the right to upgrade protocol contracts.
  address public bridge;

  event BridgeChanged(address indexed newBridge);

  /// @notice When the bridge wallet/EOA is migrated, the owner updates the bridge address.
  function setBridge(address newBridge) external onlyOwner {
    bridge = newBridge;
    emit BridgeChanged(newBridge);
  }

  /// @dev This is the EIP712 domain name. It is exposed here for ease of introspection.
  string public name;
  /// @dev This is the EIP712 domain version. It is exposed here for ease of introspection.
  string public version;

  /// @notice Whether a particular nonce has been used to prevent replay.
  /// @dev This contract uses non-sequential nonces so that multiple mint authorizations can be issued concurrently. The downside to this approach is that it is slightly more involved to invalidate a nonce that has not yet been consumed.
  mapping(bytes32 => bool) public consumedNonces;

  /// @notice This is the EIP712 domain separator. It is exposed here for ease of introspection.
  function DOMAIN_SEPARATOR() external view returns (bytes32) {
    return _domainSeparatorV4();
  }

  // These are the EIP712 struct type hashes.
  bytes32 public constant MINT_TYPEHASH =
    keccak256(
      "MintAuthorization(address minter,uint256 id,uint256 amount,bytes oracleData,uint256 deadline,bytes32 nonce)"
    );
  bytes32 public constant MINTBATCH_TYPEHASH =
    keccak256(
      "MintBatchAuthorization(address minter,uint256[] ids,uint256[] amounts,bytes[] oracleDatas,uint256 deadline,bytes32 nonce)"
    );
  bytes32 public constant CONSUMENONCE_TYPEHASH =
    keccak256("ConsumeNonce(bytes32 nonce)");

  function initialize(
    string memory initialName,
    string memory initialVersion,
    address initialBridge,
    address initialOwner
  ) external initializer onlyProxy {
    _transferOwnership(initialOwner);
    __UUPSUpgradeable_init();
    __EIP712_init(initialName, initialVersion);
    name = initialName;
    version = initialVersion;
    bridge = initialBridge;
    emit BridgeChanged(initialBridge);
  }

  event NonceConsumed(bytes32 indexed nonce);

  /// @notice Mint a new EAT.
  /// @notice Only callable by the address specified in the EIP712 mint authoriztaion.
  /// @param receiver The initial owner of the newly-minted EATs. If this is a contract, it must support IERC1155Receiver.onERC1155Received. Failure of the receiver callback does not invalidate the nonce. The receiver is NOT part of the EIP712 minting authorization.
  /// @param id The identifier of the EAT series to mint. See JasmineOracle for the constraints on this value. The id is part of the EIP712 minting authorization.
  /// @param amount The quantity of EATs to mint. The amount is part of the EIP712 minting authorization.
  /// @param transferData Additional argument to be passed to `receiver`'s callback. Ignored if `receiver` is not a contract. The transferData is NOT part of the EIP712 minting authorization.
  /// @param oracleData Authenticated EAT metadata passed to the oracle. Oracle updates are idempotent. The oracleData is part of the EIP712 minting authorization.
  /// @param deadline The latest timestamp at which the mint authorization remains valid. After this time, attempts to mint will revert. The deadline is part of the EIP712 minting authorization.
  /// @param nonce Used to prevent signature replay. The nonce is part of the EIP712 minting authorization. If consumedNonces(nonce), the minting authorization is invalid.
  /// @param sig Encoded ECDSA signature by `bridge` over the EIP712 minting authorization. Formed as the 65-byte concatenation of r, s, and v in that order. s must be in the lower half of the curve. v must be 27 or 28.
  function mint(
    address receiver,
    uint256 id,
    uint256 amount,
    bytes memory transferData,
    bytes memory oracleData,
    uint256 deadline,
    bytes32 nonce,
    bytes memory sig
  ) external {
    // Check for expiration
    require(block.timestamp <= deadline, "JasmineMinter: expired");
    // Check the EIP712 signature
    bytes32 structHash = keccak256(
      abi.encode(MINT_TYPEHASH, _msgSender(), id, amount, keccak256(oracleData), deadline, nonce)
    );
    require(
      ECDSAUpgradeable.recover(_hashTypedDataV4(structHash), sig) == bridge,
      "JasmineMinter: bad signature/wrong signer"
    );
    // Check the nonce
    require(!consumedNonces[nonce], "JasmineMinter: nonce replay");
    consumedNonces[nonce] = true;
    emit NonceConsumed(nonce);
    // `oracle` is a trusted contract, so we don't need to follow checks-effects-interactions
    if (oracleData.length != 0) {
      IJasmineOracle(oracle).updateSeries(id, oracleData);
    }
    IERC1155Mintable(token).mint(receiver, id, amount, transferData);
  }

  function _hashArray(uint256[] memory a) internal pure returns (bytes32 result) {
    assembly ("memory-safe") {
      result := keccak256(add(0x20, a), shl(5, mload(a)))
    }
  }

  /// @notice Mint a new EAT.
  /// @notice Only callable by the address specified in the EIP712 mint authoriztaion.
  /// @param receiver The initial owner of the newly-minted EATs. If this is a contract, it must support IERC1155Receiver.onERC1155Received. Failure of the receiver callback does not invalidate the nonce. The receiver is NOT part of the EIP712 minting authorization.
  /// @param ids The identifiers of the EAT series to mint. See JasmineOracle for the constraints on this value. The ids are part of the EIP712 minting authorization.
  /// @param amounts The quantities of EATs to mint. The amounts are part of the EIP712 minting authorization.
  /// @param transferData Additional argument to be passed to `receiver`'s callback. Ignored if `receiver` is not a contract. The transferData is NOT part of the EIP712 minting authorization.
  /// @param oracleDatas Authenticated EAT metadatas passed to the oracle. Oracle updates are idempotent. The oracleData is part of the EIP712 minting authorization.
  /// @param deadline The latest timestamp at which the mint authorization remains valid. After this time, attempts to mint will revert. The deadline is part of the EIP712 minting authorization.
  /// @param nonce Used to prevent signature replay. The nonce is part of the EIP712 minting authorization. If consumedNonces(nonce), the minting authorization is invalid.
  /// @param sig Encoded ECDSA signature by `bridge` over the EIP712 minting authorization. Formed as the 65-byte concatenation of r, s, and v in that order. s must be in the lower half of the curve. v must be 27 or 28.
  function mintBatch(
    address receiver,
    uint256[] memory ids,
    uint256[] memory amounts,
    bytes memory transferData,
    bytes[] memory oracleDatas,
    uint256 deadline,
    bytes32 nonce,
    bytes memory sig
  ) external {
    // We don't check `ids.length == amounts.length` because `token` will do
    // that for us.
    require(
      ids.length == oracleDatas.length,
      "JasmineMinter: ids and oracleDatas length mismatch"
    );
    // Check for expiration
    require(block.timestamp <= deadline, "JasmineMinter: expired");

    // Hashing an array of bytes for EIP712 is obnoxious. We have to store the
    // array of hashes of bytes and then hash *that* to get the appropriate
    // value to feed into the struct hash.
    uint256[] memory oracleDataHashes = new uint256[](oracleDatas.length);
    for (uint256 i; i < oracleDatas.length; i++) {
      oracleDataHashes[i] = uint256(keccak256(oracleDatas[i]));
    }
    bytes32 structHash = keccak256(
      abi.encode(
        MINTBATCH_TYPEHASH,
        _msgSender(),
        _hashArray(ids),
        _hashArray(amounts),
        _hashArray(oracleDataHashes),
        deadline,
        nonce
      )
    );
    require(
      ECDSAUpgradeable.recover(_hashTypedDataV4(structHash), sig) == bridge,
      "JasmineMinter: bad signature/wrong signer"
    );

    require(!consumedNonces[nonce], "JasmineMinter: nonce replay");
    consumedNonces[nonce] = true;
    emit NonceConsumed(nonce);

    // oracle is a trusted contract, so we don't need to follow checks-effects-interactions
    for (uint256 i; i < oracleDatas.length; i++) {
      bytes memory oracleData = oracleDatas[i];
      if (oracleData.length != 0) {
        IJasmineOracle(oracle).updateSeries(ids[i], oracleData);
      }
    }
    IERC1155Mintable(token).mintBatch(receiver, ids, amounts, transferData);
  }

  /// @notice Used to invalidate a nonce embedded in another EIP712 minting authorization.
  function consumeNonce(bytes32 nonce, bytes memory sig) external {
    bytes32 structHash = keccak256(abi.encode(CONSUMENONCE_TYPEHASH, nonce));
    require(
      ECDSAUpgradeable.recover(_hashTypedDataV4(structHash), sig) == bridge,
      "JasmineMinter: bad signature/wrong signer"
    );
    require(!consumedNonces[nonce], "JasmineMinter: nonce replay");
    consumedNonces[nonce] = true;
    emit NonceConsumed(nonce);
  }

  event BurnedSingle(address indexed owner, uint256 id, uint256 amount, bytes metadata);

  /// @notice Used in both redemption and bridge-off flows.
  /// @dev JasmineMinter must be approved to spend the caller's EATs for the operation to succeed. JasmineMinter indirectly authenticates that the caller owns the specified amount of the specified EATs.
  /// @param id The series of EAT to be redeemed/bridged-off.
  /// @param amount The amount of EAT of the specified series to be redeemed/bridged-off.
  /// @param metadata Message to the bridge specifying whether to redeem or bridge-off. If the operation is a bridge-off, also specifies the destination of the EAC. JasmineMinter imposes no authentication or structure on the metadata. Malformed or otherwise invalid metadata is an unrecoverable error.
  function burn(
    uint256 id,
    uint256 amount,
    bytes memory metadata
  ) external onlyProxy {
    require(!IJasmineEATExtensions(token).frozen(id), "JasmineMinter: frozen series");
    emit BurnedSingle(_msgSender(), id, amount, metadata);
    IERC1155Burnable(token).burn(_msgSender(), id, amount);
  }

  event BurnedBatch(
    address indexed owner,
    uint256[] ids,
    uint256[] amounts,
    bytes metadata
  );

  /// @notice Used in both redemption and bridge-off flows.
  /// @dev JasmineMinter must be approved to spend the caller's EATs for the operation to succeed. JasmineMinter indirectly authenticates that the caller owns the specified amount of the specified EATs.
  /// @param ids The series of EATs to be redeemed/bridged-off.
  /// @param amounts The amounts of EATs of the specified series to be redeemed/bridged-off.
  /// @param metadata Message to the bridge specifying whether to redeem or bridge-off. If the operation is a bridge-off, also specifies the destination of the EAC. JasmineMinter imposes no authentication or structure on the metadata. Malformed or otherwise invalid metadata is an unrecoverable error.
  function burnBatch(
    uint256[] memory ids,
    uint256[] memory amounts,
    bytes memory metadata
  ) external onlyProxy {
    for (uint256 i; i < ids.length; i++) {
      require(
        !IJasmineEATExtensions(token).frozen(ids[i]),
        "JasmineMinter: frozen series"
      );
    }
    emit BurnedBatch(_msgSender(), ids, amounts, metadata);
    IERC1155Burnable(token).burnBatch(_msgSender(), ids, amounts);
  }

  /// @dev Reserved storage gap. LINK: https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
  uint256[50] private __gap;
}
