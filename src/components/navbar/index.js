import Image from "next/image";
import Button from "../Button";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-20 py-3 bg-gray-100 bg-opacity-50 w-full fixed backdrop-blur-sm z-50">
      <div className="flex items-center gap-3">
        <Image
          src="/images/logo-travely.png"
          alt="logo travely"
          width={40}
          height={40}
        />
        <h1 className="font-bold text-xl hover:text-orange-700">Travely</h1>
      </div>
      <div>
        <ul className="flex gap-8 font-semibold">
          <li className="hover:text-orange-700">Home</li>
          <li className="hover:text-orange-700">Activity Tour</li>
          <li className="hover:text-orange-700">About Us</li>
          <li className="hover:text-orange-700">Contact Us</li>
        </ul>
      </div>
      <div className=" flex gap-0">
        <Button title="Login" bg="text-black hover:text-orange-700" />
        <Button title="Register" bg="bg-orange-400 hover:bg-orange-600 text-white" />
      </div>
    </nav>
  );
};

export default Navbar;
