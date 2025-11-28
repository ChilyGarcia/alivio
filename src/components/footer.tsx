"use client";

import React from "react";
import { Heart, Facebook, Instagram, Youtube } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-primary text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Logo, Social Media y Enlaces AliviApp */}
          <div className="md:col-span-4">
            <div className="flex items-center mb-4">
              <Image
                src="/images/icon-footer.png"
                alt="Aliviapp"
                width={120}
                height={40}
                className="h-10 w-auto"
              />
            </div>
            <div className="flex gap-4 mb-6">
              <a href="#" className="text-white hover:text-gray-200">
                <Facebook size={20} />
              </a>
              <a
                href="https://www.instagram.com/aliviapp.co/"
                className="text-white hover:text-gray-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram size={20} />
              </a>
              <a href="#" className="text-white hover:text-gray-200">
                <Youtube size={20} />
              </a>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Aliviapp</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-white hover:text-gray-200">
                    Inicio
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white hover:text-gray-200">
                    Sobre Nosotros
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white hover:text-gray-200">
                    Citas y Consultas
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white hover:text-gray-200">
                    Planes y Servicios
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Legal - Centered */}
          <div className="md:col-start-5 md:col-span-3">
            <h3 className="text-lg font-bold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-white hover:text-gray-200">
                  Términos y condiciones
                </a>
              </li>
              <li>
                <a href="#" className="text-white hover:text-gray-200">
                  Políticas de privacidad
                </a>
              </li>
              <li>
                <a href="#" className="text-white hover:text-gray-200">
                  Consentimiento Informado para Servicios de Salud
                </a>
              </li>
              <li>
                <a href="#" className="text-white hover:text-gray-200">
                  Política de Cookies y Comunicaciones
                </a>
              </li>
              <li>
                <a href="#" className="text-white hover:text-gray-200">
                  Información sobre Pagos y Cancelaciones
                </a>
              </li>
            </ul>
          </div>

          {/* Contacto - Right */}
          <div className="md:col-start-9 md:col-span-4">
            <h3 className="text-lg font-bold mb-4">Contacto</h3>
            <ul className="space-y-2">
              <li className="text-white">contact@aliviapp.com.co</li>
              <li className="text-white">+57 3102740308</li>
              <li className="text-white">Cúcuta, Colombia</li>
            </ul>
          </div>
        </div>

        {/* Copyright with lines */}
        <div className="mt-8 pt-8 text-center relative pb-8">
          <div className="absolute left-0 right-0 top-1/2 h-px bg-white/20"></div>
          <span className="relative bg-primary px-4">AliviApp ©2026</span>
        </div>
      </div>
    </footer>
  );
}
