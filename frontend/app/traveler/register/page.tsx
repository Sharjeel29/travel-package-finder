"use client";

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterTraveler() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/traveler/create`,
        form
      );
      setSuccess("Registration successful!");
      setForm({ name: "", email: "", password: "" });

      setTimeout(() => router.push("/traveler/login"), 1000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error registering user");
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
      <div className="flex-1 flex items-center justify-center">
        <div className="card w-full max-w-md bg-base-100 shadow-md mt-10">
          <div className="card-body">
            <h1 className="text-2xl font-semibold text-center">Register</h1>

            <form onSubmit={handleSubmit} className="space-y-5 mt-5">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Name</span>
                </label>
                <input
                  type="text"
                  placeholder="Your name"
                  className="input input-bordered w-full"
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  placeholder="example@email.com"
                  className="input input-bordered w-full"
                  required
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type="password"
                  placeholder="Minimum 6 characters"
                  className="input input-bordered w-full"
                  required
                  minLength={6}
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />
              </div>

              {error && <p className="text-red-600 text-sm">{error}</p>}
              {success && <p className="text-green-600 text-sm">{success}</p>}

              <button type="submit" className="btn btn-primary w-full">
                Register
              </button>
            </form>

            <p className="text-center text-sm mt-4">
              Already have an account?{" "}
              <Link
                href="/traveler/login"
                className="text-primary font-medium hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
