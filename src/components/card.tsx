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
      } items-center bg-white shadow-lg rounded-lg overflow-hidden w-[329px] h-[180px]`}
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

    <div className="flex-1 h-full flex flex-col justify-center items-center text-center p-4">
      <h3 className="text-lg font-extrabold text-[#0C0CAA]">{title}</h3>
      <p className="text-sm text-gray-700">{description}</p>
      <button className="mt-4 bg-[#0C0CAA] text-white py-2 px-6 rounded-full text-sm">
        {buttonText}
      </button>
    </div>
    </div>
  );
}
