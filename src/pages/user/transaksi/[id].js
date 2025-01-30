import Navbar from "@/components/Navbar";
import { API_KEY, BASE_URL } from "@/helper/endpoint";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const DetailTransaksi = () => {
  const [detailTransaksi, setDetailTransaksi] = useState([]);

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

  useEffect(() => {
    if (router.query.id) getDetailTransaksi();
  }, [router.query.id]);

  return (
    <div>
      <Navbar />
      <div className="pt-24">ini detail transaction</div>
    </div>
  );
};

export default DetailTransaksi;
