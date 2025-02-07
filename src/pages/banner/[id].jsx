import Button from "@/components/Button";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { API_KEY, BASE_URL } from "@/helper/endpoint";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { MdTravelExplore } from "react-icons/md";

const DetailBanner = () => {
  const router = useRouter();
  const [detailBanner, setDetailBanner] = useState([]);

  const getDetailBanner = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL.API}/api/v1/banner/${router.query.id}`,
        {
          headers: {
            apiKey: API_KEY,
          },
        }
      );
      setDetailBanner(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (router.query.id) getDetailBanner();
  }, [router.query.id]);

  return (
    <div>
      <Navbar />
      <div className="pt-24 lg:px-52 px-10">
        <h1 className="font-bold text-2xl pb-5 text-orange-400">
          {detailBanner.name}
        </h1>
        <h1 className="font-semibold sm:text-4xl pb-10 text-3xl">
          Informasi Jam Check In Hotel dan Check Out yang Wajib Diketahui
        </h1>
        <div className="pb-5">
          <div className="overflow-hidden sm:aspect-[16/7] w-full aspect-[1/1] rounded-3xl border-4 border-orange-400">
            <img
              src={detailBanner.imageUrl}
              alt={detailBanner.name}
              className="w-full h-full object-center object-cover"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.target.src = "/images/no-foto.jpg";
              }}
            />
          </div>
        </div>
        <p className="text-xl pb-10">
          Mengetahui jam check in dan check out hotel merupakan hal penting yang
          perlu diperhatikan saat merencanakan menginap di hotel. Informasi ini
          akan membantu Anda mengatur jadwal perjalanan dengan lebih baik dan
          menghindari biaya tambahan yang tidak diinginkan.
        </p>
        <h2 className="text-2xl font-semibold pb-5 text-orange-400">
          Jam Check In Hotel Standard
        </h2>
        <p className="text-xl pb-10">
          Pada umumnya, waktu check in di hotel adalah pukul 14.00 waktu
          setempat. Namun, hal ini bisa berbeda-beda tergantung kebijakan
          masing-masing hotel. Beberapa hotel menetapkan waktu check in mulai
          pukul 15.00, sementara yang lain bisa lebih awal yaitu pukul 13.00.
        </p>
        <h2 className="text-2xl font-semibold pb-5 text-orange-400">
          Early Check In
        </h2>
        <div className="text-xl pb-10">
          <p>
            Jika Anda berencana tiba lebih awal dari jam check in standard, ada
            beberapa hal yang perlu diketahui:
          </p>
          <ul className="list-disc pl-5">
            <li>
              Hubungi hotel sebelumnya untuk menanyakan kemungkinan early check
              in
            </li>
            <li>
              Beberapa hotel mengenakan biaya tambahan untuk early check in
            </li>
            <li>Ketersediaan early check in tergantung okupansi hotel</li>
            <li>Biasanya early check in dimungkinkan jika kamar sudah siap</li>
          </ul>
        </div>
        <div className="pb-10">
          <h2 className="text-2xl font-semibold pb-5 text-orange-400">
            Tips Penting
          </h2>
          <ul className="list-decimal pl-5 text-xl">
            <li>
              Hubungi hotel sebelumnya untuk menanyakan kemungkinan early check
              in
            </li>
            <li>
              Beberapa hotel mengenakan biaya tambahan untuk early check in
            </li>
            <li>Ketersediaan early check in tergantung okupansi hotel</li>
            <li>Biasanya early check in dimungkinkan jika kamar sudah siap</li>
          </ul>
        </div>
        <h2 className="text-2xl font-semibold pb-5 text-orange-400">
          Konsekuensi Keterlambatan Check Out
        </h2>
        <div className="text-xl pb-10">
          <p>
            Keterlambatan check out tanpa konfirmasi sebelumnya bisa
            mengakibatkan:
          </p>
          <ul className="list-disc pl-5">
            <li>Dikenakan biaya tambahan</li>
            <li>Charge satu malam tambahan</li>
            <li>Mempengaruhi review tamu di sistem hotel</li>
          </ul>
        </div>
        <div className="flex justify-center pb-10">
          <Button
            title={
              <div className="flex items-center sm:gap-x-3 gap-x-1 justify-center">
                Gas Travely <MdTravelExplore className="sm:text-6xl text-4xl" />
              </div>
            }
            bg="bg-orange-400 hover:bg-orange-600 rounded-full"
            p="lg:px-20 lg:py-3 w-full lg:w-fit py-2"
            text="text-white lg:text-5xl text-2xl"
            onClick={() => router.push("/activity")}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DetailBanner;
