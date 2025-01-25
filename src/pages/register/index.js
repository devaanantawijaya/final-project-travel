import Button from "@/components/Button";
import Navbar from "@/components/Navbar";
import Link from "next/link";

const RegisterPage = () => {
  return (
    <div>
      <Navbar />
      <div className="flex justify-center items-center sm:pt-28 pt-20 sm:px-0 px-5">
        <div className="bg-slate-100 sm:p-10 p-8 w-96 rounded-2xl shadow-2xl">
          <div className="text-center mb-5">
            <h1 className="text-4xl font-bold text-orange-400">REGISTER</h1>
            <p>creating an account</p>
          </div>

          {/* Full Name */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Full Name"
              className="border-2 w-full text-xl px-5 py-1 rounded-lg border-orange-400"
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Enter Email"
              className="border-2 w-full text-xl px-5 py-1 rounded-lg border-orange-400"
            />
          </div>

          {/* Password 1 */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Enter Password"
              className="border-2 w-full text-xl px-5 py-1 rounded-lg border-orange-400"
            />
          </div>

          {/* Password 2 */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Enter Password Again"
              className="border-2 w-full text-xl px-5 py-1 rounded-lg border-orange-400"
            />
          </div>

          {/* Phone */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Phone Number"
              className="border-2 w-full text-xl px-5 py-1 rounded-lg border-orange-400"
            />
          </div>

          {/* Role */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Role"
              className="border-2 w-full text-xl px-5 py-1 rounded-lg border-orange-400"
            />
          </div>

          {/* Button */}
          <div className="flex justify-center">
            <Button
              title="LOGIN"
              bg="bg-orange-400 hover:bg-orange-600 w-full"
              text="text-white"
              p="py-1"
            />
          </div>

          {/* Switch to LoginPage */}
          <div className="text-center pt-3">
            {`Already have an account?`}{" "}
            <span className="text-orange-400 hover:text-orange-600 hover:font-semibold">
              <Link href="/login">Login Now</Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default RegisterPage;
