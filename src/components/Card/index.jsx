import Button from "../Button";
import { IoIosArrowRoundForward } from "react-icons/io";
import Image from "next/image";
import { useState } from "react";

const Card = (props) => {
  const { item, key, title, totalItems, onClick } = props;
  const [imageSrc, setImageSrc] = useState("/images/no-foto.jpg");

  return (
    <div
      key={key}
      className={`mx-4 ${
        totalItems === 2 && !item.price && "sm:flex gap-x-5"
      } mb-5 sm:mb-0`}
    >
      <div className="">
        <Image
          src={imageSrc}
          alt={item.title || item.name}
          width={500}
          height={300}
          className="rounded-lg aspect-[16/9] w-full object-cover object-center h-40 border-2 border-orange-200"
          onError={() => setImageSrc("/images/no-foto.jpg")}
          onLoad={() =>
            setImageSrc(
              item.imageUrl && item.imageUrl !== ""
                ? item.imageUrl
                : item.imageUrls?.[0] && item.imageUrls[0] !== ""
                ? item.imageUrls[0]
                : "/images/no-foto.jpg"
            )
          }
          quality={80}
          priority
        />
      </div>
      <div
        className={`${
          totalItems === 2 && !item.price ? "sm:pt-0 pt-3 sm:w-52" : "pt-3"
        } flex flex-col sm:justify-between h-full`}
      >
        <div>
          <h1 className="font-bold">
            {item.title && item.title.length > 18
              ? item.title.slice(0, 18) + "..."
              : item.title}
            {item.name && item.name}
          </h1>
          {item.price && (
            <div className="flex flex-col xl:flex-row gap-x-3">
              <p className="line-through text-gray-500">
                Rp.{" "}
                {item.price_discount
                  ? (item.price + item.price_discount).toLocaleString("id-ID")
                  : "0"}
              </p>
              <p>Rp. {item.price.toLocaleString("id-ID")}</p>
            </div>
          )}

          {totalItems === 2 && !item.price ? (
            <p>
              {item.description && item.description.length > 15
                ? item.description.slice(0, 15) + "..."
                : item.description}
            </p>
          ) : (
            <p>
              {item.description && item.description.length > 25
                ? item.description.slice(0, 25) + "..."
                : item.description}
            </p>
          )}
        </div>
        {totalItems === 2 && !item.price ? (
          <Button
            title={
              <div className="flex items-center h-10">
                {title} <IoIosArrowRoundForward className="text-3xl" />
              </div>
            }
            text="text-orange-400 hover:text-orange-600"
            onClick={onClick}
          />
        ) : (
          <Button
            title={
              <div className="flex items-center h-10">
                Detail {title} <IoIosArrowRoundForward className="text-3xl" />
              </div>
            }
            text="text-orange-400 hover:text-orange-600"
            onClick={onClick}
          />
        )}
      </div>
    </div>
  );
};

export default Card;
