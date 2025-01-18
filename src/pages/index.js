// import Image from "next/image";
import Navbar from "@/components/Navbar";
import { useBanners } from "@/hooks/useBanner";
import { useEffect } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React, { Component } from "react";
import Slider from "react-slick";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import Button from "@/components/Button";

const HomePage = () => {
  const { banners, loading, getBanners } = useBanners();

  useEffect(() => {
    getBanners();
  }, []);

  function SampleNextArrow(props) {
    const { onClick } = props;
    return (
      <div
        className="absolute right-4 xl:top-1/3 top-1/2 p-1 rounded-full cursor-pointer z-10 xl:text-5xl hover:text-orange-400 text-orange-100 md:text-3xl"
        onClick={onClick}
      >
        <IoIosArrowForward />
      </div>
    );
  }

  function SamplePrevArrow(props) {
    const { onClick } = props;
    return (
      <div
        className="absolute left-4 xl:top-1/3 top-1/2 p-1 rounded-full cursor-pointer z-10 xl:text-5xl hover:text-orange-400 text-orange-100 md:text-3xl"
        onClick={onClick}
      >
        <IoIosArrowBack />
      </div>
    );
  }

  const settings = {
    infinite: true,
    speed: 500,
    autoplaySpeed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    cssEase: "linear",
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  return (
    <div>
      <Navbar />
      <div className="relative">
        {/* Banner */}
        <div className="relative xl:h-[600px] overflow-hidden">
          <Slider {...settings}>
            {banners &&
              banners.map((banner) => (
                <div
                  className="aspect-[16/9] overflow-hidden w-full"
                  key={banner.id}
                >
                  <div className="absolute inset-0 bg-black bg-opacity-10"></div>
                  <img
                    src={banner.imageUrl}
                    alt={banner.name}
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              ))}
          </Slider>
        </div>
        {/* CTA */}
        <div className="absolute top-10 left-0 right-0 bottom-0 flex items-center justify-center">
          <div className="text-center grid grid-cols-1 xl:gap-y-5 gap-y-2">
            <div>
              <h1 className="font-bold xl:text-5xl text-white xl:flex xl:gap-3 md:text-4xl">
                Mulai <span className="text-orange-400">Petualanganmu</span>{" "}
                <span className="xl:block hidden">Sekarang!</span>
              </h1>
              <h1 className="font-bold xl:text-5xl text-white xl:hidden block md:text-4xl">
                Sekarang!
              </h1>
            </div>
            <p className="font-semibold xl:text-xl text-white xl:block md:block hidden">
              Klik sekarang untuk mulai dan buat perbedaan di hidup Anda!
            </p>
            <div>
              <Button
                title="Mulai Travel"
                bg="bg-orange-400 hover:bg-orange-600"
                text="text-white xl:text-2xl"
                p="xl:px-10 xl:py-2 rounded-full px-4 py-1"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
