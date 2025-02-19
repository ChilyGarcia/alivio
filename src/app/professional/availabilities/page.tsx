"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, Activity } from "lucide-react";
import Cookies from "js-cookie";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

interface Availability {
  id: number;
  date: string;
  available_from: string;
  available_to: string;
  health_professional_id: number;
  created_at: string;
  updated_at: string;
}

interface PaginatedResponse {
  current_page: number;
  data: Availability[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

function App() {
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    available_from: "",
    available_to: "",
  });

  const API_URL = "http://127.0.0.1:8000/api";

  useEffect(() => {
    fetchAvailabilities();
  }, []);

  const fetchAvailabilities = async () => {
    try {
      const token = Cookies.get("token");

      const response = await fetch(`${API_URL}/professional/availabilities`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch availabilities");
      const data: PaginatedResponse = await response.json();
      setAvailabilities(data.data);
    } catch (error) {
      console.error("Error fetching availabilities:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = Cookies.get("token");

      const response = await fetch(`${API_URL}/availabilities`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to create availability");

      await fetchAvailabilities();
      setFormData({ date: "", available_from: "", available_to: "" });
    } catch (error) {
      console.error("Error creating availability:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, "EEEE, d MMMM yyyy", { locale: es });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="flex justify-start items-center w-full mr-6">
        <a
          href="/"
          className="text-[#4361ee] flex items-center gap-2 mr-12 ml-6 mt-12"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span>Volver</span>
        </a>
      </div>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#1e293b] mb-4">
            Gestiona tus horarios
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Administra tus disponibilidades de manera fácil y eficiente. Mantén
            tu agenda actualizada para que tus pacientes puedan encontrar el
            horario perfecto.
          </p>
        </div>

        {/* Form Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Agregar Nueva Disponibilidad
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    className="pl-10 w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Desde
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <input
                    type="time"
                    value={formData.available_from}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        available_from: e.target.value,
                      })
                    }
                    className="pl-10 w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hasta
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <input
                    type="time"
                    value={formData.available_to}
                    onChange={(e) =>
                      setFormData({ ...formData, available_to: e.target.value })
                    }
                    className="pl-10 w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Guardando..." : "Guardar Disponibilidad"}
              </button>
            </div>
          </form>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              Disponibilidades Actuales
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Desde
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hasta
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {availabilities.map((availability) => (
                  <tr key={availability.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {availability.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {availability.available_from.slice(0, 5)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {availability.available_to.slice(0, 5)}
                    </td>
                  </tr>
                ))}
                {availabilities.length === 0 && (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      No hay disponibilidades registradas
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
