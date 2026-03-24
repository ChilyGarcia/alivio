"use client";

import { motion } from "framer-motion";
import { Search, MapPin, Video, ChevronDown } from "lucide-react";
import { useState } from "react";

export default function SearchSpecialist() {
  const [serviceType, setServiceType] = useState("Presencial");

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeInUp}
      className="w-full bg-white py-8 md:py-12 pt-24"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <h2 className="text-xl md:text-2xl font-bold text-center text-primary mb-4 md:mb-6">
          Encuentra el especialista que necesitas
        </h2>
        <div className="max-w-3xl mx-auto px-1">
          <div className="flex flex-row items-center bg-white border-2 border-primary rounded-full overflow-hidden shadow-sm transition-all focus-within:ring-2 focus-within:ring-primary focus-within:ring-opacity-50 h-10 md:h-12">
            {/* Select Section */}
            <div className="relative flex items-center bg-gray-50 border-r border-primary px-3 md:px-4 h-full min-w-[100px] md:min-w-[150px]">
              {serviceType === "Presencial" ? (
                <MapPin className="w-3 h-3 md:w-4 md:h-4 text-primary mr-1 md:mr-2 flex-shrink-0" />
              ) : (
                <Video className="w-3 h-3 md:w-4 md:h-4 text-primary mr-1 md:mr-2 flex-shrink-0" />
              )}
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="bg-transparent text-primary font-bold text-[10px] md:text-xs lg:text-sm focus:outline-none appearance-none cursor-pointer pr-4 w-full"
              >
                <option value="Presencial">Presencial</option>
                <option value="Virtual">Virtual</option>
              </select>
              <ChevronDown className="absolute right-2 w-3 h-3 md:w-4 md:h-4 text-primary pointer-events-none" />
            </div>

            {/* Input Section */}
            <div className="flex-1 flex items-center px-3 md:px-4 h-full min-w-0">
              <input
                type="text"
                placeholder="Buscar especialista..."
                className="w-full bg-transparent text-gray-700 placeholder-gray-400 focus:outline-none text-[10px] md:text-xs lg:text-sm truncate"
              />
            </div>

            {/* Compact Search Button */}
            <div className="pr-1 md:pr-2">
              <button className="bg-primary hover:bg-blue-700 text-white w-8 h-8 md:w-auto md:h-8 md:px-4 rounded-full flex items-center justify-center transition-all group">
                <Search className="w-3 h-3 md:w-4 md:h-4 transition-transform group-hover:scale-110" />
                <span className="hidden md:inline ml-2 text-xs font-medium">Buscar</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
