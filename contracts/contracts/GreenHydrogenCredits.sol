// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract GreenHydrogenCredits is ERC1155, AccessControl, Pausable {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant CERTIFIER_ROLE = keccak256("CERTIFIER_ROLE");

    string public name = "Green Hydrogen Credits";
    string public symbol = "GHC";

    mapping(uint256 => string) private _tokenURIs;
    mapping(uint256 => bool) public minted;

    event BatchIssued(uint256 indexed batchId, address indexed producer, uint256 amount, string uri);
    event BatchRetired(uint256 indexed batchId, address indexed account, uint256 amount);
    event URISet(uint256 indexed batchId, string uri);

    constructor(string memory baseURI, address admin) ERC1155(baseURI) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);
        _pause(); // start paused
    }

    function pause() external onlyRole(ADMIN_ROLE) { _pause(); }
    function unpause() external onlyRole(ADMIN_ROLE) { _unpause(); }

    function issueBatch(address producer, uint256 batchId, uint256 amount, string calldata uri_) external whenNotPaused onlyRole(CERTIFIER_ROLE) {
        require(!minted[batchId], "Batch already minted");
        require(producer != address(0), "Invalid producer");
        require(amount > 0, "Amount > 0");

        minted[batchId] = true;
        _mint(producer, batchId, amount, "");
        _tokenURIs[batchId] = uri_;

        emit BatchIssued(batchId, producer, amount, uri_);
        emit URISet(batchId, uri_);
        emit URI(uri_, batchId);
    }

    function retire(uint256 batchId, uint256 amount) external whenNotPaused {
        require(amount > 0, "Amount > 0");
        _burn(msg.sender, batchId, amount);
        emit BatchRetired(batchId, msg.sender, amount);
    }

    function setURI(uint256 batchId, string calldata uri_) external whenNotPaused onlyRole(CERTIFIER_ROLE) {
        require(minted[batchId], "Batch not minted");
        _tokenURIs[batchId] = uri_;
        emit URISet(batchId, uri_);
        emit URI(uri_, batchId);
    }

    function uri(uint256 batchId) public view override returns (string memory) {
        string memory custom = _tokenURIs[batchId];
        if (bytes(custom).length > 0) return custom;
        return super.uri(batchId);
    }

    function _beforeTokenTransfer(address operator, address from, address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        internal override whenNotPaused
    {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }
}
