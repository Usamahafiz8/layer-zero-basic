// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@layerzerolabs/solidity-examples/contracts/lzApp/NonblockingLzApp.sol";

/**
 * @title UserState
 * @dev Cross-chain user state management contract that receives and processes
 *      LayerZero messages to track user token purchases and staking activities.
 * @author Your Name
 */
contract UserState is NonblockingLzApp {
    // ============ Constants ============
    
    /// @notice Action code for token purchase operations
    uint8 public constant ACTION_PURCHASE = 1;
    
    /// @notice Action code for token staking operations
    uint8 public constant ACTION_STAKE = 2;
    
    // ============ State Variables ============
    
    /// @notice Mapping of user addresses to their total purchased token amounts
    mapping(address => uint256) public totalPurchased;
    
    /// @notice Mapping of user addresses to their total staked token amounts
    mapping(address => uint256) public totalStaked;
    
    // ============ Events ============
    
    /// @notice Emitted when tokens are purchased for a user
    /// @param user The address of the user who purchased tokens
    /// @param amount The amount of tokens purchased
    /// @param newTotal The new total purchased amount for the user
    event TokensPurchased(
        address indexed user,
        uint256 amount,
        uint256 newTotal
    );
    
    /// @notice Emitted when tokens are staked by a user
    /// @param user The address of the user who staked tokens
    /// @param amount The amount of tokens staked
    /// @param newTotal The new total staked amount for the user
    event TokensStaked(
        address indexed user,
        uint256 amount,
        uint256 newTotal
    );
    
    /// @notice Emitted when an invalid action is received
    /// @param action The invalid action code received
    event InvalidActionReceived(uint8 action);
    
    // ============ Constructor ============
    
    /// @notice Initializes the UserState contract
    /// @param _lzEndpoint The LayerZero endpoint address
    constructor(address _lzEndpoint) NonblockingLzApp(_lzEndpoint) {
        require(_lzEndpoint != address(0), "Invalid endpoint address");
    }
    
    // ============ Internal Functions ============
    
    /// @notice Processes incoming LayerZero messages and updates user state
    /// @param _srcChainId The source chain ID (unused but required by interface)
    /// @param _srcAddress The source address (unused but required by interface)
    /// @param _nonce The message nonce (unused but required by interface)
    /// @param _payload The encoded message payload containing action, user, and amount
    function _nonblockingLzReceive(
        uint16 _srcChainId,
        bytes memory _srcAddress,
        uint64 _nonce,
        bytes memory _payload
    ) internal override {
        // Decode the payload to extract action, user address, and amount
        (uint8 action, address user, uint256 amount) = abi.decode(
            _payload,
            (uint8, address, uint256)
        );
        
        // Validate input parameters
        require(user != address(0), "Invalid user address");
        require(amount > 0, "Amount must be greater than 0");
        
        // Process the action based on the action code
        if (action == ACTION_PURCHASE) {
            _processPurchase(user, amount);
        } else if (action == ACTION_STAKE) {
            _processStake(user, amount);
        } else {
            // Emit event for invalid actions but don't revert to maintain message processing
            emit InvalidActionReceived(action);
        }
    }
    
    /// @notice Processes a token purchase action
    /// @param user The address of the user purchasing tokens
    /// @param amount The amount of tokens being purchased
    function _processPurchase(address user, uint256 amount) internal {
        totalPurchased[user] += amount;
        emit TokensPurchased(user, amount, totalPurchased[user]);
    }
    
    /// @notice Processes a token staking action
    /// @param user The address of the user staking tokens
    /// @param amount The amount of tokens being staked
    function _processStake(address user, uint256 amount) internal {
        totalStaked[user] += amount;
        emit TokensStaked(user, amount, totalStaked[user]);
    }
    
    // ============ External View Functions ============
    
    /// @notice Gets the total purchased and staked amounts for a specific user
    /// @param user The address of the user to query
    /// @return purchased The total amount of tokens purchased by the user
    /// @return staked The total amount of tokens staked by the user
    function getTotals(address user) 
        external 
        view 
        returns (uint256 purchased, uint256 staked) 
    {
        require(user != address(0), "Invalid user address");
        return (totalPurchased[user], totalStaked[user]);
    }
    
    /// @notice Gets the total purchased amount for a specific user
    /// @param user The address of the user to query
    /// @return The total amount of tokens purchased by the user
    function getTotalPurchased(address user) external view returns (uint256) {
        require(user != address(0), "Invalid user address");
        return totalPurchased[user];
    }
    
    /// @notice Gets the total staked amount for a specific user
    /// @param user The address of the user to query
    /// @return The total amount of tokens staked by the user
    function getTotalStaked(address user) external view returns (uint256) {
        require(user != address(0), "Invalid user address");
        return totalStaked[user];
    }
}
