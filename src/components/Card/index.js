import Button from "../Button";
import { IoIosArrowRoundForward } from "react-icons/io";

const Card = (props) => {
  const { item, key, title, totalItems } = props;
  // console.log(item)
  return (
    <div
      key={key}
      className={`mx-4 ${totalItems < 3 && "sm:flex gap-x-5"} mb-5 sm:mb-0`}
    >
      <div className="">
        <img
          src={item.imageUrl || (item.imageUrls && item.imageUrls[0])}
          alt={item.title}
          className="rounded-lg aspect-[16/9] w-full object-cover object-center h-40 border-2 border-orange-200"
          onError={(e) => {
            e.target.src = "/images/404.png";
            e.target.alt = "Default Image";
          }}
        />
      </div>
      <div
        className={`${
          totalItems < 3 ? "sm:pt-0 pt-3 sm:w-52" : "pt-3"
        } flex flex-col sm:justify-between h-full`}
      >
        <div>
          <h1 className="font-bold">
            {item.title.length > 30
              ? item.title.slice(0, 30) + "..."
              : item.title}
          </h1>
          <div className="flex gap-x-3">
            {item.price && (
              <p className="line-through text-gray-500">
                {item.price.toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </p>
            )}
            {item.price_discount && (
              <p>
                {item.price_discount.toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </p>
            )}
          </div>
          {totalItems < 3 ? (
            <p>
              {item.description.length > 40
                ? item.description.slice(0, 40) + "..."
                : item.description}
            </p>
          ) : (
            <p>
              {item.description.length > 30
                ? item.description.slice(0, 30) + "..."
                : item.description}
            </p>
          )}
        </div>
        {totalItems < 3 ? (
          <Button
            title={
              <div className="flex items-center h-10">
                {title} <IoIosArrowRoundForward className="text-3xl" />
              </div>
            }
            text="text-orange-400 hover:text-orange-600"
          />
        ) : (
          <Button
            title={
              <div className="flex items-center h-10">
                Detail {title} <IoIosArrowRoundForward className="text-3xl" />
              </div>
            }
            text="text-orange-400 hover:text-orange-600"
          />
        )}
      </div>
    </div>
  );
};

export default Card;
