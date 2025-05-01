"use client";

import React, { useEffect, useState, useCallback } from "react";
import { ArrowLeft, MessageSquare, Bell, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { authenticationService } from "@/services/auth.service";
import { User as UserInterface } from "@/interfaces/user.interface";
import ProfileEditForm from "@/components/ProfessionalComponents/ProfileEditForm";
import ServicesSection from "@/components/ProfessionalComponents/ServicesSection";
import AppointmentsSection from "@/components/ProfessionalComponents/AppointmentsSection";

export default function ProfileTabsPage() {
  const [user, setUser] = useState<UserInterface | null>(null);
  const [unread, setUnread] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "Datos de Perfil" | "Servicios" | "Citas"
  >("Datos de Perfil");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const router = useRouter();

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

      <div className="mt-4 px-4 pb-8 space-y-6">
        {activeTab === "Datos de Perfil" && (
          <ProfileEditForm initialUser={user} />
        )}
        {activeTab === "Servicios" && <ServicesSection />}
        {activeTab === "Citas" && <AppointmentsSection />}
      </div>
    </div>
  );
}
