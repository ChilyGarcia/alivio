"use client";

import React, { useEffect, useState, useRef } from "react";
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
import ProfileDataForm from "@/components/ProfileDataForm";

export default function ProfileTabsPage() {
  const [user, setUser] = useState<UserInterface | null>(null);
  const [unread, setUnread] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "Datos de Perfil" | "Servicios" | "Citas"
  >("Datos de Perfil");
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

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

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setUser((prev) =>
        prev ? { ...prev, profile_image_url: reader.result as string } : prev
      );
    };
    reader.readAsDataURL(file);

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("profile_image", file);
      const token = Cookies.get("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${user.id}/profile_image`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );
      if (res.ok) {
        const updated = await res.json();
        setUser(updated);
      } else {
        console.error("Error updating profile image");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0000CC]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hidden file input for profile image */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Header blanco */}
      <header className="flex items-center justify-between p-4 bg-white shadow-sm">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft className="h-6 w-6 text-[#0000CC]" />
        </button>
        <h2 className="text-lg font-semibold text-[#0000CC]">Perfil</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/chats")}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <MessageSquare className="h-6 w-6 text-[#0000CC]" />
          </button>
          <button
            onClick={() => router.push("/notifications")}
            className="relative p-2 rounded-full hover:bg-gray-100"
          >
            <Bell className="h-6 w-6 text-[#0000CC]" />
            {unread && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full" />
            )}
          </button>
          <button
            onClick={() => router.push("/settings")}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <Settings className="h-6 w-6 text-[#0000CC]" />
          </button>
        </div>
      </header>

      {/* Perfil: avatar, nombre, subtítulo, descripción */}
      <div className="mt-4 px-4">
        <div className="flex flex-col items-center bg-white rounded-2xl p-6 shadow-md">
          <div
            onClick={handleImageClick}
            className={`h-24 w-24 rounded-full ring-4 ring-[#0000CC] overflow-hidden hover:scale-105 transition cursor-pointer ${
              uploading ? "opacity-50" : ""
            }`}
          >
            {user.profile_image_url ? (
              <img
                src={user.profile_image_url}
                alt="avatar"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-200 text-xl font-semibold text-gray-600">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <h1 className="mt-4 text-xl font-semibold text-[#0000CC]">
            {user.name}
          </h1>
          <h2 className="text-sm text-gray-500">Cardiólogo especializado</h2>
          <p className="mt-2 text-center text-xs text-gray-500 px-8">
            Administra tu información personal y profesional en tu panel de
            usuario.{" "}
            <a href="#" className="underline text-[#0000CC]">
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
                  ? "text-[#0000CC] border-b-2 border-[#0000CC]"
                  : "text-gray-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
        <p className="mt-2 text-xs text-gray-500">
          {activeTab === "Datos de Perfil" &&
            "Puedes recopilar la información que creas conveniente para alimentar tu perfil, sean certificaciones o títulos escolares. Más información."}
          {activeTab === "Servicios" &&
            "Puedes mostrar a tus pacientes y usuarios los servicios, precios y ofertas. Más información."}
          {activeTab === "Citas" &&
            "Aquí podrás ver y gestionar tus próximas citas con pacientes. Más información."}
        </p>
      </div>

      {/* Contenido */}
      <div className="mt-4 px-4 pb-8 space-y-6">
        {activeTab === "Datos de Perfil" && <ProfileDataForm user={user} />}
        {activeTab === "Servicios" && <ServicesSection />}
        {activeTab === "Citas" && <CitasSection />}
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
        <Plus className="h-6 w-6 text-[#0000CC]" />
      </div>
      <button className="w-full py-2 text-sm bg-[#0000CC] text-white rounded-full">
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
