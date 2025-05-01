"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  ArrowLeft,
  MessageSquare,
  Bell,
  Settings,
  ChevronDown,
  ChevronUp,
  Plus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { authenticationService } from "@/services/auth.service";
import { User as UserInterface } from "@/interfaces/user.interface";

// Reusable LabeledField component
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

export default function ProfileTabsPage() {
  const [user, setUser] = useState<UserInterface | null>(null);
  const [unread, setUnread] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "Datos de Perfil" | "Servicios" | "Citas"
  >("Datos de Perfil");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const router = useRouter();

  // Fetch user and notifications
  useEffect(() => {
    async function load() {
      try {
        const u = await authenticationService.userDetails();
        setUser(u);
        const token = Cookies.get("token");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/notifications`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.ok) {
          const data = await res.json();
          setUnread(data.unread > 0);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Handle avatar change outside form
  const handleAvatarChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append("profile_image", file);
        try {
          await authenticationService.updateUser(formData);
          const updated = await authenticationService.userDetails();
          setUser(updated);
          setAvatarPreview(
            updated.profile_image_url || URL.createObjectURL(file)
          );
        } catch (err) {
          console.error(err);
          alert("Error al actualizar la foto de perfil");
        }
      }
    },
    []
  );

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header blanco */}
      <header className="flex items-center justify-between p-4 bg-white shadow-sm">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft className="h-6 w-6 text-primary" />
        </button>
        <h2 className="text-lg font-semibold text-primary">Perfil</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/chats")}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <MessageSquare className="h-6 w-6 text-primary" />
          </button>
          <button
            onClick={() => router.push("/notifications")}
            className="relative p-2 rounded-full hover:bg-gray-100"
          >
            <Bell className="h-6 w-6 text-primary" />
            {unread && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full" />
            )}
          </button>
          <button
            onClick={() => router.push("/settings")}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <Settings className="h-6 w-6 text-primary" />
          </button>
        </div>
      </header>

      {/* Avatar con carga de imagen */}
      <div className="mt-4 px-4">
        <div className="flex flex-col items-center bg-white rounded-2xl p-6 shadow-md">
          <label className="relative h-24 w-24 rounded-full ring-4 ring-primary overflow-hidden hover:scale-105 transition cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
            {avatarPreview || user.profile_image_url ? (
              <img
                src={avatarPreview || user.profile_image_url}
                alt="avatar"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-200 text-xl font-semibold text-gray-600">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="absolute inset-0 bg-black bg-opacity-25 opacity-0 hover:opacity-100 flex items-center justify-center text-white text-sm font-medium transition">
              Cambiar foto
            </div>
          </label>
          <h1 className="mt-4 text-xl font-semibold text-primary">
            {user.name}
          </h1>
          <h2 className="text-sm text-gray-500">Cardiólogo especializado</h2>
          <p className="mt-2 text-center text-xs text-gray-500 px-8">
            Administra tu información personal y profesional en tu panel de
            usuario.{" "}
            <a href="#" className="underline text-primary">
              Más información
            </a>
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 px-4">
        <nav className="flex space-x-6 border-b border-gray-200">
          {["Datos de Perfil", "Servicios", "Citas"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`pb-2 text-sm font-medium ${
                activeTab === tab
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
        <p className="mt-2 text-xs text-gray-500">
          {activeTab === "Datos de Perfil" &&
            "Edita y actualiza tus datos personales. Asegúrate de completar todos los campos."}
          {activeTab === "Servicios" &&
            "Puedes mostrar a tus pacientes y usuarios los servicios, precios y ofertas. Más información."}
          {activeTab === "Citas" &&
            "Aquí podrás ver y gestionar tus próximas citas con pacientes. Más información."}
        </p>
      </div>

      {/* Contenido */}
      <div className="mt-4 px-4 pb-8 space-y-6">
        {activeTab === "Datos de Perfil" && (
          <ProfileEditForm initialUser={user} />
        )}
        {activeTab === "Servicios" && <ServicesSection />}
        {activeTab === "Citas" && <CitasSection />}
      </div>
    </div>
  );
}

// Formulario de edición sin lógica de foto
function ProfileEditForm({ initialUser }: { initialUser: UserInterface }) {
  const [form, setForm] = useState({
    name: initialUser.name || "",
    email: initialUser.email || "",
    phone_number: initialUser.phone_number || "",
    document_type: initialUser.document_type || "cc",
    document_number: initialUser.document_number || "",
  });
  const [saving, setSaving] = useState(false);
  const router = useRouter();

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
      form.document_type &&
        formData.append("document_type", form.document_type);
      form.document_number &&
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
  );
}

function ServicesSection() {
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

function CitasSection() {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 text-center text-gray-500">
      Sección de Citas (pendiente de implementación)
    </div>
  );
}
