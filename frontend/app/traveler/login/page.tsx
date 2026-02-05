"use client";

import { useState } from "react";
import api from "../../components/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/traveler/login", { email, password });

      if (res.data?.access_token) {
        localStorage.setItem("token", res.data.access_token);
        router.push("/traveler/dashboard");
      } else {
        setError("Login failed: Invalid response from server");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
      <div className="flex-1 flex items-center justify-center">
        <div className="card w-full max-w-md bg-base-100 shadow-md mt-10">
          <div className="card-body">
            <h1 className="text-2xl font-semibold text-center">Login</h1>

            <form onSubmit={handleSubmit} className="space-y-5 mt-5">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  placeholder="example@email.com"
                  className="input input-bordered w-full"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {error && <p className="text-red-600 text-sm">{error}</p>}

              <button type="submit" className="btn btn-primary w-full">
                Login
              </button>
            </form>

            <p className="text-center text-sm mt-4">
              Don’t have an account?{" "}
              <Link
                href="/traveler/register"
                className="text-primary font-medium hover:underline"
              >
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
