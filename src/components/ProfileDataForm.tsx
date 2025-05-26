"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ChevronDown } from "lucide-react";
import { authenticationService } from "@/services/auth.service";
import { User as UserInterface } from "@/interfaces/user.interface";
import { useRouter } from "next/navigation";

// Reusable wrapper for labeled pill inputs
const LabeledField = React.memo(function LabeledField({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative border border-primary rounded-full px-4 py-3 ${className}`}
    >
      <p className="text-xs text-primary font-medium absolute -top-2 left-4 bg-white px-1">
        {label}
      </p>
      <div className="flex items-center justify-between mt-1">{children}</div>
    </div>
  );
});

export default function ProfileDataForm({ user }: { user: UserInterface }) {
  const router = useRouter();
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    document_type: user.document_type || "cc",
    document_number: user.document_number || "",
    email: "",
    phone_number: "",
    birth_date: user.birth_date || "",
    gender: user.gender || "",
    department: user.department || "",
    municipality: user.municipality || "",
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // initialize form from user
  useEffect(() => {
    const parts = user.name.split(" ");
    setForm((prev) => ({
      ...prev,
      first_name: parts[0] || "",
      last_name: parts.slice(1).join(" ") || "",
      email: user.email || "",
      phone_number: user.phone_number || "",
    }));
  }, [user]);

  const handleChange = useCallback((field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSave = async () => {
    // build and send payload
    try {
      const payload = {
        ...form,
        name: `${form.first_name} ${form.last_name}`.trim(),
      };
      await authenticationService.updateUser(payload);
      router.back();
    } catch (err: any) {
      console.error(err);
      alert("Error al guardar: " + err.message);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h3 className="text-sm font-medium text-primary mb-4">
        Información Personal Básica
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <LabeledField label="Nombre">
          <input
            type="text"
            value={form.first_name}
            onChange={(e) => handleChange("first_name", e.target.value)}
            className="bg-transparent text-sm outline-none w-full"
            placeholder="Nombre"
          />
        </LabeledField>

        <LabeledField label="Apellidos">
          <input
            type="text"
            value={form.last_name}
            onChange={(e) => handleChange("last_name", e.target.value)}
            className="bg-transparent text-sm outline-none w-full"
            placeholder="Apellidos"
          />
        </LabeledField>

        <LabeledField label="Tipo de Documento" className="md:col-span-2">
          <div className="flex-1 relative">
            <select
              value={form.document_type}
              onChange={(e) => handleChange("document_type", e.target.value)}
              className="w-full bg-transparent text-sm outline-none appearance-none"
            >
              <option value="cc">Cédula de Ciudadanía</option>
              <option value="ce">Cédula de Extranjería</option>
              <option value="tp">Pasaporte</option>
            </select>
            <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-500" />
          </div>
        </LabeledField>

        <LabeledField label="Número de Documento" className="md:col-span-2">
          <input
            type="text"
            value={form.document_number}
            onChange={(e) => handleChange("document_number", e.target.value)}
            className="bg-transparent text-sm outline-none w-full"
            placeholder="Número de Documento"
          />
        </LabeledField>

        <LabeledField label="Correo Electrónico" className="md:col-span-2">
          <input
            type="email"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="bg-transparent text-sm outline-none w-full"
            placeholder="correo@ejemplo.com"
          />
        </LabeledField>

        <LabeledField label="Número de Contacto" className="md:col-span-2">
          <input
            type="tel"
            value={form.phone_number}
            onChange={(e) => handleChange("phone_number", e.target.value)}
            className="bg-transparent text-sm outline-none w-full"
            placeholder="+57 300 000 0000"
          />
        </LabeledField>

        <LabeledField label="Fecha de Nacimiento">
          <input
            type="date"
            value={form.birth_date}
            onChange={(e) => handleChange("birth_date", e.target.value)}
            className="bg-transparent text-sm outline-none w-full"
          />
        </LabeledField>

        <LabeledField label="Género">
          <div className="flex-1 relative">
            <select
              value={form.gender}
              onChange={(e) => handleChange("gender", e.target.value)}
              className="w-full bg-transparent text-sm outline-none appearance-none"
            >
              <option value="male">Masculino</option>
              <option value="female">Femenino</option>
              <option value="other">Otro</option>
            </select>
            <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-500" />
          </div>
        </LabeledField>

        <LabeledField label="Departamento de Residencia">
          <div className="flex-1 relative">
            <select
              value={form.department}
              onChange={(e) => handleChange("department", e.target.value)}
              className="w-full bg-transparent text-sm outline-none appearance-none"
            >
              {/* Opciones dinámicas */}
              <option value="">Selecciona Departamento</option>
            </select>
            <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-500" />
          </div>
        </LabeledField>

        <LabeledField label="Municipio de Residencia">
          <div className="flex-1 relative">
            <select
              value={form.municipality}
              onChange={(e) => handleChange("municipality", e.target.value)}
              className="w-full bg-transparent text-sm outline-none appearance-none"
            >
              {/* Opciones dinámicas */}
              <option value="">Selecciona Municipio</option>
            </select>
            <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-500" />
          </div>
        </LabeledField>
      </div>

      <div className="mt-6 flex flex-col space-y-3">
        <button
          onClick={() => router.back()}
          className="w-full h-12 border border-gray-200 rounded-full text-sm font-medium text-gray-600 hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          onClick={handleSave}
          className="w-full h-12 bg-primary rounded-full text-sm font-medium text-white hover:bg-primary/90"
        >
          Guardar cambios
        </button>
      </div>
    </div>
  );
}
