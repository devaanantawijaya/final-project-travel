import Button from "@/components/Button";
import Navbar from "@/components/Navbar";
import { useUser } from "@/context/userContext";
import { API_KEY, BASE_URL } from "@/helper/endpoint";
import axios from "axios";
import { setCookie } from "cookies-next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import Swal from "sweetalert2";

const RegisterPage = () => {
  const { setUser } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    passwordRepeat: "",
    role: "",
    phoneNumber: "",
  });

  const handleRegister = async () => {
    setLoading(true);
    try {
      if (!formData.name || !formData.role || !formData.phoneNumber) {
        const emptyFields = [];
        if (!formData.name) emptyFields.push("Nama");
        if (!formData.role) emptyFields.push("Role");
        if (!formData.phoneNumber) emptyFields.push("Phone Number");

        const message =
          emptyFields.length === 1
            ? `${emptyFields[0]} belum diisi.`
            : `${emptyFields.slice(0, -1).join(", ")} dan ${
                emptyFields[emptyFields.length - 1]
              } belum diisi.`;

        await Swal.fire({
          title: "Login Failed",
          html: message,
          icon: "error",
          confirmButtonText: "Try Again",
          customClass: {
            confirmButton:
              "bg-orange-500 hover:bg-orange-400 text-white font-bold py-2 px-4 rounded",
          },
        });

        return;
      }
      const resRegister = await axios.post(
        `${BASE_URL.API}/api/v1/register`,
        formData,
        {
          headers: {
            apiKey: API_KEY,
          },
        }
      );

      const resLogin = await axios.post(
        `${BASE_URL.API}/api/v1/login`,
        {
          email: formData.email,
          password: formData.password,
        },
        {
          headers: {
            apiKey: API_KEY,
          },
        }
      );

      console.log(resLogin.data.data);
      setCookie("JWT_TOKEN", resLogin.data.token);
      const userData = resLogin.data.data;
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      Swal.fire({
        title: "Register Success",
        text: resLogin.data.message,
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
        html: error.response.data.message
          ? error.response.data.message
          : error.response.data.errors
              .map((err) => `• ${err.message}`)
              .join("<br>"),
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

        <div className="flex justify-center items-center sm:px-0 px-5 absolute xl:top-20 xl:right-28 xl:inset-auto inset-0">
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
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            {/* Email */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Enter Email"
                className="border-2 w-full text-xl px-5 py-1 rounded-lg border-orange-400"
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            {/* Password 1 */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Enter Password"
                className="border-2 w-full text-xl px-5 py-1 rounded-lg border-orange-400"
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>

            {/* Password 2 */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Enter Password Again"
                className="border-2 w-full text-xl px-5 py-1 rounded-lg border-orange-400"
                onChange={(e) =>
                  setFormData({ ...formData, passwordRepeat: e.target.value })
                }
              />
            </div>

            {/* Phone */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Phone Number"
                className="border-2 w-full text-xl px-5 py-1 rounded-lg border-orange-400"
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
              />
            </div>

            {/* Role */}
            <div className="mb-4">
              <select
                className="border-2 w-full text-xl px-5 py-2 rounded-lg border-orange-400 bg-white focus:outline-none"
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
              >
                <option disabled selected>
                  Pilih Role
                </option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Button */}
            <div className="flex justify-center">
              <Button
                title={loading ? "Loading..." : "REGISTER"}
                bg="bg-orange-400 hover:bg-orange-600 w-full"
                text="text-white"
                p="py-1"
                onClick={handleRegister}
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
    </div>
  );
};
export default RegisterPage;
