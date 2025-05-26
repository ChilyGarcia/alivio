"use client";

import {
  ArrowLeft,
  MessageSquare,
  Bell,
  Settings,
  User,
  Calendar,
  Package2 as ServicesIcon,
  Building,
  UserCheck,
  BarChart2,
  LogOut,
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
  role: "",
};

export default function ProfilePage() {
  const [user, setUser] = React.useState<UserInterface>(initialUserState);
  const [unread, setUnread] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
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
          const data = await res.json();
          setUnread(data.unread > 0);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const profileHref =
    user.role === "professional"
      ? "/professionals/profile"
      : "/edit-my-profile";

  const menuItems = [
    { icon: User, label: "Datos de Perfil", href: profileHref },
    { icon: ServicesIcon, label: "Servicios", href: "/services" },
    { icon: Calendar, label: "Citas", href: "/my-appointments" },
    { icon: MessageSquare, label: "Chats", href: "/chats" },
    { icon: Building, label: "Empresas", href: "/companies" },
    { icon: UserCheck, label: "Sé un usuario", href: "/become-user" },
    { icon: BarChart2, label: "Tus estadísticas", href: "/statistics" },
    { icon: Calendar, label: "Calendario", href: "/calendar" },
  ];

  const handleLogout = () => {
    Cookies.remove("token");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="flex items-center justify-between px-4 py-3">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-full hover:bg-gray-50 transition"
        >
          <ArrowLeft className="h-6 w-6 text-primary" />
        </button>
        <h2 className="text-lg font-semibold text-primary">Perfil</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/chats")}
            className="p-2 rounded-full hover:bg-gray-50 transition"
          >
            <MessageSquare className="h-6 w-6 text-primary" />
          </button>
          <button
            onClick={() => router.push("/notifications")}
            className="relative p-2 rounded-full hover:bg-gray-50 transition"
          >
            <Bell className="h-6 w-6 text-primary" />
            {unread && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full"></span>
            )}
          </button>
          <button
            onClick={() => router.push("/settings")}
            className="p-2 rounded-full hover:bg-gray-50 transition"
          >
            <Settings className="h-6 w-6 text-primary" />
          </button>
        </div>
      </header>

      <div className="flex flex-col items-center mt-4 px-4">
        <div className="h-24 w-24 rounded-full ring-4 ring-primary overflow-hidden hover:scale-105 transition">
          {user.profile_image_url ? (
            <img
              src={user.profile_image_url}
              alt="avatar"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-200 text-xl font-semibold text-gray-600">
              {user.name.charAt(0) || "P"}
            </div>
          )}
        </div>
        <h1 className="mt-3 text-xl font-semibold text-primary">
          {user.name || "Dr. José Pérez"}
        </h1>
        <h2 className="mt-1 text-sm font-medium text-gray-500">
          Cardiólogo especializado
        </h2>
        <p className="mt-4 text-center text-sm text-gray-600 max-w-[280px] mx-auto leading-relaxed">
          Administra tu información personal y profesional en tu panel de
          usuario.&nbsp;
          <a href="#" className="font-medium text-primary hover:underline">
            Más información
          </a>
        </p>
      </div>

      <div className="mt-6 px-4 pb-8 space-y-3 ">
        <ul className="space-y-3">
          {menuItems.map(({ icon: Icon, label, href }) => (
            <MenuItem key={label} icon={Icon} label={label} href={href} />
          ))}
          <MenuItem
            icon={LogOut}
            label="Cerrar Sesión"
            onClick={handleLogout}
          />
        </ul>
      </div>
    </div>
  );
}

interface MenuItemProps {
  icon: React.ComponentType<any>;
  label: string;
  href?: string;
  onClick?: () => void;
}

function MenuItem({ icon: Icon, label, href, onClick }: MenuItemProps) {
  const baseStyles =
    "flex items-center gap-3 p-3 border border-primary rounded-full w-full shadow-sm hover:shadow-md transition";
  const content = (
    <>
      <div className="h-8 w-8 rounded-full border-2 border-primary flex items-center justify-center">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <span className="text-sm font-medium text-primary">{label}</span>
    </>
  );

  if (onClick) {
    return (
      <li>
        <button
          type="button"
          onClick={onClick}
          className={`${baseStyles} text-left hover:bg-gray-50 transition`}
        >
          {content}
        </button>
      </li>
    );
  }

  return (
    <li>
      <a href={href} className={`${baseStyles} hover:bg-gray-50 transition`}>
        {content}
      </a>
    </li>
  );
}
