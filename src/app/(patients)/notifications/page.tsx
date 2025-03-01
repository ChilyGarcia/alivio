"use client";

import { useEffect, useState } from "react";
import { Check, Trash, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface Notification {
  id: number;
  title: string;
  description: string;
  read: boolean;
}

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const token = Cookies.get("token");

    try {
      const response = await fetch(`${API_BASE_URL}/notifications`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Error al obtener notificaciones");

      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error("Error obteniendo notificaciones:", error);
    }
  };

  const markAsRead = async (id: number) => {
    const token = Cookies.get("token");

    try {
      await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      console.error("Error marcando como leída:", error);
    }
  };

  const deleteNotification = async (id: number) => {
    try {
      await fetch(`${API_BASE_URL}/notifications/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    } catch (error) {
      console.error("Error eliminando notificación:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="bg-[#0000CC] text-white p-4 flex items-center justify-between">
        <button
          onClick={() => router.push("/")}
          className="text-white hover:text-white/80 transition-transform transform hover:scale-105"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <span className="text-lg font-medium">Notificaciones</span>
        <div></div>
      </div>

      <div className="p-4">
        {notifications.length === 0 ? (
          <p className="text-gray-500 text-center">No hay notificaciones.</p>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className={`flex justify-between items-center p-4 rounded-xl mb-3 transition-all duration-300 shadow-md ${
                notif.read
                  ? "bg-gray-100 opacity-60"
                  : "bg-white hover:shadow-lg"
              }`}
            >
              <div className="pr-6">
                <h3 className="font-semibold text-sm text-gray-900">{notif.title}</h3>
                <p className="text-sm text-gray-600 text-justify mt-2">{notif.description}</p>
              </div>
              <div className="flex gap-3">
                {!notif.read && (
                  <button
                    onClick={() => markAsRead(notif.id)}
                    className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition-all transform hover:scale-110"
                  >
                    <Check className="h-5 w-5" />
                  </button>
                )}
                <button
                  onClick={() => deleteNotification(notif.id)}
                  className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-all transform hover:scale-110"
                >
                  <Trash className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
