"use client";
import { useState } from "react";
import { GetContract } from "@/lib/ethers";

export default function VarifyLand() {
  const [disputedLands, setDisputedLands] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false); // to check if data has been loaded at least once

  async function loadDisputedLands() {
    setIsLoading(true);
    try {
      const contract = await GetContract();
      const lands = await contract.getDisputedLands();
      setDisputedLands(lands);
      setHasLoaded(true);
    } catch (err) {
      console.error("Failed to load disputed lands:", err);
      alert("❌ Error loading disputed lands.");
    }
    setIsLoading(false);
  }

  async function handleVerify(landID) {
    try {
      const contract = await GetContract();
      const tx = await contract.verifyLandAndRemoveDuplicates(landID);
      await tx.wait();
      alert(`✅ Land ID ${landID} verified and duplicates removed.`);
      await loadDisputedLands(); // reload updated list
    } catch (err) {
      console.error(err);
      alert("❌ Verification failed.");
    }
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white/10 backdrop-blur-md rounded-2xl shadow-lg border border-white/20">
      <h2 className="text-2xl font-bold text-center mb-6 text-black">
        Varification of a Land
      </h2>

      <div className="flex justify-center mb-6 mt-8">
        <button
          onClick={loadDisputedLands}
          className="px-6 py-2 bg-black hover:bg-white hover:text-gray-800 text-white rounded"
        >
          Load Disputed Lands
        </button>
      </div>

      {isLoading ? (
        <p className="text-center text-black">🔄 Loading disputed lands...</p>
      ) : !hasLoaded ? (
        <p className="text-center text-black">
          Click the button above to view disputed lands.
        </p>
      ) : disputedLands.length === 0 ? (
        <p className="text-center text-black">No disputed lands found.</p>
      ) : (
        disputedLands.map((land, idx) => (
          <div
            key={idx}
            className="bg-gray-800 text-white rounded-lg p-4 mb-4 shadow border border-gray-200"
          >
            <p>
              <strong>Land ID:</strong> {land.landID.toString()}
            </p>
            <p>
              <strong>Owner:</strong> {land.owner}
            </p>
            <p>
              <strong>Location:</strong> {land.location}
            </p>
            <p>
              <strong>Plot No:</strong> {land.plotNumber}
            </p>
            <p>
              <strong>Price:</strong> {land.price}
            </p>
            <p>
              <strong>Status:</strong> Disputed
            </p>
            <button
              onClick={() => handleVerify(land.landID)}
              className="mt-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-black rounded"
            >
              Verify Land
            </button>
          </div>
        ))
      )}
    </div>
  );
}
