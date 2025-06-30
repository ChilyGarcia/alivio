"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import NavBar from "@/components/navbar";
import AppointmentModal from "@/components/AppointmentModal";
import ProfesionalProfile from "@/components/ProfessionalProfile";
import "leaflet/dist/leaflet.css";
import { MapWithNoSSR } from "@/components/MapComponents";
import { MapLocation } from "@/components/MapComponents";
import { motion } from "framer-motion";

const DoctorCarousel = () => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [categories, setCategories] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalProfileOpen, setIsModalProfileOpen] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [selectedUserProfessional, setSelectedUserProfessional] = useState();
  const [isOffice, setIsOffice] = useState(false);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  useEffect(() => {
    console.log(locations);
  }, [locations]);

  const formatPrice = (price) => {
    return Number(price)
      .toFixed(2)
      .replace(/\.00$/, "")
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        let group = localStorage.getItem("group");
        let storedData = localStorage.getItem("responses");
        let accessibilityType = "";

        if (storedData) {
          try {
            const parsedData = JSON.parse(storedData);
            if (parsedData.type) {
              accessibilityType = parsedData.type.toLowerCase();
            }
          } catch (error) {
            console.error("Error parsing JSON from localStorage:", error);
          }
        }

        const fetchLocations = async () => {
          try {
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/locations`
            );
            if (!response.ok) {
              throw new Error("Error fetching locations");
            }
            const jsonResponse = await response.json();
            const locationsData = jsonResponse.data.data;

            if (Array.isArray(locationsData)) {
              const formattedLocations = locationsData.map((location) => ({
                latitude: location.latitude,
                longitude: location.longitude,
                popupContent: `<strong>${location.health_professional.description}</strong><br>${location.location}<br>Rating: ${location.health_professional.rating}/5<br>${location.health_professional.reviews} reviews`,
              }));

              setLocations(formattedLocations);
              console.log("Locations:", formattedLocations);
            } else {
              console.error(
                "Error: Expected 'data.data' to be an array, received:",
                locationsData
              );
            }
          } catch (error) {
            console.error("Error fetching locations:", error);
          }
        };

        if (accessibilityType === "office") {
          console.log("Oficina");
          fetchLocations();
          setIsOffice(true);
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/professional-by-group-accesibility?group_ids[]=${group}&accessibility_types[]=${accessibilityType}`
        );
        const data = await response.json();

        if (data.health_professionals) {
          const formattedDoctors = data.health_professionals.map((doctor) => {
            const location = doctor.locations?.[0] || null;

            console.log("Este es el doctor master", doctor);

            return {
              id: doctor.id,
              user_id: doctor.user_id,
              name: doctor.user.name,
              specialty: doctor.specialty.name,
              rating: parseFloat(doctor.rating),
              reviews: doctor.reviews,
              img: doctor.user.profile_image_url || "/images/card1fix.png",
              location: location
                ? location.location
                : "Ubicación no disponible",
              longitude: location ? location.longitude : null,
              latitude: location ? location.latitude : null,
              experience: doctor.description,
              accessibility: doctor.accessibilities.map((acc) => acc.type),
              price: formatPrice(doctor.hourly_rate),
              duration: "45-60 minutos",
            };
          });

          setDoctors(formattedDoctors);
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  useEffect(() => {
    console.log(selectedDoctor);
  }, [selectedDoctor]);

  useEffect(() => {
    const storedData = localStorage.getItem("specialtiesData");
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        const categoryList = parsedData.message;
        setCategories(categoryList);
      } catch (error) {
        console.error("Error parsing localStorage data:", error);
      }
    }

    // Fetch companies data
    const fetchCompanies = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/companies`);
        if (!response.ok) {
          throw new Error("Error fetching companies");
        }
        const data = await response.json();
        setCompanies(data);
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };

    fetchCompanies();
  }, []);

  const handleCompanyClick = (company) => {
    // Toggle selection if clicking the same company
    if (selectedCompany && selectedCompany.id === company.id) {
      setSelectedCompany(null);
      // Fetch the default doctors list when deselecting
      fetchInitialDoctors();
      return;
    }
    
    setSelectedCompany(company);
    setDoctors([]);
    
    const fetchProfessionalsByCompany = async () => {
      try {
        let group = localStorage.getItem("group");
        let storedData = localStorage.getItem("responses");
        let accessibilityType = "";

        if (storedData) {
          try {
            const parsedData = JSON.parse(storedData);
            if (parsedData.type) {
              accessibilityType = parsedData.type.toLowerCase();
            }
          } catch (error) {
            console.error("Error parsing JSON from localStorage:", error);
          }
        }

        // Using the same endpoint as initial load but with company_id parameter
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/professional-by-group-accesibility?group_ids[]=${group}&accessibility_types[]=${accessibilityType}&company_id=${company.id}`
        );
        
        if (!response.ok) {
          throw new Error("Error fetching professionals by company");
        }
        
        const data = await response.json();

        if (data.health_professionals) {
          const formattedDoctors = data.health_professionals.map((doctor) => {
            const location = doctor.locations?.[0] || null;

            return {
              id: doctor.id,
              user_id: doctor.user_id,
              name: doctor.user.name,
              specialty: doctor.specialty.name,
              rating: parseFloat(doctor.rating),
              reviews: doctor.reviews,
              img: doctor.user.profile_image_url || "/images/card1fix.png",
              location: location
                ? location.location
                : "Ubicación no disponible",
              longitude: location ? location.longitude : null,
              latitude: location ? location.latitude : null,
              experience: doctor.description,
              accessibility: doctor.accessibilities.map((acc) => acc.type),
              price: formatPrice(doctor.hourly_rate),
              duration: "30-45 minutos",
            };
          });

          setDoctors(formattedDoctors);
        }
      } catch (error) {
        console.error("Error fetching doctors by company:", error);
      }
    };

    fetchProfessionalsByCompany();
  };

  // Helper function to fetch initial doctors list
  const fetchInitialDoctors = async () => {
    try {
      setDoctors([]);
      let group = localStorage.getItem("group");
      let storedData = localStorage.getItem("responses");
      let accessibilityType = "";

      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          if (parsedData.type) {
            accessibilityType = parsedData.type.toLowerCase();
          }
        } catch (error) {
          console.error("Error parsing JSON from localStorage:", error);
        }
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/professional-by-group-accesibility?group_ids[]=${group}&accessibility_types[]=${accessibilityType}`
      );
      const data = await response.json();

      if (data.health_professionals) {
        const formattedDoctors = data.health_professionals.map((doctor) => {
          const location = doctor.locations?.[0] || null;
          
          return {
            id: doctor.id,
            user_id: doctor.user_id,
            name: doctor.user.name,
            specialty: doctor.specialty.name,
            rating: parseFloat(doctor.rating),
            reviews: doctor.reviews,
            img: doctor.user.profile_image_url || "/images/card1fix.png",
            location: location
              ? location.location
              : "Ubicación no disponible",
            longitude: location ? location.longitude : null,
            latitude: location ? location.latitude : null,
            experience: doctor.description,
            accessibility: doctor.accessibilities.map((acc) => acc.type),
            price: formatPrice(doctor.hourly_rate),
            duration: "45-60 minutos",
          };
        });

        setDoctors(formattedDoctors);
      }
    } catch (error) {
      console.error("Error fetching default doctors list:", error);
    }
  };

  const handleCategoryClick = (category) => {
    // Toggle selection if clicking the same category
    if (selectedCategory && selectedCategory.id === category.id) {
      setSelectedCategory(null);
      // Fetch the default doctors list when deselecting
      fetchInitialDoctors();
      return;
    }
    
    setSelectedCategory(category);
    // Reset company selection when a category is selected
    setSelectedCompany(null);
    setDoctors([]);

    let group = localStorage.getItem("group");
    let storedData = localStorage.getItem("responses");
    let accessibilityType = "";

    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        if (parsedData.type) {
          accessibilityType = parsedData.type.toLowerCase();
        }
      } catch (error) {
        console.error("Error parsing JSON from localStorage:", error);
      }
    }

    const fetchGetProfessionalsByGroupAndSpecialty = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/professional-by-group-and-specialty?group_id=${group}&specialty_id=${category.id}&accessibility_types[]=${accessibilityType}`
        );
        const data = await response.json();

        if (data.health_professionals) {
          const formattedDoctors = data.health_professionals.map((doctor) => {
            const location = doctor.locations?.[0] || null;

            return {
              id: doctor.id,
              user_id: doctor.user_id,
              name: doctor.user.name,
              specialty: doctor.specialty.name,
              rating: parseFloat(doctor.rating),
              reviews: doctor.reviews,
              img: doctor.user.profile_image_url || "/images/card1fix.png",
              location: location
                ? location.location
                : "Ubicación no disponible",
              longitude: location ? location.longitude : null,
              latitude: location ? location.latitude : null,
              experience: doctor.description,
              accessibility: doctor.accessibilities.map((acc) => acc.type),
              price: formatPrice(doctor.hourly_rate),
              duration: "30-45 minutos",
            };
          });

          setDoctors(formattedDoctors);
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchGetProfessionalsByGroupAndSpecialty();
  };

  const handlePerfilProfessional = () => {
    setIsModalProfileOpen(true);
  };

  const handleOpenModal = (doctorId) => {
    setSelectedDoctorId(doctorId.id);

    setSelectedUserProfessional(doctorId.user_id);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white flex justify-center items-center z-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="min-h-screen bg-white"
    >
      <NavBar></NavBar>
      <div className="container mx-auto p-4 mt-12">
        <motion.h1
          variants={fadeInUp}
          className="text-3xl font-bold mb-4 text-blue-800"
        >
          Selecciona los especialistas
        </motion.h1>
        <motion.p
          variants={fadeInUp}
          className="text-sm text-gray-500 mb-6"
        >
          Tu última búsqueda fue{" "}
          <span className="font-semibold text-blue-800">Fisioterapia</span>, hoy
          a las 7:39 pm. Puedes ver tu historial de búsquedas{" "}
          <a href="#" className="text-blue-500 underline">
            aquí
          </a>
          .
        </motion.p>

        <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-6">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              onClick={() => handleCategoryClick(category)}
              className={`px-4 py-2 flex-shrink-0 rounded-full border ${
                selectedCategory?.id === category.id
                  ? "bg-blue-600 text-white"
                  : "bg-white text-blue-600 border-blue-600"
              }`}
            >
              {category.name}
            </motion.button>
          ))}
        </div>

        <h3 className="font-bold text-lg text-blue-800 mb-2">Empresas de salud</h3>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-6">
          {companies.map((company) => (
            <motion.button
              key={company.id}
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              onClick={() => handleCompanyClick(company)}
              className={`px-4 py-2 flex-shrink-0 rounded-full border ${
                selectedCompany?.id === company.id
                  ? "bg-blue-600 text-white"
                  : "bg-white text-blue-600 border-blue-600"
              }`}
            >
              {company.name}
            </motion.button>
          ))}
        </div>

        {isOffice && locations.length > 0 ? (
          <>
            <MapLocation
              markers={locations}
              center={
                locations.length > 0
                  ? [locations[0].latitude, locations[0].longitude]
                  : [0, 0]
              }
            />
          </>
        ) : (
          <></>
        )}

        <Swiper
          spaceBetween={16}
          slidesPerView={1.2}
          navigation={true}
          modules={[Navigation]}
          className="mb-8 mt-8"
        >
          {doctors.length > 0 ? (
            doctors.map((doctor) => (
              <SwiperSlide key={doctor.id}>
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={fadeInUp}
                  className="bg-white rounded-xl p-5  hover:shadow-lg transition-shadow duration-200 flex flex-col h-full w-full max-w-xs border border-primary"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={doctor.img || "/images/card1fix.png"}
                        alt={doctor.name}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-blue-800 leading-tight">
                        {doctor.name}
                      </h3>
                      <p className="text-sm text-blue-600 font-medium">
                        {doctor.specialty}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                    {doctor.experience}
                  </p>

                  <div className="flex items-center mb-4">
                    <div className="text-yellow-500 mr-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className="text-sm">
                          {i < Math.floor(doctor.rating) ? "★" : "☆"}
                        </span>
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">
                      {doctor.reviews} opiniones
                    </span>
                  </div>

                  <button
                    className="mt-auto bg-primary text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition font-medium"
                    onClick={() => setSelectedDoctor(doctor)}
                  >
                    Ver más
                  </button>
                </motion.div>
              </SwiperSlide>
            ))
          ) : (
            <p>No hay doctores disponibles.</p>
          )}
        </Swiper>

        {selectedDoctor && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="bg-white rounded-[24px] p-8 border border-primary max-w-2xl mx-auto"
          >
            <div className="flex items-start gap-6 mb-8">
              <div className="w-32 h-32 rounded-full bg-sky-100 overflow-hidden flex-shrink-0">
                <Image
                  src={selectedDoctor.img || "/placeholder.svg"}
                  alt={selectedDoctor.name}
                  width={128}
                  height={128}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-blue-800 mb-1">
                  {selectedDoctor.name}
                </h2>
                <p className="text-lg text-blue-600 font-medium mb-2">
                  {selectedDoctor.specialty}
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex text-yellow-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className="text-xl">
                        {i < Math.floor(selectedDoctor.rating) ? "★" : "☆"}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="text-gray-600 text-sm">
                  {selectedDoctor.reviews} opiniones
                </span>
              </div>
            </div>

            {selectedDoctor &&
            selectedDoctor.latitude &&
            selectedDoctor.longitude ? (
              <>
                <div className="mb-6">
                  <h3 className="font-bold text-blue-800 mb-2">Consultorio</h3>
                  <div className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-blue-800 mt-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <div>
                      <p className="text-gray-700">{selectedDoctor.location}</p>
                      <p className="text-blue-800 font-medium">
                        {selectedDoctor.clinic}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 h-48 bg-gray-100 rounded-lg overflow-hidden">
                    <MapWithNoSSR
                      markers={{
                        latitude: selectedDoctor.latitude,
                        longitude: selectedDoctor.longitude,
                        popupContent: `${selectedDoctor.name} <br /> ${selectedDoctor.specialty}`,
                      }}
                      center={[
                        selectedDoctor.latitude,
                        selectedDoctor.longitude,
                      ]}
                    />
                  </div>
                </div>
              </>
            ) : (
              <></>
            )}

            <div className="mb-6">
              <h3 className="font-bold text-blue-800 mb-2">Accesibilidad a:</h3>
              <div className="space-y-2">
                {selectedDoctor.accessibility.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    {option === "office" ? (
                      <svg
                        className="w-5 h-5 text-blue-800"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                    ) : option === "videocall" ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-6 text-blue-800"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                        />
                      </svg>
                    ) : option === "chat" ? (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="size-6 text-blue-800"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                          />
                        </svg>
                      </>
                    ) : (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="size-6 text-blue-800"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                          />
                        </svg>
                      </>
                    )}
                    <span className="text-gray-700">
                      {option === "videocall"
                        ? "Videollamada"
                        : option === "chat"
                        ? "Chat"
                        : option === "office"
                        ? "Consultorio"
                        : option === "home"
                        ? "Ir a casa"
                        : option}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-blue-800 font-bold">COP</span>
                <span className="text-gray-700">{selectedDoctor.price}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-blue-800"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-gray-700">{selectedDoctor.duration}</span>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="font-bold text-blue-800 mb-2">Experiencia</h3>
              <p className="text-gray-700 whitespace-pre-line">
                {selectedDoctor.experience}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <button
                className="w-full bg-blue-800 text-white py-3 rounded-full font-medium hover:bg-blue-700 transition"
                onClick={() => handleOpenModal(selectedDoctor)}
              >
                Agendar cita
              </button>
              <button
                className="w-full bg-white text-blue-800 py-3 rounded-full font-medium border-2 border-blue-800 hover:bg-blue-50 transition"
                onClick={handlePerfilProfessional}
              >
                Ver Perfil
              </button>
            </div>

            {isModalOpen && (
              <AppointmentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                doctor={selectedDoctorId}
                selectedUserProfessional={selectedUserProfessional}
              />
            )}
          </motion.div>
        )}
      </div>

      <ProfesionalProfile
        isOpen={isModalProfileOpen}
        onClose={() => setIsModalProfileOpen(false)}
        professional={selectedDoctor}
      />
    </motion.div>
  );
};

export default DoctorCarousel;
