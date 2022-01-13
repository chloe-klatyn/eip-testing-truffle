//SPDX-License-Identifier: Unlicense
// Adapted from https://github.com/vittominacori/erc1363-payable-token/blob/master/contracts/examples/ERC1363PayableCrowdsale.sol

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "erc-payable-token/contracts/payment/ERC1363Payable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CrowdsaleContract is ERC1363Payable, ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    // The token being sold
    IERC20 private _token;

    // Address where funds are collected
    address private _wallet;

    // How many token units a buyer gets per ERC1363 token
    uint256 private _rate;

    // Amount of ERC1363 token raised
    uint256 private _tokenRaised;

    /**
     * Event for token purchase logging
     * @param operator who called function
     * @param beneficiary who got the tokens
     * @param value ERC1363 tokens paid for purchase
     * @param amount amount of tokens purchased
     */
    event TokensPurchased(
        address indexed operator,
        address indexed beneficiary,
        uint256 value,
        uint256 amount
    );

    constructor(
        uint256 rate_,
        address wallet_,
        IERC20 token_,
        IERC1363 acceptedToken_
    ) ERC1363Payable(acceptedToken_) {
        require(rate_ > 0);
        require(wallet_ != address(0));
        require(address(token_) != address(0));

        _rate = rate_;
        _wallet = wallet_;
        _token = token_;
    }

    function token() public view returns (IERC20) {
        return _token;
    }

    function wallet() public view returns (address) {
        return _wallet;
    }

    function rate() public view returns (uint256) {
        return _rate;
    }

    function tokenRaised() public view returns (uint256) {
        return _tokenRaised;
    }

    function _transferReceived(
        address operator,
        address sender,
        uint256 amount,
        bytes memory data
    ) internal override {
        _buyTokens(operator, sender, amount, data);
    }

    function _approvalReceived(
        address sender,
        uint256 amount,
        bytes memory data
    ) internal override {
        IERC20(acceptedToken()).transferFrom(sender, address(this), amount);
        _buyTokens(sender, sender, amount, data);
    }

    function _buyTokens(
        address operator,
        address sender,
        uint256 amount,
        bytes memory data
    ) internal nonReentrant {
        uint256 sentTokenAmount = amount;
        _preValidatePurchase(sentTokenAmount);

        // calculate token amount to be created
        uint256 tokens = _getTokenAmount(sentTokenAmount);

        // update state
        _tokenRaised += sentTokenAmount;

        _processPurchase(sender, tokens);
        emit TokensPurchased(operator, sender, sentTokenAmount, tokens);

        _updatePurchasingState(sender, sentTokenAmount, data);

        _forwardFunds(sentTokenAmount);
        _postValidatePurchase(sender, sentTokenAmount);
    }

    function _preValidatePurchase(uint256 sentTokenAmount) internal pure {
        require(sentTokenAmount != 0);
    }

    function _postValidatePurchase(address beneficiary, uint256 sentTokenAmount)
        internal
    {
        // optional override
    }

    function _deliverTokens(address beneficiary, uint256 tokenAmount) internal {
        _token.safeTransfer(beneficiary, tokenAmount);
    }

    function _processPurchase(address beneficiary, uint256 tokenAmount)
        internal
    {
        _deliverTokens(beneficiary, tokenAmount);
    }

    function _updatePurchasingState(
        address beneficiary,
        uint256 sentTokenAmount,
        bytes memory data
    ) internal {
        // optional override
    }

    function _getTokenAmount(uint256 sentTokenAmount)
        internal
        view
        returns (uint256)
    {
        return sentTokenAmount * _rate;
    }

    function _forwardFunds(uint256 sentTokenAmount) internal {
        IERC20(acceptedToken()).safeTransfer(_wallet, sentTokenAmount);
    }
}
