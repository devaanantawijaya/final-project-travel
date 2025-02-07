import Button from "@/components/Button";
import Footer from "@/components/Footer";
import Navbar from "../../src/components/Navbar";
import { API_KEY, BASE_URL } from "@/helper/endpoint";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { MdTravelExplore } from "react-icons/md";

const DetailPromo = () => {
  const [detailPromo, setDetailPromo] = useState([]);

  const router = useRouter();

  const getDetailPromo = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL.API}/api/v1/promo/${router.query.id}`,
        {
          headers: {
            apiKey: API_KEY,
          },
        }
      );
      setDetailPromo(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (router.query.id) getDetailPromo();
  }, [router.query.id, getDetailPromo]);

  return (
    <div>
      <Navbar />
      <div className="pt-24 lg:px-52 px-10">
        <h1 className="font-semibold sm:text-4xl sm:pb-10 text-3xl text-orange-400 pb-5">
          Nikmatin Promo {detailPromo.title}
        </h1>
        <div className="sm:pb-10 pb-5">
          <div className="overflow-hidden sm:aspect-[16/7] w-full aspect-[1/1] rounded-3xl border-4 border-orange-400 shadow-xl">
            <img
              src={detailPromo.imageUrl}
              alt={detailPromo.title}
              className="w-full h-full object-left object-cover"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.target.src = "/images/no-foto.jpg";
              }}
            />
          </div>
        </div>
        <div className="sm:grid sm:grid-cols-[7fr_3fr] sm:gap-x-10 sm:pb-10 flex flex-col gap-y-5 pb-5">
          <div className="border-2 p-5 rounded-3xl border-orange-400 shadow-xl">
            <h2 className="text-xl font-semibold pb-3 text-orange-400">
              Deskripsi Promo
            </h2>
            <p>{detailPromo.description}</p>
          </div>
          <div className="border-2 p-5 rounded-3xl flex flex-col justify-center text-center bg-orange-400 shadow-xl">
            <h2 className="font-bold text-xl text-white">Kode Promo</h2>
            <div className="bg-orange-200 rounded-xl py-3 my-3">
              <h2 className="text-2xl font-bold">{detailPromo.promo_code}</h2>
            </div>
          </div>
        </div>
        <div className="sm:grid sm:grid-cols-2 bg-orange-400 rounded-2xl p-5 gap-x-5 sm:mb-10 flex flex-col gap-y-5 mb-5 shadow-xl">
          <div className="">
            <h2 className="text-xl font-bold pb-3 text-white">Harga Diskon</h2>
            <div className="p-3 rounded-xl bg-orange-200">
              <p className="text-2xl font-bold ">
                Rp. {detailPromo?.promo_discount_price?.toLocaleString("id-ID")}
              </p>
            </div>
          </div>
          <div className="">
            <h2 className="text-xl font-bold pb-3 text-white">
              Minimum Transaksi
            </h2>
            <div className="bg-orange-200 p-3 rounded-xl ">
              <p className="text-2xl font-bold">
                Rp. {detailPromo?.minimum_claim_price?.toLocaleString("id-ID")}
              </p>
            </div>
          </div>
        </div>
        <div className="border-2 p-5 sm:mb-10 mb-5 rounded-2xl border-orange-400 shadow-xl">
          <h1 className="font-bold text-xl pb-3 text-orange-400">
            Syarat dan Ketentuan
          </h1>
          <div className="text-xl">
            {detailPromo?.terms_condition?.includes("<p>") ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: detailPromo.terms_condition,
                }}
              />
            ) : (
              <p>{detailPromo?.terms_condition}</p>
            )}
          </div>
        </div>
        <div className="flex justify-center pb-10 shadow-xl">
          <Button
            title={
              <div className="flex items-center sm:gap-x-3 gap-x-1 justify-center">
                Gas Travely <MdTravelExplore className="sm:text-6xl text-4xl" />
              </div>
            }
            bg="bg-orange-400 hover:bg-orange-600 rounded-full"
            p="lg:px-20 lg:py-3 w-full lg:w-fit py-2"
            text="text-white lg:text-5xl text-2xl"
            onClick={() => {
              router.push("/activity#travel");
              setTimeout(() => {
                document
                  .getElementById("travel")
                  ?.scrollIntoView({ behavior: "smooth" });
              }, 500);
            }}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DetailPromo;
