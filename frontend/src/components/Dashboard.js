import MyLand from "./MyLand";
import VarifyLand from "./VarifyLand";
import AllLands from "./GetAllLands";
import Card from "./card";

export default function Dashboard() {
  return (
    <>
      <div>
        <h4 className="text-lg text-gray-800 leading-relaxed">
          Welcome to LandChain — a decentralized land registry system designed
          to bring transparency, trust, and fairness to property ownership. Our
          mission is to empower users by providing a secure and tamper-proof
          platform for registering, verifying, and transferring land ownership.
          With blockchain at the core, we ensure your rights are protected,
          transactions are transparent, and records are permanent.
        </h4>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card title="Register Land" href="/register" />
        <Card title="Purchase Land" href="/transfer" />
        <Card title="Get Land Details" href="/onelanddetails" />
        <Card title="Ownership History" href="/history" />
        <Card title="Disputed Lands" href="/disputed" />
         <Card title="Verify Land" href="/varify" />
        <Card title="All Lands" href="/getalllands" />
        <Card title="My Lands" href="/mylands" />
      </div>
    </>
  );
}
