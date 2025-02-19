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
                showThumbnails={false} // Desactiva las miniaturas
                showFullscreenButton={false} // Desactiva el botón de fullscreen
                showPlayButton={false} // Desactiva el botón de reproducción
                showBullets={true} // Asegúrate de que los puntos (bullets) estén habilitados
                showNav={false} // Desactiva las flechas de navegación por defecto
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
                    background-color: rgba(12, 12, 170, 0.5); /* Puntos inactivos con opacidad */
                    border-radius: 50%;
                    transition: background-color 0.3s ease; /* Añadimos una transición para cuando el color cambie */
                }

                .image-gallery-bullet.active {
                    background-color: #0C0CAA !important; /* Punto activo con color sólido */
                    border-color: #0C0CAA !important; /* Añadimos un borde al punto activo */
                }

                /* Media query para pantallas pequeñas */
                @media (max-width: 768px) {
                    /* Mostrar los bullets en pantallas pequeñas */
                    .image-gallery-bullets {
                        display: block !important;
                    }

                    /* Mostrar las flechas (arrows) en pantallas pequeñas */
                    .image-gallery-prev, .image-gallery-next {
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
                    .image-gallery-prev, .image-gallery-next {
                        display: block !important;
                    }
                }
            `}</style>
        </div>
    );
}

export function Showgallery2() //esta funcion renderiza el slider con texto y boton//
{
    const [currentSlide, setCurrentSlide] = useState(0);

    const sliderTexts = [
        "¿Quieres formar parte de nuestra familia?",
        "Regístrate y conecta con miles de pacientes",
        "Sé parte de la app que transformará tu consulta",
    ];

    return (
        <div className="gallery-container relative">
            {/* Slider */}
            <ImageGallery
                items={sliderImages2}
                showThumbnails={false}
                showFullscreenButton={false}
                showPlayButton={false}
                showBullets={true}
                showNav={false}
                onSlide={(index) => setCurrentSlide(index)}
            />

            {/* Texto dinámico */}
            <div className="absolute bg-white w-full">
                <div className="mt-4">
                    <h2 className="text-4xl font-extrabold mt-12 text-primary">
                        {sliderTexts[currentSlide] || "Texto predeterminado"}
                    </h2>

                    <p className="text-lg text-black mt-8">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </p>

                    <button
                        onClick={() => console.log("Botón de más información")}
                        className="w-1/2 h-[45px] mt-8 px-1 py-3 bg-primary text-white font-medium text-base rounded-3xl hover:bg-blue-700 transition-colors"
                    >
                        Más información
                    </button>
                </div>
            </div>

            <style jsx global>{`
                .image-gallery-bullets {
                    position: absolute;
                    bottom: 50px; /* Ajusta para colocar debajo del botón */
                    left: 50%;
                    transform: translateX(-50%);
                    z-index: 10;
                }
                .image-gallery-bullet {
                    width: 12px;
                    height: 12px;
                    margin: 0 5px;
                    background-color: rgba(12, 12, 170, 0.5);
                    border-radius: 50%;
                    transition: background-color 0.3s ease;
                }
                .image-gallery-bullet.active {
                    background-color: #0C0CAA !important;
                    border-color: #0C0CAA !important;
                }
            `}</style>
        </div>
    );
}

