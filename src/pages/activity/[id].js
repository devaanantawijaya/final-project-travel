import Navbar from "@/components/Navbar";
import SlideBanners from "@/components/Slides/Banner";
import { API_KEY, BASE_URL } from "@/helper/endpoint";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { IoMdPin } from "react-icons/io";
import { FaStar } from "react-icons/fa";
import { IoIosArrowRoundForward } from "react-icons/io";

const DetailActivity = () => {
  const [detailActivities, setDetailActivities] = useState([]);

  const router = useRouter();

  const getDetailActivities = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL.API}/api/v1/activity/${router.query.id}`,
        {
          headers: {
            apiKey: API_KEY,
          },
        }
      );

      setDetailActivities(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (router.query.id) getDetailActivities();
  }, [router.query.id]);

  return (
    <div>
      <Navbar />
      <SlideBanners
        items={detailActivities.imageUrls}
        wordFirst="Liburan"
        hookCTA={detailActivities.title}
        buttonCTA="Add to Cart"
        title={
          <div className="flex items-center h-10">
            {detailActivities?.category?.name ? (
              <>
                Category {detailActivities.category.name}{" "}
                <IoIosArrowRoundForward className="text-3xl" />
              </>
            ) : (
              "Loading..."
            )}
          </div>
        }
        sentenceCTA={
          <>
            {/* Rating dan Reviews */}
            {detailActivities?.rating && detailActivities?.total_reviews && (
              <div className="flex items-center gap-2 justify-center">
                <div className="flex items-center gap-1">
                  <FaStar className="text-orange-400" />{" "}
                  {detailActivities.rating}
                </div>
                <div className="">{`( ${detailActivities.total_reviews} Reviews )`}</div>
              </div>
            )}

            {/* Harga dan Diskon */}
            {(detailActivities?.price || detailActivities?.price_discount) && (
              <div className="flex items-center justify-center gap-2">
                <div className="line-through opacity-50">
                  {detailActivities.price &&
                    detailActivities.price.toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}
                </div>{" "}
                <div className="">
                  {detailActivities.price_discount &&
                    detailActivities.price_discount.toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}
                </div>
              </div>
            )}

            {/* Lokasi */}
            {(detailActivities?.province || detailActivities?.city) && (
              <div className="flex items-center justify-center gap-2">
                <IoMdPin className="text-orange-400" />{" "}
                {detailActivities.province}, {detailActivities.city}
              </div>
            )}
          </>
        }
      />
    </div>
  );
};

export default DetailActivity;
