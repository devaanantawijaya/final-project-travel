import { API_KEY, BASE_URL } from "@/helper/endpoint";
import axios from "axios";
import { useState } from "react";

export const usePromos = () => {
  const [promos, setPromos] = useState([]);
  const [loadingPromos, setLoadingPromos] = useState(false);

  const getPromos = async () => {
    setLoadingPromos(true);
    try {
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

  return { promos, setPromos, loadingPromos, getPromos };
};
