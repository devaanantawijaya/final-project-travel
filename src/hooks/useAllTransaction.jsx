import { API_KEY, BASE_URL } from "@/helper/endpoint";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useState } from "react";

const useAllTransaction = () => {
  const [allTransaction, setAllTransaction] = useState([]);
  const [loadingAllTransaction, setLoadingAllTransaction] = useState(false);
  const token = getCookie("JWT_TOKEN");

  const getAllTransaction = async () => {
    setLoadingAllTransaction(true);
    try {
      const res = await axios.get(`${BASE_URL.API}/api/v1/all-transactions`, {
        headers: {
          Authorization: `Bearer ${token}`,
          apiKey: API_KEY,
        },
      });
      setAllTransaction(res.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingAllTransaction(false);
    }
  };

  return { allTransaction, loadingAllTransaction, getAllTransaction };
};

export default useAllTransaction;
