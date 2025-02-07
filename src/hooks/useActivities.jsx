import { API_KEY, BASE_URL } from "@/helper/endpoint";
import axios from "axios";
import { useState } from "react";

const useActivities = () => {
  const [activities, setActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(false);

  const getActivities = async () => {
    setLoadingActivities(true);
    try {
      const res = await axios.get(`${BASE_URL.API}/api/v1/activities`, {
        headers: {
          apiKey: API_KEY,
        },
      });
      setActivities(res.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingActivities(false);
    }
  };
  return { activities, setActivities, loadingActivities, getActivities };
};

export default useActivities;
