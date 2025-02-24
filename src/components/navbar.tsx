"use client";
import React, { useState } from "react";
import { Ambulance, Calendar, Bell } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { backendService } from "@/services/backend.service";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = React.useState(false);
  const [token, setToken] = useState(false);
  const router = useRouter();

  const fetchNotificationsService = async () => {
    try {
      const response = await backendService.getNotifications();
      const hasUnread = response.some((notif) => !notif.read);
      setUnreadNotifications(hasUnread);
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    const token = Cookies.get("token");

    if (token) {
      setToken(true);
      fetchNotificationsService();
    }
  }, []);

  const handleNotification = () => {
    console.log("Notification button");
    router.push("/notifications");
  };

  return (
    <nav className="bg-white py-3 px-6 w-full fixed top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <a href="/" className="flex items-center">
          <Image
            src="/images/LogoAlivio.png"
            alt="Logo de Alivio"
            width={120}
            height={40}
            className="w-24 md:w-32 lg:w-36"
          />
        </a>

        <div className="flex items-center space-x-4">
          {token && (
            <button
              className="relative text-gray-600 hover:text-gray-800 transition-all"
              onClick={() => handleNotification()}
            >
              <Bell className="h-6 w-6" />
              {unreadNotifications && (
                <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-red-500 rounded-full"></span>
              )}
            </button>
          )}

          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`${
                isOpen
                  ? "bg-white text-primary border border-primary"
                  : "bg-primary text-white"
              } px-3 py-2 rounded-full transition-all flex items-center text-xs font-medium w-28 shadow-md hover:shadow-lg`}
            >
              <span className="font-bold">Emergencia</span>
              <svg
                width="10"
                height="10"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`ml-1 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              >
                <path
                  d="M2.5 4.5L6 8L9.5 4.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {isOpen && (
              <div className="absolute mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 w-32 overflow-hidden">
                <button className="w-full bg-primary text-white py-2 px-3 flex items-center justify-start space-x-2 hover:bg-primary/90 transition-all">
                  <Ambulance size={14} />
                  <span className="text-xs">Llamar</span>
                </button>

                <button className="w-full bg-white text-gray-700 py-2 px-3 flex items-center justify-start space-x-2 hover:bg-primary hover:text-white transition-all border-t border-gray-200">
                  <Calendar size={14} />
                  <span className="text-xs">Citas</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
