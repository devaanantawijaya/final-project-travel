import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React, { Component, useEffect } from "react";
import Slider from "react-slick";

import Button from "@/components/Button";

import CTA from "@/components/CTA";

const SlideBanners = (props) => {
  const { items, title, wordFirst, hookCTA, sentenceCTA, buttonCTA } = props;

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
      {items && items.length > 1 ? (
        <Slider {...settings}>
          {items.map((item, idx) => (
            <div
              className="sm:aspect-[16/7] overflow-hidden w-full aspect-[1/1] relative"
              key={item.id ? item.id : idx}
            >
              <div className="absolute sm:bottom-10 flex justify-center z-50 sm:right-10">
                <Button title={title} text="hover:text-orange-400 text-white" />
              </div>
              <div className="absolute inset-0 bg-opacity-5 bg-gradient-to-b from-black/50 via-black/80 to-black/50 z-10"></div>
              <img
                src={item.imageUrl ? item.imageUrl : item}
                alt={item.name ? item.name : `banner-image-${idx}`}
                className="w-full h-full object-cover object-center"
                onError={(e) => {
                  e.target.src = "/images/404.png";
                }}
              />
            </div>
          ))}
        </Slider>
      ) : (
        <div className="sm:aspect-[16/7] overflow-hidden w-full aspect-[1/1] relative">
          <div className="absolute sm:bottom-10 bottom-3 right-3 flex justify-center z-50 sm:right-10">
            <Button title={title} text="hover:text-orange-400 text-white" />
          </div>
          <div className="absolute inset-0 bg-opacity-5 bg-gradient-to-b from-black/50 via-black/80 to-black/50 z-0"></div>
          <img
            src={items && (items[0] !== "" ? items[0] : "/images/404.png")}
            alt={`banner-image`}
            className="w-full h-full object-cover object-center"
          />
        </div>
      )}

      <CTA
        wordFirst={wordFirst}
        hookCTA={hookCTA}
        buttonCTA={buttonCTA}
        sentenceCTA={sentenceCTA}
      />
    </div>
  );
};

export default SlideBanners;
