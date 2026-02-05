"use client";

import { useEffect, useState } from "react";
import api, { getTravelerIdFromToken } from "../../components/api";
import { useRouter } from "next/navigation";
import Title from "../../components/Title";

type Profile = {
  gender: string;
  dob: string;
  bio: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const [travelerId, setTravelerId] = useState<number | null>(null);

  const [profile, setProfile] = useState<Profile>({
    gender: "",
    dob: "",
    bio: "",
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  
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

 
  useEffect(() => {
    if (!travelerId) return;

    const fetchProfile = async () => {
      try {
        const res = await api.get(`/traveler/${travelerId}/profile`);
        
        setProfile({
          gender: res.data?.gender ?? "",
          dob: res.data?.dob ?? "",
          bio: res.data?.bio ?? "",
        });
      } catch (err: any) {
        if (err.response?.status === 404) {
          setProfile({ gender: "", dob: "", bio: "" });
        } else {
          setError(err.response?.data?.message || "Failed to load profile");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [travelerId]);


  const updateProfile = async () => {
    if (!travelerId) return;

    setMessage("");
    setError("");

    try {
      await api.put(`/traveler/${travelerId}/profile`, profile);
      setMessage(" Profile updated successfully!");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update profile");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/traveler/login");
  };

  if (!travelerId || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-lg"></span>
        <span className="ml-3 text-lg">Loading profile...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <Title page="Profile" />

      <div className="flex justify-end gap-3 mb-6">
        <button
          className="btn btn-primary"
          onClick={() => router.push("/traveler/dashboard")}
        >
          Dashboard
        </button>

        <button className="btn btn-error" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="max-w-lg mx-auto card bg-base-100 shadow-md">
        <div className="card-body">
          <h2 className="text-2xl font-bold text-center mb-4">
            Update Profile
          </h2>

          <div className="form-control mb-3">
            <label className="label">
              <span className="label-text">Gender</span>
            </label>
            <input
              type="text"
              placeholder="Male/Female"
              className="input input-bordered w-full"
              value={profile.gender}
              onChange={(e) =>
                setProfile({ ...profile, gender: e.target.value })
              }
            />
          </div>

          <div className="form-control mb-3">
            <label className="label">
              <span className="label-text">Date of Birth</span>
            </label>
            <input
              type="date"
              className="input input-bordered w-full"
              value={profile.dob}
              onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
            />
          </div>

          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Bio</span>
            </label>
            <textarea
              placeholder="Write something about yourself..."
              className="textarea textarea-bordered w-full"
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            ></textarea>
          </div>

          {error && <p className="text-red-600 mb-2">{error}</p>}
          {message && <p className="text-green-600 mb-2">{message}</p>}

          <button className="btn btn-success w-full" onClick={updateProfile}>
            Update Profile
          </button>
        </div>
      </div>
    </div>
  );
}
