import { CardProps } from "@/interfaces/card.interfaces";
import Image from "next/image";

export default function CardHero({
  title,
  description,
  buttonText,
  imageSrc,
  reverse = false,
}: CardProps) {
  return (
    <div
      className={`flex ${reverse ? "md:flex-col" : "md:flex-col"} ${
        reverse ? "flex-row-reverse" : "flex-row"
      } items-center bg-white shadow-xl border border-gray-100 rounded-xl overflow-hidden w-[350px] sm:w-[380px] h-[230px] md:w-[300px] md:h-[400px] hover:shadow-2xl transition-all duration-300`}
    >
      <div className="md:hidden flex-shrink-0 w-1/2 h-full relative">
        <Image
          src={imageSrc}
          alt={title}
          fill
          className={`${
            reverse ? "rounded-r-lg" : "rounded-l-lg"
          } object-cover`}
        />
      </div>

      <div className="flex-1 h-full flex flex-col justify-center items-center text-center p-3 sm:p-4 md:p-6">
        <h3 className="text-lg font-extrabold text-[#0C0CAA] mb-2 md:mb-3">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-gray-700 overflow-hidden md:mb-4">
          {description}
        </p>
        <button className="mt-3 sm:mt-4 bg-[#0C0CAA] text-white py-1.5 sm:py-2 px-6 sm:px-8 rounded-full text-xs sm:text-sm font-medium hover:bg-blue-800 transition-colors md:ml-2 md:self-start">
          {buttonText}
        </button>
      </div>

      <div className="hidden md:flex flex-1 items-center justify-center p-4 w-full">
        <div className="relative w-full h-full">
          <Image
            src={imageSrc}
            alt={title}
            fill
            className="object-contain mx-auto"
          />
        </div>
      </div>
    </div>
  );
}
