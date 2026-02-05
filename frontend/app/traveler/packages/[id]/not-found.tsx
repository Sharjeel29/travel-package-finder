import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-6">
      <div className="card bg-base-100 shadow-xl max-w-md w-full">
        <div className="card-body text-center">
          <h2 className="text-2xl font-bold text-error">Package Not Found</h2>
          <p className="text-gray-500 mt-2">
            This package ID does not exist.
          </p>

          <div className="mt-6">
            <Link href="/traveler/packages" className="btn btn-primary">
              Back to Packages
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
