"use client";
import { useState } from "react";
import { GetContract } from "@/lib/ethers";

export default function DisputedLand() {
  const [disputedLands, setDisputedLands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);

  async function fetchDisputedLands() {
    try {
      setLoading(true);
      const contract = await GetContract();
      const allLands = await contract.getDisputedLands();

      const disputed = allLands
        .filter((land) => Number(land.status) === 1)
        .map((land) => ({
          id: land.landID.toString(),
          owner: land.owner,
          area: land.area,
          location: land.location,
          plotNumber: land.plotNumber,
          ipfs: land.ipfsHash,
        }));

      setDisputedLands(disputed);
      setFetched(true);
    } catch (err) {
      console.error("Error fetching disputed lands", err);
      alert("❌ Failed to fetch disputed lands.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white/10 backdrop-blur-md rounded-2xl shadow-lg border border-white/20">
      <h2 className="text-2xl font-bold mb-6 text-center text-black">
        🛑 Disputed Land Claims
      </h2>

      <button
        onClick={fetchDisputedLands}
        disabled={loading}
        className={`w-full py-2 mb-6 rounded ${
          loading ? "bg-gray-500" : "bg-red-600 hover:bg-red-700"
        } text-white font-semibold`}
      >
        {loading ? "Checking..." : "Check for Disputed Lands"}
      </button>

      {fetched && (
        <>
          {disputedLands.length === 0 ? (
            <p className="text-center text-green-700">
              No disputed lands found ✅
            </p>
          ) : (
            <ul className="space-y-4">
              {disputedLands.map((land) => (
                <li
                  key={land.id}
                  className="mt-4 bg-gray-800 text-white p-3 rounded-lg"
                >
                  <p>
                    <strong>Land ID:</strong> {land.id}
                  </p>
                  <p>
                    <strong>Owner:</strong> {land.owner}
                  </p>
                  <p>
                    <strong>Area:</strong> {land.area} sq ft
                  </p>
                  <p>
                    <strong>Location:</strong> {land.location}
                  </p>
                  <p>
                    <strong>Plot No:</strong> {land.plotNumber}
                  </p>
                  <p>
                    <strong>IPFS Hash:</strong> {land.ipfs}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
