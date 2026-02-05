import axios from "axios";
import Link from "next/link";
import { notFound } from "next/navigation";


type Package = {
  id: number;
  title: string;
  description?: string;
  price?: number;
};

export default async function PackageDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const id = params.id;

  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/tour-provider/packages/${id}`
    );

    const pkg: Package = res.data;

    if (!pkg) return notFound();

    return (
      <div className="min-h-screen bg-base-200 p-8">
        <div className="max-w-2xl mx-auto card bg-base-100 shadow-xl">
          <div className="card-body">
            <h1 className="text-3xl font-bold text-primary">{pkg.title}</h1>

            {pkg.description && (
              <p className="mt-3 text-gray-700">{pkg.description}</p>
            )}

            {pkg.price !== undefined && (
              <p className="mt-4 font-semibold">
                Price: <span className="text-secondary">{pkg.price} Tk</span>
              </p>
            )}

            <div className="mt-6 flex gap-2">
              <Link href="/traveler/packages" className="btn btn-outline">
                Back
              </Link>

              <Link href="/traveler/dashboard" className="btn btn-primary">
                Go Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  } catch {
    return notFound(); 
  }
}
