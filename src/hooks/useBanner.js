import { API_KEY, BASE_URL } from "@/helper/endpoint";
import axios from "axios";
import { useState } from "react";

export const useBanners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);

  const getBanners = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL.API}/api/v1/banners`, {
        headers: {
          apiKey: API_KEY,
        },
      });
      setBanners(res.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return { banners, loading, getBanners };
};
