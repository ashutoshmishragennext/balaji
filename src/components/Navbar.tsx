import Image from 'next/image';

export default function Navbar() {
  return (
    <nav className="flex items-center bg-white shadow px-6 py-4">
      <Image src="/images/logo.png" alt="Logo" width={40} height={40} />
      <span className="ml-3 text-xl font-bold text-gray-800">Sachin&aposs Dashboard</span>
    </nav>
  );
}
