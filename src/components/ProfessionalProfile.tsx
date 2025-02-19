"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Star, Calendar, Share2, Heart } from "lucide-react";

const TABS = ["Experiencia", "Consultorio", "Servicios", "Opiniones"];

const ProfessionalProfile = ({ isOpen, onClose, professional }) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState("Experiencia");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 relative shadow-lg">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          ✕
        </button>
        {/* Header */}
        <div className="relative flex flex-col items-center pb-6">
          <div className="absolute -top-16 w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-white">
            <Image
              src={professional?.img || "/images/doc1.png"}
              alt={professional?.name}
              width={128}
              height={128}
              className="object-cover w-full h-full"
            />
          </div>
          <h2 className="text-xl font-bold text-center text-blue-800 mt-16">
            {professional?.name}
          </h2>
          <p className="text-gray-600 text-center text-sm font-medium">
            {professional?.specialty}
          </p>
          <div className="flex items-center gap-1 mt-2 text-yellow-500">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={
                  i < professional?.rating
                    ? "fill-yellow-500"
                    : "stroke-yellow-500"
                }
                size={16}
              />
            ))}
            <span className="text-gray-600 text-sm">
              {professional?.reviews} opiniones
            </span>
          </div>
        </div>
        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-6">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 shadow-md">
            <Calendar size={18} /> Agendar cita
          </button>
          <button className="border px-4 py-2 rounded-lg flex items-center gap-2 text-gray-700">
            <Share2 size={18} />
          </button>
          <button className="border px-4 py-2 rounded-lg flex items-center gap-2 text-gray-700">
            <Heart size={18} />
          </button>
        </div>
        {/* Tabs */}
        <div className="flex border-b mt-6 text-blue-600 text-xs">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 text-center py-2 font-medium border-b-2 transition duration-300 ${
                activeTab === tab
                  ? "border-blue-600 font-semibold"
                  : "border-transparent"
              }`}
            >
              {tab}{" "}
              {tab === "Opiniones" ? `(${professional?.reviews || 0})` : ""}
            </button>
          ))}
        </div>

        <div className="mt-6 px-4">
          {activeTab === "Experiencia" && (
            <>
              <h3 className="text-lg font-semibold text-blue-800">
                Experiencia
              </h3>
              <p className="text-gray-700 text-sm mt-2">
                {professional?.experience || "Información no disponible."}
              </p>
            </>
          )}
          {activeTab === "Consultorio" && (
            <>
              <h3 className="text-lg font-semibold text-blue-800">
                Consultorio
              </h3>
              <p className="text-gray-700 text-sm mt-2">
                {professional?.location || "Ubicación no disponible."}
              </p>
            </>
          )}
          {activeTab === "Servicios" && (
            <>
              <h3 className="text-lg font-semibold text-blue-800">Servicios</h3>
              <p className="text-gray-700 text-sm mt-2">
                {professional?.services || "Servicios no disponibles."}
              </p>
            </>
          )}
          {activeTab === "Opiniones" && (
            <>
              <h3 className="text-lg font-semibold text-blue-800">Opiniones</h3>
              <p className="text-gray-700 text-sm mt-2">
                {professional?.reviews
                  ? `${professional.reviews} opiniones disponibles.`
                  : "No hay opiniones."}
              </p>
            </>
          )}
        </div>

        {/* Horizontal Line */}
        {/* <hr className="border-t-4 border-gray-300 my-6" /> */}
        {/* View More */}
        {/* <div className="text-center mt-6">
          <button className="text-blue-600 font-medium hover:underline">
            Ver toda la información disponible
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default ProfessionalProfile;
