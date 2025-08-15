// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@layerzerolabs/solidity-examples/contracts/lzApp/NonblockingLzApp.sol";

/**
 * @title Staking
 * @dev Cross-chain staking contract that allows users to stake tokens and
 *      sends LayerZero messages to update user state on destination chains.
 * @author Your Name
 */
contract Staking is NonblockingLzApp {
    // ============ Constants ============
    
    /// @notice Action code for staking operations (matches UserState contract)
    uint8 public constant ACTION_STAKE = 2;
    
    // ============ State Variables ============
    
    /// @notice The destination chain ID for cross-chain messages
    uint16 public destinationChainId;
    
    /// @notice The destination contract address on the target chain
    bytes public destinationAddress;
    
    /// @notice Mapping of user addresses to their staked amounts on this chain
    mapping(address => uint256) public staked;
    
    // ============ Events ============
    
    /// @notice Emitted when tokens are staked
    /// @param user The address of the user who staked tokens
    /// @param amount The amount of tokens staked
    /// @param newTotal The new total staked amount for the user
    event TokensStaked(
        address indexed user,
        uint256 amount,
        uint256 newTotal
    );
    
    /// @notice Emitted when the destination is configured
    /// @param chainId The destination chain ID
    /// @param destination The destination contract address
    event DestinationConfigured(uint16 chainId, bytes destination);
    
    /// @notice Emitted when a cross-chain message is sent
    /// @param user The user who initiated the staking
    /// @param amount The amount staked
    /// @param destinationChain The destination chain ID
    event CrossChainMessageSent(
        address indexed user,
        uint256 amount,
        uint16 destinationChain
    );
    
    // ============ Constructor ============
    
    /// @notice Initializes the Staking contract
    /// @param _lzEndpoint The LayerZero endpoint address
    constructor(address _lzEndpoint) NonblockingLzApp(_lzEndpoint) {
        require(_lzEndpoint != address(0), "Invalid endpoint address");
    }
    
    // ============ External Functions ============
    
    /// @notice Sets the destination chain and address for cross-chain messages
    /// @param _chainId The destination chain ID
    /// @param _destinationAddress The encoded destination contract address
    function setDestination(uint16 _chainId, bytes calldata _destinationAddress) 
        external 
        onlyOwner 
    {
        require(_chainId > 0, "Invalid chain ID");
        require(_destinationAddress.length > 0, "Invalid destination address");
        
        destinationChainId = _chainId;
        destinationAddress = _destinationAddress;
        
        emit DestinationConfigured(_chainId, _destinationAddress);
    }
    
    /// @notice Allows users to stake tokens and sends cross-chain message
    /// @param amount The amount of tokens to stake
    function stake(uint256 amount) external payable {
        require(amount > 0, "Amount must be greater than 0");
        require(destinationChainId > 0, "Destination not configured");
        require(destinationAddress.length > 0, "Destination address not set");
        
        // Update local staking state
        staked[msg.sender] += amount;
        
        // Emit local staking event
        emit TokensStaked(msg.sender, amount, staked[msg.sender]);
        
        // Prepare cross-chain message payload
        bytes memory payload = abi.encode(ACTION_STAKE, msg.sender, amount);
        
        // Send cross-chain message
        _lzSend(
            destinationChainId,
            payload,
            payable(msg.sender),
            address(0),
            bytes(""),
            msg.value
        );
        
        // Emit cross-chain message event
        emit CrossChainMessageSent(msg.sender, amount, destinationChainId);
    }
    
    // ============ Internal Functions ============
    
    /// @notice Processes incoming LayerZero messages (currently unused)
    /// @param _srcChainId The source chain ID
    /// @param _srcAddress The source address
    /// @param _nonce The message nonce
    /// @param _payload The message payload
    function _nonblockingLzReceive(
        uint16 _srcChainId,
        bytes memory _srcAddress,
        uint64 _nonce,
        bytes memory _payload
    ) internal override {
        // This contract currently only sends messages, doesn't receive them
        // Override is required by the interface but not used
    }
    
    // ============ External View Functions ============
    
    /// @notice Gets the staked amount for a specific user
    /// @param user The address of the user to query
    /// @return The amount of tokens staked by the user
    function getStakedAmount(address user) external view returns (uint256) {
        require(user != address(0), "Invalid user address");
        return staked[user];
    }
    
    /// @notice Gets the current destination configuration
    /// @return chainId The destination chain ID
    /// @return destination The destination contract address
    function getDestination() external view returns (uint16 chainId, bytes memory destination) {
        return (destinationChainId, destinationAddress);
    }
}
