import Link from "next/link";
import Button from "../Button";
import { RxHamburgerMenu } from "react-icons/rx";
import { useRouter } from "next/router";
import { deleteCookie, getCookie } from "cookies-next";
import { FaLuggageCart } from "react-icons/fa";
import { useUser } from "@/context/userContext";
import { useEffect, useState } from "react";

const Navbar = () => {
  const { user, setUser } = useUser();
  const router = useRouter();
  const token = getCookie("JWT_TOKEN");
  const [isClient, setIsClient] = useState(false);
  const [isOpenHamburger, setIsOpenHamburger] = useState(false);
  const [isOpenProfile, setIsOpenProfile] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  const toLoginPage = () => {
    router.push("/login");
  };

  const toRegisterPage = () => {
    router.push("/register");
  };

  const handleLogout = () => {
    deleteCookie("JWT_TOKEN");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  };

  return (
    <nav className="fixed backdrop-blur-sm z-50 w-full bg-gray-100 bg-opacity-50">
      <div className="flex items-center justify-between xl:px-20 xl:py-3 px-3 py-2">
        <button
          onClick={() => setIsOpenHamburger(!isOpenHamburger)}
          disabled={isOpenProfile && true}
          className="p-1.5 rounded-md border-orange-500 bg-orange-400 xl:hidden block hover:bg-orange-600"
        >
          <RxHamburgerMenu className="text-xl text-white font-extrabold" />
        </button>

        {/* To Home */}
        <Link href="/">
          <div className="flex items-center gap-3">
            <img
              src="/images/logo-travely.png"
              alt="logo travely"
              layout="fixed"
              className="object-contain"
            />
            <h1 className="font-bold text-xl hover:text-orange-400 text-black hidden xl:block">
              Travely
            </h1>
          </div>
        </Link>

        {/* List Desktop */}
        <div className="xl:block hidden">
          <ul className="flex gap-8 font-semibold text-black">
            <Link href="/">
              <li className="hover:text-orange-400">Home</li>
            </Link>

            <Link href="/activity">
              <li className="hover:text-orange-400">Activity Tour</li>
            </Link>
            <Link href="/about">
              <li className="hover:text-orange-400">About Us</li>
            </Link>
            <Link href="/contact">
              <li className="hover:text-orange-400">Contact Us</li>
            </Link>
          </ul>
        </div>

        {/* User Profile or Login & Register Desktop*/}
        <div className="xl:block hidden">
          {token ? (
            <div className="flex items-center gap-5">
              {user && user.role === "user" && (
                <Link href="/user/cart">
                  <FaLuggageCart className="text-3xl hover:text-orange-500" />
                </Link>
              )}

              {user && user.role === "admin" ? (
                <Link href="/user">
                  <div className="flex gap-x-3 items-center">
                    <img
                      src={
                        user.profilePictureUrl !== null
                          ? user.profilePictureUrl
                          : "/images/user.png"
                      }
                      alt="User Profile"
                      className="w-10 h-10 rounded-full"
                    />
                    <h1 className="font-semibold hover:text-orange-400">
                      {user?.name}
                    </h1>
                  </div>
                </Link>
              ) : (
                <button
                  className="flex gap-x-3 items-center"
                  onClick={() => setIsOpenProfile(!isOpenProfile)}
                >
                  <img
                    src={
                      user.profilePictureUrl !== null
                        ? user.profilePictureUrl
                        : "/images/user.png"
                    }
                    alt="User Profile"
                    className="w-10 h-10 rounded-full"
                  />
                  <h1 className="font-semibold hover:text-orange-400">
                    {user?.name}
                  </h1>
                </button>
              )}
            </div>
          ) : (
            <div className="flex gap-0">
              <Button
                title="Login"
                text="hover:text-orange-400 text-black"
                p="px-7 py-1"
                onClick={toLoginPage}
              />
              <Button
                title="Register"
                bg="bg-orange-400 hover:bg-orange-600 text-white"
                p="px-7 py-1"
                onClick={toRegisterPage}
              />
            </div>
          )}
        </div>

        {/* User Profile or Login & Register Mobile*/}
        <div className="xl:hidden block">
          {token ? (
            <div className="flex items-center gap-5">
              {user && user.role === "user" && (
                <Link href="/user/cart">
                  <FaLuggageCart className="text-3xl hover:text-orange-500" />
                </Link>
              )}

              {user && user.role === "admin" ? (
                <Link href="/user">
                  <div className="flex gap-x-3 items-center">
                    <img
                      src={
                        user.profilePictureUrl !== null
                          ? user.profilePictureUrl
                          : "/images/user.png"
                      }
                      alt="User Profile"
                      className="w-10 h-10 rounded-full"
                    />
                  </div>
                </Link>
              ) : (
                <button
                  className="flex gap-x-3 items-center"
                  onClick={() => setIsOpenProfile(!isOpenProfile)}
                  disabled={isOpenHamburger && true}
                >
                  <img
                    src={
                      user.profilePictureUrl !== null
                        ? user.profilePictureUrl
                        : "/images/user.png"
                    }
                    alt="User Profile"
                    className="w-10 h-10 rounded-full"
                  />
                </button>
              )}
            </div>
          ) : (
            <Button
              title="Register"
              bg="bg-orange-400 hover:bg-orange-600 text-white"
              p="px-4 py-0.5"
              onClick={toRegisterPage}
            />
          )}
        </div>
      </div>
      {/* List Mobile */}
      <div className={`${isOpenHamburger ? "block" : "hidden"} xl:hidden`}>
        <ul className="flex flex-col gap-y-2 font-semibold text-black px-3 pb-3">
          <Link href="/">
            <li className="hover:text-orange-400">Home</li>
          </Link>

          <Link href="/activity">
            <li className="hover:text-orange-400">Activity Tour</li>
          </Link>
          <Link href="/about">
            <li className="hover:text-orange-400">About Us</li>
          </Link>
          <Link href="/contact">
            <li className="hover:text-orange-400">Contact Us</li>
          </Link>
        </ul>
      </div>
      {/* List Profile*/}
      <div className={`${isOpenProfile ? "block" : "hidden"} xl:px-16`}>
        <ul className="flex flex-col gap-y-2 font-semibold text-black px-3 pb-3 text-end">
          <Link href="/user">
            <li className="hover:text-orange-400">Edit Profile</li>
          </Link>
          <Link href="/user/transaksi">
            <li className="hover:text-orange-400">My Transaction</li>
          </Link>
          <button className="text-end" onClick={handleLogout}>
            <li className="hover:text-orange-400">Logout</li>
          </button>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
