import Button from "@/components/Button";
import Navbar from "@/components/Navbar";
import { API_KEY, BASE_URL } from "@/helper/endpoint";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const DetailTransaksi = () => {
  const [detailTransaksi, setDetailTransaksi] = useState([]);
  const [file, setFile] = useState(null);
  const [image, setImage] = useState("");

  const router = useRouter();
  const token = getCookie("JWT_TOKEN");

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
      alert("Pilih Gambar Terlebih Dahulu!");
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
    } catch (error) {
      console.log(error);
    }
  };

  const handleTransactionProofPayment = async () => {
    if (!image.url) {
      alert("Upload Bukti Pembayaran Terlebih Dahulu!");
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
      alert(res.data.message);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancelTransaction = async () => {
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
      alert(res.data.message);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (router.query.id) getDetailTransaksi();
  }, [router.query.id]);

  return (
    <div>
      <Navbar />
      <div className="pt-24 px-20">
        <h1>Transaction Details</h1>
        <div className="flex justify-between pb-3">
          <h3>INVOICE</h3>
          <p>{detailTransaksi?.status?.toUpperCase()}</p>
        </div>

        <div className="grid grid-cols-[6.5fr_3.5fr] gap-x-7">
          {/* Order Item dan Payment Method*/}
          <div className="flex flex-col gap-y-7">
            {/* order item */}
            <div className="bg-slate-100 h-fit px-5 pt-5">
              <h1 className="pb-5 font-semibold">Order Item</h1>
              {detailTransaksi?.transaction_items?.map((item) => (
                <div
                  className="flex items-end justify-between pb-5"
                  key={item.id}
                >
                  <div className="flex items-center gap-x-3">
                    <img
                      src={
                        item.imageUrls[0] !== ""
                          ? item.imageUrls[0]
                          : "/images/404.png"
                      }
                      alt={item.title}
                      className="w-28 h-28"
                    />
                    <div>
                      <h1 className="font-semibold">{item.title}</h1>
                      <p>
                        {item.description.length > 40
                          ? item.description.slice(0, 40) + "..."
                          : item.description}
                      </p>
                      <p>Quantity: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="flex gap-x-2">
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
            <div className="bg-slate-100 p-5">
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
            <div className="bg-slate-300 p-5 h-fit">
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
              <div className="flex flex-col gap-y-3">
                <Button
                  title="Upload Payment Proof"
                  bg="bg-orange-400 w-full hover:bg-orange-600"
                  text="text-white font-semibold"
                  p="py-2"
                  onClick={handleTransactionProofPayment}
                />
                <Button
                  title="Batalkan Transaksi"
                  bg="bg-white w-full hover:bg-orange-100"
                  text="text-gray-900 font-semibold"
                  p="py-2"
                  onClick={handleCancelTransaction}
                />
              </div>
            </div>

            <div className="pt-5">
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                accept="image/*"
              />
              <button onClick={handleUplodImage}>
                Upload Bukti Pembayaran
              </button>
              {image.url && (
                <img
                  src={image.url}
                  alt="Bukti Pembayaran"
                  className="w-96 h-96"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailTransaksi;
