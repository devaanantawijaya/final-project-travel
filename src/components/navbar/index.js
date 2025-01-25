import Link from "next/link";
import Button from "../Button";
import { RxHamburgerMenu } from "react-icons/rx";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { deleteCookie, getCookie } from "cookies-next";

const Navbar = () => {
  const [token, setToken] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = getCookie("JWT_TOKEN");
    setToken(token);
  }, []);

  const toLoginPage = () => {
    router.push("/login");
  };

  const toRegisterPage = () => {
    router.push("/register");
  };

  const handleLogout = () => {
    deleteCookie("JWT_TOKEN");
    setToken(null);
    router.push("/login");
  };

  return (
    <nav className="flex items-center justify-between xl:px-20 xl:py-3 bg-gray-100 bg-opacity-50 w-full fixed backdrop-blur-sm z-50 px-3 py-2">
      <div className="p-1.5 rounded-md border-orange-500 bg-orange-400 xl:hidden block hover:bg-orange-600">
        <RxHamburgerMenu className="text-xl text-white font-extrabold" />
      </div>

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
      <div className="xl:block hidden">
        {token ? (
          <Button
            title="Logout"
            bg="bg-orange-400 hover:bg-orange-600 text-white"
            p="px-7 py-1"
            onClick={handleLogout}
          />
        ) : (
          <div className=" flex gap-0">
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
      <div className="xl:hidden block">
        <Button
          title="Register"
          bg="bg-orange-400 hover:bg-orange-600 text-white"
          p="px-4 py-0.5"
          onClick={toRegisterPage}
        />
      </div>
    </nav>
  );
};

export default Navbar;
