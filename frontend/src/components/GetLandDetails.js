import { useState } from "react";
import { GetContract } from "@/lib/ethers";

export default function GetLandDetails() {
  const [LandID, setLandId] = useState("");
  const [landDetails, setLandDetails] = useState(null);
  const [error, setError] = useState("");

  async function getlanddetails() {
    setError("");
    setLandDetails(null);
    try {
      const contract = await GetContract();
      const details = await contract.getLandDetails(Number(LandID));

      setLandDetails({
        landID: details[0].toString(),
        owner: details[1],
        area: details[2].toString(),
        location: details[3],
        plotNumber: details[4],
        ipfsHash: details[5],
        status: details[6], // Enum index (e.g., 0 = Verified)
        saleStatus: details[7],
        price: details[8],
      });
    } catch (err) {
      console.error(err);
      setError(`❌ Land with ID ${LandID} does not exist.`);
    }
  }

  const getStatusLabel = (status) => {
    return status === 0 ? "Disputed" : "Varified";
  };

  const getSaleStatusLabel = (salestatus) => {
    return salestatus === 0 ? "sold" : "Unsold";
  };

  return (
    <div className="max-w-6xl mx-auto mt-12 px-4">
      <h2 className="text-3xl font-bold mb-10 text-black">
        Get Land Details Get Land Details
      </h2>
      <div className="mt-2 border-b border-black pb-2">
        <label className="block text-xl text-black mb-1">Land ID</label>
        <input
          type="text"
          value={LandID}
          onChange={(e) => setLandId(e.target.value)}
          className="w-full bg-transparent outline-none text-black text-lg placeholder-gray-400"
          placeholder="Enter Land ID"
        />
      </div>
      <button
        onClick={getlanddetails}
        className="mt-6 px-6 py-3 bg-black hover:bg-white hover:text-gray-800 text-white font-semibold rounded-xl transition duration-200"
      >
        Get Land Details
      </button>

      {error && <p className="text-red-500">{error}</p>}

      {landDetails && (
        <div className="mt-4 text-white bg-gray-800 p-4 rounded shadow-md space-y-1 relative">
          <p>
            <strong>Land ID:</strong> {landDetails.landID}
          </p>
          <p>
            <strong>Owner:</strong> {landDetails.owner}
          </p>
          <p>
            <strong>Area:</strong> {landDetails.area} sq ft
          </p>
          <p>
            <strong>Location:</strong> {landDetails.location}
          </p>
          <p>
            <strong>Plot Number:</strong> {landDetails.plotNumber}
          </p>
          <p>
            <strong>IPFS Hash:</strong> {landDetails.ipfsHash}
          </p>
          <p>
            <strong>Verification Status:</strong>{" "}
            {getStatusLabel(landDetails.status)}
          </p>
          <p>
            <strong>Sale Status:</strong>{" "}
            {getSaleStatusLabel(landDetails.salestatus)}
          </p>
          <p>
            <strong>Price:</strong> {landDetails.price}
          </p>
        </div>
      )}
    </div>
  );
}
