import Navbar from "@/components/Navbar";
import SlideBanners from "@/components/Slides/Banner";
import { useBanners } from "@/hooks/useBanner";
import { useEffect } from "react";
import { IoIosArrowRoundForward } from "react-icons/io";
import { BiSolidDiscount } from "react-icons/bi";
import { useRouter } from "next/router";
import useCategories from "@/hooks/useCategories";
import Card from "@/components/Card";
import SlideResponsive from "@/components/Slides/Responsive";
import useActivities from "@/hooks/useActivities";

const ActivityPage = () => {
  const { banners, setLoadingBanners, getBanners } = useBanners();
  const { categories, loadingCategories, getCategories } = useCategories();
  const { activities, loadingActivities, getActivities } = useActivities();

  const router = useRouter();

  useEffect(() => {
    getBanners();
  }, []);

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    getActivities();
  }, []);

  return (
    <div>
      <Navbar />

      <SlideBanners
        items={banners}
        title={
          <div className="flex items-center h-10">
            View More <IoIosArrowRoundForward className="text-3xl" />
          </div>
        }
        wordFirst="Dapatkan"
        hookCTA="Promo-nya"
        sentenceCTA="Klik sekarang untuk dapatkan promo travel yang berlimpah dibawah ini!"
        buttonCTA={
          <div className="flex items-center sm:gap-x-2 gap-x-1">
            Ambil Promo <BiSolidDiscount className="sm:text-4xl text-3xl" />
          </div>
        }
        onSubmit={() => router.push("/#promo")}
      />

      <SlideResponsive id="travel" title="Category" items={categories} />

      <div className="px-16 pt-10">
        <h1 className="px-4 font-bold text-2xl pb-5">All Activity Tour</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full items-start">
          {activities.map((item) => (
            <Card
              key={item.id}
              item={item}
              totalItems={activities.length}
              title="Activity"
              onClick={() => router.push(`/activity/${item.id}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivityPage;
