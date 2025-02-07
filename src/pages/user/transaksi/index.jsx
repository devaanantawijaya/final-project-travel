import Authorization from "@/Authorization";
import Button from "@/components/Button";
import Navbar from "@/components/Navbar";
import { API_KEY, BASE_URL } from "@/helper/endpoint";
import axios from "axios";
import { getCookie } from "cookies-next";
import Link from "next/link";
import { useEffect, useState } from "react";

const TransaksiPage = () => {
  const getToken = getCookie("JWT_TOKEN");
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("pending");
  const itemsPerPage = 5;

  const getMyTransactions = async () => {
    try {
      const res = await axios.get(`${BASE_URL.API}/api/v1/my-transactions`, {
        headers: {
          Authorization: `Bearer ${getToken}`,
          apiKey: API_KEY,
        },
      });
      setTransactions(res.data.data);
    } catch (error) {
      console.log("error:", error);
    }
  };

  useEffect(() => {
    getMyTransactions();
  }, [getMyTransactions]);

  const filteredTransactions = transactions.filter(
    (t) => t.status === filterStatus
  );
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleFilter = (status) => {
    setFilterStatus(status);
    setCurrentPage(1);
  };

  return (
    <Authorization>
      <Navbar />
      <div className="pt-24 md:px-20 px-5">
        <h1 className="text-3xl font-bold text-orange-600 pb-4">
          Transaction History
        </h1>

        {/* Button Filter */}
        <div className="grid sm:rid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 text-center">
          {["pending", "success", "cancelled", "failed"].map((status) => (
            <div
              key={status}
              className={`border-2 py-2 rounded-xl cursor-pointer ${
                filterStatus === status
                  ? "bg-orange-400 text-white"
                  : "bg-slate-100 hover:bg-gray-200"
              }`}
              onClick={() => handleFilter(status)}
            >
              <h2 className="capitalize font-bold">{status}</h2>
              <p className="font-bold">
                {transactions.filter((t) => t.status === status).length}
              </p>
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="py-5 overflow-x-auto">
          <div className="min-w-max">
            <div className="grid grid-cols-6 border-2 text-sm bg-orange-400">
              {[
                "Invoice ID",
                "Status",
                "Amount",
                "PayMethod",
                "Order Date",
                "Expired Date",
              ].map((header, index) => (
                <div
                  key={index}
                  className="py-3 px-3 font-bold whitespace-nowrap text-white"
                >
                  {header}
                </div>
              ))}
            </div>

            {paginatedTransactions.map((item) => (
              <Link href={`/user/transaksi/${item.id}`} key={item.id}>
                <div className="grid grid-cols-6 border-2 text-sm hover:bg-orange-100 cursor-pointer">
                  <div className="py-3 px-3 whitespace-nowrap">
                    {item.invoiceId}
                  </div>
                  <div className="py-3 px-3 capitalize whitespace-nowrap">
                    {item.status}
                  </div>
                  <div className="py-3 px-3 whitespace-nowrap">
                    Rp. {item.totalAmount.toLocaleString("id-ID")}
                  </div>
                  <div className="py-3 px-3 whitespace-nowrap">
                    {item.payment_method.name}
                  </div>
                  <div className="py-3 px-3 whitespace-nowrap">
                    {item.orderDate?.slice(0, 10)}
                  </div>
                  <div className="py-3 px-3 whitespace-nowrap">
                    {item.expiredDate?.slice(0, 10)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-1 space-x-2">
            <Button
              title="Prev"
              text={` hover:text-orange-400 ${
                currentPage === 1 ? `text-gray-500` : `text-black`
              }`}
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            />

            <span className="">
              {currentPage}/{totalPages}
            </span>
            <Button
              title="Next"
              text={` hover:text-orange-400 ${
                currentPage === totalPages ? `text-gray-500` : `text-black`
              }`}
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            />
          </div>
        )}
      </div>
    </Authorization>
  );
};

export default TransaksiPage;
