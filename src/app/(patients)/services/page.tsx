"use client";

import Image from "next/image";
import { useState } from "react";
import NavBar from "@/components/navbar";

export default function Page() {
  const [activeTab, setActiveTab] = useState("planes");
  const [searchText, setSearchText] = useState("");

  return (
    <>
      <NavBar></NavBar>

      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="border-b p-4">
          <div className="flex items-center gap-3">
            <button
              className="text-blue-800"
              onClick={() => console.log("back clicked")}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold text-blue-800 ">
              Planes y Servicios
            </h1>
          </div>
          <h2 className="mt-2 text-blue-800 font-bold">
            Planes Médicos y Servicios Especiales
          </h2>

          {/* Custom Tabs */}
          <div className="mt-4 border-b w-full">
            <div className="flex gap-6">
              <button
                onClick={() => setActiveTab("planes")}
                className={`flex-1 pb-2 text-sm ${
                  activeTab === "planes"
                    ? "border-b-2 border-blue-800 font-medium text-blue-800"
                    : "text-gray-500"
                }`}
              >
                Planes
              </button>
              <button
                onClick={() => setActiveTab("servicios")}
                className={`flex-1 pb-2 text-sm ${
                  activeTab === "servicios"
                    ? "border-b-2 border-blue-800 font-medium text-blue-800"
                    : "text-gray-500"
                }`}
              >
                Servicios
              </button>
            </div>
          </div>
        </header>

        {/* Search and Filters */}
        <div className="p-4">
          <div className="relative">
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
            <input
              type="text"
              placeholder="Puedes buscar..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-10 focus:border-blue-800 focus:outline-none focus:ring-1 focus:ring-blue-800"
            />
            {searchText && (
              <button
                onClick={() => setSearchText("")}
                className="absolute right-10 top-2.5 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
            <button className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="4" y1="21" x2="4" y2="14" />
                <line x1="4" y1="10" x2="4" y2="3" />
                <line x1="12" y1="21" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12" y2="3" />
                <line x1="20" y1="21" x2="20" y2="16" />
                <line x1="20" y1="12" x2="20" y2="3" />
                <line x1="1" y1="14" x2="7" y2="14" />
                <line x1="9" y1="8" x2="15" y2="8" />
                <line x1="17" y1="16" x2="23" y2="16" />
              </svg>
            </button>
          </div>

          {/* Status Filters */}
          <div className="mt-4 flex gap-2">
            <button className="rounded-full border border-gray-300 px-4 py-1.5 text-sm text-gray-700 hover:bg-blue-900 hover:text-white">
              Activos
            </button>
            <button className="rounded-full border border-gray-300 px-4 py-1.5 text-sm text-gray-700 hover:bg-blue-900 hover:text-white">
              Caducados
            </button>
            <button className="rounded-full border border-gray-300 px-4 py-1.5 text-sm text-gray-700 hover:bg-blue-900 hover:text-white">
              Inactivos
            </button>
          </div>

          {/* Next Plan Section */}
          <div className="mt-6">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-800"></div>
              <h3 className="text-sm font-medium text-gray-600">
                Próximo Plan
              </h3>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Su plan actual estará vigente hasta el día Jueves 25 de Enero del
              2025
              <button className="ml-1 inline-flex items-center text-blue-800">
                Más información
                <svg
                  className="ml-1 h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4" />
                  <path d="M12 8h.01" />
                </svg>
              </button>
            </p>
          </div>

          {/* Plan Card */}
          <div className="mt-4 rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-blue-800">
                  Plan Básico Dentix
                </h3>
                <div className="mt-1 text-sm text-gray-600">Empresa: </div>
                <img src="/images/logo-dentix.png"></img>
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-800">
                <img src="/images/dentix-image.png"></img>
                {/* <Image
                src="/images/dentix-image.png"
                alt="Tooth icon"
                width={40}
                height={40}
                className="brightness-0 invert"
              /> */}
              </div>
            </div>

            <div className="mt-4">
              <div className="text-2xl font-bold text-blue-800">
                COP $75.990<span className="text-sm">/Mes</span>
              </div>
              <div className="mt-2 space-y-1 text-xs text-gray-500">
                <div>Fecha de activación: 05/25/2023</div>
                <div>Fecha de vencimiento: 06/25/2023</div>
              </div>
              <p className="mt-2 text-xs text-gray-600">
                Tu plan dental ya está activo. Ahora puedes disfrutar de
                beneficios exclusivos, acceso a especialistas y cobertura en
                tratamientos dentales.
              </p>
            </div>

            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700">
                Lo que incluye:
              </h4>
              <div className="mt-3 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-800">
                    📋
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-700">
                      2 Consultas sin costo adicional
                    </p>
                    <p className="text-xs text-gray-500">
                      (15/02/2025) - (27/02/2025)
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-800">
                    🔍
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-700">
                      Radiografías (panorámicas y periapicales) incluidas
                    </p>
                    <p className="text-xs text-gray-500">(15/02/2025)</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-800">
                    🦷
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-700">
                      Profilaxis dental (limpieza profunda)
                    </p>
                    <p className="text-xs text-gray-500">(17/02/2025)</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-800">
                    👨‍⚕️
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-700">
                      Ortodoncia preventiva y asesoría inicial sin costo
                    </p>
                    <p className="text-xs text-gray-500">(20/02/2025)</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <button className="w-full rounded-lg bg-blue-800 py-2.5 text-sm font-medium text-white hover:bg-blue-900">
                Renovar Plan
              </button>
              <button className="w-full rounded-lg border border-gray-300 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
                Ver Plan Detalles
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
