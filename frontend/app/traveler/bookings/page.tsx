"use client";

import { useEffect, useState } from "react";
import api, { getTravelerIdFromToken } from "../../components/api";
import { useRouter } from "next/navigation";
import Title from "../../components/Title";

type Booking = {
  id: number;
  packageId: number;
  travelDate: string;
  seats: number;
};

export default function BookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [tokenLoaded, setTokenLoaded] = useState(false);
  const [error, setError] = useState("");

  const [packageId, setPackageId] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [seats, setSeats] = useState("");

  const [travelerId, setTravelerId] = useState<number | null>(null);

  // check login token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/traveler/login");
    } else {
      const id = getTravelerIdFromToken();
      if (!id) {
        router.push("/traveler/login");
      } else {
        setTravelerId(id);
        setTokenLoaded(true);
      }
    }
  }, [router]);

  useEffect(() => {
    if (!tokenLoaded || !travelerId) return;

    const fetchBookings = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/traveler/${travelerId}/bookings`);
        setBookings(res.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [tokenLoaded, travelerId]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!travelerId) return;

    setError("");

    try {
      await api.post(`/traveler/${travelerId}/bookings`, {
        packageId: parseInt(packageId),
        travelDate,
        seats: parseInt(seats),
      });

      setPackageId("");
      setTravelDate("");
      setSeats("");

      const res = await api.get(`/traveler/${travelerId}/bookings`);
      setBookings(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create booking");
    }
  };

  const handleDelete = async (id: number) => {
    if (!travelerId) return;

    try {
      await api.delete(`/traveler/${travelerId}/bookings/${id}`);
      setBookings(bookings.filter((b) => b.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete booking");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/traveler/login");
  };

  if (!tokenLoaded)
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <p className="text-lg font-semibold">Checking login...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <Title page="Bookings" />

    
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        
          <div className="flex items-center gap-3">
            <span className="badge badge-secondary text-white">
              Total: {bookings.length}
            </span>
          </div>

         
          <div className="flex justify-end gap-3">
            <button
              className="btn btn-primary"
              onClick={() => router.push("/traveler/dashboard")}
            >
              Dashboard
            </button>

           
            <button
              className="btn btn-info text-white"
              onClick={() => router.push("/traveler/profile")}
            >
              Profile
            </button>

            <button className="btn btn-error" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        
        <div className="flex justify-center">
          <form
            onSubmit={handleCreate}
            className="card bg-base-100 shadow-lg p-6 mb-8 w-full max-w-md border border-base-300"
          >
            <h2 className="text-xl font-semibold mb-4 text-center text-primary">
              Add New Booking
            </h2>

            <div className="form-control mb-3">
              <label className="label">
                <span className="label-text font-semibold">Package ID</span>
              </label>
              <input
                value={packageId}
                onChange={(e) => setPackageId(e.target.value)}
                required
                type="number"
                placeholder="Package ID"
                className="input input-bordered w-full"
              />
            </div>

            <div className="form-control mb-3">
              <label className="label">
                <span className="label-text font-semibold">Travel Date</span>
              </label>
              <input
                type="date"
                value={travelDate}
                onChange={(e) => setTravelDate(e.target.value)}
                required
                className="input input-bordered w-full"
              />
            </div>

            <div className="form-control mb-3">
              <label className="label">
                <span className="label-text font-semibold">Seats</span>
              </label>
              <input
                type="number"
                value={seats}
                onChange={(e) => setSeats(e.target.value)}
                required
                className="input input-bordered w-full"
              />
            </div>

            <button type="submit" className="btn btn-success w-full mt-2">
              Add Booking
            </button>
          </form>
        </div>

       
        {loading ? (
          <div className="flex justify-center mt-10">
            <span className="loading loading-spinner loading-lg"></span>
            <span className="ml-2 font-semibold">Loading bookings...</span>
          </div>
        ) : error ? (
          <p className="text-red-600 font-semibold">{error}</p>
        ) : bookings.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {bookings.map((b) => (
              <div
                key={b.id}
                className="card bg-base-100 shadow-md border border-base-300 hover:shadow-xl transition"
              >
                <div className="card-body">
                  <h2 className="card-title text-accent font-bold">
                    Booking #{b.id}
                  </h2>

                  <p>
                    <strong>Package ID:</strong> {b.packageId}
                  </p>
                  <p>
                    <strong>Travel Date:</strong> {b.travelDate}
                  </p>
                  <p>
                    <strong>Seats:</strong> {b.seats}
                  </p>

                  <button
                    className="btn btn-error btn-sm mt-3"
                    onClick={() => handleDelete(b.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-6 text-center text-gray-500 font-semibold">
            No bookings found.
          </p>
        )}
      </div>
    </div>
  );
}
