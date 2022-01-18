//SPDX-License-Identifier: MIT
// Adapted from https://github.com/dievardump/EIP2981-implementation

pragma solidity ^0.8.4;

import "./ERC2981.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ERC721ContractWideRoyalties is ERC721, ERC2981, Ownable {
    /// @notice _tokenIds to keep track of the number of NFTs minted
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor(string memory name_, string memory symbol_)
        ERC721(name_, symbol_)
    {}

    /// @inheritdoc ERC165
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721, ERC2981)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    /// @notice Allows to set the royalties on the contract
    /// @dev This function in a real contract should be protected with a onlyOwner (or equivalent) modifier
    /// @param recipient the royalties recipient
    /// @param value royalties value (between 0 and 10000)
    function setRoyalties(address recipient, uint256 value) public {
        _setRoyalties(recipient, value);
    }

    function setDefaultRoyalty(address receiver, uint96 feeNumerator) public {
        _setDefaultRoyalty(receiver, feeNumerator);
    }

    function setTokenRoyalty(
        uint256 tokenId,
        address receiver,
        uint96 feeNumerator
    ) public {
        _setTokenRoyalty(tokenId, receiver, feeNumerator);
    }

    function deleteDefaultRoyalty() public {
        _deleteDefaultRoyalty();
    }

    function resetTokenRoyalty(uint tokenId) public {
        _resetTokenRoyalty(tokenId);
    }

    /// @notice Mint one token to `to`
    /// @param to the recipient of the token
    function mint(address to) external returns (uint256 _tokenId) {
        uint256 tokenId = _tokenIds.current();
        _safeMint(to, tokenId, "");
        _tokenIds.increment();
        return tokenId;
    }

    /// @notice Mint several tokens at once
    /// @param recipients an array of recipients for each token
    function mintBatch(address[] memory recipients) external {
        uint256 tokenId = _tokenIds.current();
        for (uint256 i; i < recipients.length; i++) {
            _safeMint(recipients[i], tokenId, "");
            _tokenIds.increment();
        }
    }
}
