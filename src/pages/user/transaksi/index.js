import Navbar from "@/components/Navbar";
import { API_KEY, BASE_URL } from "@/helper/endpoint";
import axios from "axios";
import { getCookie } from "cookies-next";
import Link from "next/link";
import { useEffect, useState } from "react";

const TransaksiPage = () => {
  const [transaction, setTransaction] = useState([]);
  const getToken = getCookie("JWT_TOKEN");

  const getMyTransaction = async () => {
    try {
      const res = await axios.get(`${BASE_URL.API}/api/v1/my-transactions`, {
        headers: {
          Authorization: `Bearer ${getToken}`,
          apiKey: API_KEY,
        },
      });
      setTransaction(res.data.data);
    } catch (error) {
      console.log("error:", error);
    }
  };

  useEffect(() => {
    getMyTransaction();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="pt-24 px-20">
        <h1 className="text-2xl font-bold pb-3">Transaction History</h1>
        <div className="grid grid-cols-5 gap-x-2 text-center">
          <div className="border-2 p-2 rounded-xl">
            <h1>Total Transaction</h1>
            <p className="font-bold">2</p>
          </div>
          <div className="border-2 p-2 rounded-xl">
            <h1>Total Amount</h1>
            <p className="font-bold">Rp. 0</p>
          </div>
          <div className="border-2 p-2 rounded-xl">
            <h1>Completed Transactions</h1>
            <p className="font-bold">0</p>
          </div>
          <div className="border-2 p-2 rounded-xl">
            <h1>Pending Transactions</h1>
            <p className="font-bold">0</p>
          </div>
          <div className="border-2 p-2 rounded-xl">
            <h1>Failed Transactions</h1>
            <p className="font-bold">0</p>
          </div>
        </div>
        <div className="py-5">
          {/* Header */}
          <div className="grid grid-cols-[2fr_1fr_1.5fr_1.5fr_2fr_2fr] border-2 text-sm">
            <div>
              <h1 className="py-3 px-3">Invoice ID</h1>
            </div>
            <div>
              <h1 className="py-3 px-3">Status</h1>
            </div>
            <div>
              <h1 className="py-3 px-3">Amount</h1>
            </div>
            <div>
              <h1 className="py-3 px-3">PayMethod</h1>
            </div>
            <div>
              <h1 className="py-3 px-3">Order Date</h1>
            </div>
            <div>
              <h1 className="py-3 px-3">Order Date</h1>
            </div>
          </div>

          {/* Content */}
          {transaction.map((item) => (
            <Link href={`/user/transaksi/${item.id}`} key={item.id}>
              <div className="grid grid-cols-[2fr_1fr_1.5fr_1.5fr_2fr_2fr] border-2 text-sm">
                <div>
                  <h1 className="py-3 px-3">{item.invoiceId}</h1>
                </div>
                <div>
                  <h1 className="py-3 px-3 text-left">{item.status}</h1>
                </div>
                <div>
                  <h1 className="py-3 px-3">
                    Rp. {item.totalAmount.toLocaleString("id-ID")}
                  </h1>
                </div>
                <div>
                  <h1 className="py-3 px-3">{item.payment_method.name}</h1>
                </div>
                <div>
                  <h1 className="py-3 px-3">
                    {item.orderDate && item.orderDate.slice(0, 10)}
                  </h1>
                </div>
                <div>
                  <h1 className="py-3 px-3">
                    {item.expiredDate && item.expiredDate.slice(0, 10)}
                  </h1>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TransaksiPage;
