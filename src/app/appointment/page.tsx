"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, Phone, Clock, Calendar, User2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { backendService } from "@/services/backend.service";
import { Specialty } from "@/interfaces/specialty.interface";
import { Professional } from "@/interfaces/professional.interface";
import { useRouter } from "next/navigation";
import { X, ChevronRight } from "lucide-react";

export default function Appointment() {
  const [formData, setFormData] = useState({
    specialty: "",
    date: "",
    startTime: "",
    endTime: "",
  });

  const [formDataAppointment, setFormDataAppointment] = useState({
    health_professional_id: 0,
    date: "2023-10-01",
    start_time: "00:00",
    end_time: "01:00",
  });

  const [selectedProfessional, setSelectedProfessional] =
    useState<Professional | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isProfessionalDetailsOpen, setIsProfessionalDetailsOpen] =
    useState(false);
  const [filteredProfessionals, setFilteredProfessionals] = useState([]);
  const [specialties, setSpecialties] = useState([]);

  const sliderRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const scrollAmount = 350;
      const newScrollPosition =
        sliderRef.current.scrollLeft +
        (direction === "left" ? -scrollAmount : scrollAmount);
      sliderRef.current.scrollTo({
        left: newScrollPosition,
        behavior: "smooth",
      });
    }
  };

  const router = useRouter();

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const response = await backendService.professionalList();
        setSpecialties(response);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSpecialties();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const body = {
      specialty_id: formData.specialty,
      date: formData.date,
      start_time: formData.startTime,
      end_time: formData.endTime,
    };

    const fetchFilterProfessional = async () => {
      try {
        const response = await backendService.filteredProfessionals(body);
        setFilteredProfessionals(response);
      } catch (error) {
        console.error(error);
      }
    };

    fetchFilterProfessional();
    setIsDialogOpen(true);
  };

  const handleProfessionalSelect = (professional: Professional) => {
    console.log("Este es el profesional seleccionado:", professional);

    if (professional) {
      setFormDataAppointment((prevState) => ({
        ...prevState,
        health_professional_id: professional.id,
        date: formData.date,
        start_time: formData.startTime,
        end_time: formData.endTime,
      }));
    }

    const bodyAppointment = {
      health_professional_id: professional.id,
      date: formData.date,
      start_time: formData.startTime,
      end_time: formData.endTime,
    };

    const fetchAppointmentData = async (data) => {
      try {
        const response = await backendService.appointment(data);
        setFilteredProfessionals(response);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAppointmentData(bodyAppointment);

    setSelectedProfessional(professional);
    setIsDialogOpen(false);
    setIsProfessionalDetailsOpen(false);

    router.push("/my-appointments");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors duration-200 mb-8 group"
        >
          <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="font-medium">Volver a la página principal</span>
        </Link>

        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Agendar Cita
          </h2>
          <p className="text-lg text-gray-600">
            Complete el formulario para programar su cita con un profesional de
            la salud
          </p>
        </div>

        <div className="max-w-xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 backdrop-blur-lg bg-opacity-90">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="specialty"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Especialidad
                </label>
                <select
                  id="specialty"
                  name="specialty"
                  value={formData.specialty}
                  onChange={handleChange}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
                  required
                >
                  <option value="">Seleccione una especialidad</option>
                  {(specialties || []).map((specialty: Specialty) => (
                    <option key={specialty.id} value={specialty.id}>
                      {specialty.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="date"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Fecha
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="startTime"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Hora de inicio
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="time"
                      id="startTime"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="endTime"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Hora de finalización
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="time"
                      id="endTime"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-[1.02]"
              >
                Buscar disponibilidad
              </button>
            </form>
          </div>

          <div className="mt-8 bg-white rounded-2xl shadow-xl p-8 backdrop-blur-lg bg-opacity-90">
            <div className="flex items-center space-x-4 mb-6">
              <div className="p-3 bg-blue-100 rounded-full">
                <Phone className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  ¿Necesita ayuda?
                </h3>
                <p className="text-gray-600">
                  Contáctenos si tiene alguna pregunta sobre el proceso de
                  programación
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <User2 className="h-6 w-6 text-blue-600" />
              <div>
                <p className="font-medium text-gray-900">Servicio al Cliente</p>
                <p className="text-blue-600 hover:text-blue-700 transition-colors duration-200">
                  +57 3167373829
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsDialogOpen(false)}
          />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <button
              onClick={() => setIsDialogOpen(false)}
              className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>

            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Profesionales de la Salud
              </h2>

              <div className="relative">
                <button
                  onClick={() => scroll("left")}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-600" />
                </button>

                <div
                  ref={sliderRef}
                  className="flex overflow-x-auto gap-4 p-4 scroll-smooth hide-scrollbar"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  {filteredProfessionals.map((professional) => (
                    <div
                      key={professional.id}
                      className="min-w-[300px] bg-white rounded-xl shadow-lg p-6 mx-4 flex flex-col items-center transition-transform hover:scale-105"
                    >
                      <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-blue-500">
                        <img
                          src={professional.imageUrl}
                          alt={professional.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://images.unsplash.com/photo-1550831107-1553da8c8464?auto=format&fit=crop&w=500&q=80";
                          }}
                        />
                      </div>

                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {professional.user.name}
                      </h3>
                      <p className="text-gray-600 text-center mb-6 line-clamp-3">
                        {professional.description}
                      </p>

                      <div className="flex justify-center items-center gap-x-8">
                        <button
                          onClick={() => {
                            setSelectedProfessional(professional);
                            setIsProfessionalDetailsOpen(true);
                          }}
                          className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                        >
                          Ver detalles
                        </button>
                        <button
                          onClick={() => handleProfessionalSelect(professional)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                        >
                          Seleccionar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => scroll("right")}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50"
                >
                  <ChevronRight className="w-6 h-6 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Professional Details Dialog */}
      {isProfessionalDetailsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full">
            <div className="relative w-32 h-32 mx-auto mb-6">
              <Image
                src="https://images.unsplash.com/photo-1550831107-1553da8c8464?auto=format&fit=crop&w=500&q=80"
                alt={selectedProfessional?.specialty.name || "Professional"}
                layout="fill"
                objectFit="cover"
                className="rounded-full"
              />
            </div>
            <h3 className="text-2xl font-bold text-center text-gray-900 mb-2">
              {selectedProfessional?.specialty.name}
            </h3>
            <p className="text-gray-600 text-center mb-6">
              {selectedProfessional?.description}
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsProfessionalDetailsOpen(false)}
                className="px-6 py-3 bg-gray-100 text-gray-800 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  if (selectedProfessional) {
                    handleProfessionalSelect(selectedProfessional);
                  }
                  setIsProfessionalDetailsOpen(false);
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
              >
                Seleccionar este profesional
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
