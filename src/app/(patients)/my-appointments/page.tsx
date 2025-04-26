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
      "px-4 py-2 text-sm font-medium rounded-xl transition-all focus:outline-none",
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
  const [loading, setLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        // Solo mostrar loading en la carga inicial
        if (isInitialLoad) {
          setLoading(true);
        }
        
        const response = await backendService.listAppointments(
          currentPage,
          statusFilter
        );

        console.log("📌 Respuesta de agendamiento:", response.data);

        const appointmentsAsDates = response.data.map((item: any) => {
          const [year, month, day] = item.date.split("-");
          return {
            ...item,
            date: new Date(Number(year), Number(month) - 1, Number(day)),
          };
        });

        setAppointments(appointmentsAsDates);
        setTotalPages(response.data.last_page);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
        setIsInitialLoad(false);
      }
    };
    fetchAppointments();
  }, [currentPage, statusFilter, isInitialLoad]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white flex justify-center items-center z-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
  };

  return (
    <>
      <NavBar />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10 mt-12 animate-fade-in">
        <div className="max-w-2xl mx-auto px-4">
          {/* Encabezado de la página */}
          <div className="flex items-center gap-3 mb-6">
            <button
              className="p-2 rounded-full hover:bg-gray-200 transition-colors"
              onClick={() => history.back()}
            >
              <ChevronLeft className="w-6 h-6 text-primary" />
            </button>
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

          {/* Filtro de estado */}
          <div className="flex w-full border-b border-gray-300 pb-2 mb-6 text-primary">
            <button
              className={cn(
                "flex-1 text-center text-sm font-semibold py-2 transition-colors",
                statusFilter === "scheduled"
                  ? "border-b-2 border-primary text-primary"
                  : "text-gray-500 hover:text-primary"
              )}
              onClick={() => handleStatusFilter("scheduled")}
            >
              Pendientes
            </button>
            <button
              className={cn(
                "flex-1 text-center text-sm font-semibold py-2 transition-colors",
                statusFilter === "canceled"
                  ? "border-b-2 border-primary text-primary"
                  : "text-gray-500 hover:text-primary"
              )}
              onClick={() => handleStatusFilter("canceled")}
            >
              Canceladas
            </button>
            <button
              className={cn(
                "flex-1 text-center text-sm font-semibold py-2 transition-colors",
                statusFilter === "completed"
                  ? "border-b-2 border-primary text-primary"
                  : "text-gray-500 hover:text-primary"
              )}
              onClick={() => handleStatusFilter("completed")}
            >
              Realizadas
            </button>
          </div>

          {/* Lista de citas */}
          {appointments.length === 0 ? (
            <p className="text-center text-gray-600">
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

              // Lógica para formatear la fecha
              const formattedDate = appointment.date.toLocaleDateString(
                "es-ES",
                {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              );

              return (
                <div
                  key={appointment.id}
                  className="relative bg-white border-2 border-primary rounded-xl shadow-sm p-6 mb-6 hover:shadow-md transition-shadow"
                >
                  {/* Título principal */}
                  <h2 className="text-xl font-bold text-primary mb-4">
                    Cita con:
                  </h2>

                  {/* Encabezado: foto + nombre + especialidad */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative w-16 h-16">
                      <Image
                        src="/images/doc1.png"
                        alt="Doctor avatar"
                        fill
                        className="rounded-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 leading-tight">
                        {user?.name || "Sin nombre"}
                      </h3>
                      <p className="text-sm text-primary font-semibold">
                        {specialty?.name || "Sin especialidad"}
                      </p>
                    </div>
                  </div>

                  {/* Información principal de la cita */}
                  <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                    Tu cita está agendada para el día{" "}
                    <b className="capitalize">{formattedDate}</b> a las{" "}
                    <b>{appointment.start_time}</b>{" "}
                    {appointment.accesibility.type !== "chat" &&
                      appointment.accesibility.type !== "videocall" && (
                        <>en {location}</>
                      )}
                    .
                  </p>

                  {/* Servicio solicitado + Formato de cita */}
                  <div className="mb-4 space-y-1">
                    <p className="text-sm font-semibold text-gray-700">
                      Servicio solicitado:{" "}
                      <span className="font-normal">
                        {specialty?.name || "N/A"}
                      </span>
                    </p>
                    <p className="text-sm font-semibold text-gray-700">
                      Formato de Cita:{" "}
                      {appointment.accesibility.type === "chat" ||
                      appointment.accesibility.type === "videocall" ? (
                        <span className="font-normal">Virtual</span>
                      ) : (
                        <span className="font-normal">Presencial</span>
                      )}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {appointment.accesibility.type === "chat" && (
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-50 text-blue-600 rounded-full">
                        Chat
                      </span>
                    )}
                    {appointment.accesibility.type === "videocall" && (
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-50 text-blue-600 rounded-full">
                        Videollamada
                      </span>
                    )}
                    {appointment.accesibility.type === "office" && (
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-50 text-blue-600 rounded-full">
                        Oficina
                      </span>
                    )}
                  </div>

                  {hasLocation &&
                    latitude !== null &&
                    longitude !== null &&
                    appointment.accesibility.type !== "chat" &&
                    appointment.accesibility.type !== "videocall" && (
                      <div className="bg-gray-100 rounded-lg h-40 mb-4 flex items-center justify-center overflow-hidden">
                        <AppointmenMapComponent
                          lat={latitude}
                          lng={longitude}
                          popupContent={`${user?.name} - ${specialty?.name}`}
                        />
                      </div>
                    )}

                  {/* Hora, costo y duración (si la tienes) */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-4 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>
                        {appointment.start_time} - {appointment.end_time}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <span>
                        COP{" "}
                        {Number(appointment.total_cost).toLocaleString(
                          "en-US",
                          {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          }
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <Button className="border border-primary text-primary hover:bg-primary/10">
                      Reagendar Cita
                    </Button>
                    <Button
                      className="bg-primary text-white hover:bg-primary/90"
                      onClick={() =>
                        router.push(`/chat?receiver_id=${user?.id}`)
                      }
                    >
                      Enviar Mensaje
                    </Button>
                  </div>
                </div>
              );
            })
          )}

          {/* Paginación */}
          <div className="flex justify-center items-center gap-4 mt-6">
            <Button
              disabled={currentPage === 1}
              className={cn(
                "border border-primary text-primary hover:bg-primary/10",
                currentPage === 1 && "opacity-50 cursor-not-allowed"
              )}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <span className="text-gray-600">
              Página {currentPage} de {totalPages}
            </span>
            <Button
              disabled={currentPage === totalPages}
              className={cn(
                "border border-primary text-primary hover:bg-primary/10",
                currentPage === totalPages && "opacity-50 cursor-not-allowed"
              )}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
