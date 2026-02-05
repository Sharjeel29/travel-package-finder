"use client";

import { useParams } from "next/navigation";
import Link from "next/link";

const dummyPackages = [
  { id: 1, title: "Cox's Bazar Tour", price: 12000 },
  { id: 2, title: "Sundarbans Adventure", price: 15000 },
  { id: 4, title: "Bandarban Hiking", price: 10000 },
];

export default function PackageDetailsPage() {
  const params = useParams();
  const id = Number(params.id);

  const pkg = dummyPackages.find((p) => p.id === id);

  if (!pkg) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-base-200">
        <h1 className="text-3xl font-bold text-error">Package Not Found</h1>
        <p className="text-gray-600">This package ID does not exist.</p>

        <Link href="/traveler/packages" className="btn btn-primary mt-4">
          Back to Packages
        </Link>

        <p className="mt-6 text-sm opacity-70">
          Debug: params.id = {String(params.id)}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 flex justify-center items-center p-6">
      <div className="card bg-base-100 shadow-xl w-full max-w-md">
        <div className="card-body">
          <h1 className="card-title text-2xl text-primary">{pkg.title}</h1>
          <p className="text-lg">
            <strong>Price:</strong> {pkg.price} BDT
          </p>

          <Link href="/traveler/packages" className="btn btn-secondary mt-4">
            Back to Packages
          </Link>

          
        </div>
      </div>
    </div>
  );
}
