import Button from "@/components/Button";
import Navbar from "@/components/Navbar";
import { API_KEY, BASE_URL } from "@/helper/endpoint";
import axios from "axios";
import { setCookie } from "cookies-next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

const LoginPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${BASE_URL.API}/api/v1/login`, formData, {
        headers: {
          apiKey: API_KEY,
        },
      });
      setCookie("JWT_TOKEN", res.data.token);
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex justify-center items-center sm:pt-48 pt-40 sm:px-0 px-5">
        <div className="bg-slate-100 sm:p-10 p-8 w-96 rounded-2xl shadow-2xl">
          <div className="text-center mb-5">
            <h1 className="text-4xl font-bold text-orange-400">WELCOME</h1>
            <p>Login with Email</p>
          </div>

          {/* Email */}
          <div className="mb-5">
            <input
              type="text"
              placeholder="Enter Email"
              className="border-2 w-full text-xl p-2 rounded-lg border-orange-400"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          {/* Password */}
          <div className="mb-5">
            <input
              type="text"
              placeholder="Enter Password"
              className="border-2 w-full text-xl p-2 rounded-lg border-orange-400"
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>

          {/* Button */}
          <div className="flex justify-center">
            <Button
              title="LOGIN"
              bg="bg-orange-400 hover:bg-orange-600 w-full"
              text="text-white"
              p="py-1"
              onClick={handleLogin}
            />
          </div>

          {/* Switch to RegisterPage */}
          <div className="text-center pt-3">
            {`Dont't have account?`}{" "}
            <span className="text-orange-400 hover:text-orange-600 hover:font-semibold">
              <Link href="/register">Register Now</Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
