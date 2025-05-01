"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User as UserInterface } from "@/interfaces/user.interface";
import { authenticationService } from "@/services/auth.service";
import { professionalService } from "@/services/professional.service";
import { ChevronDown, Pencil, FileText, X, Download } from "lucide-react";
import Cookies from "js-cookie";

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
      <p className="text-xs text-primary font-medium">{label}</p>
      <div className="flex items-center justify-between mt-1">{children}</div>
    </div>
  );
});

export default function ProfileEditForm({
  initialUser,
}: {
  initialUser: UserInterface;
}) {
  const [professional, setProfessional] = useState({
    description: "",
    about_me: "",
    experience: "",
    education: "",
  });

  useEffect(() => {
    const fetchProfessionalData = async () => {
      try {
        const data = await professionalService.getProfessionalByUser(
          initialUser.id
        );
        if (data && data.length > 0) {
          const profData = data[0];
          setProfessional({
            description: profData.description || "",
            about_me: profData.about_me || "",
            experience: profData.experience || "",
            education: profData.education || "",
          });
        }
      } catch (error) {
        console.error("Error fetching professional data:", error);
      }
    };

    fetchProfessionalData();
  }, []);

  const handleProfChange = useCallback((field: string, value: string) => {
    setProfessional((prev) => ({ ...prev, [field]: value }));
  }, []);

  const [savingProf, setSavingProf] = useState(false);

  const handleSaveProfessional = async () => {
    setSavingProf(true);
    try {
      await professionalService.updateProfessional(initialUser.id, {
        description: professional.description,
        experience: professional.experience,
        about_me: professional.about_me,
        education: professional.education,
      });
      alert("Información profesional actualizada correctamente");
    } catch (err) {
      console.error(err);
      alert("Error al actualizar información profesional");
    } finally {
      setSavingProf(false);
    }
  };

  const [form, setForm] = useState({
    name: initialUser.name || "",
    email: initialUser.email || "",
    phone_number: initialUser.phone_number || "",
    document_type: initialUser.document_type || "cc",
    document_number: initialUser.document_number || "",
  });
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const token = Cookies.get("token");

  const handleChange = useCallback((field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSave = async () => {
    if (!form.name || !form.email || !form.phone_number) {
      alert("Por favor completa todos los campos requeridos");
      return;
    }
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("phone_number", form.phone_number);
      if (form.document_type)
        formData.append("document_type", form.document_type);
      if (form.document_number)
        formData.append("document_number", form.document_number);
      await authenticationService.updateUser(formData);
      router.back();
    } catch (err) {
      console.error(err);
      alert("Error al actualizar el perfil: " + (err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-md p-6 space-y-6">
        <LabeledField label="Nombre completo">
          <input
            type="text"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none"
            placeholder="Ingresa tu nombre completo"
          />
        </LabeledField>

        <LabeledField label="Correo Electrónico">
          <input
            type="email"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none"
            placeholder="correo@ejemplo.com"
          />
        </LabeledField>

        <LabeledField label="Número de Teléfono">
          <input
            type="tel"
            value={form.phone_number}
            onChange={(e) => handleChange("phone_number", e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none"
            placeholder="+57 300 000 0000"
          />
        </LabeledField>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <LabeledField label="Tipo de documento">
            <select
              value={form.document_type}
              onChange={(e) => handleChange("document_type", e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none appearance-none"
            >
              <option value="cc">Cédula de Ciudadanía</option>
              <option value="ce">Cédula de Extranjería</option>
              <option value="tp">Tarjeta de Pasaporte</option>
            </select>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </LabeledField>

          <LabeledField label="Número de documento">
            <input
              type="text"
              value={form.document_number}
              onChange={(e) => handleChange("document_number", e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none"
              placeholder="Ingresa tu número de documento"
            />
          </LabeledField>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => router.back()}
            className="flex-1 h-12 border border-gray-200 rounded-full text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 h-12 bg-primary rounded-full text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50"
          >
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </div>
      {/* Sección Información Profesional */}
      <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
        <h3 className="text-sm font-semibold text-primary">
          Información Profesional
        </h3>
        <p className="text-xs text-gray-500">
          Puedes editar tu descripción inicial y tu experiencia profesional.{" "}
          <a href="#" className="underline text-primary">
            Más información
          </a>
        </p>
        <div className="space-y-4">
          <div>
            <p className="text-xs text-gray-500 font-medium">
              Descripción profesional
            </p>
            <textarea
              rows={3}
              value={professional.description}
              onChange={(e) => handleProfChange("description", e.target.value)}
              className="w-full mt-1 border border-primary rounded-2xl p-4 text-sm outline-none"
            />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Sobre mí</p>
            <textarea
              rows={3}
              value={professional.about_me}
              onChange={(e) => handleProfChange("about_me", e.target.value)}
              className="w-full mt-1 border border-primary rounded-2xl p-4 text-sm outline-none"
            />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Experiencia</p>
            <textarea
              rows={3}
              value={professional.experience}
              onChange={(e) => handleProfChange("experience", e.target.value)}
              className="w-full mt-1 border border-primary rounded-2xl p-4 text-sm outline-none"
            />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Formación</p>
            <input
              type="text"
              value={professional.education}
              onChange={(e) => handleProfChange("education", e.target.value)}
              placeholder="Universidad de Pamplona"
              className="w-full mt-1 border border-primary rounded-full px-4 py-3 text-sm outline-none"
            />
          </div>
          <button
            onClick={handleSaveProfessional}
            disabled={savingProf}
            className="w-full h-12 bg-primary text-sm font-medium text-white rounded-full hover:bg-primary/90 disabled:opacity-50"
          >
            {savingProf ? "Guardando..." : "Guardar Información Profesional"}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
        <h3 className="text-sm font-semibold text-primary">
          Información Educativa Superior
        </h3>
        <p className="text-xs text-gray-500">
          Puedes editar la información de tu formación universitaria.
        </p>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div>
            <p className="text-xs text-gray-500 font-medium">Formación</p>
            <p className="mt-1 text-sm text-gray-900">
              Universidad los Santos de Cúcuta
            </p>
          </div>
          <button className="h-10 px-4 border border-gray-200 rounded-full flex items-center gap-2 text-sm text-gray-600 hover:bg-gray-50">
            <Pencil className="h-4 w-4 text-gray-500" />
            Editar
          </button>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
        <h3 className="text-sm font-semibold text-primary">Certificaciones</h3>
        <p className="text-xs text-gray-500">
          La información solo podrá ser vista si el especialista o el
          consultorio lo desea.
        </p>
        <div className="mt-4 space-y-2">
          {[
            { name: "Cardiograma.pdf", date: "22.11.2022" },
            { name: "Análisis_general.pdf", date: "10.02.2024" },
            { name: "Cardiograma.pdf", date: "22.11.2022" },
          ].map((file, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between border border-gray-200 rounded-full px-4 py-2"
            >
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-900">{file.name}</p>
                  <p className="text-xs text-gray-500">{file.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <X className="h-5 w-5 text-red-500" />
                <Download className="h-5 w-5 text-gray-500" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
