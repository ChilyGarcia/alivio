"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import NavBar from "@/components/navbar";
import { Toaster, toast } from "sonner";
import { ChevronLeft } from "lucide-react";

interface HourlyRate {
  hourly_rate: string;
}

interface Availability {
  id: number;
  date: string;
  available_from: string;
  available_to: string;
}

export default function ProfessionalConfigurationPage() {
  const [hourlyRate, setHourlyRate] = useState("");
  const [currentRate, setCurrentRate] = useState<HourlyRate>({
    hourly_rate: "",
  });

  const [date, setDate] = useState("");
  const [availableFrom, setAvailableFrom] = useState("");
  const [availableTo, setAvailableTo] = useState("");

  const [isLoadingRate, setIsLoadingRate] = useState(false);
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);

  const [activeTab, setActiveTab] = useState<"tarifa" | "disponibilidad">(
    "tarifa"
  );

  const [availabilities, setAvailabilities] = useState<Availability[]>([]);

  const router = useRouter();

  const handleUpdateRate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingRate(true);

    try {
      const token = Cookies.get("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/professional/update-hourly-rate`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ hourly_rate: hourlyRate }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        let message = "Error al actualizar la tarifa";

        if (errorData?.error) {
          const errorMessages: string[] = [];
          for (const key in errorData.error) {
            if (Array.isArray(errorData.error[key])) {
              errorMessages.push(...errorData.error[key]);
            }
          }
          if (errorMessages.length > 0) {
            message = errorMessages.join(" ");
          }
        }
        throw new Error(message);
      }

      setCurrentRate({ hourly_rate: hourlyRate });
      toast.success("Tarifa actualizada con éxito");
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setIsLoadingRate(false);
    }
  };

  useEffect(() => {
    const token = Cookies.get("token");

    const fetchRatePerHour = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/professional/hourly-rate`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error al obtener la tarifa");
        }

        const data = await response.json();
        const { hourly_rate } = data;
        setCurrentRate({ hourly_rate });
      } catch (error: any) {
        console.log(error);
      }
    };

    const fetchProfessionalAvailabilities = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/professional/availabilities`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error al obtener las disponibilidades");
        }

        const data = await response.json();
        setAvailabilities(data.data);
      } catch (error: any) {
        console.log(error);
      }
    };

    fetchRatePerHour();
    fetchProfessionalAvailabilities();
  }, []);

  const fetchDeleteAvailability = async (id: number) => {
    try {
      const token = Cookies.get("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/professional/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        console.log(error);

        toast.error(error.error);
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddAvailability = async (e: React.FormEvent) => {
    e.preventDefault();

    if (availableFrom >= availableTo) {
      toast.error("La hora de fin debe ser mayor que la hora de inicio.");
      return;
    }

    setIsLoadingAvailability(true);

    try {
      const token = Cookies.get("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/availabilities`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            date,
            available_from: availableFrom,
            available_to: availableTo,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        console.log(error);

        toast.error(error.error);
        return;
      }

      const newAvailability = await response.json();
      console.log("Esta es la nueva disponibilidad cabron", newAvailability);
      setAvailabilities((prev) => [...prev, newAvailability.data]);

      setDate("");
      setAvailableFrom("");
      setAvailableTo("");
      toast.success("Disponibilidad agregada con éxito");
    } catch (error: any) {
      console.error(error);
      toast.error(
        "Ocurrió un error agregando la disponibilidad: " + error.error
      );
    } finally {
      setIsLoadingAvailability(false);
    }
  };

  const handleDeleteAvailability = async (id: number) => {
    try {
      await fetchDeleteAvailability(id);
      setAvailabilities((prev) => prev.filter((item) => item.id !== id));
      toast.success("Disponibilidad eliminada con éxito");
    } catch (error) {
      toast.error("Error al eliminar la disponibilidad");
    }
  };

  const handleTimeChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setState: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const [hours] = e.target.value.split(":");
    const newValue = `${hours.padStart(2, "0")}:00`;
    setState(newValue);
  };

  return (
    <>
      <NavBar />
      <Toaster />

      <div className="min-h-screen bg-white p-4 md:p-8 mt-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <button
              onClick={() => window.history.back()}
              className="p-2 mr-2 rounded-full hover:bg-gray-200 transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-primary" />
            </button>
            <h1 className="text-lg font-bold text-primary">
              Tarifas y disponibilidades
            </h1>
          </div>

          <div className="border-b border-gray-200 flex items-center text-sm md:text-base w-full">
            <button
              onClick={() => setActiveTab("tarifa")}
              className={`flex-1 px-4 py-2 font-medium text-center ${
                activeTab === "tarifa"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Tarifa por Hora
            </button>
            <button
              onClick={() => setActiveTab("disponibilidad")}
              className={`flex-1 px-4 py-2 font-medium text-center ${
                activeTab === "disponibilidad"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Disponibilidad
            </button>
          </div>

          {activeTab === "tarifa" && (
            <div className="flex justify-center items-center w-full">
              <div className="mt-6 bg-white rounded-lg shadow p-6 border border-gray-200 w-full max-w-md">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  Actualizar Tarifa por Hora
                </h2>
                <p className="text-sm text-gray-500 mb-5">
                  Establezca su tarifa por hora de consulta. Esta tarifa será
                  visible para los pacientes.
                </p>

                <form onSubmit={handleUpdateRate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tarifa por hora (COP)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        $
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="500"
                        value={hourlyRate}
                        onChange={(e) => setHourlyRate(e.target.value)}
                        className="w-full pl-7 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoadingRate}
                    className={`w-full h-10 rounded-md text-white font-medium transition-colors flex items-center justify-center space-x-2 ${
                      isLoadingRate
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {isLoadingRate ? (
                      <span className="loading loading-spinner loading-md"></span>
                    ) : (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 0 1-2.031.352 5.988 5.988 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971Zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 0 1-2.031.352 5.989 5.989 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971Z"
                          />
                        </svg>
                        <span>Actualizar Tarifa</span>
                      </>
                    )}
                  </button>
                </form>

                {currentRate.hourly_rate !== "" && (
                  <div className="mt-4 text-sm text-gray-600">
                    Tu tarifa actual es de{" "}
                    <span className="font-semibold">
                      {parseFloat(currentRate.hourly_rate).toLocaleString(
                        "es-CO",
                        {
                          style: "currency",
                          currency: "COP",
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }
                      )}
                    </span>{" "}
                    por hora.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "disponibilidad" && (
            <div className="mt-6 space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">
                  Agregar Disponibilidad
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  Seleccione fechas y horarios en los que estará disponible para
                  consultas.
                </p>

                <form
                  onSubmit={handleAddAvailability}
                  className="space-y-4 max-w-sm"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Hora de Inicio
                      </label>
                      <input
                        type="time"
                        step="3600"
                        value={availableFrom}
                        onChange={(e) => handleTimeChange(e, setAvailableFrom)}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Hora de Fin
                      </label>
                      <input
                        type="time"
                        step="3600"
                        value={availableTo}
                        onChange={(e) => handleTimeChange(e, setAvailableTo)}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoadingAvailability}
                    className={`w-full h-10 rounded-md text-white font-medium transition-colors ${
                      isLoadingAvailability
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {isLoadingAvailability ? (
                      <>
                        <span className="loading loading-spinner loading-md"></span>
                      </>
                    ) : (
                      "Agregar Disponibilidad"
                    )}
                  </button>
                </form>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">
                  Disponibilidad Actual
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  Horarios en los que estará disponible para consultas.
                </p>

                {availabilities.length > 0 ? (
                  <ul className="space-y-2">
                    {availabilities.map((item, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between bg-gray-50 p-3 rounded-md"
                      >
                        <div className="text-sm text-gray-700">
                          <span className="font-medium">{item.date}</span> |{" "}
                          {item.available_from} - {item.available_to}
                        </div>
                        <button
                          onClick={() => handleDeleteAvailability(item.id)}
                          className="text-red-500 text-sm hover:underline"
                        >
                          Eliminar
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <label>No tienes disponibilidades, agrega al menos una</label>
                )}

                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    Total: {availabilities.length} horarios
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
