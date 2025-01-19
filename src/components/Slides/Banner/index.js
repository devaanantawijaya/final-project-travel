import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React, { Component, useEffect } from "react";
import Slider from "react-slick";
import { useBanners } from "@/hooks/useBanner";

const SlideBanners = () => {
  const { banners, setLoadingBanners, getBanners } = useBanners();

  useEffect(() => {
    getBanners();
  }, []);

  function SampleNextArrow(props) {
    const { onClick } = props;
    return (
      <div
        className="absolute right-4 top-1/2 p-1 rounded-full cursor-pointer z-10 xl:text-5xl hover:text-orange-400 text-orange-100 md:text-3xl"
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
        className="absolute left-4 top-1/2 p-1 rounded-full cursor-pointer z-10 xl:text-5xl hover:text-orange-400 text-orange-100 md:text-3xl"
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
    <div className="relative">
      <Slider {...settings}>
        {banners &&
          banners.map((banner) => (
            <div
              className="sm:aspect-[16/7] overflow-hidden w-full aspect-[1/1]"
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
  );
};

export default SlideBanners;
