import Authorization from "@/Authorization";
import Navbar from "@/components/Navbar";
import { useUser } from "@/context/userContext";
import { API_KEY, BASE_URL } from "@/helper/endpoint";
import useAllTransaction from "@/hooks/useAllTransaction";
import useAllUser from "@/hooks/useAllUser";
import { useBanners } from "@/hooks/useBanner";
import axios from "axios";
import { getCookie } from "cookies-next";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { RiSaveFill } from "react-icons/ri";
import Swal from "sweetalert2";
import { FiEdit } from "react-icons/fi";
import { FaTrashAlt } from "react-icons/fa";

const UserPage = () => {
  const [activePage, setActivePage] = useState("Data Transaksi");
  const { user } = useUser();
  const { allTransaction, loadingAllTransaction, getAllTransaction } =
    useAllTransaction();
  const [selectedStatus, setSelectedStatus] = useState("pending");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageAllUser, setCurrentPageAllUser] = useState(1);
  const [currentPageBanners, setCurrentPageBanners] = useState(1);
  const itemsPerPage = 5;

  const { allUser, loadingAllUser, getAllUser } = useAllUser();
  const { banners, setBanners, loadingBanners, getBanners } = useBanners();

  const token = getCookie("JWT_TOKEN");

  const [isOpenBanner, setIsOpenBanner] = useState(false);

  const [image, setImage] = useState(null);
  const [prevImage, setPrevImage] = useState(null);
  const [nameBanner, setNameBanner] = useState("");

  const [selectedBannerId, setSelectedBannerId] = useState(null);

  useEffect(() => {
    getAllTransaction();
  }, []);

  useEffect(() => {
    getAllUser();
  }, []);

  useEffect(() => {
    getBanners();
  }, []);

  useEffect(() => {
    if (selectedBannerId) {
      const bannerData = banners.find(
        (banner) => banner.id === selectedBannerId
      );
      if (bannerData) {
        setNameBanner(bannerData.name);

        setPrevImage((prev) =>
          prev !== bannerData.imageUrl ? bannerData.imageUrl : prev
        );
      }
    }
  }, [selectedBannerId, banners]);

  const handleDeleteBanner = async (bannerId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this banner?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel",
      reverseButtons: true,
      customClass: {
        confirmButton: "bg-red-500 hover:bg-red-400",
        cancelButton: "bg-gray-300 hover:bg-gray-400",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(
            `${BASE_URL.API}/api/v1/delete-banner/${bannerId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                apiKey: API_KEY,
              },
            }
          );

          // Perbarui daftar banners dengan memanggil ulang getBanners
          getBanners();

          Swal.fire({
            title: "Deleted!",
            text: "Banner has been deleted.",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });
        } catch (error) {
          console.log("Error deleting banner:", error);
        }
      }
    });
  };

  const handleCreateBanner = async () => {
    let imageUrl = "/images/no-foto.jpg";

    if (image) {
      console.log("Uploading new image...");
      const formData = new FormData();
      formData.append("image", image);

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
      name: nameBanner,
      imageUrl,
    };

    try {
      await axios.post(`${BASE_URL.API}/api/v1/create-banner`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          apiKey: API_KEY,
        },
      });

      // Reset input setelah berhasil menambahkan banner
      setNameBanner("");
      setImage(null);

      // Refresh daftar banners dari API
      getBanners();

      // Tutup modal setelah sukses
      setIsOpenBanner(false);

      Swal.fire({
        title: "Success!",
        text: "Banner has been added.",
        icon: "success",
        timer: 1100,
        showConfirmButton: false,
        customClass: {
          confirmButton: "bg-orange-500 hover:bg-orange-400",
        },
      });
    } catch (error) {
      console.log("Error adding banner:", error);
    }
  };

  const handleUpdateBanner = async (bannerId) => {
    let imageUrl = prevImage;

    if (image) {
      console.log("Uploading new image...");
      const formData = new FormData();
      formData.append("image", image);

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
      name: nameBanner,
      imageUrl,
    };
    try {
      const res = await axios.post(
        `${BASE_URL.API}/api/v1/update-banner/${bannerId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            apiKey: API_KEY,
          },
        }
      );

      // Reset input setelah berhasil menambahkan banner
      setNameBanner("");
      setImage(null);

      // Refresh daftar banners dari API
      getBanners();

      // Tutup modal setelah sukses
      setIsOpenBanner(false);

      Swal.fire({
        title: "Success!",
        text: "Banner has been added.",
        icon: "success",
        timer: 1100,
        showConfirmButton: false,
        customClass: {
          confirmButton: "bg-orange-500 hover:bg-orange-400",
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const transactionCounts = allTransaction.reduce(
    (acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    },
    { pending: 0, success: 0, cancelled: 0, failed: 0 }
  );

  const filteredTransactions = allTransaction?.filter(
    (item) => item.status === selectedStatus
  );

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const displayedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPagesAllUsers = Math.ceil(allUser.length / itemsPerPage);

  const displayedUsers = allUser.slice(
    (currentPageAllUser - 1) * itemsPerPage,
    currentPageAllUser * itemsPerPage
  );

  const totalPagesBanners = Math.ceil(banners.length / itemsPerPage);

  const displayedBanners = banners.slice(
    (currentPageBanners - 1) * itemsPerPage,
    currentPageBanners * itemsPerPage
  );

  const [role, setRole] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const handleUpdateRole = (userId, newRole) => {
    Swal.fire({
      title: "Konfirmasi",
      text: `Apakah kamu yakin ingin mengubah role user ini menjadi "${newRole}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Ubah!",
      cancelButtonText: "Batal",
      reverseButtons: true,
      confirmButtonColor: "#f97316",
      cancelButtonColor: "#6b7280",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const payload = { role: newRole };
          await axios.post(
            `${BASE_URL.API}/api/v1/update-user-role/${userId}`,
            payload,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                apiKey: API_KEY,
              },
            }
          );
          Swal.fire({
            title: "Berhasil!",
            text: "Role telah diperbarui.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });
        } catch (error) {
          console.log(error);
          Swal.fire("Error!", "Gagal memperbarui role.", "error");
        }
      }
    });
  };

  return (
    <Authorization>
      <Navbar />

      {/* Admin */}
      {user && user.role === "admin" && (
        <div>
          <div className="grid grid-cols-[2fr_8fr]">
            {/* Side Bar */}
            <div className="flex flex-col gap-y-5 bg-slate-200 pt-24 pl-20 min-h-screen">
              {[
                "Data Transaksi",
                "Data User",
                "Data Banner",
                "Data Promo",
                "Data Category",
                "Data Activity",
              ].map((list) => (
                <div
                  key={list}
                  className={`cursor-pointer hover:text-orange-400 hover:font-semibold ${
                    activePage === list ? "text-orange-400 font-bold" : ""
                  }`}
                  onClick={() => setActivePage(list)}
                >
                  {list}
                </div>
              ))}
            </div>

            {/* Main Content */}
            <div className="pt-24 min-h-screen px-20">
              {/* Data Transaksi */}
              {activePage === "Data Transaksi" && (
                <div>
                  <div className="">
                    <h1 className="text-2xl font-bold pb-3">
                      Transaction Management
                    </h1>

                    {/* Button Filter Transaction */}
                    <div className="grid grid-cols-4 gap-x-2 text-center">
                      {["pending", "success", "cancelled", "failed"].map(
                        (status) => (
                          <button
                            key={status}
                            className={`border-2 flex justify-center items-center gap-x-1 p-2 rounded-xl font-bold ${
                              selectedStatus === status
                                ? "bg-orange-400 text-white"
                                : ""
                            }`}
                            onClick={() => setSelectedStatus(status)}
                          >
                            <h1>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </h1>
                            <p>{transactionCounts[status]}</p>
                          </button>
                        )
                      )}
                    </div>

                    {/* Tabel Transaction */}
                    <div className="py-5">
                      {/* Header */}
                      <div className="grid grid-cols-[2fr_2fr_2fr_2fr_2fr] border-2 text-sm font-semibold">
                        <div>
                          <h1 className="py-3 px-3">Invoice ID</h1>
                        </div>
                        <div>
                          <h1 className="py-3 px-3">PayMethod</h1>
                        </div>
                        <div>
                          <h1 className="py-3 px-3">Amount</h1>
                        </div>
                        <div>
                          <h1 className="py-3 px-3">Order Date</h1>
                        </div>

                        <div>
                          <h1 className="py-3 px-3">Status</h1>
                        </div>
                      </div>

                      {/* Content */}
                      {displayedTransactions.map((item) => (
                        <Link href={`/user/transaksi/${item.id}`} key={item.id}>
                          <div className="grid grid-cols-[2fr_2fr_2fr_2fr_2fr] border-2 text-sm">
                            <div>
                              <h1 className="py-3 px-3">{item?.invoiceId}</h1>
                            </div>
                            <div>
                              <h1 className="py-3 px-3 text-left">
                                {item?.payment_method?.name}
                              </h1>
                            </div>
                            <div>
                              <h1 className="py-3 px-3">
                                Rp. {item.totalAmount.toLocaleString("id-ID")}
                              </h1>
                            </div>
                            <div>
                              <h1 className="py-3 px-3">
                                {item?.orderDate?.slice(0, 10)}
                              </h1>
                            </div>
                            <div>
                              <h1 className="py-3 px-3">{item.status}</h1>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                    {/* Pagination */}
                    <div className="flex justify-center mt-4 gap-4">
                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className="border px-4 py-2 rounded disabled:opacity-50 hover:bg-orange-400 hover:text-white"
                      >
                        Prev
                      </button>

                      <span className="px-4 py-2">
                        {currentPage} / {totalPages}
                      </span>

                      <button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
                        }
                        disabled={currentPage === totalPages}
                        className="border px-4 py-2 rounded disabled:opacity-50 hover:bg-orange-400 hover:text-white"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Data User */}
              {activePage === "Data User" && (
                <div>
                  <div>
                    <div className="">
                      <h1 className="text-2xl font-bold pb-3">
                        User Management
                      </h1>

                      {/* Tabel Transaction */}
                      <div className="pb-3">
                        {/* Header */}
                        <div className="grid grid-cols-[2fr_2fr_2fr_2fr_2fr] border-2 text-sm font-semibold">
                          <div>
                            <h1 className="py-3 px-3">Foto Profile</h1>
                          </div>
                          <div>
                            <h1 className="py-3 px-3">Name</h1>
                          </div>
                          <div>
                            <h1 className="py-3 px-3">Email</h1>
                          </div>
                          <div>
                            <h1 className="py-3 px-3">No. Hp</h1>
                          </div>

                          <div>
                            <h1 className="py-3 px-3">Role</h1>
                          </div>
                        </div>

                        {/* Content */}
                        {displayedUsers.map((item) => (
                          <div key={item.id}>
                            <div className="grid grid-cols-[2fr_2fr_2fr_2fr_2fr] border-2 text-sm items-center">
                              <div>
                                <div className="p-2">
                                  <img
                                    src={
                                      item?.profilePictureUrl &&
                                      item.profilePictureUrl !== "null" &&
                                      item.profilePictureUrl !== ""
                                        ? item.profilePictureUrl
                                        : "/images/no-foto.jpg"
                                    }
                                    alt="Profile"
                                    className="w-16 h-16 object-cover rounded-lg"
                                    onError={(e) => {
                                      e.currentTarget.onerror = null;
                                      e.currentTarget.src =
                                        "/images/no-foto.jpg";
                                    }}
                                  />
                                </div>
                              </div>
                              <div>
                                <h1 className="py-3 px-3 text-left">
                                  {item?.name}
                                </h1>
                              </div>
                              <div>
                                <h1 className="py-3 px-3">{item?.email}</h1>
                              </div>
                              <div>
                                <h1 className="py-3 px-3">
                                  {item?.phoneNumber !== ""
                                    ? item.phoneNumber
                                    : "Empty"}
                                </h1>
                              </div>
                              <div className="flex items-center">
                                <select
                                  className="border-2 text-sm px-3 py-1 rounded-lg border-orange-400 bg-white focus:outline-none"
                                  value={
                                    selectedUserId === item.id
                                      ? role
                                      : item.role
                                  }
                                  onChange={(e) => {
                                    setRole(e.target.value);
                                    setSelectedUserId(item.id);
                                  }}
                                >
                                  <option value="user">User</option>
                                  <option value="admin">Admin</option>
                                </select>
                                <button
                                  onClick={() =>
                                    handleUpdateRole(item.id, role)
                                  }
                                  className="ml-2 px-3 py-1 bg-orange-400 text-white rounded-lg hover:bg-orange-500"
                                  disabled={selectedUserId !== item.id}
                                >
                                  <RiSaveFill className="text-xl" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      {/* Pagination */}
                      <div className="flex justify-center mt-4 gap-4">
                        <button
                          onClick={() =>
                            setCurrentPageAllUser((prev) =>
                              Math.max(prev - 1, 1)
                            )
                          }
                          disabled={currentPageAllUser === 1}
                          className="border px-4 py-2 rounded disabled:opacity-50 hover:bg-orange-400 hover:text-white"
                        >
                          Prev
                        </button>

                        <span className="px-4 py-2">
                          {currentPageAllUser} / {totalPagesAllUsers}
                        </span>

                        <button
                          onClick={() =>
                            setCurrentPageAllUser((prev) =>
                              Math.min(prev + 1, totalPagesAllUsers)
                            )
                          }
                          disabled={currentPageAllUser === totalPagesAllUsers}
                          className="border px-4 py-2 rounded disabled:opacity-50 hover:bg-orange-400 hover:text-white"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Data Banner */}
              {activePage === "Data Banner" && (
                <div>
                  <div>
                    <div className="">
                      <div className="pb-3 flex items-center justify-between">
                        <h1 className="text-2xl font-bold">
                          Banner Management
                        </h1>
                        <button
                          className="py-2 px-5 rounded-xl bg-orange-400 font-semibold text-white hover:bg-orange-600"
                          onClick={() => {
                            setSelectedBannerId(null);
                            setIsOpenBanner(true);
                          }}
                        >
                          Add Banner
                        </button>
                      </div>

                      {/* Tabel Transaction */}
                      <div className="pb-3">
                        {/* Header */}
                        <div className="grid grid-cols-[2fr_2fr_2fr_2fr_2fr] border-2 text-sm font-semibold">
                          <div>
                            <h1 className="py-3 px-3">Image</h1>
                          </div>
                          <div>
                            <h1 className="py-3 px-3">Name</h1>
                          </div>
                          <div>
                            <h1 className="py-3 px-3">Created At</h1>
                          </div>
                          <div>
                            <h1 className="py-3 px-3">Updated At</h1>
                          </div>

                          <div>
                            <h1 className="py-3 px-3">Action</h1>
                          </div>
                        </div>

                        {/* Content */}
                        {displayedBanners.map((item) => (
                          <div key={item.id}>
                            <div className="grid grid-cols-[2fr_2fr_2fr_2fr_2fr] border-2 text-sm items-center">
                              <div>
                                <div className="p-2">
                                  <img
                                    src={
                                      item?.imageUrl &&
                                      item.imageUrl !== "null" &&
                                      item.imageUrl !== ""
                                        ? item.imageUrl
                                        : "/images/no-foto.jpg"
                                    }
                                    alt="Profile"
                                    className="w-32 h-16 object-cover rounded-lg"
                                    onError={(e) => {
                                      e.currentTarget.onerror = null;
                                      e.currentTarget.src =
                                        "/images/no-foto.jpg";
                                    }}
                                  />
                                </div>
                              </div>
                              <div>
                                <h1 className="py-3 px-3 text-left">
                                  {item?.name}
                                </h1>
                              </div>
                              <div>
                                <h1 className="py-3 px-3">
                                  {item?.createdAt?.slice(0, 10)}
                                </h1>
                              </div>
                              <div>
                                <h1 className="py-3 px-3">
                                  {item?.updatedAt?.slice(0, 10)}
                                </h1>
                              </div>
                              <div className="flex gap-x-5 text-center">
                                <button
                                  onClick={() => {
                                    setSelectedBannerId(item.id);
                                    setIsOpenBanner(true);
                                  }}
                                >
                                  <FiEdit className="text-xl hover:text-green-600" />
                                </button>
                                <button
                                  onClick={() => handleDeleteBanner(item.id)}
                                >
                                  <FaTrashAlt className="text-xl text-red-400 hover:text-red-700" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      {/* Pagination */}
                      <div className="flex justify-center mt-4 gap-4">
                        <button
                          onClick={() =>
                            setCurrentPageBanners((prev) =>
                              Math.max(prev - 1, 1)
                            )
                          }
                          disabled={currentPageBanners === 1}
                          className="border px-4 py-2 rounded disabled:opacity-50 hover:bg-orange-400 hover:text-white"
                        >
                          Prev
                        </button>

                        <span className="px-4 py-2">
                          {currentPageBanners} / {totalPagesBanners}
                        </span>

                        <button
                          onClick={() =>
                            setCurrentPageBanners((prev) =>
                              Math.min(prev + 1, totalPagesBanners)
                            )
                          }
                          disabled={currentPageBanners === totalPagesBanners}
                          className="border px-4 py-2 rounded disabled:opacity-50 hover:bg-orange-400 hover:text-white"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activePage === "Data Promo" && <div>Ini Promo</div>}
              {activePage === "Data Category" && <div>Ini Category</div>}
              {activePage === "Data Activity" && <div>Ini Activity</div>}
            </div>
          </div>

          {/** Pop-up Banner **/}
          <div
            className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 ${
              isOpenBanner ? "block" : "hidden"
            }`}
          >
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
              <h2 className="text-lg font-bold mb-4 text-center">
                {selectedBannerId ? "Edit Banner" : "Create Banner"}
              </h2>

              {/* Image */}
              <div className="flex justify-center mb-4">
                <img
                  src={selectedBannerId ? prevImage : "/images/no-foto.jpg"}
                  alt="image banner"
                  className="w-72 h-36 object-cover"
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
                      setImage(file); // Simpan file untuk di-upload
                      setPrevImage(URL.createObjectURL(file)); // Tampilkan preview gambar
                    }
                  }}
                />
              </div>

              {/* Nama */}
              <div>
                <h3 className="pb-1">Name:</h3>
                <input
                  type="text"
                  className="w-full p-2 border rounded mb-2"
                  value={selectedBannerId ? nameBanner : ""}
                  onChange={(e) => setNameBanner(e.target.value)}
                  placeholder={selectedBannerId ? nameBanner : "Nama Wisata"}
                />
              </div>
              <div className="flex justify-between">
                <button
                  className="bg-gray-100 text-orange-400 hover:text-white px-4 py-2 rounded hover:bg-orange-400"
                  onClick={() => setIsOpenBanner(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-orange-400 text-white px-4 py-2 rounded hover:bg-orange-600"
                  onClick={() =>
                    selectedBannerId
                      ? handleUpdateBanner(selectedBannerId)
                      : handleCreateBanner()
                  }
                >
                  {selectedBannerId ? "Update" : "Create"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Authorization>
  );
};

export default UserPage;
