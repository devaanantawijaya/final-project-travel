const { BASE_URL, API_KEY } = require("@/helper/endpoint");
const { default: axios } = require("axios");
const { getCookie } = require("cookies-next");
const { useState } = require("react");

const useAllUser = () => {
  const [allUser, setAllUser] = useState([]);
  const [loadingAllUser, setLoadingAllUser] = useState(false);
  const token = getCookie("JWT_TOKEN");

  const getAllUser = async () => {
    setLoadingAllUser(true);
    try {
      const res = await axios.get(`${BASE_URL.API}/api/v1/all-user`, {
        headers: {
          Authorization: `Bearer ${token}`,
          apiKey: API_KEY,
        },
      });
      setAllUser(res.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingAllUser(false);
    }
  };

  return { allUser, loadingAllUser, getAllUser };
};

export default useAllUser;
