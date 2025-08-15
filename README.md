# LayerZero Cross-Chain Demo

A comprehensive demonstration of LayerZero cross-chain interoperability using a centralized state management pattern. This project shows how to build cross-chain applications where actions on multiple chains update a single, centralized state contract.

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐
│   SEPOLIA       │    │     AMOY        │
│                 │    │                 │
│  UserState      │◄───┤   PreSale       │
│  (Central DB)   │    │   (Buy Tokens)  │
│                 │    │                 │
│  Contract:      │    │  Contract:      │
│  0x0f46E2...    │    │  0x7Dda43...    │
└─────────────────┘    └─────────────────┘
         ▲                       ▲
         │                       │
         └───────┐       ┌───────┘
                 │       │
         ┌─────────────────┐
         │     AMOY        │
         │                 │
         │   Staking       │
         │   (Stake Tokens)│
         │                 │
         │  Contract:      │
         │  0x489476...    │
         └─────────────────┘
```

## 📁 Project Structure

```
layer-zero-basics/
├── contracts/                    # Smart contracts
│   ├── UserState.sol            # Central state management contract
│   ├── PreSale.sol              # Token purchase contract
│   ├── Staking.sol              # Token staking contract
│   └── TestUserState.sol        # Testing helper contract
│
├── scripts/                      # All scripts organized by purpose
│   ├── deploy/                   # Deployment scripts
│   │   ├── deployUserState.js    # Deploy UserState to Sepolia
│   │   ├── deployPreSale.js      # Deploy PreSale to Amoy
│   │   ├── deployStaking.js      # Deploy Staking to Amoy
│   │   └── deployToTestnets.js   # Deploy all contracts
│   │
│   ├── test/                     # Testing scripts
│   │   ├── simpleLocalTest.js    # Local cross-chain simulation
│   │   ├── stakingTest.js        # Staking functionality test
│   │   ├── testBuy.js            # Buy flow test on testnets
│   │   ├── testFullFlow.js       # Complete flow test
│   │   ├── testAll.js            # Comprehensive test suite
│   │   ├── localCrossChainTest.js # Local cross-chain test
│   │   ├── fullLocalTest.js      # Full local test
│   │   └── localTest.js          # Basic local test
│   │
│   └── utils/                    # Utility scripts
│       ├── setDestination.js     # Configure cross-chain destinations
│       ├── readState.js          # Read contract state
│       ├── checkBalance.js       # Check wallet balances
│       ├── demo.js               # Visual demonstration
│       ├── minimalTest.js        # Minimal cost test
│       ├── setTrustedRemotes.js  # Configure trusted remotes
│       ├── getAddress.js         # Get wallet address
│       └── stakeTokens.js        # Simple staking interface
│
├── frontend/                     # Web interface
│   └── index.html               # Basic web frontend
│
├── artifacts/                    # Compiled contracts (auto-generated)
├── cache/                       # Hardhat cache (auto-generated)
├── ignition/                    # Hardhat Ignition files
├── .env                         # Environment variables
├── hardhat.config.js           # Hardhat configuration
├── package.json                # Project dependencies and scripts
├── README.md                   # Main project documentation
├── PROJECT_STRUCTURE.md        # Detailed structure documentation
├── QUICK_REFERENCE.md          # Quick reference guide
└── CLEANUP_SUMMARY.md          # Cleanup summary
```

## 🚀 Quick Start

### 1. Setup
```bash
# Clone and install dependencies
git clone <repository-url>
cd layer-zero-basics
npm install

# Create environment file
cp .env.example .env
# Add your private key and RPC URLs to .env
```

### 2. Compile Contracts
```bash
npm run compile
```

### 3. Test Locally (Recommended)
```bash
# Test the complete cross-chain flow
npm run test:local

# Test staking functionality specifically
npm run test:staking

# Simple staking interface
npm run stake
```

### 4. Deploy to Testnets
```bash
# Deploy all contracts
npm run deploy:all

# Configure cross-chain destinations
npm run utils:set-dest
```

## 📜 Smart Contracts

### UserState.sol (Sepolia)
Central state management contract that receives cross-chain messages and tracks user token purchases and staking activities.

**Key Features:**
- Receives LayerZero messages from other chains
- Tracks `totalPurchased` and `totalStaked` for all users
- Processes action codes: 1 (purchase), 2 (staking)
- Emits events for state changes

**Functions:**
- `getTotals(address user)` - Get user's purchased and staked amounts
- `getTotalPurchased(address user)` - Get user's total purchased
- `getTotalStaked(address user)` - Get user's total staked

### PreSale.sol (Amoy)
Token purchase contract that allows users to "buy" tokens and sends cross-chain messages to update the central state.

**Key Features:**
- Users can buy tokens with `buyTokens(amount)`
- Sends LayerZero messages to UserState on Sepolia
- Action code: 1 (purchase)
- Requires LayerZero fee payment

### Staking.sol (Amoy)
Token staking contract that allows users to stake tokens and sends cross-chain messages to update the central state.

**Key Features:**
- Users can stake tokens with `stake(amount)`
- Sends LayerZero messages to UserState on Sepolia
- Action code: 2 (staking)
- Tracks local staking state
- Requires LayerZero fee payment

### TestUserState.sol
Testing helper contract that inherits from UserState and exposes the internal `_nonblockingLzReceive` function for local testing.

## 🛠️ Available Scripts

### Deployment Scripts
```bash
npm run deploy:userstate    # Deploy UserState to Sepolia
npm run deploy:presale      # Deploy PreSale to Amoy
npm run deploy:staking      # Deploy Staking to Amoy
npm run deploy:all          # Deploy all contracts to testnets
```

### Testing Scripts
```bash
npm run test:local          # Run local cross-chain simulation
npm run test:staking        # Test staking functionality locally
npm run test:buy            # Test buy flow on testnets
npm run test:full           # Test complete flow on testnets
npm run test:all            # Run comprehensive test suite
```

### Utility Scripts
```bash
npm run utils:set-dest      # Configure cross-chain destinations
npm run utils:read-state    # Read current contract state
npm run utils:check-balance # Check wallet balances
npm run utils:demo          # Visual demonstration
npm run utils:minimal       # Minimal cost test
npm run utils:set-trusted   # Configure trusted remotes
npm run utils:stake         # Simple staking interface
```

### Legacy Scripts (for backward compatibility)
```bash
npm run configure           # Alias for utils:set-dest
npm run read:state          # Alias for utils:read-state
npm run check:balance       # Alias for utils:check-balance
npm run stake               # Alias for utils:stake
```

## 🧪 Testing

### Local Testing (Recommended)
Local testing simulates the complete cross-chain flow without requiring real tokens or gas fees.

```bash
# Test complete cross-chain flow
npm run test:local

# Test staking functionality
npm run test:staking

# Simple staking interface
npm run stake
```

**Local Test Results:**
```
🎉 SIMPLE LOCAL TEST COMPLETE!
==============================
✅ Cross-chain state management working
✅ Multiple users supported
✅ Multiple transactions per user working
✅ State accumulation working
✅ LayerZero message simulation working

📈 GLOBAL STATISTICS:
   Total Purchased: 375
   Total Staked: 150
   Total Users: 2
```

### Testnet Testing
Testnet testing uses real Sepolia and Amoy testnets with actual LayerZero infrastructure.

```bash
# Deploy to testnets
npm run deploy:all

# Configure destinations
npm run utils:set-dest

# Test on testnets
npm run test:buy
npm run test:full
```

## 🌐 LayerZero Configuration

### Network Configuration
- **Sepolia**: Chain ID 10161 (LayerZero)
- **Amoy**: Chain ID 80002 (LayerZero)
- **Local**: Chain ID 31337 (Hardhat)

### Endpoint Addresses
- **Sepolia**: `0x6aB5Ae6822647046626e83ee6dB8187151E1d5ab`
- **Amoy**: `0xf69186dfba60ddb133e91e9a4b5673624293df17`

### Contract Addresses (Deployed)
- **UserState (Sepolia)**: `0x0f46E2c871Ab9B891caCF986EAa55c28e7751cE7`
- **PreSale (Amoy)**: `0x7Dda431a9e4F451Dd8Ea50788B63df69f3D18BA4`
- **Staking (Amoy)**: `0x489476ABbe4CbC3A7CeaB2Fc70225684CBEf6b5E`

## 📊 State Management

The system uses a centralized state management pattern:

1. **User Action**: User calls function on source chain (Amoy)
2. **Message Creation**: Contract creates LayerZero payload
3. **Cross-Chain Send**: LayerZero sends message to destination chain (Sepolia)
4. **State Update**: UserState receives message and updates user's totals
5. **Verification**: User can check updated state on destination chain

### Message Format
```solidity
// Payload structure
(uint8 action, address user, uint256 amount)

// Action codes
ACTION_PURCHASE = 1  // Token purchase
ACTION_STAKE = 2     // Token staking
```

### State Variables
```solidity
mapping(address => uint256) public totalPurchased;  // User's total purchased
mapping(address => uint256) public totalStaked;     // User's total staked
```

## 🔧 Development

### Environment Setup
Create a `.env` file with:
```env
PRIVATE_KEY=your_64_character_private_key
SEPOLIA_RPC=your_sepolia_rpc_url
AMOY_RPC=your_amoy_rpc_url
```

### Compilation
```bash
npm run compile
```

### Local Development
```bash
# Start local testing
npm run test:local

# Test specific functionality
npm run test:staking

# Use simple staking interface
npm run stake
```

### Adding New Features
1. Modify contracts in `contracts/`
2. Add tests in `scripts/test/`
3. Add utilities in `scripts/utils/`
4. Update documentation

## 🚨 Important Notes

### Gas Requirements
- **Sepolia**: Requires Sepolia ETH for gas
- **Amoy**: Requires Amoy MATIC for gas
- **LayerZero Fees**: Additional fees for cross-chain messages

### Token Requirements
- **Sepolia**: Get Sepolia ETH from [Sepolia Faucet](https://sepoliafaucet.com/)
- **Amoy**: Get Amoy MATIC from [Polygon Faucet](https://faucet.polygon.technology/) (select Amoy)

### Cross-Chain Delays
- LayerZero messages can take 1-5 minutes to deliver
- Always wait for message confirmation before checking state
- Use `npm run utils:read-state` to monitor progress

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Update documentation
6. Submit a pull request

### Development Guidelines
- Follow the existing code structure
- Add comprehensive tests
- Update documentation for new features
- Use the organized script structure
- Test locally before testnet deployment

## 📄 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

**"insufficient funds"**
- Get more testnet tokens from faucets
- Check your wallet balance with `npm run utils:check-balance`

**"private key too short"**
- Ensure your private key is 64 characters long
- Check your `.env` file format

**"network error"**
- Verify RPC URLs in `.env`
- Check network connectivity

**"function not found"**
- Run `npm run compile` to compile contracts
- Check contract deployment status

### Getting Help
- Check the `QUICK_REFERENCE.md` for common commands
- Review `PROJECT_STRUCTURE.md` for architecture details
- Use local testing for development and debugging
- Check the troubleshooting section in this README

## 🎯 Key Features

- ✅ **Cross-Chain Interoperability**: LayerZero integration
- ✅ **Centralized State Management**: Single source of truth
- ✅ **Token Purchase**: Buy tokens on Amoy, track on Sepolia
- ✅ **Token Staking**: Stake tokens on Amoy, track on Sepolia
- ✅ **Local Testing**: Complete simulation without real tokens
- ✅ **Testnet Testing**: Real cross-chain testing
- ✅ **Organized Structure**: Clean, maintainable codebase
- ✅ **Comprehensive Documentation**: Detailed guides and references
- ✅ **User-Friendly Scripts**: Easy-to-use commands
- ✅ **Production Ready**: Scalable architecture

## 🚀 Quick Commands

| Purpose | Command |
|---------|---------|
| **Local Testing** | `npm run test:local` |
| **Staking** | `npm run stake` |
| **Deploy All** | `npm run deploy:all` |
| **Check State** | `npm run utils:read-state` |
| **Check Balance** | `npm run utils:check-balance` |
| **Configure** | `npm run utils:set-dest` |
| **Demo** | `npm run utils:demo` |

---

**Ready to build cross-chain applications!** 🚀
