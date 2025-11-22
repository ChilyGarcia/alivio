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

  const route =
    user.role === "professional"
      ? "/professionals/profile"
      : "/edit-my-profile";

  const menuItems = [
    { icon: User, label: "Datos de Perfil", href: route },
    { icon: Calendar, label: "Citas", href: "/my-appointments" },
    { icon: MessageSquare, label: "Chats", href: "/my-chats" },
    { icon: BarChart2, label: "Tu Historial", href: "/statistics" },
  ];

  const handleLogout = async () => {
    try {
      const response = await authenticationService.logOut();
      if (response) {
        Cookies.remove("token");
        router.push("/");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
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
            onClick={() => router.push("/my-chats")}
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

      <div className="bg-white p-4 sm:p-6 rounded-2xl mx-2 sm:mx-5 mt-6 sm:ml-10 lg:ml-40 shadow-sm relative">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-full bg-white border-4 border-white overflow-hidden shadow-md flex-shrink-0">
            {user.profile_image_url ? (
              <img
                src={user.profile_image_url}
                alt={user.name || "Usuario"}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-primary/10 text-3xl sm:text-4xl font-semibold text-primary">
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
            )}
          </div>
          <div className="w-full sm:ml-4 flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-2">
              <div className="w-full">
                <h1 className="text-xl font-bold text-primary">
                  {user.name || "Usuario"}
                </h1>
                <p className="text-sm text-primary/80">
                  {user.email || "usuario@ejemplo.com"}
                </p>
                <p className="text-sm text-primary/70">
                  Miembro desde{" "}
                  {user.created_at
                    ? new Date(user.created_at).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                      })
                    : "hace un tiempo"}
                </p>
              </div>
              <button
                onClick={() => router.push(route)}
                className="text-xs bg-white text-primary border border-primary hover:bg-primary/5 font-medium py-1.5 px-3 rounded-lg transition ml-2 whitespace-nowrap"
              >
                Editar perfil
              </button>
            </div>
          </div>
        </div>
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
