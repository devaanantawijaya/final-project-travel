import { API_KEY, BASE_URL } from "@/helper/endpoint";
import axios from "axios";
import { useState } from "react";

const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const getCategories = async () => {
    setLoadingCategories(true);
    try {
      const res = await axios.get(`${BASE_URL.API}/api/v1/categories`, {
        headers: {
          apiKey: API_KEY,
        },
      });
      setCategories(res.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingCategories(false);
    }
  };

  return { categories, setCategories, loadingCategories, getCategories };
};

export default useCategories;
