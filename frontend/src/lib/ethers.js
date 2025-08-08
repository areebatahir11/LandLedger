import { ethers } from "ethers";
import abiFile from "@/abi/LandRegistry.json";

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export async function GetProvider() {
  if (!window.ethereum) throw new Error("MetaMask is not installed");
  else {
    return new ethers.BrowserProvider(window.ethereum);
  }
}

export async function GetContract() {
  const provider = await GetProvider();
  const signer = await provider.getSigner();

  const abi = abiFile.abi;

  const contract = new ethers.Contract(contractAddress, abi, signer);
  return contract;
}

export async function GetEthersProvider() {
  const provider = await GetProvider();
  return provider;
}

