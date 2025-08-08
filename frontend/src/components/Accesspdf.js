"use client";
import { generatePDF } from "@/lib/generatePDF";
import { useState } from "react";
import { GetProvider } from "@/lib/ethers";

export default function GetOwnershipCertificate({ land }) {
  const [ownerAddress, setOwnerAddress] = useState("");

  async function handleDownload() {
    const provider = await GetProvider();
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    setOwnerAddress(address);

    generatePDF({
      ...land,
      currentOwner: address,
    });
  }

  return (
    <button
      className="bg-gray-800 ml-6 text-white px-4 py-2 rounded hover:bg-gray-700"
      onClick={handleDownload}
    >
      Download Certificate
    </button>
  );
}
