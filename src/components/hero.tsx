"use client";

import { useRouter } from "next/navigation";
import CardHero from "./card";
import Image from "next/image";
import { Showgallery2 } from "../components/ImageGallery";
import { useState, useEffect } from "react";
import CitySearchComponent from "@/components/CitySearchComponent";
import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function Hero() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

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
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-2xl font-extrabold text-center text-primary mb-6 md:py-5">
          ¿Qué necesitas hoy?
        </h3>
        <p className="text-center text-sm text-gray-600 mb-6 md:py-5">
          Elige si necesitas atención inmediata o puedes agendarla.
        </p>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex justify-between space-x-4"
        >
          <motion.button
            variants={fadeInUp}
            className={`flex-1 px-4 py-2 ${
              responses.motivo === "Urgencia"
                ? "bg-primary text-white hover:bg-primary md:py-3 md:rounded-[25px] md:mb-8"
                : "bg-white text-primary hover:bg-gray-100 md:py-3 md:rounded-[25px] md:mb-8"
            } border border-primary font-bold text-sm rounded-2xl transition-colors`}
            onClick={() => handleSelection("motivo", "Urgencia")}
          >
            Urgencia
          </motion.button>
          <motion.button
            variants={fadeInUp}
            className={`flex-1 px-4 py-2 ${
              responses.motivo === "Agendar"
                ? "bg-primary text-white hover:bg-primary md:py-3 md:rounded-[25px] md:mb-8"
                : "bg-white text-primary hover:bg-gray-100 md:py-3 md:rounded-[25px] md:mb-8"
            } border border-primary font-bold text-sm rounded-2xl transition-colors`}
            onClick={() => handleSelection("motivo", "Agendar")}
          >
            Agendar
          </motion.button>
        </motion.div>
      </motion.div>
    ),
    2: (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-2xl font-extrabold text-center text-primary mb-6">
          Selecciona la especialidad que necesitas
        </h3>

        <p className="text-center text-sm text-gray-600 mb-6">
          Estamos contigo en cada área de tu bienestar.
        </p>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col space-y-4"
        >
          {groups.map((group, index) => (
            <motion.button
              key={group.id}
              variants={fadeInUp}
              custom={index}
              className={`w-full px-4 py-2 ${
                responses.servicio === group.id
                  ? "bg-primary text-white hover:bg-primary"
                  : "bg-white text-primary hover:bg-gray-100"
              } border border-primary font-bold text-sm rounded-2xl transition-colors`}
              onClick={() => handleSelection("servicio", group.id)}
            >
              {group.name}
            </motion.button>
          ))}
        </motion.div>
      </motion.div>
    ),
    3: (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-2xl font-extrabold text-center text-primary mb-6">
          Elige tu tipo de consulta
        </h3>
        <p className="text-center text-sm text-gray-600 mb-6">
          ¿Cómo prefieres recibir la atención?
        </p>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col space-y-4"
        >
          <motion.button
            variants={fadeInUp}
            onClick={() => handleSelection("formato", "Presencial")}
            className={`w-full px-4 py-2 ${
              responses.formato === "Presencial"
                ? "bg-primary text-white hover:bg-primary"
                : "bg-white text-primary hover:bg-gray-100"
            } border border-primary font-bold text-sm rounded-2xl transition-colors`}
          >
            Presencial
          </motion.button>
          <motion.button
            variants={fadeInUp}
            onClick={() => {
              handleSelection("formato", "Videollamada");
              handleSelection("type", "videocall");
            }}
            className={`w-full px-4 py-2 ${
              responses.formato === "Videollamada"
                ? "bg-primary text-white hover:bg-primary"
                : "bg-white text-primary hover:bg-gray-100"
            } border border-primary font-bold text-sm rounded-2xl transition-colors`}
          >
            Videollamada
          </motion.button>
          <motion.button
            variants={fadeInUp}
            onClick={() => {
              handleSelection("formato", "Chat");
              handleSelection("type", "chat");
            }}
            className={`w-full px-4 py-2 ${
              responses.formato === "Chat"
                ? "bg-primary text-white hover:bg-primary"
                : "bg-white text-primary hover:bg-gray-100"
            } border border-primary font-bold text-sm rounded-2xl transition-colors`}
          >
            Chat (Consulta rápida)
          </motion.button>
        </motion.div>
      </motion.div>
    ),
    4: (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-2xl font-extrabold text-center text-primary mb-6">
          ¿Cuál es tu sexo?
        </h3>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col space-y-4"
        >
          <motion.button
            variants={fadeInUp}
            onClick={() => handleSelection("sexo", "Hombre")}
            className={`w-full px-4 py-2 ${
              responses.sexo === "Hombre"
                ? "bg-primary text-white hover:bg-primary"
                : "bg-white text-primary hover:bg-gray-100"
            } border border-primary font-bold text-sm rounded-2xl transition-colors`}
          >
            Hombre
          </motion.button>
          <motion.button
            variants={fadeInUp}
            onClick={() => handleSelection("sexo", "Mujer")}
            className={`w-full px-4 py-2 ${
              responses.sexo === "Mujer"
                ? "bg-primary text-white hover:bg-primary"
                : "bg-white text-primary hover:bg-gray-100"
            } border border-primary font-bold text-sm rounded-2xl transition-colors`}
          >
            Mujer
          </motion.button>
          <motion.button
            variants={fadeInUp}
            onClick={() => handleSelection("sexo", "Otro")}
            className={`w-full px-4 py-2 ${
              responses.sexo === "Otro"
                ? "bg-primary text-white hover:bg-primary"
                : "bg-white text-primary hover:bg-gray-100"
            } border border-primary font-bold text-sm rounded-2xl transition-colors`}
          >
            Otro
          </motion.button>
        </motion.div>
      </motion.div>
    ),
    5: (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-2xl font-extrabold text-center text-primary mb-6">
          ¿Cuál es tu ubicación actual?
        </h3>
        <p className="text-center text-sm text-gray-600 mb-6">
          Ingresa la ciudad para encontrar especialistas cercanos.
        </p>
        <CitySearchComponent apiUrl={process.env.NEXT_PUBLIC_API_URL} />
      </motion.div>
    ),
    6: (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-2xl font-extrabold text-center text-primary mb-6">
          ¿Que tipo de cita necesitas?
        </h3>
        <p className="text-center text-sm text-gray-600 mb-6">
          Esta es la opcion de cita presencial disponible.
        </p>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col space-y-4"
        >
          <motion.button
            variants={fadeInUp}
            onClick={() => handleSelection("type", "office")}
            className={`w-full px-4 py-2 ${
              responses.type === "office"
                ? "bg-primary text-white hover:bg-primary"
                : "bg-white text-primary hover:bg-gray-100"
            } border border-primary font-bold text-sm rounded-2xl transition-colors`}
          >
            Ir a consultorio
          </motion.button>
        </motion.div>
      </motion.div>
    ),
  };

  // Add smooth scroll behavior to the page
  useEffect(() => {
    // Set smooth scroll behavior
    document.documentElement.style.scrollBehavior = "smooth";

    return () => {
      document.documentElement.style.scrollBehavior = "";
    };
  }, []);

  return (
    <div className="overflow-hidden">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative bg-gradient-to-b from-white via-[#E8F8FF] to-[#15B5FC] flex items-center py-16 md:py-24"
      >
        <div className="h-full max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="relative h-full flex flex-col">
            <div className="mx-auto w-full px-4 sm:px-6">
              <div className="relative lg:grid lg:grid-cols-12 lg:gap-8 items-center">
                <motion.div
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="sm:text-center lg:text-left lg:col-span-6"
                >
                  <h1 className="text-4xl tracking-tight text-primary font-extrabold sm:text-4xl md:text-6xl">
                    Tu salud conectada en un solo lugar
                  </h1>
                  <p className="mt-7 text-base text-black sm:text-lg md:text-xl">
                    AliviApp te conecta con médicos, psicólogos, terapeutas y
                    servicios especializados para ti y tu familia. Todo desde tu
                    móvil.
                  </p>
                </motion.div>

                <motion.div
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="lg:col-span-6 flex justify-center"
                >
                  <div className="relative w-full max-w-[600px] sm:max-w-[500px] md:max-w-[550px] lg:max-w-[600px]">
                    <div className="relative">
                      <Image
                        src="/images/Heros.png"
                        alt="Hero Image"
                        width={600}
                        height={600}
                        className="w-full h-auto object-contain"
                      />
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      <section className="py-24 md:pt-60 md:pb-60 w-full relative bg-white flex justify-center">
        <div className="md:mt-12 bg-white border-2 border-primary rounded-[25px] shadow-lg absolute top-[-80px] left-1/2 transform -translate-x-1/2 w-[calc(100%-2rem)] max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl p-6 z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            className="w-full"
          >
            <div className="flex items-center justify-center">
              <label className="text-sm font-bold text-primary">
                {currentStep > 1 ? (
                  <>Formulario</>
                ) : (
                  <>Citas con Especialistas</>
                )}
              </label>
            </div>
            <div className="-mx-6 mb-6 mt-4">
              <hr className="border-primary" />
            </div>
            {currentStep > 1 && (
              <div className="absolute top-5 left-4">
                <button
                  onClick={handlePrevStep}
                  className="flex items-center space-x-2 text-primary font-bold hover:text-blue-700 transition-colors "
                >
                  <img src="/icons/arrow-left-icon.png"></img>
                </button>
              </div>
            )}
            <div className="mt-10">{steps[currentStep]}</div>
            <div className="flex justify-between mt-6 ">
              <button
                onClick={handleNextStep}
                disabled={!isStepValid()}
                className="md:py-3 md:w-1/2 md:mx-auto px-4 py-2 bg-primary w-full text-white font-medium text-sm rounded-[25px] transition-colors hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="loading loading-spinner loading-md "></span>
                ) : currentStep === 4 ? (
                  "Finalizar"
                ) : (
                  "Siguiente"
                )}
              </button>
            </div>
          </motion.div>
        </div>
      </section>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
        className="py-20 md:py-24 bg-secondary relative flex flex-col items-center justify-center space-y-8 overflow-hidden"
      >
        <motion.h1
          variants={fadeInUp}
          className="text-4xl font-extrabold text-primary mt-12"
        >
          Tres pilares
        </motion.h1>
        <motion.div
          variants={staggerContainer}
          className="w-full flex flex-wrap justify-center gap-8 px-4"
        >
          <motion.div variants={fadeInUp}>
            <CardHero
              title="Citas y consultas"
              description="Agenda o solicita atención inmediata con profesionales de confianza. Virtual o presencial."
              buttonText="Ingresar"
              imageSrc="/images/card1fix.png"
              reverse={true}
            />
          </motion.div>
          <motion.div variants={fadeInUp}>
            <CardHero
              title="Planes"
              description="Suscríbete a combos de salud con beneficios, como paquetes médicos, psicológicos, odontológicos y más."
              buttonText="Ver Planes"
              imageSrc="/images/card2.png"
              reverse={false}
            />
          </motion.div>
          <motion.div variants={fadeInUp}>
            <CardHero
              title="Servicios Especiales"
              description="Solicita certificados médicos, exámenes laborales y otros servicios personalizados de salud."
              buttonText="Explorar"
              imageSrc="/images/card1fix.png"
              reverse={true}
            />
          </motion.div>
        </motion.div>
      </motion.div>
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeInUp}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="py-20 pb-64 md:pb-80 relative bg-white overflow-hidden"
      >
        <div>
          <h1 className="text-4xl font-extrabold text-primary mx-7">Aliados</h1>
          <div className="flex justify-center items-center my-16 md:justify-start md:pl-20 md:pb-10">
            <div className="transform scale-150">
              <Image
                src="/images/zynovapp.png"
                alt="zynovapp"
                width={400}
                height={72}
                className="w-auto h-auto"
              />
            </div>
          </div>

          <Showgallery2 />
        </div>
      </motion.section>
    </div>
  );
}
