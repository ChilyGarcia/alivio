"use client";
import { useState } from "react";
import { Plus, ChevronDown, ChevronUp } from "lucide-react";

export default function ServicesSection() {
  const [services] = useState(["Vacunación", "Pediatría", "Nutrición"]);
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Buscar el servicio o especialidad que ofreces"
          className="flex-1 text-sm bg-gray-100 rounded-full px-4 py-2 focus:outline-none"
        />
        <Plus className="h-6 w-6 text-primary" />
      </div>
      <button className="w-full py-2 text-sm bg-primary text-white rounded-full">
        + Crear Servicio
      </button>
      <div className="space-y-3">
        {services.map((svc) => (
          <div
            key={svc}
            className="border border-gray-200 rounded-lg p-3 flex justify-between items-center cursor-pointer"
            onClick={() => setExpanded(expanded === svc ? null : svc)}
          >
            <span className="text-sm font-medium text-gray-900">{svc}</span>
            {expanded === svc ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
