import Button from "../Button";

const CTA = (props) => {
  const { buttonCTA, wordFirst, hookCTA } = props;

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-center grid grid-cols-1 xl:gap-y-5 gap-y-2 w-72 sm:w-full">
        <h1 className="font-bold xl:text-5xl text-white xl:gap-3 md:text-4xl text-2xl">
          {wordFirst} <span className="text-orange-400">{hookCTA}</span>{" "}
          Sekarang!
        </h1>
        <p className="font-semibold xl:text-xl text-white xl:block">
          Klik sekarang untuk mulai dan buat perbedaan di hidup Anda!
        </p>
        <div>
          <Button
            title={buttonCTA}
            bg="bg-orange-400 hover:bg-orange-600"
            text="text-white xl:text-2xl"
            p="xl:px-10 xl:py-2 rounded-full px-4 py-1"
          />
        </div>
      </div>
    </div>
  );
};

export default CTA;
