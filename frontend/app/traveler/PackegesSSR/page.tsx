import axios from "axios";
import Link from "next/link";

type Package = {
  id: number;
  title: string;
  price?: number;
};

export default async function PackagesPage() {
  let packages: Package[] = [];

  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/tour-provider/packages`
    );
    packages = res.data;
  } catch (err) {
    packages = [];
  }

  return (
    <div className="min-h-screen bg-base-200 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-primary">
          Travel Packages (SSR)
        </h1>

        {packages.length === 0 ? (
          <div className="alert alert-error">
            <span>Failed to load packages from backend.</span>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {packages.map((p) => (
              <div key={p.id} className="card bg-base-100 shadow-md">
                <div className="card-body">
                  <h2 className="card-title">{p.title}</h2>

                  {p.price !== undefined && (
                    <p className="text-sm text-gray-500">
                      Price: {p.price} Tk
                    </p>
                  )}

                  <Link
                    href={`/traveler/packages/${p.id}`}
                    className="btn btn-primary btn-sm mt-3"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
