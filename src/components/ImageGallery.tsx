import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { sliderImages1, sliderImages2 } from "../../public/images/sliders";
import { useState } from "react";
import CardHero from "./card";

export default function Showgallery() {
  return (
    <div className="gallery-container relative">
      <ImageGallery
        items={sliderImages1}
        showThumbnails={false}
        showFullscreenButton={false}
        showPlayButton={false}
        showBullets={true}
        showNav={false}
      />
      <style jsx global>{`
        /* Personaliza la posición de los puntos (bullets) */
        .image-gallery-bullets {
          position: absolute;
          top: 80%; /* Ponemos los puntos a la mitad de la imagen */
          left: 50%;
          transform: translateX(-50%);
          z-index: 10;
        }

        /* Ajusta el tamaño y estilo de los puntos */
        .image-gallery-bullet {
          width: 12px;
          height: 12px;
          margin: 0 5px;
          background-color: rgba(
            12,
            12,
            170,
            0.5
          ); /* Puntos inactivos con opacidad */
          border-radius: 50%;
          transition: background-color 0.3s ease; /* Añadimos una transición para cuando el color cambie */
        }

        .image-gallery-bullet.active {
          background-color: #0c0caa !important; /* Punto activo con color sólido */
          border-color: #0c0caa !important; /* Añadimos un borde al punto activo */
        }

        /* Media query para pantallas pequeñas */
        @media (max-width: 768px) {
          /* Mostrar los bullets en pantallas pequeñas */
          .image-gallery-bullets {
            display: block !important;
          }

          /* Mostrar las flechas (arrows) en pantallas pequeñas */
          .image-gallery-prev,
          .image-gallery-next {
            display: none !important;
          }
        }

        /* Media query para pantallas grandes */
        @media (min-width: 769px) {
          /* Ocultar los bullets en pantallas grandes */
          .image-gallery-bullets {
            display: none !important;
          }

          /* Mostrar las flechas (arrows) en pantallas grandes */
          .image-gallery-prev,
          .image-gallery-next {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
}

export function Showgallery2() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const sliderTexts = [
    "¿Eres profesional de la salud?",
    "Regístrate y conecta con miles de pacientes",
    "Sé parte de la app que transformará tu consulta",
  ];

  const sliderDescriptions = [
    "Conecta con nuevos pacientes, gestiona tu agenda y amplía tu consulta en línea o presencial.",
    "Accede fácilmente a especialistas en cualquier momento. Soluciones integrales en salud para toda la familia.",
    "En AliviApp conectamos pacientes con especialistas y empresas del sector salud, de forma segura, rápida y sencilla.",
  ];

  return (
    <div className="gallery-container relative w-[327px] mx-auto">
      {/* Slider */}
      <div className="relative">
        <ImageGallery
          items={sliderImages2}
          showThumbnails={false}
          showFullscreenButton={false}
          showPlayButton={false}
          showBullets={true}
          showNav={false}
          onSlide={(index) => setCurrentSlide(index)}
        />
      </div>

      {/* Texto dinámico */}
      <div className="relative bg-white w-full z-20 px-4 pt-4 pb-16 shadow-lg rounded-b-xl">
        <div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-primary">
            {sliderTexts[currentSlide] || "Texto predeterminado"}
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-black mt-4">
            {sliderDescriptions[currentSlide] || "Descripción predeterminada"}
          </p>

          <button
            onClick={() => console.log("Botón de más información")}
            className="w-full sm:w-1/2 h-[45px] mt-6 px-1 py-3 bg-primary text-white font-medium text-base rounded-3xl hover:bg-blue-700 transition-colors"
          >
            Más información
          </button>
        </div>
      </div>

      <style jsx global>{`
        .gallery-container .image-gallery-bullets {
          position: absolute;
          bottom: 15px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 30;
        }
        .gallery-container .image-gallery-bullet {
          width: 12px;
          height: 12px;
          margin: 0 5px;
          background-color: rgba(12, 12, 170, 0.5);
          border-radius: 50%;
          transition: background-color 0.3s ease;
        }
        .gallery-container .image-gallery-bullet.active {
          background-color: #0c0caa !important;
          border-color: #0c0caa !important;
        }
        .gallery-container .image-gallery,
        .gallery-container .image-gallery-content,
        .gallery-container .image-gallery-slide-wrapper {
          overflow: visible !important;
        }
      `}</style>
    </div>
  );
}
