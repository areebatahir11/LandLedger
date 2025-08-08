"use client";
import { useState } from "react";
import { GetContract } from "@/lib/ethers";
import { ethers } from "ethers";

export default function MyLands() {
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadMyLands = async () => {
    try {
      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      const contract = await GetContract();
      const myLands = await contract.getMyLands(address);

      setLands(myLands);
    } catch (err) {
      console.error("Error loading your lands:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (status) => {
    return status === 0 ? "Disputed" : "Varified";
  };

  const getSaleStatusLabel = (salestatus) => {
    return salestatus === 0 ? "Unsold" : "Sold";
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white/10 backdrop-blur-md rounded-2xl shadow-lg border border-white/20">
      <h2 className="text-3xl font-bold text-center mb-6 text-black">
        Your Registered Lands
      </h2>

      <div className="text-center mb-6">
        <button
          onClick={loadMyLands}
          className="bg-black text-white hover:bg-white hover:text-gray-800 font-semibold px-6 py-3 rounded-lg shadow-md transition duration-200"
        >
          {loading ? "Loading..." : "Load My Lands"}
        </button>
      </div>

      {lands.length === 0 ? (
        <p className="text-center text-gray-700">
          {loading ? "Fetching your lands..." : "No lands found."}
        </p>
      ) : (
        lands.map((land, idx) => (
          <div key={idx} className="bg-gray-800 text-white rounded-lg p-4 mb-4">
            <p>
              <strong>Land ID:</strong> {Number(land.landID)}
            </p>
            <p>
              <strong>Location:</strong> {land.location}
            </p>
            <p>
              <strong>Area:</strong> {Number(land.area)} sq ft
            </p>
            <p>
              <strong>Plot Number:</strong> {land.plotNumber}
            </p>
            <p>
              <strong>Verification Status:</strong>{" "}
              {getStatusLabel(land.status)}
            </p>
            <p>
              <strong>Sale Status:</strong>{" "}
              {getSaleStatusLabel(land.salestatus)}
            </p>
            <p>
              <strong>Price:</strong> {land.price}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
