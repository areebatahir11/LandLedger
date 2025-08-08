import Link from "next/link";
import ConnectWallet from "./ConnectWallet";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-6 py-4 rounded-2xl bg-white/30 backdrop-blur-md shadow-md">
  
      <h2 className="text-2xl font-bold text-gray-800" style={{textShadow: "2px 2px 6px #CFFFE2", fontFamily:"cursive"}}>LandLedger</h2>
      <div className="flex items-center space-x-4">
        <Link href="/">
          <button className="px-4 py-2 bg-white hover:bg-gray-800 text-gray-800 hover:text-white rounded-lg shadow-sm border border-white/30 transition">
            Dashboard
          </button>
        </Link>
        <ConnectWallet />

      </div>
    </nav>
  );
}
