import Authorization from "@/Authorization";
import Button from "@/components/Button";
import Navbar from "@/components/Navbar";
import { API_KEY, BASE_URL } from "@/helper/endpoint";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [paymentMethods, settPaymentMethods] = useState([]);
  const [selectedCart, setSelectedCart] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState("");
  const token = getCookie("JWT_TOKEN");

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
    // Tampilkan pop-up konfirmasi
    const isConfirmed = window.confirm(
      "Apakah kamu yakin ingin menghapus item ini?"
    );

    if (!isConfirmed) {
      return; // Batalkan penghapusan jika pengguna memilih "No"
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
    } catch (error) {
      console.log(error);
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

  const createTransaction = async () => {
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
    } catch (error) {
      console.log(error);
    }
  };

  const subtotal = cart
    .filter((item) => selectedCart.includes(item.id))
    .reduce((sum, item) => sum + item.activity.price * item.quantity, 0);

  const serviceFee = 0;
  const totalPayment = subtotal + serviceFee;

  useEffect(() => {
    getCart();
  }, []);

  useEffect(() => {
    getPaymentMethods();
  }, []);

  return (
    <Authorization>
      <Navbar />
      <div className="pt-28 px-20">
        <div className="flex justify-between">
          <h1>Your Cart</h1>
          <p>0 item</p>
        </div>
        <div className="flex justify-between">
          <h1>Select All Items</h1>
          <p>{`0 item(s) selected`}</p>
        </div>
        <div className="lg:flex gap-10">
          {/* List Cart */}
          <div className="bg-slate-300 w-[70%] h-fit">
            {/* Header */}
            <div className="grid grid-cols-[1fr_3fr_2fr_2fr_2fr]">
              <div>
                <h1 className="py-5 text-center">Select</h1>
              </div>
              <div>
                <h1 className="py-5 text-left">Activity</h1>
              </div>
              <div>
                <h1 className="py-5 text-center">Price</h1>
              </div>
              <div>
                <h1 className="py-5 text-center">Quantity</h1>
              </div>
              <div>
                <h1 className="py-5 text-center">Total</h1>
              </div>
            </div>
            {/* Content */}
            {cart.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-[1fr_3fr_2fr_2fr_2fr] border-t border-gray-400"
              >
                {/* 1. Select */}
                <div className="flex items-center justify-center">
                  <input
                    type="checkbox"
                    onChange={() => handleSelectedCart(item.id)}
                  />
                </div>

                {/* 2. Activity */}
                <div className="flex items-center gap-3 py-3">
                  <div className="overflow-hidden w-28">
                    <img
                      src={item.activity.imageUrls[0]}
                      alt="images"
                      className="aspect-square object-cover"
                    />
                  </div>
                  <div>
                    <h1>{item.activity.title}</h1>
                    <p>
                      {item.activity.city}, {item.activity.province}
                    </p>
                    <p>Added on</p>
                    {/* <p className="text-xs">{item.addedDate}</p> */}
                    {/* <p className="text-xs">{item.addedTime}</p> */}
                  </div>
                </div>

                {/* 3. Price */}
                <div className="flex flex-col items-center justify-center">
                  <p>{`Rp. ${item.activity.price.toLocaleString("id-ID")}`}</p>
                  <p className="line-through">{`Rp. ${item.activity.price_discount.toLocaleString(
                    "id-ID"
                  )}`}</p>
                </div>

                {/* 4. Quantity */}
                <div className="flex items-center justify-center">
                  <div className="flex items-center gap-2">
                    <button
                      className="px-2 py-1 bg-gray-200 rounded"
                      onClick={() => {
                        if (item.quantity > 1) {
                          handleUpdateCart(item.id, item.quantity - 1);
                        }
                      }}
                    >
                      -
                    </button>
                    <p>{item.quantity}</p>
                    <button
                      className="px-2 py-1 bg-gray-200 rounded"
                      onClick={() => {
                        handleUpdateCart(item.id, item.quantity + 1);
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* 5. Total */}
                <div className="flex items-center justify-between px-5">
                  <p>{`Rp. ${(
                    item.activity.price * item.quantity
                  ).toLocaleString("id-ID")}`}</p>
                  <button onClick={() => handleDeleteCart(item.id)}>
                    <FaTrash className="hover:text-red-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          {/* Summary */}
          <div className="bg-slate-400 w-[30%] h-fit">
            {/* Total Harga dan pembayaran*/}
            <div className="px-5 py-5">
              <h1 className="font-bold text-xl">Order Summary</h1>
              <div className="flex justify-between">
                <p>Subtotal</p>
                <p>Rp. {subtotal.toLocaleString("id-ID")}</p>
              </div>
              <div className="flex justify-between">
                <p>Service Fee</p>
                <p>
                  Rp. {serviceFee.toLocaleString("id-ID")} {`(Free)`}
                </p>
              </div>
              <div className="flex justify-between">
                <p>Total Pembayaran</p>
                <p>
                  Rp. {totalPayment && totalPayment.toLocaleString("id-ID")}
                </p>
              </div>
              <h1 className="font-bold text-lg">Pilih Metode Pembayaran</h1>
              {paymentMethods.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <input
                    type="checkbox"
                    checked={selectedPayment === item.id}
                    onChange={() => handleSelectedPayment(item.id)}
                  />
                  <img src={item.imageUrl} alt={item.name} />
                </div>
              ))}
              <div className="flex justify-center">
                <Button
                  title="Lanjutkan Pembayaran"
                  bg="bg-orange-400 w-full hover:bg-orange-600"
                  text="text-white"
                  p="py-1"
                  onClick={createTransaction}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Authorization>
  );
};

export default CartPage;
