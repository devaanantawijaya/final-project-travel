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

const HomePage = () => {
  const { banners, loading, getBanners } = useBanners();

  useEffect(() => {
    getBanners();
  }, []);

  function SampleNextArrow(props) {
    const { onClick } = props;
    return (
      <div
        className="absolute right-4 top-1/3 p-1 rounded-full cursor-pointer z-10 text-5xl hover:text-orange-400 text-orange-200"
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
        className="absolute left-4 top-1/3 p-1 rounded-full cursor-pointer z-10 text-5xl hover:text-orange-400 text-orange-200"
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
      <div className="relative h-[600px] overflow-hidden">
        <Slider {...settings}>
          {banners &&
            banners.map((banner) => (
              <div
                className="aspect-[16/9] overflow-hidden w-full"
                key={banner.id}
              >
                <img
                  src={banner.imageUrl}
                  alt={banner.name}
                  className="w-full h-full object-cover object-center"
                />
              </div>
            ))}
        </Slider>
      </div>
    </div>
  );
};

export default HomePage;
