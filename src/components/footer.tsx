"use client";

import React from "react";
import { Heart, Facebook, Instagram, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Social Media */}
          <div>
            <div className="flex items-center">
              <span className="text-2xl font-bold">Alivio</span>
            </div>
            <div className="mt-4 flex gap-4">
              <a href="#" className="text-white hover:text-gray-200">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-white hover:text-gray-200">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-white hover:text-gray-200">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Compañía */}
          <div>
            <h3 className="text-lg font-bold mb-4">Compañía</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-white hover:text-gray-200">
                  Inicio
                </a>
              </li>
              <li>
                <a href="#" className="text-white hover:text-gray-200">
                  ¿Quiénes Somos?
                </a>
              </li>
              <li>
                <a href="#" className="text-white hover:text-gray-200">
                  Planes
                </a>
              </li>
              <li>
                <a href="#" className="text-white hover:text-gray-200">
                  Contacto
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-bold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-white hover:text-gray-200">
                  Términos y servicios
                </a>
              </li>
              <li>
                <a href="#" className="text-white hover:text-gray-200">
                  Privacidad y políticas
                </a>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div className="md:col-span-3">
            <h3 className="text-lg font-bold mb-4">Contacto</h3>
            <ul className="space-y-2">
              <li className="text-white">Info@gmail.com</li>
              <li className="text-white">Cúcuta, Colombia</li>
            </ul>
          </div>
        </div>

        {/* Copyright with lines */}
        <div className="mt-8 pt-8 text-center relative pb-8">
          <div className="absolute left-0 right-0 top-1/2 h-px bg-white/20"></div>
          <span className="relative bg-primary px-4">AENS TECH 2023</span>
        </div>
      </div>
    </footer>
  );
}
