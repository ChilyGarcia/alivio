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
      className={`flex ${
        reverse ? "flex-row-reverse" : "flex-row"
      } items-center bg-white shadow-xl border border-gray-100 rounded-xl overflow-hidden w-[350px] sm:w-[380px] md:w-[400px] h-[230px] hover:shadow-2xl transition-all duration-300`}
    >
      {/* Imagen */}
      <div className="flex-shrink-0 w-1/2 h-full relative">
        <Image
          src={imageSrc}
          alt={title}
          layout="fill"
          objectFit="cover"
          className="rounded-l-lg"
        />
      </div>

    <div className="flex-1 h-full flex flex-col justify-center items-center text-center p-3 sm:p-4">
      <h3 className="text-lg font-extrabold text-[#0C0CAA] mb-2">{title}</h3>
      <p className="text-xs sm:text-sm text-gray-700 overflow-hidden">{description}</p>
      <button className="mt-3 sm:mt-4 bg-[#0C0CAA] text-white py-1.5 sm:py-2 px-6 sm:px-8 rounded-full text-xs sm:text-sm font-medium hover:bg-blue-800 transition-colors">
        {buttonText}
      </button>
    </div>
    </div>
  );
}
