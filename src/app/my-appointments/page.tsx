"use client";

import React, { useEffect, useState } from "react";
import { Clock, DollarSign, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { backendService } from "@/services/backend.service";
import { Datum } from "@/interfaces/appointment.interface";
import NavBar from "@/components/navbar";
import { useRouter } from "next/navigation";
import { AppointmenMapComponent } from "@/components/MapComponents";

const cn = (...classes: string[]) => classes.filter(Boolean).join(" ");

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button
    className={cn(
      "px-4 py-2 text-sm font-medium rounded-md transition-all",
      className
    )}
    ref={ref}
    {...props}
  />
));
Button.displayName = "Button";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Datum[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("scheduled");

  const router = useRouter();

  useEffect(() => {
    const fetchAppointments = async () => {
      const response = await backendService.listAppointments(
        currentPage,
        statusFilter
      );

      console.log("📌 Respuesta de agendamiento:", response.data);
      setAppointments(response.data.data);
      setTotalPages(response.data.last_page);
    };
    fetchAppointments();
  }, [currentPage, statusFilter]);

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
  };

  return (
    <>
      <NavBar></NavBar>

      <div className="max-w-2xl mx-auto p-4 mt-12">
        <div className="flex items-center gap-3 mb-6">
          <ChevronLeft className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-semibold text-primary capitalize">
            Citas{" "}
            {statusFilter == "scheduled" ? (
              <>Pendientes</>
            ) : statusFilter == "canceled" ? (
              <>Canceladas</>
            ) : (
              <>Completadas</>
            )}
          </h1>
        </div>

        {/* Filtros de estado de cita */}
        <div className="flex border-b pb-2 mb-4 space-x-6 text-primary">
          <button
            className={`text-sm font-semibold ${
              statusFilter === "scheduled" ? "border-b-2 border-primary" : ""
            }`}
            onClick={() => handleStatusFilter("scheduled")}
          >
            Pendientes
          </button>
          <button
            className={`text-sm font-semibold ${
              statusFilter === "canceled" ? "border-b-2 border-primary" : ""
            }`}
            onClick={() => handleStatusFilter("canceled")}
          >
            Canceladas
          </button>
          <button
            className={`text-sm font-semibold ${
              statusFilter === "completed" ? "border-b-2 border-primary" : ""
            }`}
            onClick={() => handleStatusFilter("completed")}
          >
            Realizadas
          </button>
        </div>

        {appointments.length === 0 ? (
          <p className="text-center text-gray-500">
            No tienes citas{" "}
            {statusFilter == "scheduled" ? (
              <>pendientes</>
            ) : statusFilter == "canceled" ? (
              <>canceladas</>
            ) : (
              <>completadas</>
            )}
            .
          </p>
        ) : (
          appointments.map((appointment) => {
            const healthProfessional = appointment.health_professional;
            const user = healthProfessional.user;
            const specialty = healthProfessional.specialty;

            // Acceder correctamente a la ubicación
            const hasLocation = healthProfessional?.locations?.length > 0;
            const location = hasLocation
              ? healthProfessional.locations[0]?.location
              : "Ubicación no disponible";
            const latitude = hasLocation
              ? parseFloat(healthProfessional.locations[0]?.latitude)
              : null;
            const longitude = hasLocation
              ? parseFloat(healthProfessional.locations[0]?.longitude)
              : null;

            return (
              <div
                key={appointment.id}
                className="bg-white rounded-xl shadow-sm border mb-4 p-6"
              >
                <h2 className="text-lg font-semibold text-primary mb-2">
                  Cita con:
                </h2>
                <div className="flex items-start gap-4 mb-4">
                  <Image
                    src="/images/doc1.png"
                    alt="Doctor avatar"
                    width={60}
                    height={60}
                    className="rounded-full"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">
                      {user?.name || "Sin nombre"}
                    </h3>
                    <p className="text-sm text-gray-500 font-medium">
                      {specialty?.name || "Sin especialidad"}
                    </p>
                    <p className="text-sm text-gray-700 mt-2">
                      Su cita está agendada para el día{" "}
                      <b>{appointment.date.toLocaleDateString()}</b> a las{" "}
                      <b>{appointment.start_time}</b> en {location}.
                    </p>

                    <p className="font-bold  mt-4">
                      Tipo:{" "}
                      <span className=" font-normal">
                        {" "}
                        {appointment.accesibility.type}{" "}
                      </span>{" "}
                    </p>
                  </div>
                </div>

                {/* Validamos que existan coordenadas antes de renderizar el mapa */}
                {hasLocation && latitude !== null && longitude !== null && (
                  <div className="bg-gray-100 rounded-lg h-40 mb-4 flex items-center justify-center mt-4 overflow-hidden">
                    <AppointmenMapComponent
                      lat={latitude}
                      lng={longitude}
                      popupContent={`${user?.name} - ${specialty?.name}`}
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">
                      {appointment.start_time} - {appointment.end_time}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">COP $35,000</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button className="w-full border border-primary text-primary">
                    Reagendar Cita
                  </Button>
                  <Button
                    className="w-full bg-primary text-white"
                    onClick={() => router.push(`/chat?receiver_id=${user?.id}`)}
                  >
                    Enviar Mensaje
                  </Button>
                </div>
              </div>
            );
          })
        )}

        <div className="flex justify-center items-center gap-4 mt-6">
          <Button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <span>
            Página {currentPage} de {totalPages}
          </span>
          <Button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </>
  );
}
