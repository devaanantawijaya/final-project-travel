const { getCookie } = require("cookies-next");
const { useRouter } = require("next/router");
const { useEffect } = require("react");

const Authorization = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    const token = getCookie("JWT_TOKEN");
    if (!token) router.push("/login");
  }, []);

  return children;
};

export default Authorization;
