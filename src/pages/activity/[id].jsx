import Navbar from "@/components/Navbar";
import SlideBanners from "@/components/Slides/Banner";
import { API_KEY, BASE_URL } from "@/helper/endpoint";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { IoMdPin } from "react-icons/io";
import { FaStar } from "react-icons/fa";
import { IoIosArrowRoundForward } from "react-icons/io";
import { getCookie } from "cookies-next";
import { LiaLuggageCartSolid } from "react-icons/lia";
import Swal from "sweetalert2";
import Footer from "@/components/Footer";

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

  const handleAddtoCart = async () => {
    const token = getCookie("JWT_TOKEN");

    if (!token) {
      return Swal.fire({
        title: "You need to log in first!",
        showDenyButton: true,
        confirmButtonText: "Yes, log me in",
        denyButtonText: "No",
        customClass: {
          confirmButton:
            "bg-orange-400 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded",
          denyButton:
            "bg-gray-100 text-orange-400 hover:text-white hover:bg-orange-400 font-bold py-2 px-4 rounded",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/login");
        }
      });
    }

    try {
      const result = await Swal.fire({
        title: "Yakin ingin menambahkan ke keranjang belanja?",
        showDenyButton: true,
        confirmButtonText: "Yakin, Tambahkan",
        denyButtonText: "Tidak",
        customClass: {
          confirmButton:
            "bg-orange-400 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded",
          denyButton:
            "bg-gray-100 text-orange-400 hover:text-white hover:bg-orange-400 font-bold py-2 px-4 rounded",
        },
      });

      if (result.isConfirmed) {
        // Jika "Yes", kirim data ke backend
        const payload = {
          activityId: router.query.id,
        };

        await axios.post(`${BASE_URL.API}/api/v1/add-cart`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            apiKey: API_KEY,
          },
        });

        // popup "Sudah ditambahkan"
        Swal.fire({
          title: "Sudah Ditambahkan",
          icon: "success",
          draggable: true,
          timer: 1100,
          customClass: {
            confirmButton:
              "bg-orange-400 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded",
          },
        });
      }
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
        buttonCTA={
          <div className="flex items-center sm:gap-x-2 gap-x-1">
            Add To Cart <LiaLuggageCartSolid className="sm:text-5xl text-2xl" />
          </div>
        }
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
        idCategory={detailActivities?.category?.id}
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
                  Rp.{" "}
                  {(
                    detailActivities?.price + detailActivities?.price_discount
                  )?.toLocaleString("id-ID")}
                </div>
                <div className="">
                  Rp. {detailActivities?.price?.toLocaleString("id-ID")}
                </div>{" "}
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
        onSubmit={handleAddtoCart}
      />

      <div className="sm:px-32 px-5 sm:grid sm:grid-cols-[7fr_3fr] sm:gap-x-5 mt-5 flex flex-col gap-y-5">
        <div className="border-2 p-5 rounded-2xl border-orange-400 shadow-xl">
          <h1 className="font-semibold text-xl text-orange-400">Description</h1>
          <p>{detailActivities?.description}</p>
        </div>
        <div className="border-2 p-5 rounded-2xl border-orange-400 shadow-xl">
          <h1 className="font-semibold text-xl text-orange-400">Facilities</h1>
          <p>
            {detailActivities?.facilities?.includes("<p>") ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: detailActivities.facilities,
                }}
              />
            ) : (
              detailActivities?.facilities
            )}
          </p>
        </div>
      </div>
      <div className="my-5 px-5 sm:px-32 sm:grid sm:grid-cols-[7fr_3fr] sm:gap-x-5 flex flex-col gap-y-5">
        <div className="w-full border-2 p-5 rounded-2xl border-orange-400 shadow-xl">
          <h1 className="font-semibold text-xl text-orange-400 pb-5">
            Peta Location
          </h1>
          <div className="w-full aspect-[16/9] relative">
            {detailActivities.location_maps &&
            detailActivities.location_maps.includes("<iframe") ? (
              <div
                className="absolute inset-0 w-full h-full"
                dangerouslySetInnerHTML={{
                  __html: detailActivities.location_maps
                    .replace(/width=['"]\d+['"]/, "width='100%'")
                    .replace(/height=['"]\d+['"]/, "height='100%'"),
                }}
              />
            ) : (
              <iframe
                src={detailActivities.location_maps}
                className="w-full h-full"
                sandbox="allow-scripts allow-same-origin allow-popups"
                referrerPolicy="no-referrer-when-downgrade"
              />
            )}
          </div>
        </div>
        <div className="border-2 h-fit p-5 rounded-2xl border-orange-400 shadow-xl">
          <h1 className="font-semibold text-xl text-orange-400">Address</h1>
          <p>{detailActivities?.address}</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DetailActivity;
