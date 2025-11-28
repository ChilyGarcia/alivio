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
      <div className="bg-white rounded-xl overflow-hidden w-full max-w-xs max-h-[80vh] flex flex-col shadow-2xl relative">
        {/* Botón de cerrar */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-2 right-2 bg-white text-primary border-2 border-primary w-6 h-6 rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors z-10"
          aria-label="Cerrar modal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="w-full flex items-center justify-center pt-6">
          <div className="relative w-24 h-24 rounded-full overflow-hidden">
            <Image
              src="/images/Heros.png"
              alt="Bienvenido a AliviApp"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 8rem, 9rem"
            />
          </div>
        </div>

        {/* Contenido */}
        <div className="w-full p-4 flex flex-col justify-center">
          <div className="text-center px-2">
            <h2 className="text-lg font-bold text-primary mb-1">
              ¡Comienza ahora con AliviApp!
            </h2>
            <p className="text-xs text-gray-600 mb-4">
              Solo te tomará un minuto y podrás acceder a especialistas y
              servicios de salud personalizados.
            </p>

            <div className="flex flex-col space-y-2 w-full px-2">
              <Link
                href="/authentication/register"
                onClick={() => setIsOpen(false)}
                className="bg-primary text-white py-2 px-4 rounded-full text-sm font-medium hover:bg-primary-dark transition-colors"
              >
                Regístrate
              </Link>
              <Link
                href="/authentication/login"
                onClick={() => setIsOpen(false)}
                className="border border-primary text-primary py-2 px-4 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Iniciar sesión
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;
