"use client";

import { useState } from "react";
import api from "../components/api";
import Title from "../components/Title";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await api.post("/traveler/create", { name, email, password });
      setSuccess("Registration successful!");
      setName(""); setEmail(""); setPassword("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Error registering user");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <Title page="Register" />
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
