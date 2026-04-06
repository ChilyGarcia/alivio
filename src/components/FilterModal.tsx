"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Search,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  Stethoscope,
  Building2,
  CircleDollarSign,
  Briefcase,
  UserRound,
  Globe,
  MapPin,
} from "lucide-react";
import Image from "next/image";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: any[];
  companies: any[];
  initialFilters?: any;
  onApply: (filters: any) => void;
}

export default function FilterModal({
  isOpen,
  onClose,
  categories,
  companies,
  initialFilters,
  onApply,
}: FilterModalProps) {
  const [activeFilters, setActiveFilters] = useState({
    orderBy: "Populares",
    specialty: "",
    company: "",
    priceRange: [100000, 150000],
    services: [],
    diseases: [],
    format: "Virtual",
    city: "Cúcuta",
  });

  const [localCategories, setLocalCategories] = useState(categories);
  const [localCompanies, setLocalCompanies] = useState(companies);

  useEffect(() => {
    if (initialFilters) {
      setActiveFilters((prev) => ({ ...prev, ...initialFilters }));
    }
  }, [initialFilters, isOpen]);

  const toggleFilter = (category: string, value: string) => {
    setActiveFilters((prev: any) => {
      if (Array.isArray(prev[category])) {
        const current = prev[category];
        return {
          ...prev,
          [category]: current.includes(value)
            ? current.filter((v: string) => v !== value)
            : [...current, value],
        };
      }
      return { ...prev, [category]: value };
    });
  };

  const resetFilters = () => {
    setActiveFilters({
      orderBy: "Populares",
      specialty: "",
      company: "",
      priceRange: [100000, 750000],
      services: [],
      diseases: [],
      format: "",
      city: "",
    });
  };

  const handleApply = () => {
    onApply(activeFilters);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-white flex flex-col h-full"
      >
        {/* Sticky Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2">
                <Image src="/images/logo_alivia_blue.png" alt="ALIVIO" width={100} height={30} className="object-contain" />
             </div>
          </div>
          <button className="bg-[#0C7B02] text-white px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2">
            Emergencia <ChevronDown className="h-3 w-3" />
          </button>
        </div>

        {/* Modal Content Header */}
        <div className="flex items-center gap-4 px-6 py-4 mt-2">
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="h-8 w-8 text-[#0C0CAA]" />
          </button>
          <h2 className="text-2xl font-extrabold text-[#0C0CAA]">Filtros de búsqueda</h2>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-10 pb-6">
          
          {/* Ordenar por */}
          <Section icon={<ClipboardList className="h-6 w-6" />} title="Ordenar por">
            <div className="flex gap-3 flex-wrap">
              {["Populares", "Todos", "Cerca de mi"].map((item) => (
                <Chip key={item} label={item} active={activeFilters.orderBy === item} onClick={() => toggleFilter("orderBy", item)} />
              ))}
            </div>
          </Section>

          {/* Especialidades */}
          <Section icon={<Stethoscope className="h-6 w-6" />} title="Especialidades">
            <div className="flex flex-col gap-4">
              <SearchInput placeholder="Escribe la especialidad" />
              <div className="flex gap-3 flex-wrap">
                {categories.slice(0, 5).map((cat) => (
                  <Chip key={cat.id} label={cat.name} active={activeFilters.specialty === cat.name} onClick={() => toggleFilter("specialty", cat.name)} />
                ))}
                <button className="text-[#0C0CAA] font-bold text-sm px-4 py-2 hover:underline">Ver más...</button>
              </div>
            </div>
          </Section>

          {/* Empresas */}
          <Section icon={<Building2 className="h-6 w-6" />} title="Empresas">
            <div className="flex flex-col gap-4">
               <SearchInput placeholder="Escribe la empresa" />
               <div className="flex gap-3 flex-wrap">
                {companies.slice(0, 5).map((comp) => (
                  <Chip key={comp.id} label={comp.name} active={activeFilters.company === comp.name} onClick={() => toggleFilter("company", comp.name)} />
                ))}
                <button className="text-[#0C0CAA] font-bold text-sm px-4 py-2 hover:underline">Ver más...</button>
              </div>
            </div>
          </Section>

          {/* Intervalo de precio */}
          <Section icon={<CircleDollarSign className="h-6 w-6" />} title="Intervalo de precio">
            <div className="px-4 py-8 relative">
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-[#0C0CAA] text-white px-3 py-1 rounded-full text-[10px] font-bold z-10">
                COP 100.000-150.000
              </div>
              <div className="h-1.5 w-full bg-blue-100 rounded-full relative">
                <div className="absolute left-[10%] right-[70%] h-full bg-[#0C0CAA] rounded-full"></div>
                <div className="absolute left-[10%] -top-2 h-5 w-5 bg-[#0C0CAA] rounded-full border-4 border-white shadow-sm cursor-pointer"></div>
                <div className="absolute right-[70%] -top-2 h-5 w-5 bg-blue-200 rounded-full border-4 border-white shadow-sm cursor-pointer"></div>
              </div>
              <div className="flex justify-between mt-4 text-[10px] font-bold text-[#0C0CAA]">
                <span>COP 10.000</span>
                <span>COP 1.000.000</span>
              </div>
            </div>
          </Section>

          {/* Servicios */}
          <Section icon={<Briefcase className="h-6 w-6" />} title="Servicios">
            <div className="flex gap-3 flex-wrap">
              {["Odontologia", "Fisioterapia", "General", "Dermatologia", "Terapias"].map((s) => (
                <Chip key={s} label={s} active={activeFilters.services.includes(s)} onClick={() => toggleFilter("services", s)} />
              ))}
              <button className="text-[#0C0CAA] font-bold text-sm px-4 py-2 hover:underline">Ver más...</button>
            </div>
          </Section>

          {/* Enfermedades */}
          <Section icon={<UserRound className="h-6 w-6" />} title="Enfermedades">
             <div className="flex gap-3 flex-wrap">
              {["Gripe", "Ansiedad", "Depresión", "Cálculos", "Fiebre"].map((e) => (
                <Chip key={e} label={e} active={activeFilters.diseases.includes(e)} onClick={() => toggleFilter("diseases", e)} />
              ))}
              <button className="text-[#0C0CAA] font-bold text-sm px-4 py-2 hover:underline">Ver más...</button>
            </div>
          </Section>

          {/* Formato */}
          <Section icon={<Globe className="h-6 w-6" />} title="Formato">
             <div className="flex gap-3">
              {["Presencial", "Virtual"].map((f) => (
                <Chip key={f} label={f} active={activeFilters.format === f} onClick={() => toggleFilter("format", f)} />
              ))}
            </div>
          </Section>

          {/* Ciudad */}
          <Section icon={<MapPin className="h-6 w-6" />} title="Ciudad">
             <div className="flex gap-3 flex-wrap">
              {["Bucaramanga", "Cúcuta", "Bogotá", "Medellín"].map((c) => (
                <Chip key={c} label={c} active={activeFilters.city === c} onClick={() => toggleFilter("city", c)} />
              ))}
            </div>
          </Section>

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-6 border-t border-gray-100 bg-white space-y-4">
          <button 
            onClick={resetFilters}
            className="w-full py-3 text-[#0C0CAA] font-bold border-2 border-[#0C0CAA] rounded-2xl hover:bg-blue-50 transition-colors"
          >
            Borrar filtros
          </button>
          <button 
            onClick={handleApply}
            className="w-full py-3 bg-[#0C0CAA] text-white font-bold rounded-2xl hover:bg-blue-900 transition-all shadow-lg"
          >
            Aplicar
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function Section({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="text-[#0C0CAA]">{icon}</div>
        <h3 className="text-xl font-extrabold text-gray-800">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function Chip({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-2 rounded-full border-2 font-bold text-sm transition-all ${
        active 
          ? "bg-[#0C0CAA] text-white border-[#0C0CAA] shadow-md" 
          : "bg-white text-[#0C0CAA] border-[#0C0CAA] hover:bg-blue-50"
      }`}
    >
      {label}
    </button>
  );
}

function SearchInput({ placeholder }: { placeholder: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <input
          type="text"
          placeholder={placeholder}
          className="w-full bg-[#F5FBFF] border-2 border-primary/10 rounded-2xl px-5 py-2.5 text-[#0C0CAA] placeholder-primary/20 text-sm focus:outline-none focus:border-primary/30"
        />
      </div>
      <button className="p-2.5 bg-[#0C0CAA] text-white rounded-2xl shadow-sm">
        <SlidersHorizontal className="h-5 w-5" />
      </button>
    </div>
  );
}
