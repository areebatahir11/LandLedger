// "use client";
// import { useEffect, useState } from "react";
// import { GetContract } from "@/lib/ethers";
// import { parseEther, formatEther } from "ethers";

// export default function PurchaseLand() {
//   const [lands, setLands] = useState([]);
//   const [selectedLandId, setSelectedLandId] = useState(null);
//   const [priceInEth, setPriceInEth] = useState("");

//   async function purchaseLand() {
//     try {
//       const contract = await GetContract();
//       const value = parseEther(priceInEth); // ✅ correct
//       const tx = await contract.purchaseLand(selectedLandId, { value });
//       await tx.wait();
//       alert("✅ Land purchased successfully!");
//     } catch (err) {
//       console.error(err);
//       let message = "❌ Failed to purchase land!";
//       if (err?.data?.message) message += `\n${err.data.message}`;
//       else if (err?.error?.message) message += `\n${err.error.message}`;
//       else if (err?.message) message += `\n${err.message}`;
//       alert(message);
//     }
//   }

//   // Fetch all lands on page load
//   useEffect(() => {
//     const fetchLands = async () => {
//       try {
//         const contract = await GetContract();
//         const allLands = await contract.getAllLands();
//         setLands(allLands);
//       } catch (err) {
//         console.error("Failed to fetch lands:", err);
//       }
//     };

//     fetchLands();
//   }, []);

//   return (
//     <div className="max-w-6xl mx-auto mt-12 px-4">
//       <h2 className="text-3xl font-bold mb-10 text-black">Purchase Land</h2>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//         {lands.map((land, index) => {
//           let price = "N/A";
//           try {
//             if (land?.[8]) {
//               price = `${formatEther(land[8])} ETH`; // ✅ correct
//             }
//           } catch {
//             price = "N/A";
//           }

//           return (
//             <div key={index} className="border p-4 rounded-xl shadow">
//               <p>
//                 <strong>ID:</strong> {land[0].toString()}
//               </p>
//               <p>
//                 <strong>Owner:</strong> {land[1]}
//               </p>
//               <p>
//                 <strong>Location:</strong> {land[2]}
//               </p>
//               <p>
//                 <strong>Area:</strong> {land[3]}
//               </p>
//               <p>
//                 <strong>Price:</strong> {price}
//               </p>

//               <button
//                 onClick={() => {
//                   if (land?.[8]) {
//                     try {
//                       setSelectedLandId(land[0].toString());
//                       setPriceInEth(formatEther(land[8])); // ✅ correct
//                     } catch {
//                       alert("❌ Invalid price for this land.");
//                     }
//                   } else {
//                     alert("❌ This land has no price set.");
//                   }
//                 }}
//                 className="mt-4 px-4 py-2 bg-black text-white rounded hover:bg-white hover:text-black transition"
//               >
//                 Select for Purchase
//               </button>
//             </div>
//           );
//         })}
//       </div>

//       {selectedLandId && (
//         <div className="mt-10 border-t pt-8">
//           <h3 className="text-2xl font-semibold mb-4">Confirm Purchase</h3>
//           <p className="mb-2 text-black">Selected Land ID: {selectedLandId}</p>

//           <div className="mb-4">
//             <label className="block text-black mb-1">Price in ETH</label>
//             <input
//               type="text"
//               value={priceInEth}
//               onChange={(e) => setPriceInEth(e.target.value)}
//               className="w-full border px-3 py-2 rounded"
//             />
//           </div>

//           <button
//             onClick={purchaseLand}
//             className="px-6 py-3 bg-black text-white rounded-xl hover:bg-white hover:text-black transition"
//           >
//             Purchase Land
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }
"use client";
import { useEffect, useState } from "react";
import { GetContract } from "@/lib/ethers";
import { parseEther, formatEther } from "ethers";

export default function PurchaseLand() {
  const [lands, setLands] = useState([]);
  const [selectedLandId, setSelectedLandId] = useState(null);
  const [priceInEth, setPriceInEth] = useState("");

  const landStatusMap = {
    0: "Verified",
    1: "Disputed",
  };

  const saleStatusMap = {
    0: "Sold",
    1: "Unsold",
  };

  const fetchLands = async () => {
    try {
      const contract = await GetContract();
      const allLands = await contract.getAllLands();
      setLands(allLands);
    } catch (err) {
      console.error("Failed to fetch lands:", err);
    }
  };

  async function purchaseLand() {
    try {
      const contract = await GetContract();
      const value = parseEther(priceInEth);
      const tx = await contract.purchaseLand(selectedLandId, { value });
      await tx.wait();
      alert("✅ Land purchased successfully!");
      await fetchLands(); // 🔄 update owner & keep price shown
    } catch (err) {
      console.error(err);
      let message = "❌ Failed to purchase land!";
      if (err?.data?.message) message += `\n${err.data.message}`;
      else if (err?.error?.message) message += `\n${err.error.message}`;
      else if (err?.message) message += `\n${err.message}`;
      alert(message);
    }
  }

  useEffect(() => {
    fetchLands();
  }, []);

  return (
    <div className="max-w-6xl mx-auto mt-12 px-4">
      <h2 className="text-3xl font-bold mb-10 text-black">Purchase Land</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {lands.map((land, index) => {
          let price = "N/A";
          try {
            if (land?.[8]) {
              price = `${formatEther(land[8])} ETH`;
            }
          } catch {
            price = "N/A";
          }

          return (
            <div key={index} className="border p-4 rounded-xl shadow">
              <p><strong>ID:</strong> {land[0].toString()}</p>
              <p><strong>Owner:</strong> {land[1]}</p>
              <p><strong>Location:</strong> {land[2]}</p>
              <p><strong>Area:</strong> {land[3]}</p>
              <p><strong>Price:</strong> {land[8]}</p>
              <p><strong>Land Status:</strong> {landStatusMap[land[6]] || "Unknown"}</p>
              <p><strong>Sale Status:</strong> {saleStatusMap[land[7]] || "Unknown"}</p>

              <button
                onClick={() => {
                  if (land?.[8]) {
                    try {
                      setSelectedLandId(land[0].toString());
                      setPriceInEth(formatEther(land[8]));
                    } catch {
                      alert("❌ Invalid price for this land.");
                    }
                  } else {
                    alert("❌ This land has no price set.");
                  }
                }}
                className="mt-4 px-4 py-2 bg-black text-white rounded hover:bg-white hover:text-black transition"
              >
                Select for Purchase
              </button>
            </div>
          );
        })}
      </div>

      {selectedLandId && (
        <div className="mt-10 border-t pt-8">
          <h3 className="text-2xl font-semibold mb-4">Confirm Purchase</h3>
          <p className="mb-2 text-black">Selected Land ID: {selectedLandId}</p>

          <div className="mb-4">
            <label className="block text-black mb-1">Price in ETH</label>
            <input
              type="text"
              value={priceInEth}
              onChange={(e) => setPriceInEth(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <button
            onClick={purchaseLand}
            className="px-6 py-3 bg-black text-white rounded-xl hover:bg-white hover:text-black transition"
          >
            Purchase Land
          </button>
        </div>
      )}
    </div>
  );
}
