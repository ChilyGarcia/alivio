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
      } items-center bg-white shadow-xl border border-gray-100 rounded-xl overflow-hidden w-[350px] sm:w-[380px] h-[230px] md:w-[300px] md:h-[400px] hover:shadow-2xl transition-all duration-300 relative`}
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

      <div className="flex-1 h-full flex flex-col justify-start items-center text-center p-3 sm:p-4 md:px-6 md:pt-6 md:pb-2">
        <h3 className="text-lg font-extrabold text-[#0C0CAA] mb-2 md:mb-3">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-gray-700 overflow-hidden md:pb-1">
          {description}
        </p>
      </div>

      <div className="hidden md:flex absolute bottom-0 right-0 w-3/4 h-3/4 p-0 overflow-visible">
        <div className="relative w-full h-full">
          <Image
            src={imageSrc}
            alt={title}
            fill
            className="object-contain object-right-bottom"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </div>
    </div>
  );
}
