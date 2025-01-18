import Image from "next/image";
import Button from "../Button";
import { RxHamburgerMenu } from "react-icons/rx";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between xl:px-20 xl:py-3 bg-gray-100 bg-opacity-50 w-full fixed backdrop-blur-sm z-50 px-3 py-2">
      <div className="p-1.5 rounded-md border-orange-500 bg-orange-400 xl:hidden block hover:bg-orange-600">
        <RxHamburgerMenu className="text-xl text-white font-extrabold" />
      </div>
      <div className="flex items-center gap-3">
        <Image
          src="/images/logo-travely.png"
          alt="logo travely"
          layout="fixed"
          width={40}
          height={40}
          className="object-contain"
        />
        <h1 className="font-bold text-xl hover:text-orange-400 text-white hidden xl:block">
          Travely
        </h1>
      </div>
      <div className="xl:block hidden">
        <ul className="flex gap-8 font-semibold text-white">
          <li className="hover:text-orange-400">Home</li>
          <li className="hover:text-orange-400">Activity Tour</li>
          <li className="hover:text-orange-400">About Us</li>
          <li className="hover:text-orange-400">Contact Us</li>
        </ul>
      </div>
      <div className="xl:block hidden">
        <div className=" flex gap-0">
          <Button
            title="Login"
            text="hover:text-orange-400 text-white"
            p="px-7 py-1"
          />
          <Button
            title="Register"
            bg="bg-orange-400 hover:bg-orange-600 text-white"
            p="px-7 py-1"
          />
        </div>
      </div>
      <div className="xl:hidden block">
        <Button
          title="Register"
          bg="bg-orange-400 hover:bg-orange-600 text-white"
          p="px-4 py-0.5"
        />
      </div>
    </nav>
  );
};

export default Navbar;
