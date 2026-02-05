// "use client";

// import MyNav from "../components/MyNav";

// export default function TravelerLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <>
//       <MyNav />
//       <main>{children}</main>
//     </>
//   );
// }

"use client";
import MyNav from "../components/MyNav";
import { usePathname } from "next/navigation";

export default function TravelerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const hideNav = pathname === "/traveler/login" || pathname === "/traveler/register"|| pathname === "/traveler/dashboard"|| pathname === "/traveler/bookings"|| pathname === "/traveler/profile"||pathname === "/traveler/packages"||pathname === "/traveler/packages/[id]";

  return (
    <div>
      {!hideNav && <MyNav />}
      <main>{children}</main>
    </div>
  );
}
