"use client";

import { useEffect, useState } from "react";
import api, { getTravelerIdFromToken } from "../../components/api";
import { useRouter } from "next/navigation";
import Title from "../../components/Title";
import { pusher } from "../../lib/pusher";
import toast from "react-hot-toast";

type Booking = {
  id: number;
  packageId: number;
  travelDate: string;
  seats: number;
};

type Profile = {
  gender?: string;
  dob?: string;
  bio?: string;
};

export default function DashboardPage() {
  const router = useRouter();

  const [travelerId, setTravelerId] = useState<number | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);

  const [loadingBookings, setLoadingBookings] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const [errorBookings, setErrorBookings] = useState("");
  const [errorProfile, setErrorProfile] = useState("");

  /* ---------------- AUTH CHECK ---------------- */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/traveler/login");
      return;
    }

    const id = getTravelerIdFromToken();
    if (!id) {
      localStorage.removeItem("token");
      router.push("/traveler/login");
      return;
    }

    setTravelerId(id);
  }, [router]);

  /* ---------------- FETCH PROFILE ---------------- */
  useEffect(() => {
    if (!travelerId) return;

    const fetchProfile = async () => {
      try {
        const res = await api.get(`/traveler/${travelerId}/profile`);
        setProfile(res.data);
      } catch (err: any) {
        setErrorProfile(err.response?.data?.message || "Profile not found yet");
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [travelerId]);

  /* ---------------- FETCH BOOKINGS ---------------- */
  useEffect(() => {
    if (!travelerId) return;

    const fetchBookings = async () => {
      try {
        const res = await api.get(`/traveler/${travelerId}/bookings`);
        setBookings(res.data);
      } catch (err: any) {
        setErrorBookings(
          err.response?.data?.message || "Failed to fetch bookings"
        );
      } finally {
        setLoadingBookings(false);
      }
    };

    fetchBookings();
  }, [travelerId]);

  /* ---------------- PUSHER REAL-TIME ---------------- */
  useEffect(() => {
    if (!travelerId) return;

    const channel = pusher.subscribe("notifications");

    channel.bind("booking-created", (data: any) => {
      toast.success(data.message);

      // Refresh bookings live
      api
        .get(`/traveler/${travelerId}/bookings`)
        .then((res) => setBookings(res.data))
        .catch(() => {});
    });

    channel.bind("profile-updated", (data: any) => {
      toast.success(data.message);

      // Refresh profile live
      api
        .get(`/traveler/${travelerId}/profile`)
        .then((res) => setProfile(res.data))
        .catch(() => {});
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [travelerId]);

  /* ---------------- LOGOUT ---------------- */
  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/traveler/login");
  };

  /* ---------------- LOADING STATE ---------------- */
  if (!travelerId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-lg"></span>
        <p className="ml-3 text-lg">Checking login...</p>
      </div>
    );
  }

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-primary">
                  Traveler Dashboard
                </h1>
              </div>

              <div className="flex flex-wrap gap-3 justify-end">
                <button
                  className="btn btn-info text-white"
                  onClick={() => router.push("/traveler/profile")}
                >
                  Profile
                </button>

                <button
                  className="btn btn-secondary"
                  onClick={() => router.push("/traveler/bookings")}
                >
                  Bookings
                </button>

                <button className="btn btn-error" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* PROFILE SUMMARY */}
        <div className="card bg-base-100 shadow-xl mb-8 border border-base-300">
          <div className="card-body">
            <h2 className="text-xl font-bold text-primary mb-2">
              Profile Summary
            </h2>

            {loadingProfile ? (
              <div className="flex items-center gap-2">
                <span className="loading loading-spinner loading-sm"></span>
                <p>Loading profile...</p>
              </div>
            ) : profile ? (
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="p-3 rounded bg-base-200">
                  <p className="font-semibold">Gender</p>
                  <p>{profile.gender || "Not set"}</p>
                </div>

                <div className="p-3 rounded bg-base-200">
                  <p className="font-semibold">DOB</p>
                  <p>{profile.dob || "Not set"}</p>
                </div>

                <div className="p-3 rounded bg-base-200">
                  <p className="font-semibold">Bio</p>
                  <p>{profile.bio || "Not set"}</p>
                </div>
              </div>
            ) : (
              <p className="text-warning font-semibold">
                {errorProfile || "No profile found."}
              </p>
            )}
          </div>
        </div>

        {/* BOOKINGS */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white drop-shadow-md">
            Your Bookings
          </h2>

          <span className="badge badge-accent text-white">
            Total: {bookings.length}
          </span>
        </div>

        {loadingBookings ? (
          <div className="flex justify-center mt-10">
            <span className="loading loading-spinner loading-lg"></span>
            <span className="ml-2 text-white font-semibold">
              Loading bookings...
            </span>
          </div>
        ) : errorBookings ? (
          <p className="text-red-200 font-semibold">{errorBookings}</p>
        ) : bookings.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {bookings.map((b) => (
              <div
                key={b.id}
                className="card bg-gradient-to-br from-slate-800 via-gray-800 to-zinc-800 
                           text-white shadow-lg border border-gray-700 
                           hover:scale-[1.02] hover:shadow-2xl transition duration-300"
              >
                <div className="card-body">
                  <h3 className="card-title text-accent font-bold">
                    Booking #{b.id}
                  </h3>

                  <p>
                    <strong>Package ID:</strong> {b.packageId}
                  </p>
                  <p>
                    <strong>Travel Date:</strong> {b.travelDate}
                  </p>
                  <p>
                    <strong>Seats:</strong> {b.seats}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card bg-base-100 shadow-md">
            <div className="card-body text-center">
              <p className="text-gray-500">No bookings found.</p>
              <button
                className="btn btn-primary mt-3"
                onClick={() => router.push("/traveler/bookings")}
              >
                Create Booking
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
