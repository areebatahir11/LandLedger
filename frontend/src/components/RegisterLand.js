"use client";
import { useState } from "react";
import { GetContract, GetProvider } from "@/lib/ethers";
import GetOwnershipCertificate from "./Accesspdf";
import Image from "next/image";

export default function RegisterLand() {
  const [area, setArea] = useState("");
  const [location, setLocation] = useState("");
  const [plotNumber, setPlotNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [owner, setOwnerAddress] = useState("");
  const [price, setPrice]=useState("");
  const [registeredLandforcertificate, setRegisteredLandforCertificate] =
    useState(null);

  async function registerLand() {
    try {
      setIsLoading(true);
      const provider = await GetProvider();
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      setOwnerAddress(address);
      const contract = await GetContract();

      const dummyIPFSHash = "sample-hash-ipfs-89744";

      const tx = await contract.registerLand(
        Number(area),
        location,
        plotNumber,
        dummyIPFSHash,
        price
      );
      const receipt = await tx.wait();

      const registeredEvent = receipt?.logs?.find(
        (e) => e.fragment?.name === "RegisteredLand"
      );
      const newLandID = registeredEvent?.args?.landID?.toString();

      alert(`✅ Land registered successfully!\nLand ID: ${newLandID}`);
      const newLand = {
        landID: Number(newLandID),
        owner: owner,
        area: Number(area),
        location,
        plotNumber,
        ipfsHash: dummyIPFSHash,
        status: 0, // Assuming 0 = Verified
        salestatus: 1, // Assuming 1 = Unsold
        price
      };
      setRegisteredLandforCertificate(newLand);

      const allLands = await contract.getAllLands();

      const duplicate = allLands.find(
        (land, index) =>
          index !== Number(newLandID) &&
          land.plotNumber.toLowerCase() === plotNumber.toLowerCase() &&
          land.location.toLowerCase() === location.toLowerCase()
      );

      if (duplicate) {
        const disputeTx = await contract.markAsDisputed(Number(newLandID));
        await disputeTx.wait();

        alert(
          `⚠️ Duplicate Detected! Land ID ${newLandID} marked as DISPUTED.`
        );
      }

      setArea("");
      setLocation("");
      setPlotNumber("");
    } catch (err) {
      console.error(err);

      let message = "❌ Failed to register land.";
      if (err?.data?.message) message += `\n${err.data.message}`;
      else if (err?.error?.message) message += `\n${err.error.message}`;
      else if (err?.message) message += `\n${err.message}`;

      alert(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto mt-12 px-4 flex flex-col md:flex-row gap-10 items-start">
      {/* LEFT: FORM SECTION */}
      <div className="flex-1 space-y-6">
        <h2 className="text-3xl font-bold text-black font-cursive mb-6">
          Register Land
        </h2>

        <div className="border-b border-black pb-2">
          <label className="block text-xl text-black mb-1">📐 Area</label>
          <input
            type="number"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="w-full bg-transparent outline-none text-black text-lg placeholder-gray-400"
            placeholder="Enter area in sq ft"
          />
        </div>

        <div className="border-b border-black pb-2">
          <label className="block text-xl text-black mb-1">📍 Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full bg-transparent outline-none text-black text-lg placeholder-gray-400"
            placeholder="Enter location (e.g., Model town Phase 6)"
          />
        </div>

        <div className="border-b border-black pb-2">
          <label className="block text-xl text-black mb-1">
            🏷️ Plot Number
          </label>
          <input
            type="text"
            value={plotNumber}
            onChange={(e) => setPlotNumber(e.target.value)}
            className="w-full bg-transparent outline-none text-black text-lg placeholder-gray-400"
            placeholder="Enter plot number (e.g., 14-B)"
          />
        </div>

           <div className="border-b border-black pb-2">
          <label className="block text-xl text-black mb-1">📍 Price</label>
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full bg-transparent outline-none text-black text-lg placeholder-gray-400"
            placeholder="Enter Price..."
          />
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={registerLand}
            disabled={isLoading}
            className={`px-4 py-2 rounded transition duration-300 ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black hover:bg-white text-white hover:text-gray-800 border border-black"
            } font-semibold`}
          >
            {isLoading ? "Registering..." : "Register Land"}
          </button>

          {registeredLandforcertificate && (
            <div>
              <GetOwnershipCertificate land={registeredLandforcertificate} />
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 max-w-sm space-y-4">
        <div className="aspect-square relative rounded-xl overflow-hidden border-4 border-gray-300 shadow-md">
          <Image
            src="/background_image/advanced.jpg"
            alt="Land Preview"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </div>
  );
}
