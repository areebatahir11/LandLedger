import Link from "next/link";

export default function Card({ title, href }) {
  return (
    <Link href={href}>
      <div className="cursor-pointer p-6 bg-white/30 backdrop-blur-lg border border-white/20 rounded-2xl shadow-md hover:scale-105 transition-all text-center">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      </div>
    </Link>
  );
}
