"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function UpdateProfessionalData() {
  const [hourlyRate, setHourlyRate] = useState("");
  const [date, setDate] = useState("");
  const [availableFrom, setAvailableFrom] = useState("");
  const [availableTo, setAvailableTo] = useState("");
  const [isLoadingRate, setIsLoadingRate] = useState(false);
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);

  const router = useRouter();

  const handleUpdateRate = async (e) => {
    e.preventDefault();
    setIsLoadingRate(true);
    try {
      const token = Cookies.get("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/health-professionals/update-rate`,
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
        throw new Error("Error al actualizar la tarifa");
      }

      alert("Tarifa actualizada con éxito");
      setHourlyRate("");
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error actualizando la tarifa: " + error.message);
    } finally {
      setIsLoadingRate(false);
    }
  };

  const handleAddAvailability = async (e) => {
    e.preventDefault();
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
        throw new Error("Error al agregar disponibilidad");
      }

      alert("Disponibilidad agregada con éxito");
      setDate("");
      setAvailableFrom("");
      setAvailableTo("");
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error agregando la disponibilidad: " + error.message);
    } finally {
      setIsLoadingAvailability(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-white p-4 md:p-6">
        <div className="mx-auto max-w-2xl space-y-8 mt-12">
          <h1 className="text-2xl font-bold text-blue-800">
            Panel del Profesional
          </h1>

          <div className="bg-white rounded-lg shadow p-6 border border-blue-100">
            <h2 className="text-xl font-semibold text-blue-700 mb-4">
              Actualizar Tarifa por Hora
            </h2>
            <form onSubmit={handleUpdateRate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tarifa por hora (COP)
                </label>
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={isLoadingRate}
                className={`w-full h-10 rounded-md text-white font-medium transition-colors ${
                  isLoadingRate
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isLoadingRate ? "Actualizando..." : "Actualizar Tarifa"}
              </button>
            </form>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border border-blue-100">
            <h2 className="text-xl font-semibold text-blue-700 mb-4">
              Agregar Disponibilidad
            </h2>
            <form onSubmit={handleAddAvailability} className="space-y-4">
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
                    value={availableFrom}
                    onChange={(e) => setAvailableFrom(e.target.value)}
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
                    value={availableTo}
                    onChange={(e) => setAvailableTo(e.target.value)}
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
                {isLoadingAvailability
                  ? "Agregando..."
                  : "Agregar Disponibilidad"}
              </button>
            </form>
          </div>
        </div>
      </div>
      
    </>
  );
}
