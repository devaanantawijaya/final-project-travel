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
import imageCompression from "browser-image-compression";
import { TbBoxMultipleFilled } from "react-icons/tb";
import { FaWindowClose } from "react-icons/fa";
import { usePromos } from "@/hooks/usePromos";
import useCategories from "@/hooks/useCategories";
import useActivities from "@/hooks/useActivities";

const UserPage = () => {
  const [activePage, setActivePage] = useState("Data Transaksi");
  const { user } = useUser();
  const [selectedStatus, setSelectedStatus] = useState("pending");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageAllUser, setCurrentPageAllUser] = useState(1);
  const [currentPageBanners, setCurrentPageBanners] = useState(1);
  const [currentPagePromos, setCurrentPagePromos] = useState(1);
  const [currentPageCategories, setCurrentPageCategories] = useState(1);
  const [currentPageActivities, setCurrentPageActivities] = useState(1);
  const itemsPerPage = 5;

  const { allTransaction, loadingAllTransaction, getAllTransaction } =
    useAllTransaction();
  const { allUser, loadingAllUser, getAllUser } = useAllUser();
  const { banners, setBanners, loadingBanners, getBanners } = useBanners();
  const { promos, setPromos, loadingPromos, getPromos } = usePromos();
  const { categories, setCategories, loadingCategories, getCategories } =
    useCategories();
  const { activities, setActivities, loadingActivities, getActivities } =
    useActivities();

  const token = getCookie("JWT_TOKEN");

  const [isOpenSideBar, setIsOpenSideBar] = useState(false);
  const [isOpenData, setIsOpenData] = useState(false);

  const [selectedId, setSelectedId] = useState(null);
  const [image, setImage] = useState(null);
  const [prevImage, setPrevImage] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [name, setName] = useState("");
  const [jdl, setJdl] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [terms_condition, setTerms_condition] = useState("");
  const [promo_code, setPromo_code] = useState("");
  const [promo_discount_price, setPromo_discount_price] = useState(0);
  const [minimum_claim_price, setMinimum_claim_price] = useState(0);
  const [price, setPrice] = useState(0);
  const [price_discount, setPrice_discount] = useState(0);
  const [rating, setRating] = useState(0);
  const [total_reviews, setTotal_reviews] = useState(0);
  const [facilities, setFacilities] = useState("");
  const [address, setAddress] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [location_maps, setLocation_maps] = useState("");

  useEffect(() => {
    getAllTransaction();
    getAllUser();
    getBanners();
    getPromos();
    getCategories();
    getActivities();
  }, []);

  useEffect(() => {
    if (!selectedId || jdl !== "banner") return;

    if (selectedId && jdl === "banner") {
      const bannerData = banners.find((banner) => banner.id === selectedId);
      if (bannerData) {
        setName(bannerData.name);
        setPrevImage((prev) =>
          prev !== bannerData.imageUrl ? bannerData.imageUrl : prev
        );
      }
    }
  }, [selectedId, jdl, banners]);

  useEffect(() => {
    if (!selectedId || jdl !== "promo") return;

    if (selectedId && jdl === "promo") {
      const promosData = promos.find((promo) => promo.id === selectedId);
      if (promosData) {
        setName(promosData.title);
        setDescription(promosData.description);
        setPrevImage((prev) =>
          prev !== promosData.imageUrl ? promosData.imageUrl : prev
        );
        setTerms_condition(promosData.terms_condition);
        setPromo_code(promosData.promo_code);
        setPromo_discount_price(promosData.promo_discount_price);
        setMinimum_claim_price(promosData.minimum_claim_price);
      }
    }
  }, [selectedId, jdl, promos]);

  useEffect(() => {
    if (!selectedId || jdl !== "category") return;

    if (selectedId && jdl === "category") {
      const categoriesData = categories.find(
        (banner) => banner.id === selectedId
      );
      if (categoriesData) {
        setName(categoriesData.name);
        setPrevImage((prev) =>
          prev !== categoriesData.imageUrl ? categoriesData.imageUrl : prev
        );
      }
    }
  }, [selectedId, jdl, categories]);

  useEffect(() => {
    if (!selectedId || jdl !== "activity") return;

    if (selectedId && jdl === "activity") {
      const activitiesData = activities.find(
        (promo) => promo.id === selectedId
      );
      if (activitiesData) {
        setCategoryId(activitiesData.categoryId);
        setName(activitiesData.title);
        setDescription(activitiesData.description);
        setPrevImage((prev) =>
          prev !== activitiesData.imageUrls[0]
            ? activitiesData.imageUrls[0]
            : prev
        );
        setPrice(activitiesData.price);
        setPrice_discount(activitiesData.price_discount);
        setRating(activitiesData.rating);
        setTotal_reviews(activitiesData.total_reviews);
        setFacilities(activitiesData.facilities);
        setAddress(activitiesData.address);
        setProvince(activitiesData.province);
        setCity(activitiesData.city);
        setLocation_maps(activitiesData.location_maps);
      }
    }
  }, [selectedId, jdl, activities]);

  const handleDelete = async (Id, judul) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete this ${judul}?`,
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
          await axios.delete(`${BASE_URL.API}/api/v1/delete-${judul}/${Id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              apiKey: API_KEY,
            },
          });

          {
            judul === "banner" && getBanners();
          }
          {
            judul === "promo" && getPromos();
          }
          {
            judul === "category" && getCategories();
          }
          {
            judul === "activity" && getActivities();
          }

          Swal.fire({
            title: "Deleted!",
            text: `${judul} has been deleted.`,
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });
        } catch (error) {
          console.log("Error deleting:", error);
          Swal.fire({
            icon: "error",
            title: "Gagal, Coba Lagi Nanti",
            text:
              error.response?.data?.message || "Terjadi kesalahan pada server.",
          });
        }
      }
    });
  };

  const handleCreateBanner = async (judul) => {
    let imageUrl = "/images/no-foto.jpg";

    if (image) {
      try {
        console.log("Compressing image...");
        const options = {
          maxSizeMB: 1, // Batas maksimal 1MB
          maxWidthOrHeight: 1024, // Resolusi maksimum 1024px
          useWebWorker: true,
        };

        const compressedImage = await imageCompression(image, options);
        console.log("Image compressed successfully");
        console.log("Uploading new image...");
        const formData = new FormData();
        formData.append("image", compressedImage);

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
      } catch (error) {
        console.log("error uplod", error);
        console.error("Image upload failed:", error);
        return Swal.fire({
          title: "Error!",
          text: "Failed to upload image.",
          icon: "error",
        });
      }
    }

    try {
      const payload = {
        ...(judul === "activity" ? { categoryId } : {}),
        [judul === "banner" || judul === "category" ? "name" : "title"]: name,
        ...(judul === "promo" || judul === "activity" ? { description } : {}),
        [judul === "activity" ? "imageUrls" : "imageUrl"]:
          judul === "activity" ? [imageUrl] : imageUrl,
        ...(judul === "promo"
          ? {
              terms_condition,
              promo_code,
              promo_discount_price,
              minimum_claim_price,
            }
          : {}),
        ...(judul === "activity"
          ? {
              price,
              price_discount,
              rating,
              total_reviews,
              facilities,
              address,
              province,
              city,
              location_maps,
            }
          : {}),
      };

      await axios.post(`${BASE_URL.API}/api/v1/create-${judul}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          apiKey: API_KEY,
        },
      });

      // Reset input setelah berhasil menambahkan banner
      setName("");
      setImage(null);
      setPrevImage("");

      // Refresh daftar banners dari API
      {
        judul === "banner" && getBanners();
      }
      {
        judul === "promo" && getPromos();
      }
      {
        judul === "category" && getCategories();
      }
      {
        judul === "activity" && getActivities();
      }

      // Tutup modal setelah sukses
      setIsOpenData(false);

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
      console.log("Error adding:", error);
    }
  };

  const handleUpdateBanner = async (Id, judul) => {
    let imageUrl = prevImage;

    if (image) {
      try {
        console.log("Compressing image...");
        const options = {
          maxSizeMB: 1, // Batas maksimal 1MB
          maxWidthOrHeight: 1024, // Resolusi maksimum 1024px
          useWebWorker: true,
        };

        const compressedImage = await imageCompression(image, options);
        console.log("Image compressed successfully");
        console.log("Uploading new image...");
        const formData = new FormData();
        formData.append("image", compressedImage);

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
      } catch (error) {
        console.log("error uplod", error);
        console.error("Image upload failed:", error);
        return Swal.fire({
          title: "Error!",
          text: "Failed to upload image.",
          icon: "error",
        });
      }
    }

    try {
      const payload = {
        ...(judul === "activity" ? { categoryId } : {}),
        [judul === "banner" || judul === "category" ? "name" : "title"]: name,
        ...(judul === "promo" || judul === "activity" ? { description } : {}),
        [judul === "activity" ? "imageUrls" : "imageUrl"]:
          judul === "activity" ? [imageUrl] : imageUrl,
        ...(judul === "promo"
          ? {
              terms_condition,
              promo_code,
              promo_discount_price,
              minimum_claim_price,
            }
          : {}),
        ...(judul === "activity"
          ? {
              price,
              price_discount,
              rating,
              total_reviews,
              facilities,
              address,
              province,
              city,
              location_maps,
            }
          : {}),
      };
      const res = await axios.post(
        `${BASE_URL.API}/api/v1/update-${judul}/${Id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            apiKey: API_KEY,
          },
        }
      );

      setName("");
      setImage(null);

      {
        judul === "banner" && getBanners();
      }
      {
        judul === "promo" && getPromos();
      }
      {
        judul === "category" && getCategories();
      }
      {
        judul === "activity" && getActivities();
      }

      setIsOpenData(false);

      Swal.fire({
        title: "Success!",
        text: `${judul} has been added.`,
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

  const totalPagesPromos = Math.ceil(promos.length / itemsPerPage);
  const displayedPromos = promos.slice(
    (currentPagePromos - 1) * itemsPerPage,
    currentPagePromos * itemsPerPage
  );

  const totalPagesCategories = Math.ceil(categories.length / itemsPerPage);
  const displayedCategories = categories.slice(
    (currentPageCategories - 1) * itemsPerPage,
    currentPageCategories * itemsPerPage
  );

  const totalPagesActivities = Math.ceil(activities.length / itemsPerPage);
  const displayedActivities = activities.slice(
    (currentPageActivities - 1) * itemsPerPage,
    currentPageActivities * itemsPerPage
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
          <div className="lg:grid lg:grid-cols-[2fr_8fr] relative">
            {/* Sidebar */}
            <div
              className={`fixed lg:relative top-0 left-0 w-64 bg-slate-200 h-full transition-transform duration-300 lg:translate-x-0 z-50 ${
                isOpenSideBar ? "translate-x-0" : "-translate-x-full"
              }`}
            >
              <div className="flex flex-col gap-y-5 pt-24 lg:pl-20 lg:min-h-screen pl-5">
                <button
                  className="lg:hidden block text-white mb-3 w-fit"
                  onClick={() => setIsOpenSideBar(false)}
                >
                  <FaWindowClose className="text-3xl text-red-500" />
                </button>

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
                    className={`cursor-pointer hover:text-orange-400 hover:font-semibold py-2 ${
                      activePage === list ? "text-orange-400 font-bold" : ""
                    }`}
                    onClick={() => setActivePage(list)}
                  >
                    {list}
                  </div>
                ))}
              </div>
            </div>

            {/* Overlay saat sidebar terbuka */}
            {isOpenSideBar && (
              <div
                className="fixed top-0 left-0 h-full bg-black opacity-50 lg:hidden w-screen"
                onClick={() => setIsOpenSideBar(false)}
              ></div>
            )}

            {/* Main Content */}
            <div className="lg:pt-24 pt-20 min-h-screen lg:px-20 px-5">
              <button
                className="lg:hidden block p-1 rounded-lg shadow-xl bg-slate-100 text-white mb-3 border-2"
                onClick={() => setIsOpenSideBar(true)}
              >
                <TbBoxMultipleFilled className="text-orange-400 text-3xl" />
              </button>
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
                            className={`border-2 sm:flex justify-center items-center gap-x-1 p-2 rounded-xl font-bold ${
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

                    {/* Tabel Transaction Desktop*/}
                    <div className="py-5 sm:block hidden">
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
                            <div className="">
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
                    {/* Tabel Transaction Mobile */}
                    <div className="py-5 sm:hidden block">
                      {/* Header */}
                      <div className="hidden sm:grid grid-cols-5 border-2 text-sm font-semibold">
                        <div className="py-3 px-3">Invoice ID</div>
                        <div className="py-3 px-3">PayMethod</div>
                        <div className="py-3 px-3">Amount</div>
                        <div className="py-3 px-3">Order Date</div>
                        <div className="py-3 px-3">Status</div>
                      </div>

                      {/* Content */}
                      {displayedTransactions.map((item) => (
                        <Link href={`/user/transaksi/${item.id}`} key={item.id}>
                          <div className="grid grid-cols-[4fr_6fr] sm:grid-cols-5 border-2 text-sm p-3">
                            <div className="font-semibold">Invoice ID</div>
                            <div>{item?.invoiceId}</div>

                            <div className="font-semibold">PayMethod</div>
                            <div>{item?.payment_method?.name}</div>

                            <div className="font-semibold">Amount</div>
                            <div>
                              Rp. {item.totalAmount.toLocaleString("id-ID")}
                            </div>

                            <div className="font-semibold">Order Date</div>
                            <div>{item?.orderDate?.slice(0, 10)}</div>

                            <div className="font-semibold">Status</div>
                            <div>{item.status}</div>
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
                <div className="">
                  <h1 className="text-2xl font-bold pb-3">User Management</h1>

                  {/* Tabel User*/}
                  <div className="pb-3">
                    {/* Header (Hanya muncul di Desktop) */}
                    <div className="hidden sm:grid sm:grid-cols-5 border-2 text-sm font-semibold">
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
                      <div
                        key={item.id}
                        className="border-2 p-3 grid grid-cols-1 sm:grid-cols-5 gap-y-2"
                      >
                        {/* Foto Profile */}
                        <div className="flex sm:justify-start">
                          <img
                            src={
                              item?.profilePictureUrl &&
                              item.profilePictureUrl !== "null" &&
                              item.profilePictureUrl !== ""
                                ? item.profilePictureUrl
                                : "/images/no-foto.jpg"
                            }
                            alt="Profile"
                            className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = "/images/no-foto.jpg";
                            }}
                          />
                        </div>

                        {/* Name */}
                        <div className="grid grid-cols-[1fr_2fr] sm:block">
                          <span className="sm:hidden font-semibold">Name</span>
                          <h1 className="py-1 px-3">{item?.name}</h1>
                        </div>

                        {/* Email */}
                        <div className="grid grid-cols-[1fr_2fr] sm:block">
                          <span className="sm:hidden font-semibold">Email</span>
                          <h1 className="py-1 px-3">{item?.email}</h1>
                        </div>

                        {/* No HP */}
                        <div className="grid grid-cols-[1fr_2fr] sm:block">
                          <span className="sm:hidden font-semibold">
                            No. Hp
                          </span>
                          <h1 className="py-1 px-3">
                            {item?.phoneNumber !== ""
                              ? item.phoneNumber
                              : "Empty"}
                          </h1>
                        </div>

                        {/* Role (Dropdown + Button) */}
                        <div className="grid grid-cols-[1fr_2fr] sm:flex sm:items-center">
                          <span className="sm:hidden font-semibold">Role</span>
                          <div className="flex sm:flex-row flex-col">
                            <select
                              className="border-2 text-sm px-3 py-1 rounded-lg border-orange-400 bg-white focus:outline-none"
                              value={
                                selectedUserId === item.id ? role : item.role
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
                              onClick={() => handleUpdateRole(item.id, role)}
                              className="ml-0 sm:ml-2 mt-2 sm:mt-0 px-3 py-1 bg-orange-400 text-white rounded-lg hover:bg-orange-500"
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
                        setCurrentPageAllUser((prev) => Math.max(prev - 1, 1))
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
              )}

              {/* Data Banner */}
              {activePage === "Data Banner" && (
                <div className="">
                  {/* Judul dan Add */}
                  <div className="pb-3 flex items-center justify-between">
                    <h1 className="text-2xl font-bold w-5 sm:w-fit">
                      Banner Management
                    </h1>
                    <button
                      className="py-2 sm:px-5 px-3 rounded-xl bg-orange-400 font-semibold text-white hover:bg-orange-600 w-fit h-fit"
                      onClick={() => {
                        setSelectedId(null);

                        setImage(null);
                        setName("Ketik Nama Wisata");

                        setFileInputKey((prevKey) => prevKey + 1);
                        setIsOpenData(true);
                        setPrevImage(null);
                        setJdl("banner");
                      }}
                    >
                      Add Banner
                    </button>
                  </div>

                  {/* Tabel Banner */}
                  <div className="pb-3">
                    {/* Header (Desktop Only) */}
                    <div className="hidden sm:grid sm:grid-cols-5 border-2 text-sm font-semibold">
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
                      <div
                        key={item.id}
                        className="border-2 p-3 grid grid-cols-1 sm:grid-cols-5 gap-y-2"
                      >
                        {/* Image */}
                        <div className="flex sm:justify-start">
                          <img
                            src={
                              item?.imageUrl &&
                              item.imageUrl !== "null" &&
                              item.imageUrl !== ""
                                ? item.imageUrl
                                : "/images/no-foto.jpg"
                            }
                            alt="Banner"
                            className="w-32 h-16 object-cover rounded-lg"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = "/images/no-foto.jpg";
                            }}
                          />
                        </div>

                        {/* Name */}
                        <div className="grid grid-cols-[1fr_2fr] sm:block">
                          <span className="sm:hidden font-semibold">Name</span>
                          <h1 className="py-1 px-3">{item?.name}</h1>
                        </div>

                        {/* Created At */}
                        <div className="grid grid-cols-[1fr_2fr] sm:block">
                          <span className="sm:hidden font-semibold">
                            Created At
                          </span>
                          <h1 className="py-1 px-3">
                            {item?.createdAt?.slice(0, 10)}
                          </h1>
                        </div>

                        {/* Updated At */}
                        <div className="grid grid-cols-[1fr_2fr] sm:block">
                          <span className="sm:hidden font-semibold">
                            Updated At
                          </span>
                          <h1 className="py-1 px-3">
                            {item?.updatedAt?.slice(0, 10)}
                          </h1>
                        </div>

                        {/* Action */}
                        <div className="grid grid-cols-[1fr_2fr] sm:flex sm:items-center">
                          <span className="sm:hidden font-semibold">
                            Action
                          </span>
                          <div className="flex gap-x-5">
                            <button
                              onClick={() => {
                                setSelectedId(item.id);
                                setIsOpenData(true);
                                setImage(null);
                                setFileInputKey((prevKey) => prevKey + 1);
                                setJdl("banner");
                              }}
                            >
                              <FiEdit className="text-xl hover:text-green-600" />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id, "banner")}
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
                        setCurrentPageBanners((prev) => Math.max(prev - 1, 1))
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
              )}

              {/* Data Promo */}
              {activePage === "Data Promo" && (
                <div className="">
                  {/* Judul dan Add */}
                  <div className="pb-3 flex items-center justify-between">
                    <h1 className="text-2xl font-bold w-5 sm:w-fit">
                      Promo Management
                    </h1>
                    <button
                      className="py-2 sm:px-5 px-3 rounded-xl bg-orange-400 font-semibold text-white hover:bg-orange-600 w-fit h-fit"
                      onClick={() => {
                        setSelectedId(null);
                        setImage(null);
                        setFileInputKey((prevKey) => prevKey + 1);
                        setPrevImage(null);
                        setName("Ketik Nama Promo");
                        setDescription("Enter Description");
                        setTerms_condition("Enter Terms and Descrption");
                        setPromo_code("Enter Promo Code");
                        setPromo_discount_price(0);
                        setMinimum_claim_price(0);
                        setIsOpenData(true);
                        setJdl("promo");
                      }}
                    >
                      Add Promo
                    </button>
                  </div>

                  {/* Tabel Promo */}
                  <div className="pb-3">
                    {/* Header (Desktop Only) */}
                    <div className="hidden sm:grid sm:grid-cols-[2.5fr_3.5fr_2fr_2fr] border-2 text-sm font-semibold">
                      <div>
                        <h1 className="py-3 px-3">Image</h1>
                      </div>
                      <div>
                        <h1 className="py-3 px-3">Title</h1>
                      </div>
                      <div>
                        <h1 className="py-3 px-3">Code Promo</h1>
                      </div>

                      <div>
                        <h1 className="py-3 px-3">Action</h1>
                      </div>
                    </div>

                    {/* Content */}
                    {displayedPromos.map((item) => (
                      <div
                        key={item.id}
                        className="border-2 p-3 grid grid-cols-1 sm:grid-cols-[2.5fr_3.5fr_2fr_2fr] gap-y-2"
                      >
                        {/* Image */}
                        <div className="flex sm:justify-start">
                          <img
                            src={
                              item?.imageUrl &&
                              item.imageUrl !== "null" &&
                              item.imageUrl !== ""
                                ? item.imageUrl
                                : "/images/no-foto.jpg"
                            }
                            alt="Promo"
                            className="w-32 h-16 object-cover rounded-lg"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = "/images/no-foto.jpg";
                            }}
                          />
                        </div>

                        {/* Name */}
                        <div className="grid grid-cols-[1fr_2fr] sm:block">
                          <span className="sm:hidden font-semibold">Title</span>
                          <h1 className="py-1 px-3">{item?.title}</h1>
                        </div>

                        {/* Code Promo */}
                        <div className="grid grid-cols-[1fr_2fr] sm:block">
                          <span className="sm:hidden font-semibold">
                            Code Promo
                          </span>
                          <h1 className="py-1 px-3">{item?.promo_code}</h1>
                        </div>

                        {/* Action */}
                        <div className="grid grid-cols-[1fr_2fr] sm:flex sm:items-center">
                          <span className="sm:hidden font-semibold">
                            Action
                          </span>
                          <div className="flex gap-x-5">
                            <button
                              onClick={() => {
                                setSelectedId(item.id);
                                setIsOpenData(true);
                                setImage(null);
                                setFileInputKey((prevKey) => prevKey + 1);
                                setJdl("promo");
                              }}
                            >
                              <FiEdit className="text-xl hover:text-green-600" />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id, "promo")}
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
                        setCurrentPagePromos((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPagePromos === 1}
                      className="border px-4 py-2 rounded disabled:opacity-50 hover:bg-orange-400 hover:text-white"
                    >
                      Prev
                    </button>

                    <span className="px-4 py-2">
                      {currentPagePromos} / {totalPagesPromos}
                    </span>

                    <button
                      onClick={() =>
                        setCurrentPagePromos((prev) =>
                          Math.min(prev + 1, totalPagesPromos)
                        )
                      }
                      disabled={currentPagePromos === totalPagesPromos}
                      className="border px-4 py-2 rounded disabled:opacity-50 hover:bg-orange-400 hover:text-white"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}

              {/* Data Category */}
              {activePage === "Data Category" && (
                <div className="">
                  {/* Judul dan Add */}
                  <div className="pb-3 flex items-center justify-between">
                    <h1 className="text-2xl font-bold w-5 sm:w-fit">
                      Category Management
                    </h1>
                    <button
                      className="py-2 sm:px-5 px-3 rounded-xl bg-orange-400 font-semibold text-white hover:bg-orange-600 w-fit h-fit"
                      onClick={() => {
                        setSelectedId(null);
                        setImage(null);
                        setName("Ketik Nama Category");
                        setFileInputKey((prevKey) => prevKey + 1);
                        setIsOpenData(true);
                        setPrevImage(null);
                        setJdl("category");
                      }}
                    >
                      Add Category
                    </button>
                  </div>

                  {/* Tabel Category */}
                  <div className="pb-3">
                    {/* Header (Desktop Only) */}
                    <div className="hidden sm:grid sm:grid-cols-5 border-2 text-sm font-semibold">
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
                    {displayedCategories.map((item) => (
                      <div
                        key={item.id}
                        className="border-2 p-3 grid grid-cols-1 sm:grid-cols-5 gap-y-2"
                      >
                        {/* Image */}
                        <div className="flex sm:justify-start">
                          <img
                            src={
                              item?.imageUrl &&
                              item.imageUrl !== "null" &&
                              item.imageUrl !== ""
                                ? item.imageUrl
                                : "/images/no-foto.jpg"
                            }
                            alt="Category"
                            className="w-32 h-16 object-cover rounded-lg"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = "/images/no-foto.jpg";
                            }}
                          />
                        </div>

                        {/* Name */}
                        <div className="grid grid-cols-[1fr_2fr] sm:block">
                          <span className="sm:hidden font-semibold">Name</span>
                          <h1 className="py-1 px-3">{item?.name}</h1>
                        </div>

                        {/* Created At */}
                        <div className="grid grid-cols-[1fr_2fr] sm:block">
                          <span className="sm:hidden font-semibold">
                            Created At
                          </span>
                          <h1 className="py-1 px-3">
                            {item?.createdAt?.slice(0, 10)}
                          </h1>
                        </div>

                        {/* Updated At */}
                        <div className="grid grid-cols-[1fr_2fr] sm:block">
                          <span className="sm:hidden font-semibold">
                            Updated At
                          </span>
                          <h1 className="py-1 px-3">
                            {item?.updatedAt?.slice(0, 10)}
                          </h1>
                        </div>

                        {/* Action */}
                        <div className="grid grid-cols-[1fr_2fr] sm:flex sm:items-center">
                          <span className="sm:hidden font-semibold">
                            Action
                          </span>
                          <div className="flex gap-x-5">
                            <button
                              onClick={() => {
                                setSelectedId(item.id);
                                setIsOpenData(true);
                                setImage(null);
                                setFileInputKey((prevKey) => prevKey + 1);
                                setJdl("category");
                              }}
                            >
                              <FiEdit className="text-xl hover:text-green-600" />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id, "category")}
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
                        setCurrentPageCategories((prev) =>
                          Math.max(prev - 1, 1)
                        )
                      }
                      disabled={currentPageCategories === 1}
                      className="border px-4 py-2 rounded disabled:opacity-50 hover:bg-orange-400 hover:text-white"
                    >
                      Prev
                    </button>

                    <span className="px-4 py-2">
                      {currentPageCategories} / {totalPagesCategories}
                    </span>

                    <button
                      onClick={() =>
                        setCurrentPageCategories((prev) =>
                          Math.min(prev + 1, totalPagesCategories)
                        )
                      }
                      disabled={currentPageCategories === totalPagesCategories}
                      className="border px-4 py-2 rounded disabled:opacity-50 hover:bg-orange-400 hover:text-white"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}

              {/* Data Activity */}
              {activePage === "Data Activity" && (
                <div className="">
                  {/* Judul dan Add */}
                  <div className="pb-3 flex items-center justify-between">
                    <h1 className="text-2xl font-bold w-5 sm:w-fit">
                      Activity Management
                    </h1>
                    <button
                      className="py-2 sm:px-5 px-3 rounded-xl bg-orange-400 font-semibold text-white hover:bg-orange-600 w-fit h-fit"
                      onClick={() => {
                        setJdl("activity");
                        setSelectedId(null);
                        setImage(null);
                        setFileInputKey((prevKey) => prevKey + 1);
                        setPrevImage(null);
                        setCategoryId("");

                        setName("Enter Activity Title");
                        setDescription("Enter Description");

                        setPrice(0);
                        setPrice_discount(0);
                        setRating(0);
                        setTotal_reviews(0);
                        setFacilities("Enter Facilities");
                        setAddress("Enter Address");
                        setProvince("Enter Province");
                        setCity("Enter City");
                        setLocation_maps("Enter Link Google Maps");

                        setIsOpenData(true);
                      }}
                    >
                      Add Activity
                    </button>
                  </div>

                  {/* Tabel Activity */}
                  <div className="pb-3">
                    {/* Header (Desktop Only) */}
                    <div className="hidden sm:grid sm:grid-cols-[2.5fr_3.5fr_2fr_2fr] border-2 text-sm font-semibold">
                      <div>
                        <h1 className="py-3 px-3">Image</h1>
                      </div>
                      <div>
                        <h1 className="py-3 px-3">Title</h1>
                      </div>
                      <div>
                        <h1 className="py-3 px-3">City</h1>
                      </div>

                      <div>
                        <h1 className="py-3 px-3">Action</h1>
                      </div>
                    </div>

                    {/* Content */}
                    {displayedActivities.map((item) => (
                      <div
                        key={item.id}
                        className="border-2 p-3 grid grid-cols-1 sm:grid-cols-[2.5fr_3.5fr_2fr_2fr] gap-y-2"
                      >
                        {/* Image */}
                        <div className="flex sm:justify-start">
                          <img
                            src={
                              item?.imageUrls &&
                              item.imageUrls[0] !== "null" &&
                              item.imageUrls[0] !== ""
                                ? item.imageUrls
                                : "/images/no-foto.jpg"
                            }
                            alt="Activity"
                            className="w-32 h-16 object-cover rounded-lg"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = "/images/no-foto.jpg";
                            }}
                          />
                        </div>

                        {/* Name */}
                        <div className="grid grid-cols-[1fr_2fr] sm:block">
                          <span className="sm:hidden font-semibold">Title</span>
                          <h1 className="py-1 px-3">{item?.title}</h1>
                        </div>

                        {/* City */}
                        <div className="grid grid-cols-[1fr_2fr] sm:block">
                          <span className="sm:hidden font-semibold">City</span>
                          <h1 className="py-1 px-3">{item?.city}</h1>
                        </div>

                        {/* Action */}
                        <div className="grid grid-cols-[1fr_2fr] sm:flex sm:items-center">
                          <span className="sm:hidden font-semibold">
                            Action
                          </span>
                          <div className="flex gap-x-5">
                            <button
                              onClick={() => {
                                setSelectedId(item.id);
                                setIsOpenData(true);
                                setImage(null);
                                setFileInputKey((prevKey) => prevKey + 1);
                                setJdl("activity");
                              }}
                            >
                              <FiEdit className="text-xl hover:text-green-600" />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id, "activity")}
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
                        setCurrentPageActivities((prev) =>
                          Math.max(prev - 1, 1)
                        )
                      }
                      disabled={currentPageActivities === 1}
                      className="border px-4 py-2 rounded disabled:opacity-50 hover:bg-orange-400 hover:text-white"
                    >
                      Prev
                    </button>

                    <span className="px-4 py-2">
                      {currentPageActivities} / {totalPagesActivities}
                    </span>

                    <button
                      onClick={() =>
                        setCurrentPageActivities((prev) =>
                          Math.min(prev + 1, totalPagesActivities)
                        )
                      }
                      disabled={currentPageActivities === totalPagesActivities}
                      className="border px-4 py-2 rounded disabled:opacity-50 hover:bg-orange-400 hover:text-white"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/** Pop-up Banner **/}
          <div
            className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 ${
              isOpenData ? "block" : "hidden"
            }`}
            onClick={() => setIsOpenData(false)}
          >
            <div
              className="bg-white p-6 rounded-lg shadow-lg w-80 max-h-screen overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Judul Pop Up */}
              <h2 className="text-lg font-bold mb-4 text-center">
                {selectedId
                  ? `Edit ${
                      jdl.charAt(0).toUpperCase() + jdl.slice(1).toLowerCase()
                    }`
                  : `Create ${
                      jdl.charAt(0).toUpperCase() + jdl.slice(1).toLowerCase()
                    }`}
              </h2>

              {/* Image */}
              <div className="flex justify-center mb-4">
                <img
                  src={
                    selectedId || prevImage ? prevImage : "/images/no-foto.jpg"
                  }
                  alt={`image ${jdl}`}
                  className="w-72 h-36 object-cover"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/images/no-foto.jpg";
                  }}
                />
              </div>

              {/* Input untuk Upload Gambar */}
              <div className="mb-4">
                <input
                  key={fileInputKey}
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

              {/* CategoryID */}
              {jdl === "activity" && categories?.length > 0 && (
                <div className="mb-1">
                  <h3 className="pb-1">Category</h3>
                  <select
                    className="border-2 w-full text-xl px-5 py-1 rounded-lg bg-white focus:outline-none"
                    onChange={(e) => setCategoryId(e.target.value)}
                    value={categoryId}
                  >
                    <option value="" disabled>
                      Pilih Category
                    </option>
                    {categories.map((item) => (
                      <option key={item?.id} value={item?.id}>
                        {item?.name?.charAt(0).toUpperCase() +
                          item?.name?.slice(1).toLowerCase()}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Nama */}
              <div>
                <h3 className="pb-1">
                  {jdl === "banner" || jdl === "category" ? "Name:" : "Title"}
                </h3>
                <input
                  type="text"
                  className="w-full p-2 border rounded mb-2"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={selectedId ? name : ""}
                />
              </div>

              {/* Deskripsi Promo dan Activity */}
              {(jdl === "promo" || jdl === "activity") && (
                <div>
                  <h3 className="pb-1">Description</h3>
                  <input
                    type="text"
                    className="w-full p-2 border rounded mb-2"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={selectedId ? description : ""}
                  />
                </div>
              )}

              {/* Sisa Isi Promo */}
              {jdl === "promo" && (
                <div>
                  {/* terms_condition */}
                  <div>
                    <h3 className="pb-1">Terms Condition</h3>
                    <input
                      type="text"
                      className="w-full p-2 border rounded mb-2"
                      value={terms_condition}
                      onChange={(e) => setTerms_condition(e.target.value)}
                      placeholder={selectedId ? terms_condition : ""}
                    />
                  </div>
                  {/* promo_code */}
                  <div>
                    <h3 className="pb-1">Code Promo</h3>
                    <input
                      type="text"
                      className="w-full p-2 border rounded mb-2"
                      value={promo_code}
                      onChange={(e) => setPromo_code(e.target.value)}
                      placeholder={selectedId ? promo_code : ""}
                    />
                  </div>
                  {/* Discount Promo */}
                  <div>
                    <h3 className="pb-1">Discount Promo</h3>
                    <input
                      type="number"
                      className="w-full p-2 border rounded mb-2"
                      value={promo_discount_price}
                      onChange={(e) =>
                        setPromo_discount_price(Number(e.target.value))
                      }
                      placeholder={selectedId ? promo_discount_price : 0}
                    />
                  </div>
                  {/* Minimum Claim */}
                  <div>
                    <h3 className="pb-1">Minimum Claim</h3>
                    <input
                      type="number"
                      className="w-full p-2 border rounded mb-2"
                      value={minimum_claim_price}
                      onChange={(e) =>
                        setMinimum_claim_price(Number(e.target.value))
                      }
                      placeholder={selectedId ? minimum_claim_price : 0}
                    />
                  </div>
                </div>
              )}

              {/* Sisa Isi Activity kecuali ctgyID*/}
              {jdl === "activity" && (
                <div>
                  {/* Price */}
                  <div>
                    <h3 className="pb-1">Price</h3>
                    <input
                      type="number"
                      className="w-full p-2 border rounded mb-2"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      placeholder={selectedId ? price : 0}
                    />
                  </div>
                  {/* Price Discount */}
                  <div>
                    <h3 className="pb-1">Discount Price</h3>
                    <input
                      type="number"
                      className="w-full p-2 border rounded mb-2"
                      value={price_discount}
                      onChange={(e) =>
                        setPrice_discount(Number(e.target.value))
                      }
                      placeholder={selectedId ? price_discount : 0}
                    />
                  </div>
                  {/* Rating */}
                  <div>
                    <h3 className="pb-1">Rating</h3>
                    <input
                      type="number"
                      className="w-full p-2 border rounded mb-2"
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      placeholder={selectedId ? rating : 0}
                    />
                  </div>
                  {/* Total Reviews */}
                  <div>
                    <h3 className="pb-1">Total Reviews</h3>
                    <input
                      type="number"
                      className="w-full p-2 border rounded mb-2"
                      value={total_reviews}
                      onChange={(e) => setTotal_reviews(Number(e.target.value))}
                      placeholder={selectedId ? total_reviews : 0}
                    />
                  </div>
                  {/* Fasilitas */}
                  <div>
                    <h3 className="pb-1">Facilities</h3>
                    <input
                      type="text"
                      className="w-full p-2 border rounded mb-2"
                      value={facilities}
                      onChange={(e) => setFacilities(e.target.value)}
                      placeholder={selectedId ? facilities : ""}
                    />
                  </div>
                  {/* Address */}
                  <div>
                    <h3 className="pb-1">Address</h3>
                    <input
                      type="text"
                      className="w-full p-2 border rounded mb-2"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder={selectedId ? address : ""}
                    />
                  </div>
                  {/* Province */}
                  <div>
                    <h3 className="pb-1">Province</h3>
                    <input
                      type="text"
                      className="w-full p-2 border rounded mb-2"
                      value={province}
                      onChange={(e) => setProvince(e.target.value)}
                      placeholder={selectedId ? province : ""}
                    />
                  </div>
                  {/* City */}
                  <div>
                    <h3 className="pb-1">City</h3>
                    <input
                      type="text"
                      className="w-full p-2 border rounded mb-2"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder={selectedId ? city : ""}
                    />
                  </div>
                  {/* Maps */}
                  <div>
                    <h3 className="pb-1">Locations Maps</h3>
                    <input
                      type="text"
                      className="w-full p-2 border rounded mb-2"
                      value={location_maps}
                      onChange={(e) => setLocation_maps(e.target.value)}
                      placeholder={selectedId ? location_maps : ""}
                    />
                  </div>
                </div>
              )}

              {/* Button Cancel and Create/Update */}
              <div className="flex justify-between">
                <button
                  className="bg-gray-100 text-orange-400 hover:text-white px-4 py-2 rounded hover:bg-orange-400"
                  onClick={() => setIsOpenData(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-orange-400 text-white px-4 py-2 rounded hover:bg-orange-600"
                  onClick={() =>
                    selectedId
                      ? handleUpdateBanner(selectedId, jdl)
                      : handleCreateBanner(jdl)
                  }
                >
                  {selectedId ? "Update" : "Create"}
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
