"use client";

import { useRouter } from "next/navigation";
import CardHero from "./card";
import Image from "next/image";
import { Showgallery2 } from "../components/ImageGallery";
import { useState, useEffect } from "react";
import CitySearchComponent from "@/components/CitySearchComponent";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function Hero() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [responses, setResponses] = useState({
    motivo: null,
    servicio: null,
    formato: null,
    type: null,
    sexo: null,
  });
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPresencial, setIsPresencial] = useState(false);

  const fetchGroup = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/get-groups`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setGroups(data);
    } catch (error) {
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
    }
  };

  const fetchSpecialtiesByGroup = async (id) => {
    console.log("El dato que llega al fetch es: ", id);
    setIsLoading(true);

    localStorage.setItem("group", id);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/get-specialties-group/${id}`
      ).finally(() => {
        setIsLoading(false);
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      localStorage.setItem("specialtiesData", JSON.stringify(data));
    } catch (error) {
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
    }
  };

  const handleNextStep = async () => {
    if (!isStepValid()) return;

    const isPresencial = responses.formato === "Presencial";

    if (isPresencial && currentStep < 6) {
      setCurrentStep(currentStep + 1);
    } else if (!isPresencial && currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      console.log("JSON preparado para enviar:", responses);

      try {
        await fetchSpecialtiesByGroup(responses.servicio);

        localStorage.setItem("responses", JSON.stringify(responses));

        router.push("/filter-professionals");
      } catch (error) {
        console.error("Error al obtener las especialidades:", error);
      }
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSelection = (stepKey, value) => {
    setResponses((prev) => ({ ...prev, [stepKey]: value }));
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return responses.motivo !== null;
      case 2:
        return responses.servicio !== null;
      case 3:
        return responses.formato !== null;
      case 4:
        return responses.sexo !== null;
      case 5:
        return true;
      case 6:
        return responses.type !== null;
      default:
        return false;
    }
  };

  useEffect(() => {
    fetchGroup();
  }, []);

  const steps = {
    1: (
      <div>
        <h3 className="text-2xl font-extrabold text-center text-primary mb-6">
          ¿Motivo de su cita?
        </h3>
        <p className="text-center text-sm text-gray-600 mb-6">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod.
        </p>
        <div className="flex justify-between space-x-4">
          <button
            className="flex-1 px-4 py-2 bg-white border border-primary text-primary font-bold text-sm rounded-2xl hover:bg-gray-100 transition-colors"
            onClick={() => handleSelection("motivo", "Urgencia")}
          >
            Urgencia
          </button>
          <button
            className="flex-1 px-4 py-2 bg-white border border-primary text-primary font-bold text-sm rounded-2xl hover:bg-gray-100 transition-colors"
            onClick={() => handleSelection("motivo", "Agendar")}
          >
            Agendar
          </button>
        </div>
      </div>
    ),
    2: (
      <div>
        <h3 className="text-2xl font-extrabold text-center text-primary mb-6">
          ¿Motivo de la cita? Servicio requerido
        </h3>
        <p className="text-center text-sm text-gray-600 mb-6">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>
        <div className="flex flex-col space-y-4">
          {groups.map((group) => (
            <button
              key={group.id}
              className="w-full px-4 py-2 bg-white border border-primary text-primary font-bold text-sm rounded-2xl hover:bg-gray-100 transition-colors"
              onClick={() => handleSelection("servicio", group.id)}
            >
              {group.name}
            </button>
          ))}
        </div>
      </div>
    ),

    3: (
      <div>
        <h3 className="text-2xl font-extrabold text-center text-primary mb-6">
          ¿Qué formato prefieres?
        </h3>
        <p className="text-center text-sm text-gray-600 mb-6">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>
        <div className="flex flex-col space-y-4">
          <button
            onClick={() => handleSelection("formato", "Presencial")}
            className="w-full px-4 py-2 bg-white border border-primary text-primary font-bold text-sm rounded-2xl hover:bg-gray-100 transition-colors"
          >
            Presencial
          </button>
          <button
            onClick={() => {
              handleSelection("formato", "Videollamada");
              handleSelection("type", "videocall");
            }}
            className="w-full px-4 py-2 bg-white border border-primary text-primary font-bold text-sm rounded-2xl hover:bg-gray-100 transition-colors"
          >
            Videollamada
          </button>
          <button
            onClick={() => {
              handleSelection("formato", "Chat");
              handleSelection("type", "chat");
            }}
            className="w-full px-4 py-2 bg-white border border-primary text-primary font-bold text-sm rounded-2xl hover:bg-gray-100 transition-colors"
          >
            Chat (Consulta rápida)
          </button>
        </div>
      </div>
    ),
    4: (
      <div>
        <h3 className="text-2xl font-extrabold text-center text-primary mb-6">
          ¿Cuál es tu sexo?
        </h3>
        <p className="text-center text-sm text-gray-600 mb-6">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>
        <div className="flex flex-col space-y-4">
          <button
            onClick={() => handleSelection("sexo", "Hombre")}
            className="w-full px-4 py-2 bg-white border border-primary text-primary font-bold text-sm rounded-2xl hover:bg-gray-100 transition-colors"
          >
            Hombre
          </button>
          <button
            onClick={() => handleSelection("sexo", "Mujer")}
            className="w-full px-4 py-2 bg-white border border-primary text-primary font-bold text-sm rounded-2xl hover:bg-gray-100 transition-colors"
          >
            Mujer
          </button>
          <button
            onClick={() => handleSelection("sexo", "Otro")}
            className="w-full px-4 py-2 bg-white border border-primary text-primary font-bold text-sm rounded-2xl hover:bg-gray-100 transition-colors"
          >
            Otro
          </button>
        </div>
      </div>
    ),
    5: (
      <div>
        <h3 className="text-2xl font-extrabold text-center text-primary mb-6">
          ¿Cuál es tu ubicación actual?
        </h3>
        <p className="text-center text-sm text-gray-600 mb-6">
          Ingresa la ciudad para encontrar especialistas cercanos.
        </p>
        <CitySearchComponent apiUrl={process.env.NEXT_PUBLIC_API_URL} />
      </div>
    ),

    6: (
      <div>
        <h3 className="text-2xl font-extrabold text-center text-primary mb-6">
          ¿Que tipo de cita necesitas?
        </h3>
        <p className="text-center text-sm text-gray-600 mb-6">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>
        <div className="flex flex-col space-y-4">
          <button
            onClick={() => handleSelection("type", "home")}
            className="w-full px-4 py-2 bg-white border border-primary text-primary font-bold text-sm rounded-2xl hover:bg-gray-100 transition-colors"
          >
            Ir a domicilio
          </button>
          <button
            onClick={() => handleSelection("type", "office")}
            className="w-full px-4 py-2 bg-white border border-primary text-primary font-bold text-sm rounded-2xl hover:bg-gray-100 transition-colors"
          >
            Ir a consultorio
          </button>
        </div>
      </div>
    ),
  };

  return (
    <div className="mt-12">
      <div className="relative bg-gradient-to-b h-screen from-white via-[#E8F8FF] to-[#15B5FC] flex items-center">
        {/* Contenedor principal */}
        <div className="h-full max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="relative h-full flex flex-col">
            {/* Contenido de texto */}
            <div className="mt-5 mx-auto w-full px-4 sm:mt-24 sm:px-6 lg:mt-32">
              <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
                {/* Lado izquierdo */}
                <div className="sm:text-center lg:text-left lg:col-span-6">
                  <h1 className="text-4xl tracking-tight text-primary font-extrabold sm:text-4xl md:text-6xl">
                    Mira nuestros nuevos beneficios para los miembros
                  </h1>
                  <p className="mt-7 text-base text-black sm:text-lg md:text-xl">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Voluptate delectus veritatis perspiciatis, alias mollitia,
                    quaerat numquam aliquam eos provident harum magnam dicta
                    nostrum ipsam similique quibusdam, at neque laboriosam
                    iusto.
                  </p>
                </div>

                {/* Imagen Haeros - Responsiva */}
                <div className="lg:col-span-6 flex justify-center">
                  <div className="relative w-full max-w-[600px] sm:max-w-[500px] md:max-w-[550px] lg:max-w-[600px]">
                    <Image
                      src="/images/Heros.png"
                      alt="Hero Image"
                      width={600}
                      height={600}
                      className="w-full h-auto object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="h-[60vh] w-full relative bg-white flex justify-center">
        <div className="bg-white border-2 border-primary rounded-2xl shadow-lg absolute top-[-55px] left-1/2 transform -translate-x-1/2 w-[calc(100%-2rem)] max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl p-6 z-10">
          <div className="flex items-center justify-center ">
            <label className="text-sm font-bold text-primary">
              {currentStep > 1 ? <>Formulario</> : <>Citas con Especialistas</>}
            </label>
          </div>
          <div className="-mx-6 mb-6 mt-4">
            <hr className="border-primary" />
          </div>
          {currentStep > 1 && (
            <div className="absolute top-5 left-4">
              <button
                onClick={handlePrevStep}
                className="flex items-center space-x-2 text-primary font-bold hover:text-blue-700 transition-colors"
              >
                <img src="/icons/arrow-left-icon.png"></img>
              </button>
            </div>
          )}
          <div className="mt-10">{steps[currentStep]}</div>
          <div className="flex justify-between mt-6">
            <button
              onClick={handleNextStep}
              disabled={!isStepValid()}
              className="px-4 py-2 bg-primary w-full text-white font-medium text-sm rounded-2xl transition-colors hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="loading loading-spinner loading-md"></span>
              ) : currentStep === 4 ? (
                "Finalizar"
              ) : (
                "Siguiente"
              )}
            </button>
          </div>
        </div>
      </section>

      <div className="h-screen bg-secondary relative flex flex-col items-center justify-center space-y-8">
        <h1 className="text-4xl font-extrabold text-primary">Tres pilares</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <CardHero
            title="Agendar Citas"
            description="Programa tu cita con especialistas."
            buttonText="Ingresar"
            imageSrc="/images/card1fix.png"
            reverse={true}
          />
          <CardHero
            title="Planes de Salud"
            description="Planes personalizados para ti."
            buttonText="Ver Planes"
            imageSrc="/images/card2.png"
            reverse={false}
          />
          <CardHero
            title="Servicios Especiales"
            description="Atención médica especializada"
            buttonText="Explorar"
            imageSrc="/images/card1fix.png"
            reverse={true}
          />
        </div>
      </div>

      <section className="h-[170vh] relative bg-white">
        <div>
          <h1 className="text-4xl font-extrabold text-primary mt-20 mx-7">
            Aliados
          </h1>
          <div className="flex justify-center items-center space-x-4 mt-10 mb-10">
            <Image src="/images/IPS.png" alt="IPS" width={154} height={57} />
            <Image
              src="/images/Uronorte.png"
              alt="Uronorte"
              width={154}
              height={28}
            />
          </div>
          <div className="mt-32">
            <div className="relative w-[327px] h-[393px] mx-6">
              <div className="absolute inset-0 w-[327px] h-[300px] bg-blue-200 rounded-2xl"></div>

              <div className="absolute top-[-50px] right-0 w-[180px] h-[393px] bg-blue-200 rounded-2xl"></div>

              <div className="absolute -top-10">
                <Showgallery2></Showgallery2>
              </div>
            </div>

            <div className="absolute bottom-[30px] w-full flex justify-center items-center">
              <div className="shadow-xl">
                <CardHero
                  title="Servicios Especiales"
                  description="Lorem ipsum dolor sit amet."
                  buttonText="Ingresar"
                  imageSrc="/images/card1fix.png"
                  reverse={true}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
