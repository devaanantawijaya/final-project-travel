import Link from "next/link";
import Button from "../Button";
import { RxHamburgerMenu } from "react-icons/rx";
import { useRouter } from "next/router";
import { deleteCookie, getCookie } from "cookies-next";
import { FaLuggageCart } from "react-icons/fa";
import { useUser } from "@/context/userContext";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { API_KEY, BASE_URL } from "@/helper/endpoint";

const Navbar = () => {
  const { user, setUser } = useUser();
  const router = useRouter();
  const token = getCookie("JWT_TOKEN");
  const [isClient, setIsClient] = useState(false);
  const [isOpenHamburger, setIsOpenHamburger] = useState(false);
  const [isOpenProfile, setIsOpenProfile] = useState(false);
  const [isOpenMyProfile, setIsOpenMyProfile] = useState(false);

  const [fotoProfile, setFotoProfile] = useState(null);
  const [imageProfile, setImageProfile] = useState(user?.profilePictureUrl);

  const [name, setName] = useState(user?.name);
  const [email, setEmail] = useState(user?.email);
  const [phone, setPhone] = useState(user?.phoneNumber);

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
    Swal.fire({
      title: "Konfirmasi Logout",
      text: "Apakah kamu yakin ingin keluar?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Keluar",
      cancelButtonText: "Batal",
      reverseButtons: true,
      confirmButtonColor: "#f97316", // Warna orange (Tailwind: bg-orange-400)
      cancelButtonColor: "#6b7280", // Warna abu-abu (Tailwind: bg-gray-500)
    }).then((result) => {
      if (result.isConfirmed) {
        deleteCookie("JWT_TOKEN");
        localStorage.removeItem("user");
        setUser(null);

        Swal.fire({
          title: "Berhasil Logout!",
          text: "Anda akan diarahkan ke halaman login.",
          icon: "success",
          timer: 1500, // 1,5 detik
          showConfirmButton: false,
        });

        setTimeout(() => {
          router.push("/login");
        }, 1500);
      }
    });
  };

  const handleUpdateProfile = async () => {
    let imageUrl = user?.profilePictureUrl;

    if (fotoProfile) {
      console.log("Uploading new image...");

      const formData = new FormData();
      formData.append("image", fotoProfile);

      const resUpload = await axios.post(
        `${BASE_URL.API}/api/v1/upload-image`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            apiKey: API_KEY,
          },
        }
      );

      console.log("Upload Success:", resUpload.data);
      imageUrl = resUpload.data.url;
    }

    const payload = {
      name: name,
      email: email,
      phoneNumber: phone,
      profilePictureUrl: imageUrl,
    };

    try {
      const res = await axios.post(
        `${BASE_URL.API}/api/v1/update-profile`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            apiKey: API_KEY,
          },
        }
      );

      const updatedUser = {
        ...user,
        name: name,
        email: email,
        phoneNumber: phone,
        profilePictureUrl: imageProfile,
      };

      setUser(updatedUser);

      Swal.fire({
        icon: "success",
        title: res.data.message,
        text: "Your profile has been successfully updated.",
        timer: 1100,
        showConfirmButton: false,
      }).then(() => {
        setIsOpenMyProfile(false);
      });
    } catch (error) {
      console.log("error profile", error);
    }
  };

  const handleMyProfile = () => {
    setIsOpenMyProfile(!isOpenMyProfile);
  };

  return (
    <div className="relative">
      <nav className="fixed backdrop-blur-sm z-40 w-full bg-gray-100 bg-opacity-50">
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
                  <button
                    className="flex gap-x-3 items-center"
                    onClick={() => setIsOpenProfile(!isOpenProfile)}
                  >
                    <div className="flex gap-x-3 items-center">
                      <img
                        src={
                          user.profilePictureUrl &&
                          user.profilePictureUrl !== ""
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
                  </button>
                ) : (
                  <button
                    className="flex gap-x-3 items-center"
                    onClick={() => setIsOpenProfile(!isOpenProfile)}
                  >
                    <img
                      src={
                        user.profilePictureUrl && user.profilePictureUrl !== ""
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
                  <button
                    className="flex gap-x-3 items-center"
                    onClick={() => setIsOpenProfile(!isOpenProfile)}
                  >
                    <div className="flex gap-x-3 items-center">
                      <img
                        src={
                          user.profilePictureUrl &&
                          user.profilePictureUrl !== ""
                            ? user.profilePictureUrl
                            : "/images/user.png"
                        }
                        alt="User Profile"
                        className="w-10 h-10 rounded-full"
                      />
                    </div>
                  </button>
                ) : (
                  <button
                    className="flex gap-x-3 items-center"
                    onClick={() => setIsOpenProfile(!isOpenProfile)}
                    disabled={isOpenHamburger && true}
                  >
                    <img
                      src={
                        user.profilePictureUrl && user.profilePictureUrl !== ""
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
        {/* List Navbar Mobile */}
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
            <button className="text-end" onClick={handleMyProfile}>
              <li className="hover:text-orange-400">My Profile</li>
            </button>
            {user && user.role === "admin" ? (
              <Link href="/user">
                <li className="hover:text-orange-400">My Dashboard</li>
              </Link>
            ) : (
              <Link href="/user/transaksi">
                <li className="hover:text-orange-400">My Transaction</li>
              </Link>
            )}

            <button className="text-end" onClick={handleLogout}>
              <li className="hover:text-orange-400">Logout</li>
            </button>
          </ul>
        </div>
      </nav>
      {/** Pop-up My Profile*/}
      <div
        className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 ${
          isOpenMyProfile ? "block" : "hidden"
        }`}
      >
        <div className="bg-white p-6 rounded-lg shadow-lg w-80">
          <h2 className="text-lg font-bold mb-4 text-center">My Profile</h2>

          {/* Foto Profile */}
          <div className="flex justify-center mb-4">
            <img
              src={imageProfile || user?.profilePictureUrl}
              alt="profile user"
              className="w-24 h-24 rounded-full object-cover"
            />
          </div>

          {/* Input untuk Upload Foto */}
          <div className="mb-4">
            <input
              type="file"
              accept="image/*"
              className="mt-2 text-sm"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setFotoProfile(file); // Simpan file untuk di-upload
                  setImageProfile(URL.createObjectURL(file)); // Tampilkan preview gambar
                }
              }}
            />
          </div>

          {/* Nama */}
          <div>
            <h3 className="pb-1">Fullname:</h3>
            <input
              type="text"
              className="w-full p-2 border rounded mb-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={user?.name}
            />
          </div>

          {/* Email */}
          <div>
            <h3 className="pb-1">Email:</h3>
            <input
              type="email"
              className="w-full p-2 border rounded mb-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={user?.email}
            />
          </div>

          {/* role */}
          <div>
            <h3 className="pb-1">Role:</h3>
            <input
              type="text"
              className="w-full p-2 border bg-gray-200 cursor-not-allowed rounded mb-2"
              value={user?.role}
              readOnly
            />
          </div>

          <div>
            <h3 className="pb-1">Phone Number:</h3>
            <input
              type="text"
              className="w-full p-2 border rounded mb-4"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={user?.phoneNumber}
            />
          </div>

          <div className="flex justify-between">
            <button
              className="bg-gray-100 text-orange-400 hover:text-white px-4 py-2 rounded hover:bg-orange-400"
              onClick={handleMyProfile}
            >
              Cancel
            </button>
            <button
              className="bg-orange-400 text-white px-4 py-2 rounded hover:bg-orange-600"
              onClick={handleUpdateProfile}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
