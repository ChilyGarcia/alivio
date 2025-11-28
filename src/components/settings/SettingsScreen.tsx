"use client";

import {
  ArrowLeft,
  User,
  Sun,
  Users,
  Shield,
  FileText,
  LogOut,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Switch } from "@/components/ui/switch";
import Navbar from "@/components/navbar";
import { authenticationService } from "@/services/auth.service";
import Cookies from "js-cookie";

type SettingItem = {
  id: string;
  title: string;
  icon: React.ReactNode;
  action?: () => void;
  rightElement?: React.ReactNode;
};

export function SettingsScreen() {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [user, setUser] = useState({ name: "Usuario" });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = Cookies.get("token");
        if (token) {
          const userData = await authenticationService.userDetails();
          setUser(userData);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, []);

  const settingsItems: SettingItem[] = [
    {
      id: "support",
      title: "Soporte AliviApp",
      icon: (
        <div className="w-5 h-5 relative">
          <Image
            src="/images/images-settings/soporte.png"
            alt="Soporte"
            width={20}
            height={20}
            className="w-full h-full object-contain"
          />
        </div>
      ),
      action: () => console.log("Support clicked"),
    },
    {
      id: "theme",
      title: "Modo claro",
      icon: (
        <div className="w-5 h-5 relative">
          <Image
            src="/images/images-settings/switch.png"
            alt="Tema"
            width={20}
            height={20}
            className="w-full h-full object-contain"
          />
        </div>
      ),
      rightElement: (
        <Switch
          checked={!isDarkMode}
          onCheckedChange={() => setIsDarkMode(!isDarkMode)}
          className="data-[state=checked]:bg-blue-600"
        />
      ),
    },
    {
      id: "switch-account",
      title: "Iniciar sesión con otra cuenta",
      icon: (
        <div className="w-5 h-5 relative">
          <Image
            src="/images/images-settings/sessions.png"
            alt="Cambiar cuenta"
            width={20}
            height={20}
            className="w-full h-full object-contain"
          />
        </div>
      ),
      action: () => console.log("Switch account clicked"),
    },
    {
      id: "privacy",
      title: "Política de privacidad",
      icon: (
        <div className="w-5 h-5 relative">
          <Image
            src="/images/images-settings/politica.png"
            alt="Política de privacidad"
            width={20}
            height={20}
            className="w-full h-full object-contain"
          />
        </div>
      ),
      action: () => console.log("Privacy policy clicked"),
    },
    {
      id: "terms",
      title: "Términos y condiciones",
      icon: (
        <div className="w-5 h-5 relative">
          <Image
            src="/images/images-settings/termino-condiciones.png"
            alt="Términos y condiciones"
            width={20}
            height={20}
            className="w-full h-full object-contain"
          />
        </div>
      ),
      action: () => console.log("Terms and conditions clicked"),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />

      <main className="container mx-auto px-4 py-6 pt-20">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button className="text-blue-800" onClick={() => router.back()}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-blue-800">Configuración</h1>
        </div>

        {/* Profile Section */}
        <div className="bg-[#0C0CAA] rounded-2xl p-6 mb-6 flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
            <Image
              src="/images/card1fix.png"
              alt="Profile"
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">
              {user?.name || "Usuario"}
            </h2>
            <p className="text-sm text-white">Perfil</p>
          </div>
        </div>

        {/* Settings List */}
        <div className="overflow-hidden">
          {settingsItems.map((item) => (
            <div
              key={item.id}
              onClick={item.action}
              className={`flex items-center justify-between p-4 ${
                item.action ? "hover:bg-gray-50 cursor-pointer" : ""
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="p-1.5 rounded-lg">{item.icon}</div>
                <span className="text-[#0C0CAA] font-semibold">
                  {item.title}
                </span>
              </div>
              {item.rightElement}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
