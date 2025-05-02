"use client";

import React, { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Calendar,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { backendService } from "@/services/backend.service";
import { Datum } from "@/interfaces/my-patients.interface";

const Button = ({ variant = "default", children, ...props }) => {
  const base =
    "px-4 py-2 rounded-xl font-medium transition-colors focus:outline-none";
  const variants = {
    default: "bg-primary text-white hover:bg-primary/90",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
  };
  return (
    <button className={`${base} ${variants[variant]}`} {...props}>
      {children}
    </button>
  );
};

const Badge = ({ variant = "default", children }) => {
  const styles = {
    default: "bg-primary text-white",
    outline: "border border-gray-300 bg-white text-gray-700",
    gray: "bg-gray-100 text-gray-700",
    cost: "bg-green-50 text-green-700 border border-green-200",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles[variant]}`}
    >
      {children}
    </span>
  );
};

export default function AppointmentsSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<
    "scheduled" | "canceled" | "completed"
  >("scheduled");
  const [appointments, setAppointments] = useState<Datum[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleStatusFilter = (
    status: "scheduled" | "canceled" | "completed"
  ) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const response = await backendService.listMyPatients(
          currentPage,
          statusFilter
        );
        const { data, last_page } = response[0];
        const mapped = data.map((item) => {
          const [year, month, day] = item.date.split("-");
          return {
            ...item,
            date: new Date(Number(year), Number(month) - 1, Number(day)),
          };
        });

        setAppointments(mapped);
        setTotalPages(last_page);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [currentPage, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Filtros de estado */}
      <div className="flex w-full border-b border-gray-300 pb-2 text-primary">
        {[
          { key: "scheduled", label: "Pendientes" },
          { key: "canceled", label: "Canceladas" },
          { key: "completed", label: "Realizadas" },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => handleStatusFilter(key as any)}
            className={`flex-1 text-center text-sm font-semibold py-2 transition-colors ${
              statusFilter === key
                ? "border-b-2 border-primary text-primary"
                : "text-gray-500 hover:text-primary"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Lista de citas o spinner / mensaje */}
      <div>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
          </div>
        ) : appointments.length > 0 ? (
          appointments.map((appt) => (
            <div
              key={appt.id}
              className="bg-white border border-primary rounded-xl p-6 space-y-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                    {appt.patient.avatarUrl ? (
                      <img
                        src={appt.patient.avatarUrl}
                        alt={appt.patient.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-700 font-bold">
                        {appt.patient.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {appt.patient.name}
                      </h3>
                      <Badge variant="outline">ID: {appt.id}</Badge>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Edad: {appt.patient.age}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <Badge variant="gray">{appt.accesibility.type}</Badge>
                      <Badge variant="cost">Costo: ${appt.total_cost}</Badge>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">
                      {appt.date.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 mt-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">
                      {appt.start_time} - {appt.end_time}
                    </span>
                  </div>
                  {appt.accesibility.type !== "chat" &&
                    appt.accesibility.type !== "videocall" && (
                      <div className="flex items-center gap-2 text-gray-500 mt-1">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">
                          {appt.health_professional.locations[0].location}
                        </span>
                      </div>
                    )}
                </div>
              </div>

              <div className="bg-gray-50 border-l-4 border-primary p-3 rounded-lg">
                <div className="flex items-start gap-2">
                  <User className="w-4 h-4 mt-1 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-800">
                      Motivo de consulta:
                    </p>
                    <p className="text-sm text-gray-600">
                      {appt.reason || "Sin motivo especificado"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline">Reagendar Cita</Button>
                <Button
                  onClick={() =>
                    router.push(`/chat?receiver_id=${appt.patient.id}`)
                  }
                >
                  Enviar Mensaje
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-8">
            No hay citas para este estado.
          </p>
        )}
      </div>

      {/* Paginación */}
      <div className="flex justify-center items-center gap-4">
        <Button
          variant="outline"
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <span className="text-sm text-gray-500">
          Página {currentPage} de {totalPages}
        </span>
        <Button
          variant="outline"
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
