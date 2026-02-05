"use client";

import Link from "next/link";

export default function MyNav() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/traveler/login";
  };

  return (
    <nav style={{ padding: "10px", background: "#eee", marginBottom: "20px" }}>
     <Link href="/traveler/dashboard" style={{ marginRight: "10px" }}>Dashboard</Link>
      <Link href="/traveler/bookings" style={{ marginRight: "10px" }}>Bookings</Link>
      <button onClick={handleLogout}>Logout</button>
    </nav>
  );
}
