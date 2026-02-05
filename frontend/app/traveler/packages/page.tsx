import Link from "next/link";

const dummyPackages = [
  { id: 1, title: "Cox's Bazar Tour" },
  { id: 2, title: "Sundarbans Adventure" },
  { id: 3, title: "Bandarban Hiking" },
];

export default function PackagesPage() {
  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="max-w-2xl mx-auto card bg-base-100 shadow-xl">
        <div className="card-body">
          <h1 className="text-2xl font-bold text-primary">Travel Packages</h1>

          <div className="mt-4 space-y-3">
            {dummyPackages.map((p) => (
              <Link
                key={p.id}
                href={`/traveler/packages/${p.id}`}
                className="btn btn-outline w-full justify-start"
              >
                {p.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
