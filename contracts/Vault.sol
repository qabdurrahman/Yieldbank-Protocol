// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";



contract Vault is Ownable, Pausable {
    using SafeERC20 for IERC20;

    IERC20 public immutable token;

    mapping(address => uint256) public balances;
    mapping(address => uint256) public depositTimestamps;

    uint256 public constant YIELD_RATE = 5; // 5% flat yield

    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount, uint256 yield);

    constructor(address _token) {
        require(_token != address(0), "Token address cannot be zero");
        token = IERC20(_token);
    }

    function deposit(uint256 amount) external whenNotPaused {
        require(amount > 0, "Amount must be > 0");

        token.safeTransferFrom(msg.sender, address(this), amount);
        balances[msg.sender] += amount;
        depositTimestamps[msg.sender] = block.timestamp;

        emit Deposited(msg.sender, amount);
    }

    function withdraw() external whenNotPaused {
        uint256 amount = balances[msg.sender];
        require(amount > 0, "No balance to withdraw");

        uint256 yield = calculateYield(msg.sender);

        balances[msg.sender] = 0;
        depositTimestamps[msg.sender] = 0;

        token.safeTransfer(msg.sender, amount + yield);

        emit Withdrawn(msg.sender, amount, yield);
    }

    function calculateYield(address user) public view returns (uint256) {
        uint256 depositTime = depositTimestamps[user];
        if (depositTime == 0) return 0;

        uint256 timeElapsed = block.timestamp - depositTime;
        uint256 base = balances[user];

        // Simulate simple yield: 5% if >= 1 minute
        if (timeElapsed >= 60) {
            return (base * YIELD_RATE) / 100;
        }
        return 0;
    }

    // Owner only pause/unpause
    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
}
