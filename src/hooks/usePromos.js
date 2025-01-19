import { API_KEY, BASE_URL } from "@/helper/endpoint";
import axios from "axios";
import { useState } from "react";

export const usePromos = () => {
  const [promos, setPromos] = useState([]);
  const [loadingPromos, setLoadingPromos] = useState(false);
  const perPage = 4;

  const getPromos = async (page) => {
    setLoadingPromos(true);
    try {
      const start = (page - 1) * perPage;
      const end = start + perPage;

      const res = await axios.get(`${BASE_URL.API}/api/v1/promos`, {
        headers: {
          apiKey: API_KEY,
        },
      });
      setPromos(res.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingPromos(false);
    }
  };

  return { promos, loadingPromos, getPromos };
};


