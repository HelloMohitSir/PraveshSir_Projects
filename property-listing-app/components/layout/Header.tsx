export default function Header() {
  return (
    <header className="bg-white shadow-sm px-6 py-4 flex justify-between">
      <h1 className="text-2xl font-bold text-blue-600">
        PropertyHub
      </h1>

      <button className="bg-blue-600 text-white px-4 py-2 rounded-xl">
        Login
      </button>
    </header>
  );
}