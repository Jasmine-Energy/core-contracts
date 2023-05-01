// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.17;

import {
  Ownable2StepUpgradeable
} from "@openzeppelin/contracts-upgradeable/access/Ownable2StepUpgradeable.sol";
import {
  UUPSUpgradeable
} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {
  ERC1155BurnableUpgradeable
} from "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155BurnableUpgradeable.sol";
import {
  ERC1155SupplyUpgradeable
} from "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155SupplyUpgradeable.sol";
import {IERC1155Burnable} from "./interfaces/IERC1155Burnable.sol";
import {IERC1155Mintable} from "./interfaces/IERC1155Mintable.sol";
import {IJasmineEATExtensions} from "./interfaces/IJasmineEATExtensions.sol";

// We only import this so that we can mention it in our overrides to appease the
// compiler.
import {
  ERC1155Upgradeable
} from "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";

/// @dev This contract is upgradeable. You can only append new contracts to the list of bases. You cannot delete bases or reorder them.
/// @notice The tokens produced by this contract represent EACs held by the Jasmine bridge.
/// @custom:security-contact kai.aldag@jasmine.energy
contract JasmineEAT is
  Ownable2StepUpgradeable,
  UUPSUpgradeable,
  ERC1155BurnableUpgradeable,
  ERC1155SupplyUpgradeable,
  IERC1155Burnable,
  IERC1155Mintable,
  IJasmineEATExtensions
{
  /// @dev We use the Ownable owner for upgrades, not the ERC1967 admin. The ERC1967 admin is not used by this contract.
  function _authorizeUpgrade(address) internal override onlyOwner {}

  /// @notice This address is the mint authorization checker. The minter is controlled by the bridge.
  address public minter;

  function _checkMinter() internal view {
    require(minter == _msgSender(), "JasmineEAT: caller is not the minter");
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

  mapping(uint256 => bool) public override frozen;

  /// @dev EAT series that are frozen cannot be transferred. They can be burned, however.
  function _beforeTokenTransfer(
    address operator,
    address from,
    address to,
    uint256[] memory ids,
    uint256[] memory amounts,
    bytes memory data
  ) internal override(ERC1155Upgradeable, ERC1155SupplyUpgradeable) {
    if (to != address(0)) {
      for (uint256 i; i < ids.length; i++) {
        require(!frozen[ids[i]], "JasmineEAT: frozen series");
      }
    }
    super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
  }

  function initialize(string memory initialURI, address initialMinter, address initialOwner)
    external
    initializer
    onlyProxy
  {
    _transferOwnership(initialOwner);
    __UUPSUpgradeable_init();
    __ERC1155_init(initialURI);
    minter = initialMinter;
    emit MinterChanged(initialMinter);
  }

  /// @notice Create new EATs when EACs are received by the bridge. Only callable by `minter`.
  function mint(
    address to,
    uint256 id,
    uint256 amount,
    bytes memory data
  ) external override onlyMinter {
    _mint(to, id, amount, data);
  }

  /// @notice Create new EATs when EACs are received by the bridge. Only callable by `minter`.
  function mintBatch(
    address to,
    uint256[] memory ids,
    uint256[] memory amounts,
    bytes memory data
  ) external override onlyMinter {
    _mintBatch(to, ids, amounts, data);
  }

  event Frozen(uint256 indexed id);

  /// @notice If there is an error in an EAC or in the issuance of the EAT, the EAT series may be frozen by the owner.
  function freeze(uint256 id) external onlyOwner {
    frozen[id] = true;
    emit Frozen(id);
  }

  event Thawed(uint256 indexed id);

  /// @notice This un-does the effects of freeze.
  function thaw(uint256 id) external onlyOwner {
    frozen[id] = false;
    emit Thawed(id);
  }

  /// @notice If the owner determines that there is no resolution to an erroneous EAT series, the EATs may be destroyed.
  function slash(
    address from,
    uint256 id,
    uint256 amount
  ) external onlyOwner {
    require(frozen[id], "JasmineEAT: series not frozen");
    uint256 balance = balanceOf(from, id);
    if (balance < amount) {
      amount = balance;
    }
    _burn(from, id, amount);
  }

  /// @notice If the owner determines that there is no resolution to an erroneous EAT series, the EATs may be destroyed.
  function slashBatch(
    address from,
    uint256[] memory ids,
    uint256[] memory amounts
  ) external onlyOwner {
    for (uint256 i; i < ids.length; i++) {
      uint256 id = ids[i];
      require(frozen[id], "JasmineEAT: series not frozen");
      uint256 balance = balanceOf(from, id);
      if (balance < amounts[i]) {
        amounts[i] = balance;
      }
    }
    _burnBatch(from, ids, amounts);
  }

  // These are only here to appease Solidity's horrible inheritance logic.
  function burn(
    address from,
    uint256 id,
    uint256 value
  ) public override(ERC1155BurnableUpgradeable, IERC1155Burnable) {
    super.burn(from, id, value);
  }

  function burnBatch(
    address from,
    uint256[] memory ids,
    uint256[] memory values
  ) public override(ERC1155BurnableUpgradeable, IERC1155Burnable) {
    super.burnBatch(from, ids, values);
  }

  /// @dev Update the base URI of the contract.
  function updateTokenURI(string memory _newURI) external onlyOwner {
    require(bytes(_newURI).length != 0, "JasmineEAT: new URI cannot be empty.");
    _setURI(_newURI);
  }

  /// @dev Reserved storage gap. LINK: https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
  uint256[50] private __gap;
}
