import Authorization from "@/Authorization";
import Navbar from "@/components/Navbar";
import { useUser } from "@/context/userContext";
import { deleteCookie } from "cookies-next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

const UserPage = () => {
  const { setUser } = useUser();
  const [activePage, setActivePage] = useState("Dashboard");
  const router = useRouter();
  const { user } = useUser();

  const handleLogout = () => {
    deleteCookie("JWT_TOKEN");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  };

  return (
    <Authorization>
      <Navbar />

      {/* Admin */}
      {user && user.role === "admin" && (
        <div className="grid grid-cols-[2fr_8fr]">
          {/* Side Bar */}
          <div className="flex flex-col gap-y-5 bg-slate-200 pt-28 pl-20 min-h-screen">
            {[
              "Dashboard",
              "My Profile",
              "Data Banner",
              "Data Promo",
              "Data Category",
              "Data Activity",
              "Data Transaksi",
              "Data User",
            ].map((list) => (
              <div
                key={list}
                className={`cursor-pointer hover:text-orange-400 hover:font-semibold ${
                  activePage === list ? "text-orange-400 font-bold" : ""
                }`}
                onClick={() => setActivePage(list)}
              >
                {list}
              </div>
            ))}
            <div onClick={handleLogout}>Logout</div>
          </div>
          {/* Main Content */}
          <div className="bg-slate-300 pt-28 min-h-screen px-20">
            {activePage === "Dashboard" && <div>Ini Dashboard</div>}
            {activePage === "My Profile" && <div>Ini My Profile</div>}
            {activePage === "Data Banner" && <div>Ini Banner</div>}
            {activePage === "Data Promo" && <div>Ini Promo</div>}
            {activePage === "Data Category" && <div>Ini Category</div>}
            {activePage === "Data Activity" && <div>Ini Activity</div>}
            {activePage === "Data Transaksi" && <div>Ini Transaksi</div>}
            {activePage === "Data User" && <div>Ini Data User</div>}
          </div>
        </div>
      )}

      {/* User */}
      {user && user.role === "user" && (
        <div className="grid grid-cols-[2fr_8fr]">
          {/* Side Bar */}
          <div className="flex flex-col gap-y-5 bg-slate-200 pt-28 pl-20 min-h-screen">
            {["Dashboard", "My Profile"].map((list) => (
              <div
                key={list}
                className={`cursor-pointer hover:text-orange-400 hover:font-semibold ${
                  activePage === list ? "text-orange-400 font-bold" : ""
                }`}
                onClick={() => setActivePage(list)}
              >
                {list}
              </div>
            ))}
            <div onClick={handleLogout}>Logout</div>
          </div>
          {/* Main Content */}
          <div className="bg-slate-300 pt-28 min-h-screen px-20">
            {activePage === "Dashboard" && (
              <div>
                {activePage === "Dashboard" && (
                  <div>
                    <h1>Ini Dashboard</h1>
                    <Link href="/user/transaksi">
                      <div>All Transaksi</div>
                    </Link>
                  </div>
                )}
              </div>
            )}
            {activePage === "My Profile" && <div>Ini My Profile</div>}
          </div>
        </div>
      )}
    </Authorization>
  );
};

export default UserPage;
