"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const WelcomeModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Verificar si ya se mostró el modal
    const hasSeenModal = localStorage.getItem("hasSeenWelcomeModal");
    if (!hasSeenModal) {
      setIsOpen(true);
      localStorage.setItem("hasSeenWelcomeModal", "true");
    }
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl overflow-hidden w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row shadow-2xl relative">
        {/* Botón de cerrar */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 left-4 bg-white text-primary border-2 border-primary w-7 h-7 rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors z-10"
          aria-label="Cerrar modal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        {/* Imagen */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8">
          <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-white shadow-lg">
            <Image
              src="/images/doc1.png"
              alt="Bienvenido a AliviApp"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Contenido */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-primary mb-4">
              ¡Comienza ahora con AliviApp!
            </h2>
            <p className="text-black mb-8 px-4">
              Solo te tomará un minuto y podrás acceder a especialistas y
              servicios de salud personalizados.
            </p>

            <div className="flex flex-col space-y-4 max-w-xs mx-auto">
              <Link
                href="/authentication/register"
                onClick={() => setIsOpen(false)}
                className="bg-primary text-white py-3 px-6 rounded-full text-center font-medium hover:bg-primary-dark transition-colors"
              >
                Regístrate
              </Link>
              <Link
                href="/authentication/login"
                onClick={() => setIsOpen(false)}
                className="border-2 border-primary text-primary py-3 px-6 rounded-full text-center font-medium hover:bg-gray-50 transition-colors"
              >
                Inicia Ahora
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;
