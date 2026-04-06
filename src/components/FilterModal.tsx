"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
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

const MIN_PRICE = 10000;
const MAX_PRICE = 1000000;
const PRICE_STEP = 5000;

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
    priceRange: [100000, 150000] as [number, number],
    services: [] as string[],
    diseases: [] as string[],
    format: "Virtual",
    city: "Cúcuta",
  });

  const [localCategories, setLocalCategories] = useState(categories);
  const [localCompanies, setLocalCompanies] = useState(companies);
  const trackRef = useRef<HTMLDivElement>(null);

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
        className="fixed inset-0 z-[10000] bg-white flex flex-col h-full"
      >
        {/* Modal Content Header */}
        <div className="flex items-center gap-4 px-6 py-4 mt-2">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-8 w-8 text-[#0C0CAA]" />
          </button>
          <h2 className="text-2xl font-extrabold text-[#0C0CAA]">
            Filtros de búsqueda
          </h2>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-10 pb-6">
          {/* Ordenar por */}
          <Section
            icon={<ClipboardList className="h-6 w-6" />}
            title="Ordenar por"
          >
            <div className="flex gap-3 flex-wrap">
              {["Populares", "Todos", "Cerca de mi"].map((item) => (
                <Chip
                  key={item}
                  label={item}
                  active={activeFilters.orderBy === item}
                  onClick={() => toggleFilter("orderBy", item)}
                />
              ))}
            </div>
          </Section>

          {/* Especialidades */}
          <Section
            icon={<Stethoscope className="h-6 w-6" />}
            title="Especialidades"
          >
            <div className="flex flex-col gap-4">
              <SearchInput placeholder="Escribe la especialidad" />
              <div className="flex gap-3 flex-wrap">
                {categories.slice(0, 5).map((cat) => (
                  <Chip
                    key={cat.id}
                    label={cat.name}
                    active={activeFilters.specialty === cat.name}
                    onClick={() => toggleFilter("specialty", cat.name)}
                  />
                ))}
                <button className="text-[#0C0CAA] font-bold text-sm px-4 py-2 hover:underline">
                  Ver más...
                </button>
              </div>
            </div>
          </Section>

          {/* Empresas */}
          <Section icon={<Building2 className="h-6 w-6" />} title="Empresas">
            <div className="flex flex-col gap-4">
              <SearchInput placeholder="Escribe la empresa" />
              <div className="flex gap-3 flex-wrap">
                {companies.slice(0, 5).map((comp) => (
                  <Chip
                    key={comp.id}
                    label={comp.name}
                    active={activeFilters.company === comp.name}
                    onClick={() => toggleFilter("company", comp.name)}
                  />
                ))}
                <button className="text-[#0C0CAA] font-bold text-sm px-4 py-2 hover:underline">
                  Ver más...
                </button>
              </div>
            </div>
          </Section>

          {/* Intervalo de precio */}
          <PriceRangeSlider
            initialRange={activeFilters.priceRange}
            onChange={(range) =>
              setActiveFilters((prev) => ({ ...prev, priceRange: range }))
            }
          />

          {/* Servicios */}
          <Section icon={<Briefcase className="h-6 w-6" />} title="Servicios">
            <div className="flex gap-3 flex-wrap">
              {[
                "Odontologia",
                "Fisioterapia",
                "General",
                "Dermatologia",
                "Terapias",
              ].map((s) => (
                <Chip
                  key={s}
                  label={s}
                  active={activeFilters.services.includes(s)}
                  onClick={() => toggleFilter("services", s)}
                />
              ))}
              <button className="text-[#0C0CAA] font-bold text-sm px-4 py-2 hover:underline">
                Ver más...
              </button>
            </div>
          </Section>

          {/* Enfermedades */}
          <Section
            icon={<UserRound className="h-6 w-6" />}
            title="Enfermedades"
          >
            <div className="flex gap-3 flex-wrap">
              {["Gripe", "Ansiedad", "Depresión", "Cálculos", "Fiebre"].map(
                (e) => (
                  <Chip
                    key={e}
                    label={e}
                    active={activeFilters.diseases.includes(e)}
                    onClick={() => toggleFilter("diseases", e)}
                  />
                ),
              )}
              <button className="text-[#0C0CAA] font-bold text-sm px-4 py-2 hover:underline">
                Ver más...
              </button>
            </div>
          </Section>

          {/* Formato */}
          <Section icon={<Globe className="h-6 w-6" />} title="Formato">
            <div className="flex gap-3">
              {["Presencial", "Virtual"].map((f) => (
                <Chip
                  key={f}
                  label={f}
                  active={activeFilters.format === f}
                  onClick={() => toggleFilter("format", f)}
                />
              ))}
            </div>
          </Section>

          {/* Ciudad */}
          <Section icon={<MapPin className="h-6 w-6" />} title="Ciudad">
            <div className="flex gap-3 flex-wrap">
              {["Bucaramanga", "Cúcuta", "Bogotá", "Medellín"].map((c) => (
                <Chip
                  key={c}
                  label={c}
                  active={activeFilters.city === c}
                  onClick={() => toggleFilter("city", c)}
                />
              ))}
            </div>
          </Section>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-6 pb-10 border-t border-gray-100 bg-white space-y-4">
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

function PriceRangeSlider({
  initialRange,
  onChange,
}: {
  initialRange: [number, number];
  onChange: (range: [number, number]) => void;
}) {
  const [rango, setRango] = useState<[number, number]>(initialRange);
  const contenedorRef = useRef<HTMLDivElement>(null);

  // Valores de movimiento para sincronía total (fuera del ciclo de React)
  const x1 = useMotionValue(0);
  const x2 = useMotionValue(0);

  // Efecto para inicializar posiciones basándonos en el rango inicial
  useEffect(() => {
    if (!contenedorRef.current) return;
    const ancho = contenedorRef.current.offsetWidth;
    const p1 = ((initialRange[0] - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * ancho;
    const p2 = ((initialRange[1] - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * ancho;
    x1.set(p1);
    x2.set(p2);
    setRango(initialRange);
  }, [initialRange, x1, x2]);

  // Sincronización de la barra azul con las posiciones x de las asas
  const barraLeft = x1;
  const barraWidth = useTransform([x1, x2], ([v1, v2]: any) => v2 - v1);

  const actualizarPrecio = () => {
    if (!contenedorRef.current) return;
    const ancho = contenedorRef.current.offsetWidth;
    
    const pct1 = Math.max(0, Math.min(100, (x1.get() / ancho) * 100));
    const pct2 = Math.max(0, Math.min(100, (x2.get() / ancho) * 100));
    
    const val1 = Math.round(((pct1 / 100) * (MAX_PRICE - MIN_PRICE) + MIN_PRICE) / PRICE_STEP) * PRICE_STEP;
    const val2 = Math.round(((pct2 / 100) * (MAX_PRICE - MIN_PRICE) + MIN_PRICE) / PRICE_STEP) * PRICE_STEP;
    
    const nuevoRango: [number, number] = [val1, val2];
    setRango(nuevoRango);
    onChange(nuevoRango);
  };

  return (
    <Section icon={<CircleDollarSign className="h-6 w-6" />} title="Intervalo de precio">
      <div className="px-4 py-8 relative">
        {/* Etiqueta de precio (Badge) */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-[#0C0CAA] text-white px-3 py-1 rounded-full text-[10px] font-bold z-10 transition-all">
          COP {rango[0].toLocaleString()} - {rango[1].toLocaleString()}
        </div>

        <div className="relative pt-2 pb-2">
          {/* Pista del deslizador */}
          <div ref={contenedorRef} className="h-2 w-full bg-blue-100 rounded-full relative">
            {/* Barra Azul (Activa) - Sincronizada por Transformación */}
            <motion.div
              className="absolute h-full bg-[#0C0CAA] rounded-full"
              style={{ left: barraLeft, width: barraWidth }}
            />

            {/* Asa Izquierda */}
            <motion.div
              drag="x"
              dragConstraints={contenedorRef}
              dragElastic={0}
              dragMomentum={false}
              style={{ x: x1 }}
              onDrag={actualizarPrecio}
              className="absolute top-1/2 -translate-y-1/2 -ml-3 h-6 w-6 bg-[#0C0CAA] rounded-full border-4 border-white shadow-md cursor-grab active:cursor-grabbing z-30"
            />

            {/* Asa Derecha */}
            <motion.div
              drag="x"
              dragConstraints={contenedorRef}
              dragElastic={0}
              dragMomentum={false}
              style={{ x: x2 }}
              onDrag={actualizarPrecio}
              className="absolute top-1/2 -translate-y-1/2 -ml-3 h-6 w-6 bg-blue-200 rounded-full border-4 border-white shadow-md cursor-grab active:cursor-grabbing z-30"
            />
          </div>
        </div>

        {/* Etiquetas de Mín y Máx */}
        <div className="flex justify-between mt-4 text-[10px] font-bold text-[#0C0CAA]">
          <span>COP {MIN_PRICE.toLocaleString()}</span>
          <span>COP {MAX_PRICE.toLocaleString()}</span>
        </div>
      </div>
    </Section>
  );
}

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
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

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
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
