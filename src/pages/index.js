// import Image from "next/image";
import Navbar from "@/components/Navbar";
import { useEffect } from "react";
import { usePromos } from "@/hooks/usePromos";
import SlideBanners from "@/components/Slides/Banner";
import CTA from "@/components/CTA";

const HomePage = () => {
  const { promos, LoadingPromos, getPromos } = usePromos();

  useEffect(() => {
    getPromos();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="relative">
        {/* Banner */}
        <SlideBanners />
        {/* CTA */}
        <CTA wordFirst="Mulai" hookCTA="Travel" buttonCTA="Mulai Travel"/>
      </div>
      <div className="px-20 py-10">
        <div className="flex justify-between items-center">
          <h1 className="font-bold text-2xl">Promo</h1>
          <div className="flex gap-2">
            <p>{`<`}</p>
            <p>{`>`}</p>
          </div>
        </div>
        <div>
          {promos.map((promo) => (
            <div key={promo.id}>{promo.title}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
