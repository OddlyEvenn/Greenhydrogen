// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * GreenCreditToken (GHC): 1 token = 1 unit of certified green hydrogen (e.g., 1 kg or 1 ton; you decide off-chain).
 * - ERC20
 * - Burnable: "retire" = burn
 * - AccessControl: CERTIFIER_ROLE can mint after verification
 * - Pausable: emergency stop by DEFAULT_ADMIN_ROLE
 */

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";

contract GreenCreditToken is ERC20, ERC20Burnable, AccessControl, Pausable {
    bytes32 public constant CERTIFIER_ROLE = keccak256("CERTIFIER_ROLE");

    // Optional metadata so auditors/judges see intent
    string public constant STANDARD = "Green Hydrogen Credit v1";
    string public constant UNIT_HINT = "1 token = 1 unit green H2";

    event CreditsIssued(address indexed to, uint256 amount, address indexed certifier);
    event CreditsRetired(address indexed from, uint256 amount);

    constructor(
        address admin,        // your deployer / regulator
        address certifier     // entity allowed to mint
    ) ERC20("Green Hydrogen Credit", "GHC") {
        require(admin != address(0) && certifier != address(0), "zero addr");
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(CERTIFIER_ROLE, certifier);
    }

    // --- Admin controls ---

    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    function setCertifier(address newCertifier) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(newCertifier != address(0), "zero addr");
        _grantRole(CERTIFIER_ROLE, newCertifier);
    }

    function revokeCertifier(address certifier) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _revokeRole(CERTIFIER_ROLE, certifier);
    }

    // --- Minting (issuance) ---

    /**
     * Issue (mint) credits to a producer after verification by a certifier.
     * amount uses ERC20 decimals (default 18). Decide your unit: 1e18 == 1 credit or 1 token?
     * For hackathon: treat 1 * 10^18 as 1 credit for human-friendly display in UI.
     */
    function issueCredits(address to, uint256 amount) external whenNotPaused onlyRole(CERTIFIER_ROLE) {
        require(to != address(0), "zero addr");
        _mint(to, amount);
        emit CreditsIssued(to, amount, _msgSender());
    }

    // --- Retire (burn) ---

    /**
     * Retire credits owned by msg.sender (burn).
     * Once retired, they cannot be re-sold: aligns with "no double counting".
     */
    function retire(uint256 amount) external whenNotPaused {
        _burn(_msgSender(), amount);
        emit CreditsRetired(_msgSender(), amount);
    }

    // --- Hooks ---

    function _update(address from, address to, uint256 value) internal override(ERC20) {
        require(!paused(), "token paused");
        super._update(from, to, value);
    }
}