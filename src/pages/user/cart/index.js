import Authorization from "@/Authorization";
import Button from "@/components/Button";
import Navbar from "../../src/components/Navbar";
import { API_KEY, BASE_URL } from "@/helper/endpoint";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [paymentMethods, settPaymentMethods] = useState([]);
  const [selectedCart, setSelectedCart] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("");
  const token = getCookie("JWT_TOKEN");
  const MySwal = withReactContent(Swal);
  const router = useRouter();

  const getCart = async () => {
    try {
      const res = await axios.get(`${BASE_URL.API}/api/v1/carts`, {
        headers: {
          Authorization: `Bearer ${token}`,
          apiKey: API_KEY,
        },
      });
      setCart(res.data.data);
      console.log("cart data:", res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateCart = async (cartId, qty) => {
    try {
      const payload = {
        quantity: qty,
      };
      const res = await axios.post(
        `${BASE_URL.API}/api/v1/update-cart/${cartId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            apiKey: API_KEY,
          },
        }
      );

      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === cartId ? { ...item, quantity: payload.quantity } : item
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteCart = async (cartId) => {
    const result = await MySwal.fire({
      title: "Apakah kamu yakin?",
      text: "Item ini akan dihapus dari keranjang!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f97316",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      const res = await axios.delete(
        `${BASE_URL.API}/api/v1/delete-cart/${cartId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            apiKey: API_KEY,
          },
        }
      );

      setCart((prevCart) => prevCart.filter((item) => item.id !== cartId));

      MySwal.fire({
        title: "Dihapus!",
        text: "Item berhasil dihapus dari keranjang.",
        icon: "success",
        confirmButtonColor: "#f97316",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.log(error);
      MySwal.fire({
        title: "Gagal!",
        text: "Terjadi kesalahan saat menghapus item.",
        icon: "error",
        confirmButtonColor: "#f97316",
      });
    }
  };

  const getPaymentMethods = async () => {
    try {
      const res = await axios.get(`${BASE_URL.API}/api/v1/payment-methods`, {
        headers: {
          apiKey: API_KEY,
        },
      });
      settPaymentMethods(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelectedCart = (cartId) => {
    setSelectedCart((prev) =>
      prev.includes(cartId)
        ? prev.filter((id) => id !== cartId)
        : [...prev, cartId]
    );
  };

  const handleSelectedPayment = (payId) => {
    setSelectedPayment((prev) => (prev === payId ? "" : payId));
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    cart.forEach((item) => handleSelectedCart(item.id, !selectAll));
  };

  const createTransaction = async () => {
    if (selectedCart.length === 0) {
      return MySwal.fire({
        title: "Peringatan!",
        text: "Silakan pilih item di keranjang sebelum melanjutkan.",
        icon: "warning",
        confirmButtonColor: "#f97316",
      });
    }

    if (!selectedPayment) {
      return MySwal.fire({
        title: "Peringatan!",
        text: "Silakan pilih metode pembayaran sebelum melanjutkan.",
        icon: "warning",
        confirmButtonColor: "#f97316",
      });
    }

    try {
      const payload = {
        cartIds: selectedCart,
        paymentMethodId: selectedPayment,
      };

      const res = await axios.post(
        `${BASE_URL.API}/api/v1/create-transaction`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            apiKey: API_KEY,
          },
        }
      );

      MySwal.fire({
        title: "Transaksi Berhasil!",
        text: "Pesanan kamu sedang diproses.",
        icon: "success",
        confirmButtonColor: "#f97316",
        timer: 1150,
        showConfirmButton: false,
      });

      setTimeout(() => {
        router.push("/user/transaksi");
      }, 1500);
    } catch (error) {
      console.log(error);
      MySwal.fire({
        title: "Gagal!",
        text: "Terjadi kesalahan saat memproses transaksi.",
        icon: "error",
        confirmButtonColor: "#f97316",
      });
    }
  };

  const subtotal = cart
    .filter((item) => selectedCart.includes(item.id))
    .reduce((sum, item) => sum + item.activity.price * item.quantity, 0);

  const serviceFee = 0;
  const totalPayment = subtotal + serviceFee;

  useEffect(() => {
    getCart();
  }, [getCart]);

  useEffect(() => {
    getPaymentMethods();
  }, []);

  return (
    <Authorization>
      <Navbar />
      <div className="pt-24 xl:px-20 px-5">
        <div className="flex justify-between">
          <h1 className="font-bold text-3xl text-orange-500">Your Cart</h1>
          <p>{cart.length} item</p>
        </div>
        <div className="flex justify-between">
          <div className="flex items-center gap-x-2">
            <input
              type="checkbox"
              checked={selectAll}
              onChange={handleSelectAll}
            />
            <h1>Select All Items</h1>
          </div>
          <p>{`${selectedCart.length} item(s) selected`}</p>
        </div>
        <div className="xl:flex gap-10 py-5">
          {/* List Cart */}
          <div className="bg-white w-full xl:w-2/3 shadow-lg rounded-lg p-5 border-2 mb-5 xl:mb-0 h-fit">
            <h1 className="text-xl font-bold text-orange-500 mb-4">
              List Cart
            </h1>
            {/* Header hanya muncul di desktop */}
            <div className="hidden lg:grid grid-cols-[1fr_3fr_2fr_2fr_2fr] bg-gray-100 p-3 rounded-md font-semibold text-gray-700">
              <div className="text-center">Select</div>
              <div>Activity</div>
              <div className="text-center">Price</div>
              <div className="text-center">Quantity</div>
              <div className="text-center">Total</div>
            </div>

            {/* content desktop */}
            <div className="lg:block hidden">
              {cart.length > 0 ? (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-[1fr_3fr_2fr_2fr_2fr] items-center border-t border-gray-300 py-3"
                  >
                    <div className="flex justify-center">
                      <input
                        type="checkbox"
                        checked={selectedCart.includes(item.id)}
                        onChange={() => handleSelectedCart(item.id)}
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-24 h-24 overflow-hidden rounded-lg">
                        <img
                          src={
                            item.activity.imageUrls.length > 0 &&
                            item.activity.imageUrls[0] !== ""
                              ? item.activity.imageUrls[0]
                              : "/images/no-foto.jpg"
                          }
                          alt={item.activity.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = "/images/no-foto.jpg";
                          }}
                        />
                      </div>
                      <div>
                        <h1 className="font-semibold">
                          {item.activity.title.length > 15
                            ? item.activity.title.slice(0, 15) + "..."
                            : item.activity.title}
                        </h1>
                        <p className="text-sm text-gray-500">
                          {item.activity.city},
                        </p>
                        <p className="text-sm text-gray-500">
                          {item.activity.province}
                        </p>
                      </div>
                    </div>

                    <div className="text-center">
                      <p className="font-medium">
                        Rp. {item.activity.price.toLocaleString("id-ID")}
                      </p>
                      <p className="line-through text-gray-400 text-sm">
                        Rp.{" "}
                        {(
                          item.activity.price + item.activity.price_discount
                        ).toLocaleString("id-ID")}
                      </p>
                    </div>

                    <div className="flex justify-center gap-2 items-center">
                      <button
                        className="px-2 py-1 bg-gray-200 rounded"
                        onClick={() =>
                          item.quantity > 1 &&
                          handleUpdateCart(item.id, item.quantity - 1)
                        }
                      >
                        -
                      </button>
                      <p className="font-medium">{item.quantity}</p>
                      <button
                        className="px-2 py-1 bg-gray-200 rounded"
                        onClick={() =>
                          handleUpdateCart(item.id, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>

                    <div className="flex justify-between px-5">
                      <p className="font-medium">
                        Rp.{" "}
                        {(item.activity.price * item.quantity).toLocaleString(
                          "id-ID"
                        )}
                      </p>
                      <button
                        onClick={() => handleDeleteCart(item.id)}
                        className="text-gray-500 hover:text-red-600"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-5 ">
                  <p className="text-gray-500">
                    Keranjang belanja Anda kosong. Tambahkan aktivitas untuk
                    melanjutkan.
                  </p>
                  <div className="py-3">
                    <Button
                      title="Lanjut Belanja"
                      bg="bg-orange-400 hover:bg-orange-600"
                      text="text-xl text-white"
                      p="px-8 py-1"
                      onClick={() => router.push("/activity")}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Version (List Style) */}
            <div className="block lg:hidden">
              {cart.length > 0 ? (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col border-t border-gray-300 py-3 space-y-3"
                  >
                    <div className="flex justify-between items-center">
                      <input
                        type="checkbox"
                        checked={selectedCart.includes(item.id)}
                        onChange={() => handleSelectedCart(item.id)}
                      />
                      <button
                        onClick={() => handleDeleteCart(item.id)}
                        className="text-gray-500 hover:text-red-600"
                      >
                        <FaTrash />
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-24 h-24 overflow-hidden rounded-lg">
                        <img
                          src={
                            item.activity.imageUrls.length > 0 &&
                            item.activity.imageUrls[0] !== ""
                              ? item.activity.imageUrls[0]
                              : "/images/no-foto.jpg"
                          }
                          alt={item.activity.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = "/images/no-foto.jpg";
                          }}
                        />
                      </div>
                      <div>
                        <h1 className="font-semibold">
                          {item.activity.title.length > 20
                            ? item.activity.title.slice(0, 20) + "..."
                            : item.activity.title}
                        </h1>
                        <p className="text-sm text-gray-500">
                          {item.activity.city}, {item.activity.province}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-x-2">
                        <p className="font-medium line-through text-gray-500">
                          Rp.{" "}
                          {(
                            item.activity.price + item.activity.price_discount
                          ).toLocaleString("id-ID")}
                        </p>
                        <p className="font-medium">
                          Rp. {item.activity.price.toLocaleString("id-ID")}
                        </p>
                      </div>
                      <div className="flex gap-2 items-center">
                        <button
                          className="px-2 py-1 bg-gray-200 rounded"
                          onClick={() =>
                            item.quantity > 1 &&
                            handleUpdateCart(item.id, item.quantity - 1)
                          }
                        >
                          -
                        </button>
                        <p className="font-medium">{item.quantity}</p>
                        <button
                          className="px-2 py-1 bg-gray-200 rounded"
                          onClick={() =>
                            handleUpdateCart(item.id, item.quantity + 1)
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <p className="text-right font-medium">
                      Total: Rp.{" "}
                      {(item.activity.price * item.quantity).toLocaleString(
                        "id-ID"
                      )}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-5 ">
                  <p className="text-gray-500">
                    Keranjang belanja Anda kosong. Tambahkan aktivitas untuk
                    melanjutkan.
                  </p>
                  <div className="py-3">
                    <Button
                      title="Lanjut Belanja"
                      bg="bg-orange-400 hover:bg-orange-600"
                      text="text-xl text-white"
                      p="px-8 py-1"
                      onClick={() => router.push("/activity")}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white w-full xl:w-1/3 shadow-lg rounded-lg p-5 border-2 h-fit">
            <h1 className="font-bold text-xl text-orange-500">Order Summary</h1>
            <div className="mt-3 space-y-2">
              <div className="flex justify-between">
                <p>Subtotal</p>
                <p>Rp. {subtotal.toLocaleString("id-ID")}</p>
              </div>
              <div className="flex justify-between">
                <p>Service Fee</p>
                <p>Rp. {serviceFee.toLocaleString("id-ID")} (Free)</p>
              </div>
              <div className="flex justify-between font-semibold text-lg">
                <p>Total Pembayaran</p>
                <p>Rp. {totalPayment?.toLocaleString("id-ID")}</p>
              </div>
            </div>

            <h1 className="font-bold text-lg mt-5">Pilih Metode Pembayaran</h1>
            <div className="mt-2 space-y-2">
              {paymentMethods.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-2 border rounded-md cursor-pointer hover:bg-gray-100"
                >
                  <input
                    type="radio"
                    checked={selectedPayment === item.id}
                    onChange={() => handleSelectedPayment(item.id)}
                  />
                  <img src={item.imageUrl} alt={item.name} className="h-8" />
                </div>
              ))}
            </div>

            <Button
              title="Lanjutkan Pembayaran"
              bg="bg-orange-500 w-full hover:bg-orange-600"
              text="text-white"
              p="py-2 mt-4"
              onClick={createTransaction}
            />
          </div>
        </div>
      </div>
    </Authorization>
  );
};

export default CartPage;
