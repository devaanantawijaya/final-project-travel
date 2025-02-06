import Button from "@/components/Button";
import Navbar from "@/components/Navbar";
import { useUser } from "@/context/userContext";
import { API_KEY, BASE_URL } from "@/helper/endpoint";
import axios from "axios";
import { setCookie } from "cookies-next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const LoginPage = () => {
  const { setUser } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL.API}/api/v1/login`, formData, {
        headers: {
          apiKey: API_KEY,
        },
      });
      setCookie("JWT_TOKEN", res.data.token);
      const userData = res.data.data;
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      Swal.fire({
        title: "Login Success",
        text: res.data.message,
        icon: "success",
        confirmButtonText: "OK",
        timer: 1100,
        customClass: {
          confirmButton:
            "bg-orange-500 hover:bg-orange-400 text-white font-bold py-2 px-4 rounded",
        },
      }).then(() => {
        if (userData.role === "admin") {
          router.push("/user");
        }
        router.push("/");
      });
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Login Failed",
        text: error.response.data.message,
        icon: "error",
        confirmButtonText: "Try Again",
        timer: 2000,
        customClass: {
          confirmButton:
            "bg-orange-500 hover:bg-orange-400 text-white font-bold py-2 px-4 rounded",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="relative">
        <div className="w-full xl:aspect-[16/8] overflow-hidden sm:aspect-square aspect-[9/16]">
          <img
            src="/images/liburan.jpg"
            alt="bg-liburan"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex justify-center items-center sm:px-0 px-5 absolute xl:top-1/4 xl:right-28 xl:inset-auto inset-0">
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
                title={loading ? "Loading..." : "LOGIN"}
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
    </div>
  );
};
export default LoginPage;
