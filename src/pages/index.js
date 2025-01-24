// import Image from "next/image";
import Navbar from "@/components/Navbar";
import { useEffect } from "react";
import { usePromos } from "@/hooks/usePromos";
import SlideBanners from "@/components/Slides/Banner";
import CTA from "@/components/CTA";
import SlideResponsive from "@/components/Slides/Responsive";
import useActivities from "@/hooks/useActivities";
import Button from "@/components/Button";
import Card from "@/components/Card";
import { apiBenefit } from "./api/apiBenefit";

const HomePage = () => {
  const { promos, LoadingPromos, getPromos } = usePromos();
  const { activities, loadingActivities, getActivities } = useActivities();

  useEffect(() => {
    getPromos();
  }, []);

  useEffect(() => {
    getActivities();
  }, []);

  // console.log(apiBenefit.length);

  return (
    <div>
      <Navbar />
      <div className="relative">
        {/* Banner */}
        <SlideBanners />
        {/* CTA */}
        <CTA wordFirst="Mulai" hookCTA="Travel" buttonCTA="Mulai Travel" />
      </div>
      <SlideResponsive title="Promo" items={promos} />
      <SlideResponsive
        title="Activity"
        items={activities}
        extraTitle={
          <Button
            title="All View"
            text="text-orange-400 hover:text-orange-600 font-semibold"
          />
        }
      />
      <div className="xl:pt-10 pt-5">
        <h1 className="font-bold text-2xl xl:px-20 px-4">
          Kenapa harus di Travely?
        </h1>
        <div className="sm:flex xl:px-16 pt-5">
          {apiBenefit.map((item) => (
            <Card
              key={item.id}
              item={item}
              totalItems={apiBenefit.length}
              title={item.type === "promo" ? "Cek Promo" : "Gas Travel"}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
