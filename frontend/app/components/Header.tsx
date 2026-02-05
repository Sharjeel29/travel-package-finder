import Image from "next/image";

export default function Header({ title }: { title: string }) {
  return (
    <header className="bg-gray-100 shadow-md p-6 flex items-center space-x-4">
      <Image src="/logo.jpg" alt="Logo" width={50} height={50} />
      <h1 className="text-2xl font-bold">{title}</h1>
    </header>
  );
}
