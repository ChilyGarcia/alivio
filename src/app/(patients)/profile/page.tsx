"use client";

import {
  ArrowLeft,
  Bell,
  Settings,
  User,
  Calendar,
  MessageSquare,
  History,
  ShoppingCart,
  Package2,
  PenToolIcon as Tool,
  Heart,
} from "lucide-react";
import * as React from "react";
import { authenticationService } from "@/services/auth.service";
import { User as UserInterface } from "@/interfaces/user.interface";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const initialUserState: UserInterface = {
  id: 0,
  name: "",
  email: "",
  email_verified_at: null,
  created_at: null,
  updated_at: new Date(),
  profile_image: "",
  role: "",
};

export default function ProfilePage() {
  const [user, setUser] = React.useState<UserInterface>(initialUserState);
  const [unread, setUnread] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
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
          const notes = await res.json();
          setUnread(notes.some((n: any) => !n.read));
        }
      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, []);

  const handleLogout = () => {
    Cookies.remove("token");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Blue Header Container with bottom rounding */}
      <div className="bg-[#0000CC] rounded-b-3xl pb-8">
        {/* Header */}
        <header className="relative flex items-center justify-between px-4 py-4">
          <button
            onClick={() => router.back()}
            className="text-white hover:text-white/80"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h2 className="absolute left-1/2 transform -translate-x-1/2 text-white font-semibold">
            Perfil
          </h2>
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/notifications")}
              className="relative text-white hover:text-white/80"
            >
              <Bell className="h-6 w-6" />
              {unread && (
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500" />
              )}
            </button>
            <button
              onClick={() => router.push("/settings")}
              className="text-white hover:text-white/80"
            >
              <Settings className="h-6 w-6" />
            </button>
          </div>
        </header>

        {/* Profile Info */}
        <section className="flex flex-col items-center">
          <div className="h-24 w-24 rounded-full border-4 border-white overflow-hidden">
            {user.profile_image ? (
              <img
                src={user.profile_image}
                alt="avatar"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-200 text-xl font-semibold text-gray-600">
                {user.name.charAt(0) || "P"}
              </div>
            )}
          </div>
          <h1 className="mt-2 text-lg font-semibold text-white">
            {user.name || "Pepito Pérez"}
          </h1>
        </section>
      </div>

      {/* White Content */}
      <div className="bg-white pt-8 px-4 pb-8">
        <ul className="space-y-4">
          <MenuItem
            icon={User}
            label="Datos Personales"
            sublabel={user.name || "Pepito Pérez"}
            href="/edit-my-profile"
          />
          <MenuItem
            icon={Calendar}
            label="Citas"
            sublabel="Prox. Cita - 22.01.25 08:00 AM."
            sublabelClassName="text-[#0000CC]"
            href="/my-appointments"
          />
          <MenuItem
            icon={MessageSquare}
            label="Consultas"
            sublabel="Consulta o edita tu información, históricos e informes de especialistas."
            href="/consultations"
          />
          <MenuItem
            icon={ShoppingCart}
            label="Compras"
            sublabel="Aquí puedes ver tus compras realizadas."
            href="/purchases"
          />
          <MenuItem
            icon={Package2}
            label="Planes y Servicios"
            sublabel="Puedes ver los planes y servicios que has comprado."
            href="/plans-services"
          />
          <MenuItem
            icon={Tool}
            label="Herramientas"
            sublabel="Herramientas para tu salud."
            href="/tools"
          />
          <MenuItem
            icon={Heart}
            label="Guardados"
            sublabel="Puedes ver y categorizar tus especialistas, planes y servicios guardados."
            href="/favorite-health-professional"
          />
        </ul>
        <button
          onClick={handleLogout}
          className="mt-6 w-full bg-[#0000CC] text-white py-3 rounded-full flex items-center justify-center space-x-2"
        >
          <ArrowLeft className="h-5 w-5 rotate-180" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
}

function MenuItem({
  icon: Icon,
  label,
  sublabel,
  sublabelClassName,
  href,
}: {
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  sublabel: string;
  sublabelClassName?: string;
  href: string;
}) {
  const router = useRouter();

  return (
    <li>
      <button
        onClick={() => router.push(href)}
        className="w-full flex items-center gap-4 bg-white rounded-full p-4 shadow-md hover:shadow-lg transition-all duration-300"
      >
        <div className="relative flex-shrink-0 w-12 h-12">
          <div className="absolute inset-0 flex items-center justify-center rounded-full border border-[#0000CC] bg-white">
            <Icon size={20} className="text-[#0000CC]" />
          </div>
        </div>
        <div className="flex-1 min-w-0 text-left">
          <h3 className="text-gray-900 font-medium truncate">{label}</h3>
          <p
            className={`mt-1 text-sm truncate ${
              sublabelClassName || "text-gray-500"
            }`}
          >
            {sublabel}
          </p>
        </div>
      </button>
    </li>
  );
}

function cn(
  ...classes: (
    | string
    | boolean
    | undefined
    | null
    | { [key: string]: boolean }
  )[]
) {
  return classes
    .filter(Boolean)
    .map((className) => {
      if (typeof className === "object") {
        return Object.entries(className)
          .filter(([, value]) => value)
          .map(([key]) => key)
          .join(" ");
      }
      return className;
    })
    .join(" ");
}
