import Authorization from "@/Authorization";
import Button from "@/components/Button";
import Navbar from "@/components/Navbar";
import { useUser } from "@/context/userContext";
import { API_KEY, BASE_URL } from "@/helper/endpoint";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const DetailTransaksi = () => {
  const [detailTransaksi, setDetailTransaksi] = useState([]);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [image, setImage] = useState("");
  const [status, setStatus] = useState("");

  const router = useRouter();
  const token = getCookie("JWT_TOKEN");

  const { user } = useUser();

  const [isTransactionCanceled, setIsTransactionCanceled] = useState(false);

  const [isPayUrl, setIsPayUrl] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile)); // Membuat preview URL
    }
  };

  useEffect(() => {
    if (detailTransaksi?.status) {
      setIsTransactionCanceled(
        ["cancelled", "success", "failed"].includes(detailTransaksi.status)
      );
    }
  }, [detailTransaksi?.status]);

  useEffect(() => {
    if (
      detailTransaksi?.proofPaymentUrl &&
      detailTransaksi?.proofPaymentUrl !== ""
    ) {
      setIsPayUrl("/images/bukti-pembayaran.png");
    }
  }, [detailTransaksi]); // ✅ Tambahkan dependency

  const getDetailTransaksi = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL.API}/api/v1/transaction/${router.query.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            apiKey: API_KEY,
          },
        }
      );
      setDetailTransaksi(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUplodImage = async () => {
    if (!file) {
      Swal.fire({
        icon: "warning",
        title: "Pilih Gambar Terlebih Dahulu!",
        text: "Anda belum memilih gambar untuk diupload.",
        confirmButtonColor: "#FFA500",
      });
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post(
        `${BASE_URL.API}/api/v1/upload-image`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            apiKey: API_KEY,
          },
        }
      );

      setImage(res.data);

      // Tampilkan notifikasi sukses tanpa perlu klik OK
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Gambar telah berhasil diupload.",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1500, // Hilang otomatis dalam 1.5 detik
      });
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Terjadi kesalahan saat mengupload gambar.",
        confirmButtonColor: "#d33",
      });
    }
  };

  const handleTransactionProofPayment = async () => {
    if (!image.url) {
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Upload Bukti Pembayaran Terlebih Dahulu!",
        confirmButtonColor: "#FFA500",
      });
      return;
    }

    try {
      const payload = {
        proofPaymentUrl: image.url,
      };

      const res = await axios.post(
        `${BASE_URL.API}/api/v1/update-transaction-proof-payment/${router.query.id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            apiKey: API_KEY,
          },
        }
      );

      // Notifikasi sukses (tanpa klik OK) dan redirect otomatis
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: res.data.message,
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1500, // Hilang otomatis dalam 1.5 detik
      });

      setTimeout(() => {
        router.push("/user/transaksi"); // Redirect setelah toast sukses hilang
      }, 1500);
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Terjadi kesalahan saat mengunggah bukti pembayaran.",
        confirmButtonColor: "#FFA500",
      });
    }
  };

  const handleCancelTransaction = async () => {
    const result = await Swal.fire({
      title: "Apakah Anda yakin ingin menghapus transaksi?",
      text: "Tindakan ini tidak dapat dibatalkan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#FFA500",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });

    if (result.isConfirmed) {
      try {
        const res = await axios.post(
          `${BASE_URL.API}/api/v1/cancel-transaction/${router.query.id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              apiKey: API_KEY,
            },
          }
        );

        // Langsung redirect tanpa perlu klik OK
        router.push("/user/transaksi");
      } catch (error) {
        console.log(error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Terjadi kesalahan saat menghapus transaksi.",
        });
      }
    }
  };

  const handleUpdateStatus = async () => {
    if (status === "") {
      Swal.fire({
        icon: "warning",
        title: "Peringatan",
        text: "Silakan pilih status terlebih dahulu!",
        confirmButtonColor: "#FFA500",
      });
      return;
    }
    const payload = {
      status: status,
    };
    try {
      const res = await axios.post(
        `${BASE_URL.API}/api/v1/update-transaction-status/${router.query.id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            apiKey: API_KEY,
          },
        }
      );
      console.log(res.data.message);
      Swal.fire({
        icon: "success",
        title: res.data.message,
        timer: 1200,
        confirmButtonColor: "#FFA500",
      }).then(() => {
        router.push("/user");
      });
    } catch (error) {
      console.log("error", error);
      Swal.fire({
        icon: "warning",
        title: "Peringatan!",
        text: "Sudah Terupdate Sebelumnya",
        confirmButtonColor: "#FFA500",
      });
    }
  };

  useEffect(() => {
    if (router.query.id) getDetailTransaksi();
  }, [router.query.id]);

  return (
    <Authorization>
      <Navbar />
      <div className="pt-24 sm:px-20 px-5">
        <h1 className="font-semibold text-2xl text-orange-400">
          Transaction Details
        </h1>
        <div className="flex justify-between pb-3">
          <h3>{detailTransaksi?.invoiceId}</h3>
          <p>{detailTransaksi?.status?.toUpperCase()}</p>
        </div>

        <div className="lg:grid lg:grid-cols-[6.5fr_3.5fr] lg:gap-x-7 flex flex-col gap-y-7">
          {/* Order Item dan Payment Method*/}
          <div className="flex flex-col gap-y-7">
            {/* order item */}
            <div className="h-fit px-5 pt-5 rounded-2xl border-2 shadow-xl border-orange-400">
              <h1 className="pb-5 font-semibold">Order Item</h1>
              {detailTransaksi?.transaction_items?.map((item) => (
                <div
                  className="flex items-end justify-between pb-5"
                  key={item.id}
                >
                  <div className="flex items-center gap-x-3">
                    <div className="w-28 h-28 overflow-hidden rounded-lg">
                      <img
                        src={
                          item.imageUrls.length > 0 && item.imageUrls[0] !== ""
                            ? item.imageUrls[0]
                            : "/images/no-foto.jpg"
                        }
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "/images/no-foto.jpg";
                        }}
                      />
                    </div>
                    <div>
                      <h1 className="font-semibold">{item.title}</h1>
                      <p>
                        {item.description.length > 30
                          ? item.description.slice(0, 30) + "..."
                          : item.description}
                      </p>
                      <p>Quantity: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="sm:flex gap-x-2">
                    <h1 className="line-through">
                      Rp.{" "}
                      {(item.price + item.price_discount).toLocaleString(
                        "id-ID"
                      )}
                    </h1>
                    <h1 className="">
                      Rp. {item.price.toLocaleString("id-ID")}
                    </h1>
                  </div>
                </div>
              ))}
            </div>

            {/* Payment */}
            <div className="p-5 rounded-2xl border-2 shadow-xl border-orange-400">
              <h1 className="pb-5 font-semibold">Payment Method</h1>
              <div className="flex items-center gap-x-5">
                <img
                  src={detailTransaksi?.payment_method?.imageUrl}
                  alt=""
                  className="w-20 h-20"
                />
                <div>
                  <h3 className="font-semibold">
                    {detailTransaksi?.payment_method?.name}
                  </h3>
                  <p className="text-xs">
                    {detailTransaksi?.payment_method?.virtual_account_number}
                  </p>
                  <p className="text-xs">
                    {detailTransaksi?.payment_method?.virtual_account_name}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="p-5 h-fit rounded-2xl border-2 shadow-xl border-orange-400">
              <h1 className="pb-5 font-semibold">Order Summary</h1>
              <div className="flex justify-between pb-3">
                <h3>Total Amount</h3>
                <h3>
                  Rp. {detailTransaksi?.totalAmount?.toLocaleString("id-ID")}
                </h3>
              </div>
              <div className="pb-5">
                <p>Order Date: {detailTransaksi?.orderDate?.slice(0, 10)}</p>
                <p>
                  Expired Date: {detailTransaksi?.expiredDate?.slice(0, 10)}
                </p>
              </div>
              {user && user.role === "user" && (
                <div
                  className={`flex flex-col gap-y-3 ${
                    isTransactionCanceled ? "hidden" : "block"
                  }`}
                >
                  <Button
                    title="Upload Payment Proof"
                    bg="bg-orange-400 w-full hover:bg-orange-600"
                    text="text-white font-semibold"
                    p="py-2"
                    onClick={handleTransactionProofPayment}
                    disabled={isTransactionCanceled}
                  />

                  <Button
                    title="Batalkan Transaksi"
                    bg="bg-white w-full hover:bg-orange-100"
                    text="text-gray-900 font-semibold"
                    p="py-2"
                    onClick={handleCancelTransaction}
                    disabled={isTransactionCanceled}
                  />
                </div>
              )}
              {user && user.role === "admin" && (
                <div className="flex flex-col gap-y-3">
                  <div className="mb-4">
                    <select
                      className="border-2 w-full text-xl px-5 py-2 rounded-lg border-orange-400 bg-white focus:outline-none"
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option disabled selected>
                        Pilih Status
                      </option>
                      <option value="success">Success</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>
                  <Button
                    title="Update Status"
                    bg="bg-orange-400 w-full hover:bg-orange-600"
                    text="text-white font-semibold"
                    p="py-2"
                    onClick={handleUpdateStatus}
                  />
                </div>
              )}
            </div>

            {user && user.role === "user" && (
              <div
                className={`pt-5 ${isTransactionCanceled ? "hidden" : "block"}`}
              >
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                />
                <div className="py-3 ">
                  <button
                    className="bg-orange-400 py-1 px-4 rounded-xl text-white"
                    onClick={handleUplodImage}
                    disabled={isTransactionCanceled}
                  >
                    Upload Bukti Pembayaran
                  </button>
                </div>
              </div>
            )}
            {user && user.role === "user" && (preview || isPayUrl) && (
              <div className="border-2">
                <h1 className="text-center py-2">Bukti Pembayaran</h1>
                <img
                  src={preview || isPayUrl}
                  alt="Belum ada Bukti Pembayaran"
                  className="w-[300px] h-[300px] object-cover mx-auto"
                />
              </div>
            )}

            {user && user.role === "admin" && (
              <div className="pt-5">
                <h1 className="font-bold text-xl pb-2">Bukti Pembayaran</h1>

                <img
                  src={
                    detailTransaksi?.proofPaymentUrl &&
                    "/images/bukti-pembayaran.png"
                  }
                  alt={
                    detailTransaksi?.proofPaymentUrl
                      ? "Ada Bukti Pembayaran"
                      : "Tidak Ada Bukti Pembayaran"
                  }
                  className="w-96 h-96 border-2"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </Authorization>
  );
};

export default DetailTransaksi;
