import React, { useRef } from "react";
import Slider from "react-slick";
import { IoIosArrowDropright } from "react-icons/io";
import { IoIosArrowDropleft } from "react-icons/io";
import Card from "@/components/Card";
import { useRouter } from "next/router";

const SlideResponsive = (props) => {
  const { title, items, extraTitle, id } = props;

  const sliderRef = useRef(null);

  const router = useRouter();

  const settings = {
    centerMode: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    initialSlide: 0,
    autoplay: true,
    cssEase: "linear",
    nextArrow: null,
    prevArrow: null,

    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="xl:pt-10 pt-5">
      <div className="flex justify-between items-center xl:px-20 px-5">
        <div className="flex items-end pb-5 gap-x-3">
          <h1 id={id} className="font-bold text-2xl">
            {title}
          </h1>
          {extraTitle && <p>{extraTitle}</p>}
        </div>
        <div className="flex">
          <p
            onClick={() => sliderRef.current.slickPrev()}
            className="cursor-pointer text-orange-400 hover:bg-orange-400 text-2xl hover:text-white hover:rounded-full"
          >
            <IoIosArrowDropleft />
          </p>
          <p
            onClick={() => sliderRef.current.slickNext()}
            className="cursor-pointer text-orange-400 hover:bg-orange-400 text-2xl hover:text-white hover:rounded-full"
          >
            <IoIosArrowDropright />
          </p>
        </div>
      </div>
      <div className="">
        <div className="w-full overflow-hidden">
          <Slider {...settings} ref={sliderRef}>
            {items.map((item) => (
              <Card
                item={item}
                key={item.id}
                title={title}
                onClick={() =>
                  router.push(`/${title.toLowerCase()}/${item.id}`)
                }
              />
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default SlideResponsive;
