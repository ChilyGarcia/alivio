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
import NavBar from "@/components/navbar";
import { backendService } from "@/services/backend.service";
import { Datum } from "@/interfaces/my-patients.interface";
import { useRouter } from "next/navigation";

const Tabs = ({ defaultValue, children }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <div className="w-full">
      {React.Children.map(children, (child) => {
        if (child.type === TabsList) {
          return React.cloneElement(child, { activeTab, setActiveTab });
        }
        if (child.type === TabsContent) {
          return activeTab === child.props.value ? child : null;
        }
        return child;
      })}
    </div>
  );
};

const TabsList = ({ children, activeTab, setActiveTab }) => {
  return (
    <div className="flex overflow-x-auto whitespace-nowrap space-x-1 rounded-xl bg-gray-100 p-1 mb-8">
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, { activeTab, setActiveTab });
      })}
    </div>
  );
};

const TabsTrigger = ({ value, activeTab, setActiveTab, children }) => {
  return (
    <button
      className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
        activeTab === value
          ? "bg-white text-primary shadow border-b-2 border-primary"
          : "text-gray-600 hover:bg-white/50"
      }`}
      onClick={() => setActiveTab(value)}
    >
      {children}
    </button>
  );
};

const TabsContent = ({ value, children }) => {
  return <div>{children}</div>;
};

const Button = ({ variant = "default", children, ...props }) => {
  const baseStyles =
    "px-4 py-2 rounded-xl font-medium transition-colors focus:outline-none";
  const variantStyles = {
    default:
      "bg-primary text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500",
    outline:
      "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500",
  };

  return (
    <button className={`${baseStyles} ${variantStyles[variant]}`} {...props}>
      {children}
    </button>
  );
};

const Avatar = ({ children, className = "", ...props }) => {
  return (
    <div
      className={`relative w-10 h-10 sm:w-16 sm:h-16 rounded-full overflow-hidden bg-gray-200 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

const AvatarImage = ({ src, alt = "" }) => {
  return (
    <img
      src={src || "/placeholder.svg"}
      alt={alt}
      className="w-full h-full object-cover"
    />
  );
};

const AvatarFallback = ({ children }) => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-700 font-bold">
      {children}
    </div>
  );
};

const Badge = ({ variant = "default", children, className = "" }) => {
  const variantStyles = {
    default: "bg-primary text-white",
    secondary: "bg-green-600 text-white",
    outline: "border border-gray-300 bg-white text-gray-700",
    gray: "bg-gray-100 text-gray-700",
    cost: "bg-green-50 text-green-700 border border-green-200",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

export default function ProfessionalPanel() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("scheduled");
  const [appointments, setAppointments] = useState<Datum[]>([]);

  const router = useRouter();

  useEffect(() => {
    const fecthMyPatients = async () => {
      const response = await backendService.listMyPatients(
        currentPage,
        statusFilter
      );
      const { data, last_page } = response[0];

      const appointmentsAsDates = data.map((item) => {
        const [year, month, day] = item.date.split("-");
        return {
          ...item,
          date: new Date(Number(year), Number(month) - 1, Number(day)),
        };
      });

      setAppointments(appointmentsAsDates);
      setTotalPages(last_page);
    };

    fecthMyPatients();
  }, [currentPage, statusFilter]);

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
  };

  return (
    <>
      <NavBar />

      <div className="container mx-auto p-6 max-w-4xl min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 mt-12">
        <div className="flex items-center mb-6">
          <button
            onClick={() => window.history.back()}
            className="p-2 mr-2 rounded-full hover:bg-gray-200 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-primary" />
          </button>
          <h1 className="text-2xl font-bold text-primary">Mis pacientes</h1>
        </div>
        <div className="flex w-full border-b border-gray-300 pb-2 mb-4 text-primary">
          <button
            className={`flex-1 text-center text-sm font-semibold py-2 transition-colors ${
              statusFilter === "scheduled"
                ? "border-b-2 border-primary text-primary"
                : "text-gray-500 hover:text-primary"
            }`}
            onClick={() => handleStatusFilter("scheduled")}
          >
            Pendientes
          </button>
          <button
            className={`flex-1 text-center text-sm font-semibold py-2 transition-colors ${
              statusFilter === "canceled"
                ? "border-b-2 border-primary text-primary"
                : "text-gray-500 hover:text-primary"
            }`}
            onClick={() => handleStatusFilter("canceled")}
          >
            Canceladas
          </button>
          <button
            className={`flex-1 text-center text-sm font-semibold py-2 transition-colors ${
              statusFilter === "completed"
                ? "border-b-2 border-primary text-primary"
                : "text-gray-500 hover:text-primary"
            }`}
            onClick={() => handleStatusFilter("completed")}
          >
            Realizadas
          </button>
        </div>

        <Tabs defaultValue="pending">
          <TabsContent value="pending">
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="bg-white border border-primary rounded-xl p-6 space-y-4 shadow-sm hover:shadow-md transition-shadow ring-1 ring-gray-100"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start">
                    <div className="flex gap-4">
                      <Avatar>
                        <AvatarImage src="/images/doc1.png" />
                        <AvatarFallback>
                          {appointment.patient.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                          <h3 className="text-lg font-semibold text-gray-800">
                            {appointment.patient.name}
                          </h3>
                          <Badge variant="outline" className="uppercase ">
                            ID: {appointment.id}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                          Edad: {appointment.patient.age} años
                        </p>

                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <Badge variant="gray">
                            {appointment.accesibility.type}
                          </Badge>
                          <Badge variant="cost">
                            Costo: ${appointment.total_cost}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 sm:mt-0 text-left sm:text-right">
                      <div className="flex items-center gap-2 text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">
                          {appointment.date.toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500 mt-1">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">
                          {`${appointment.start_time} - ${appointment.end_time}`}
                        </span>
                      </div>

                      {appointment.accesibility.type === "chat" ||
                      appointment.accesibility.type === "videocall" ? null : (
                        <div className="flex items-center gap-2 text-gray-500 mt-1">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">
                            {
                              appointment.health_professional.locations[0]
                                .location
                            }
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 border-l-4 border-blue-500 p-3 rounded-lg">
                    <div className="flex items-start gap-2">
                      <User className="w-4 h-4 mt-1 text-gray-500" />
                      <div>
                        <p className="font-medium text-gray-800">
                          Motivo de consulta:
                        </p>
                        <p className="text-sm text-gray-600">
                          Motivo de consulta hardcodeado
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-end gap-3">
                    <Button variant="outline">Reagendar Cita</Button>
                    <Button
                      onClick={() =>
                        router.push(
                          `/chat?receiver_id=${appointment.patient.id}`
                        )
                      }
                    >
                      Enviar Mensaje
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center items-center gap-4 mt-6">
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
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="cancelled">
            <div className="text-center py-8 text-gray-500">
              No hay citas canceladas
            </div>
          </TabsContent>

          <TabsContent value="completed">
            <div className="text-center py-8 text-gray-500">
              No hay citas realizadas
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
