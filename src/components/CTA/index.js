import Button from "../Button";

const CTA = (props) => {
  const { buttonCTA, wordFirst, hookCTA, sentenceCTA } = props;

  return (
    <div className="absolute top-1/3 right-0 w-full">
      <div className="flex-col flex xl:gap-y-5 gap-y-2 w-full justify-center items-center">
        <h1 className="font-bold xl:text-5xl text-white xl:gap-3 md:text-4xl text-2xl text-center">
          {wordFirst} <span className="text-orange-400">{hookCTA}</span>{" "}
          Sekarang!
        </h1>
        <p className="font-semibold xl:text-xl text-white text-center w-72 sm:w-[800px]">
          {sentenceCTA}
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
