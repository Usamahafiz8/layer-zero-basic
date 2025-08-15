// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./UserState.sol";

/**
 * @title TestUserState
 * @dev Test wrapper for UserState contract that exposes internal functions
 *      for testing purposes. This contract should only be used in test
 *      environments and not in production.
 * @author Your Name
 */
contract TestUserState is UserState {
    // ============ Constructor ============
    
    /// @notice Initializes the TestUserState contract
    /// @param _lzEndpoint The LayerZero endpoint address
    constructor(address _lzEndpoint) UserState(_lzEndpoint) {}
    
    // ============ External Test Functions ============
    
    /// @notice Public function to test the internal _nonblockingLzReceive
    /// @dev This function is only for testing purposes and should not be used in production
    /// @param _srcChainId The source chain ID
    /// @param _srcAddress The source address
    /// @param _nonce The message nonce
    /// @param _payload The message payload
    function testNonblockingLzReceive(
        uint16 _srcChainId,
        bytes memory _srcAddress,
        uint64 _nonce,
        bytes memory _payload
    ) external {
        _nonblockingLzReceive(_srcChainId, _srcAddress, _nonce, _payload);
    }
}


