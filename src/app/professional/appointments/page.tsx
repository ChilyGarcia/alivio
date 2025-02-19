"use client";

import { useState } from "react";
import { Bell, Calendar, Check, X } from "lucide-react";
import { authenticationService } from "@/services/auth.service";
import { backendService } from "@/services/backend.service";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AppointmentManager() {
  const [appointments, setAppointments] = useState([]);
  const router = useRouter();

  const handleAppointment = (id: number, action: "accept" | "decline") => {
    setAppointments(appointments.filter((apt) => apt.id !== id));

    console.log(id);
  };

  const fetchUserDetails = async () => {
    try {
      const response = await authenticationService.userDetails();
      return response;
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProfessionalAppointments = async () => {
    try {
      const response = await backendService.getProfessionalAppointments();
      setAppointments(response);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const getUserDetails = async () => {
      const userDetails = await fetchUserDetails();

      if (userDetails.role !== "professional") {
        router.push("/");
      }

      console.log(userDetails);
    };

    const getProfessionalAppointments = async () => {
      const appointments = await fetchProfessionalAppointments();
      console.log(appointments);
    };

    getUserDetails();
    getProfessionalAppointments();
  }, []);

  useEffect(() => {
    console.log(appointments);
  }, [appointments]);

  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 py-8">
        <a href="/" className="text-[#4361ee] flex items-center gap-2 mb-12">
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
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Panel de <span className="text-[#2563EB]">Citas Médicas</span>
              </h1>
              <p className="text-gray-600">
                Gestione sus citas médicas de manera fácil y eficiente
              </p>
            </div>
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors relative">
              <Bell className="h-6 w-6 text-gray-600" />
              <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full"></span>
            </button>
          </div>

          {appointments.map((apt) => (
            <div
              key={apt.id}
              className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {apt.patient.name}
                  </h3>
                  <p className="text-gray-500 text-sm">{apt.reason}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-[#2563EB]" />
                  <span className="text-gray-600">{apt.date}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-gray-600">
                  <p>
                    <strong>Hora de inicio: </strong> {apt.start_time}
                  </p>
                  <p className="pt-2">
                    <strong>Hora de fin: </strong> {apt.end_time}
                  </p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleAppointment(apt.id, "decline")}
                    className="px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50 transition-colors flex items-center"
                  >
                    <X className="h-4 w-4 mr-1" /> Rechazar
                  </button>
                  <button
                    onClick={() => handleAppointment(apt.id, "accept")}
                    className="px-4 py-2 bg-[#2563EB] text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
                  >
                    Ir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
