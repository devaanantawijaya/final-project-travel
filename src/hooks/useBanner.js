import { API_KEY, BASE_URL } from "@/helper/endpoint";
import axios from "axios";
import { useState } from "react";

export const useBanner = () => {
  const [banner, setBanner] = useState([]);
  const [loading, setLoading] = useState(false);

  const getBanner = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL.API}/api/v1/banners`, {
        headers: {
          apiKey: API_KEY,
        },
      });
      setBanner(res.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return { banner, loading, getBanner };
};
