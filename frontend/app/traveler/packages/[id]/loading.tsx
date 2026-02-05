export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <span className="loading loading-spinner loading-lg"></span>
      <p className="ml-3 text-lg">Loading package details...</p>
    </div>
  );
}
