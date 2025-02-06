import Card from "@/components/Card";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { API_KEY, BASE_URL } from "@/helper/endpoint";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const DetailCategories = () => {
  const [detailCategories, setDetailCategories] = useState([]);

  const router = useRouter();

  const getDetailCategories = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL.API}/api/v1/activities-by-category/${router.query.id}`,
        {
          headers: {
            apiKey: API_KEY,
          },
        }
      );
      setDetailCategories(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  console.log(detailCategories);

  useEffect(() => {
    if (router.query.id) getDetailCategories();
  }, [router.query.id]);

  return (
    <div>
      <Navbar />
      <div className="pt-24 lg:px-52 px-5">
        {/* Banner */}
        <div className="relative">
          {/* Judul */}
          <div className="absolute lg:w-full left-10 bottom-10 w-40">
            <p className="bg-white w-fit px-3 py-1 text-orange-400 font-bold rounded-xl">
              Category
            </p>
            <h1 className="font-bold text-2xl text-orange-400 pt-2">
              {detailCategories[0]?.category?.name.toUpperCase()}
            </h1>
            <p className="py-2 text-white text-xl">
              Daftar travel yang telah dikelompokkan sesuai kategori{" "}
              {detailCategories[0]?.category?.name?.toLowerCase()}.
            </p>
          </div>

          {/* Gambar */}
          <div className="overflow-hidden sm:aspect-[16/7] w-full aspect-[1/1] rounded-3xl border-4 border-orange-400 shadow-xl">
            <img
              src={detailCategories[0]?.category?.imageUrl}
              alt={detailCategories[0]?.category?.name}
              className="w-full h-full object-left object-cover"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.target.src = "/images/no-foto.jpg";
              }}
            />
          </div>
        </div>

        {/* List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 w-full items-start py-10">
          {detailCategories.map((item) => (
            <Card
              key={item.id}
              item={item}
              totalItems={detailCategories.length}
              title="Activity"
              onClick={() => router.push(`/activity/${item.id}`)}
            />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DetailCategories;
