# 🏛️ LandLedger – Decentralized Land Registry System

**LandLedger** is a full-stack blockchain application that enables secure, transparent, and tamper-proof land registration and transfer of ownership.  
Built with **Solidity** for the smart contract and **Next.js** for the frontend, it ensures that property records are immutable and accessible to all stakeholders.

---
## 🚀 Features

- **Land Registration** – Register land parcels with unique identifiers and metadata.
- **Land purchasing** – Transfer property rights securely on the blockchain.
- **Ownership History** – View complete ownership records of any land parcel.
- **Dispute Handling** – Automatically mark lands as disputed when ownership anomalies occur.
- **Verification System** – Varification of disputed lands.
- **Land details by ID** – Quickly find lands by owner address or unique ID.
- **PDF as registry Certificates** – Download verified land ownership certificates.
- **Gas Optimization** – Hash-based indexing for duplicate checks.

Video Demo:
---
https://drive.google.com/file/d/1eW6LEvA08SZbR6UvAOlYprtVgZYN6Ppu/view?usp=drive_link

## 🛠️ Tech Stack

**Smart Contract**  
- Solidity  
- Hardhat  
- OpenZeppelin (Counters for auto ID generation)

**Frontend**  
- Next.js  
- Tailwind CSS  
- Ethers.js for Web3 integration

**Other Tools**  
- IPFS (Here used a dummy IPFS-HASH)  
- PDF generation library for certificates(jspdf)


---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository
```
git clone https://github.com/areebatahir11/LandLedger.git
cd LandLedger
````

### 2️⃣ Backend Setup (Smart Contract)

```bash
cd backend
npm install
npx hardhat compile
```

### 3️⃣ Frontend Setup

```
cd frontend
npm install
npm run dev
```

---

## 🔗 Smart Contract Deployment

To deploy on a local blockchain:

```
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost

```
## Frontend link on vercel
https://land-ledger-gamma.vercel.app/

## 📜 License

This project is licensed under the MIT License.

Developed by **Areeba**


