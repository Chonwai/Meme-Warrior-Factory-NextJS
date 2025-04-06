# Meme Warriors Factory

<div align="center">
  <img src="public/images/logo.png" alt="Meme Warriors Logo" width="200"/>
  <h3>Create AI Meme Soldiers & Battle in the Pixel Arena!</h3>
  
  [![Next.js](https://img.shields.io/badge/Built%20with-Next.js-black?style=flat-square&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.3.0-38b2ac?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
  [![Viem](https://img.shields.io/badge/Viem-1.0.0-purple?style=flat-square)](https://viem.sh/)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
</div>

## 📖 Overview

Meme Warriors Factory is a web3 gaming platform that allows users to create AI-generated meme soldiers and battle in a pixelated blockchain arena. The platform supports multiple blockchain networks, including Celo, Flow, and World Chain, enabling users to connect their wallets, generate unique warriors, and participate in battles to earn rewards.

## ✨ Features

- **AI-Powered Meme Generation**: Create custom meme soldiers with AI technology
- **Multi-Chain Support**: Seamlessly connect to Celo, Flow, and World Chain networks
- **Pixelated Battle Arena**: Deploy your warriors in exciting turn-based battles
- **Voting System**: Vote for your favorite warriors in community battles
- **Reward Mechanism**: Earn rewards for successful battles and voting
- **Wallet Integration**: Connect with MetaMask and other EVM-compatible wallets
- **Interactive UI**: Enjoy a pixel-art gaming interface with Minecraft-inspired aesthetics

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0.0 or later
- npm or yarn
- MetaMask or another EVM-compatible wallet

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/meme-warrior-factory-nextjs.git
cd meme-warrior-factory-nextjs
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory and add the following environment variables:

```
NEXT_PUBLIC_REWARD_CONTRACT_ADDRESS=your_contract_address
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key
```

4. Start the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 🌐 Supported Networks

The application supports the following blockchain networks:

- **Celo Alfajores Testnet**
  - Chain ID: `0xaef3` (44787)
  - RPC URL: `https://alfajores-forno.celo-testnet.org`
  - Block Explorer: `https://alfajores.celoscan.io`

- **Celo Mainnet**
  - Chain ID: `0xa4ec` (42220)
  - RPC URL: `https://forno.celo.org`
  - Block Explorer: `https://explorer.celo.org`

- **Flow Testnet**
  - Chain ID: `0x221` (545)
  - RPC URL: `https://testnet.evm.nodes.onflow.org`
  - Block Explorer: `https://evm-testnet.flowscan.io`

- **World Chain**
  - Chain ID: `0x3a44` (14916)
  - RPC URL: `https://mainnet.worldchain.network`
  - Block Explorer: `https://explorer.worldchain.network`

## 🏗️ Project Structure

```
meme-warrior-factory-nextjs/
├── app/                    # Next.js 13 app directory
│   ├── battlefield/        # Battle arena page
│   ├── soldier-prep/       # Soldier creation pages
│   ├── wallet/             # Wallet management page
│   ├── layout.tsx          # Root layout component
│   └── page.tsx            # Homepage
├── components/             # Reusable components
│   ├── NetworkIndicator/   # Network selection UI
│   ├── NetworkSelectionModal/ # Network switching modal
│   ├── VoteButton/         # Voting mechanism component
│   └── ...                 # Other components
├── lib/                    # Client-side libraries
│   └── wallet-context.tsx  # Wallet connection context
├── public/                 # Static assets
│   └── images/             # Image assets
├── styles/                 # Global styles
├── utils/                  # Utility functions
│   └── web3.js             # Web3 interaction helpers
├── .env.local              # Local environment variables
└── package.json            # Project dependencies
```

## 🔧 Smart Contract Integration

The application integrates with the `MemeWarriorsReward` smart contract, which provides the following functionality:

- Voting for teams in battles
- Retrieving battle information
- Checking user votes
- Claiming rewards after battles
- Tracking battle metrics

To interact with the contract, the application uses the Viem library and provides a set of utility functions in `utils/web3.js`.

## 🖼️ Creating a Meme Soldier

1. Navigate to the soldier creation page.
2. Enter a name and prompt for your soldier.
3. The AI will generate a unique pixelated meme soldier based on your prompt.
4. Review and customize your soldier's attributes if desired.
5. Save the soldier to your wallet or deploy directly to the battlefield.

## ⚔️ Participating in Battles

1. Connect your wallet to one of the supported networks.
2. Navigate to the battlefield page.
3. Select an active battle to participate in.
4. Vote for your favorite team by clicking the "Vote" button.
5. Wait for the battle to end and claim your rewards if your team wins.

## 🛠️ Development

### Building for Production

```bash
npm run build
# or
yarn build
```

### Running Production Build

```bash
npm start
# or
yarn start
```

### Code Linting

```bash
npm run lint
# or
yarn lint
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/) - The React Framework
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [Viem](https://viem.sh/) - TypeScript Interface for Ethereum
- [OpenAI](https://openai.com/) - For AI-powered image generation
- [Celo](https://celo.org/) - Mobile-first blockchain platform
- [Flow](https://flow.com/) - Blockchain designed for NFTs and gaming

---

<div align="center">
  <p>Built with ❤️ by the Meme Warriors Team</p>
</div>
