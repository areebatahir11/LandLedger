"use client";
import { useState } from "react";
import { GetContract, GetEthersProvider } from "@/lib/ethers";

export default function GetOwnershipHistory() {
  const [landID, setLandId] = useState("");
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(false);

  async function getownershiphistory() {
    try {
      setLoading(true);
      const contract = await GetContract();
      const provider = await GetEthersProvider();
      const ownerAddresses = await contract.getOwnershipHistory(landID);

      const ownerNames = await Promise.all(
        ownerAddresses.map(async (address) => {
          try {
            const ens = await provider.lookupAddress(address);
            return ens || address;
          } catch {
            // fallback: if ENS not supported, return address
            return address;
          }
        })
      );

      setOwners(ownerNames);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to fetch ownership history!\n" + (err?.message || ""));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto mt-12 px-4">
      <h2 className="text-3xl font-bold mb-10 text-black">
        Ownership History of Land
      </h2>
      <div className="border-b border-black pb-2">
        <label className="block text-xl text-black mb-1">Land ID</label>
        <input
          type="text"
          value={landID}
          onChange={(e) => setLandId(e.target.value)}
          className="w-full bg-transparent outline-none text-black text-lg placeholder-gray-400"
          placeholder="Enter Land ID"
        />
      </div>
      <button
        onClick={getownershiphistory}
        className="mt-6 px-6 py-3 bg-black hover:bg-white hover:text-gray-800 text-white font-semibold rounded-xl transition duration-200"
      >
        {loading ? "Loading..." : "Previous Owners"}
      </button>

      {owners.length > 0 && (
        <div className="mt-4 bg-gray-800 text-white p-3 rounded-lg">
          <h3 className="font-semibold mb-2">Previous Owners:</h3>
          <ul className="list-disc ml-6 space-y-1">
            {owners.map((owner, index) => (
              <li key={index} className="break-all">
                {owner}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
