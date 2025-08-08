// src/components/ConnectWallet.js
"use client";
import { useState, useEffect } from "react";

export default function ConnectWallet({ onConnect }) {
  const [account, setAccount] = useState("");

  async function connectWallet() {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
      if (onConnect) onConnect(accounts[0]);
    } catch (err) {
      if (err.code === -32002) {
        alert(
          "Connection request already pending in MetaMask. Please open it."
        );
      } else {
        console.error(err);
      }
    }
  }

  return (
    <button
      onClick={connectWallet}
      className="bg-gray-800 hover:bg-gray-700 text-white font-semibold px-4 py-2 rounded-xl shadow-lg shadow-black text-shadow-md transition duration-300"
    >
      {account ? `Connected ${account.slice(0, 6)}...` : "Connect Wallet"}
    </button>
  );
}
