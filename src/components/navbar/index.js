import Image from "next/image";
import Button from "../Button";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-20 py-3 bg-gray-100 bg-opacity-50 w-full fixed backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <Image
          src="/images/logo-travely.png"
          alt="logo travely"
          width={40}
          height={40}
        />
        <h1 className="font-bold text-xl">Travely</h1>
      </div>
      <div>
        <ul className="flex gap-8 font-semibold">
          <li>Home</li>
          <li>Activity Tour</li>
          <li>About Us</li>
          <li>Contact Us</li>
        </ul>
      </div>
      <div className=" flex gap-0">
        <Button title="Login" bg="text-black" />
        <Button title="Register" bg="bg-orange-400 text-white" />
      </div>
    </nav>
  );
};

export default Navbar;
