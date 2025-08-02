# Mori

A regenerative sustainability protocol that brings real-world impact on-chain. Mori enables land stewards, climate innovators, and circular economy builders to issue verifiable carbon offsets and sustainability tokens based on real-time, oracle-verified data — all transparently governed by a decentralized network.

---

## Overview

Mori consists of ten Clarity smart contracts that together form a composable ecosystem for tracking, verifying, and rewarding sustainability progress:

1. **Project Root Contract** – Registers and manages sustainability or carbon offset projects.
2. **Data Anchor Contract** – Receives and stores signed off-chain environmental data.
3. **Proof Engine Contract** – Evaluates data against project goals and computes eligible credits.
4. **Verifier Mesh Contract** – Coordinates decentralized verification and handles disputes.
5. **Impact Tokenizer Contract** – Mints sustainability tokens for verified outcomes.
6. **Credit Streamer Contract** – Issues carbon credits over time based on sustained impact.
7. **Marketplace Router Contract** – Facilitates trading of impact tokens.
8. **Escrow & Slashing Contract** – Manages verifier bonds and penalizes fraudulent actions.
9. **DAO Governance Contract** – Controls protocol upgrades and verifier onboarding.
10. **Trace Explorer Contract** – Provides transparent provenance of every impact token.

---

## Features

- **Project registration** for climate-positive actions like reforestation, soil carbon, recycling  
- **Signed data ingestion** from oracles, sensors, and verified sources  
- **Proof engine** to validate improvement against baselines and thresholds  
- **Staked verifier network** for community-driven approval and audits  
- **ERC-1155-like impact tokens** for fungible and non-fungible sustainability credits  
- **Streaming credit issuance** to encourage ongoing project performance  
- **Decentralized trading** and offset retirement features  
- **DAO governance** over verifier lists, parameters, and protocol logic  
- **Escrow-based slashing system** to prevent fraud and abuse  
- **Full traceability** of each sustainability token’s origin and verification

---

## Smart Contracts

### Project Root Contract
- Registers new sustainability projects
- Defines project scope, type, and baseline
- Links to project owner and expected outcomes

### Data Anchor Contract
- Accepts signed environmental data from trusted oracles
- Associates each data point with a project and timestamp
- Stores metadata for later verification

### Proof Engine Contract
- Assesses whether submitted data meets defined sustainability thresholds
- Computes the quantity of impact or credits earned
- Emits verification events

### Verifier Mesh Contract
- Registers, stakes, and slashes verifiers
- Coordinates verification rounds and voting
- Handles challenge and dispute resolution

### Impact Tokenizer Contract
- Mints tokens representing verified impact (e.g. carbon removed, waste recycled)
- Supports fungible and non-fungible sustainability tokens
- Linked to project metadata and proof results

### Credit Streamer Contract
- Allows credit issuance over time for long-term performance
- Supports vesting schedules and ongoing monitoring
- Encourages accountability

### Marketplace Router Contract
- Routes tokens to marketplaces or DEX integrations
- Handles listing, pricing, and optional royalties
- Supports offset retirement and provenance locking

### Escrow & Slashing Contract
- Manages verifier collateral
- Automatically slashes or rewards based on behavior
- Holds funds for disputes or bounties

### DAO Governance Contract
- Token-weighted proposal creation and voting
- Controls critical protocol parameters
- Verifier onboarding/removal

### Trace Explorer Contract
- Provides a full transparency trail for every token
- Shows verification history, linked data, and project origin
- Supports public auditability

---

## Installation

1. Install [Clarinet CLI](https://docs.hiro.so/clarinet/getting-started)
2. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/mori.git
   ```
3. Run tests:
    ```bash
    npm test
    ```
4. Deploy contracts:
    ```bash
    clarinet deploy
    ```

## Usage

Each smart contract is independently deployed and upgradeable via DAO governance. Mori allows seamless integration with IoT oracles, DAO platforms, and carbon marketplaces.

Refer to individual contract documentation for function signatures, storage layout, and usage examples.

## Testing

Run full test suite using:
    ```bash
    npm test
    ```

**Tests include:**

- Project registration and setup
- Oracle data verification
- Credit calculation logic
- Token minting and marketplace interaction
- Verifier onboarding, disputes, and governance voting

## License

MIT License