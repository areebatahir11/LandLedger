import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: "url('/background_image/advanced.jpg')",
        fontFamily: "monospace",
      }}
    >
      <div className="bg-white/5 backdrop-blur-md min-h-screen p-4">
        <Navbar />
        <main className="mt-6">{children}</main>
      </div>
    </div>
  );
}
