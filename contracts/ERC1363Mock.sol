//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "erc-payable-token/contracts/token/ERC1363/ERC1363.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// mock class using ERC1363
contract ERC1363Mock is ERC1363, Ownable {
    address private caller;

    event Caller(address caller);

    /**
     * @dev Constructor that gives msg.sender all of existing tokens.
     */
    constructor(
        string memory name,
        string memory symbol,
        address initialAccount,
        uint256 initialBalance
    ) ERC20(name, symbol) {
        _mint(initialAccount, initialBalance);
    }

    // function transferAndCall(address recipient, uint256 amount)
    //     public
    //     override
    //     returns (bool)
    // {
    //     emit Caller(msg.sender);
    //     return transferAndCall(recipient, amount, "");
    // }

    function checkCaller() public {
        emit Caller(msg.sender);
    }

    function transferAndCallCheck1(address recipient, uint256 amount)
        public
        virtual
        returns (bool)
    {
        return transferAndCallCheck2(recipient, amount, "");
    }

    function transferAndCallCheck2(
        address recipient,
        uint256 amount,
        bytes memory data
    ) public returns (bool) {
        transferCheck(recipient, amount);
        require(
            _checkAndCallTransfer(_msgSender(), recipient, amount, data),
            "ERC1363: _checkAndCallTransfer reverts"
        );
        return true;
    }

    function transferCheck(address recipient, uint256 amount)
        public
        virtual
        returns (bool)
    {
        emit Caller(msg.sender);
        _transfer(_msgSender(), recipient, amount);
        return true;
    }
}
