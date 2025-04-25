"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Heart, Star, User, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { backendService } from "@/services/backend.service";
import Cookies from "js-cookie";
import NavBar from "@/components/navbar";

// --- tu Button y helper cn intactos ---
const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "ghost" | "default";
    size?: "icon" | "default";
  }
>(({ className, variant = "default", size = "default", ...props }, ref) => (
  <button
    className={cn(
      "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
      {
        "bg-primary text-primary-foreground shadow hover:bg-primary/90":
          variant === "default",
        "hover:bg-primary/90 hover:text-accent-foreground": variant === "ghost",
        "h-9 px-4": size === "default",
        "h-9 w-9": size === "icon",
      },
      className
    )}
    ref={ref}
    {...props}
  />
));
Button.displayName = "Button";

function cn(
  ...classes: (
    | string
    | boolean
    | undefined
    | null
    | { [key: string]: boolean }
  )[]
) {
  return classes.filter(Boolean).join(" ");
}

interface HealthProfessional {
  id: number;
  user_id: number;
  specialty_id: number;
  description: string;
  rating: string;
  hourly_rate: string;
  reviews: number;
  created_at: string;
  updated_at: string;
  user?: {
    name: string;
    email: string;
    profile_image: string;
  };
}

interface Favorite {
  id: number;
  user_id: number;
  health_professional_id: number;
  created_at: string;
  updated_at: string;
  health_professional: HealthProfessional;
}

export default function FavoriteHealthProfessionalPage() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const data = await backendService.getFavorites();
        console.log("Datos recibidos:", data);

        if (data && Array.isArray(data)) {
          setFavorites(data);
        } else {
          console.error("Datos inválidos recibidos:", data);
          setFavorites([]);
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
        setFavorites([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  console.log("Estado actual de favorites:", favorites);

  const handleBack = () => router.push("/");

  const handleRemoveFavorite = async (id: number) => {
    try {
      await backendService.removeFavorite(id);
      setFavorites((prevFavorites) => prevFavorites.filter((f) => f.id !== id));
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <NavBar></NavBar>

      <div
        className="min-h-screen bg-gradient-to-br from-white to-gray-50 py-10 mt-12"
        suppressHydrationWarning
      >
        <div className="max-w-2xl mx-auto px-4" suppressHydrationWarning>
          {/* Encabezado de la página con animación */}
          <div className="flex items-center gap-3 mb-8 animate-fade-in">
            <button
              className="p-2.5 rounded-full hover:bg-white/80 transition-all duration-300 hover:shadow-md active:scale-95"
              onClick={handleBack}
            >
              <ArrowLeft className="w-6 h-6 text-primary" />
            </button>
            <h1 className="text-2xl font-semibold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Profesionales Favoritos
            </h1>
          </div>

          {/* Contenido */}
          <div
            className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100"
            suppressHydrationWarning
          >
            <div className="p-8" suppressHydrationWarning>
              {/* Lista de cards */}
              {favorites.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500 animate-fade-in">
                  <div className="relative">
                    <Heart className="w-20 h-20 text-gray-200 animate-pulse" />
                    <Heart className="w-20 h-20 text-primary/10 absolute top-0 left-0 animate-ping" />
                  </div>
                  <p className="text-xl font-medium mt-6 text-gray-600">
                    No tienes favoritos
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    Agrega profesionales a tu lista de favoritos
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {favorites.map(
                    ({ id, health_professional: hp, created_at }, index) => (
                      <div
                        key={id}
                        className="relative bg-white rounded-xl border border-gray-100 p-6 hover:border-primary/20 transition-all duration-300 hover:shadow-lg group animate-fade-in"
                        style={{ animationDelay: `${index * 150}ms` }}
                      >
                        {/* Corazón con animación */}
                        <button
                          className="absolute top-4 right-4 text-red-500 hover:scale-110 transform transition-all duration-300 active:scale-95"
                          onClick={() => handleRemoveFavorite(id)}
                        >
                          <Heart className="h-6 w-6 fill-current hover:drop-shadow-md" />
                        </button>

                        {/* Contenido */}
                        <div className="flex items-start gap-5">
                          <div className="w-16 h-16 bg-primary/5 rounded-xl flex-shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform duration-300 overflow-hidden">
                            {hp.user?.profile_image ? (
                              <img
                                src={hp.user.profile_image}
                                alt={hp.user?.name || "Doctor"}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User className="w-8 h-8 text-primary" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 group-hover:text-primary transition-colors">
                              {hp.user?.name || hp.description.split(" - ")[0]}
                            </h3>
                            <p className="text-sm text-gray-500 line-clamp-1">
                              {hp.description.split(" - ")[1] || "Especialista"}
                            </p>
                            <p className="text-xs text-gray-400 mb-3">
                              {hp.user?.email}
                            </p>
                            <div className="flex flex-wrap items-center gap-3 text-sm">
                              <div className="flex items-center bg-yellow-50 border border-yellow-100 px-3 py-1.5 rounded-lg whitespace-nowrap">
                                <Star className="h-4 w-4 text-yellow-400 mr-1.5" />
                                <span className="text-gray-700 font-medium text-xs">
                                  {hp.rating}
                                </span>
                                <span className="text-gray-500 ml-1 text-xs">
                                  ({hp.reviews} reseñas)
                                </span>
                              </div>
                              <div className="bg-primary/5 px-3 py-1.5 rounded-lg text-primary font-medium whitespace-nowrap">
                                ${Number(hp.hourly_rate).toLocaleString()} /hora
                              </div>
                              <div className="flex items-center text-gray-500 text-xs gap-1">
                                <Calendar className="h-4 w-4" />
                                Favorito desde {formatDate(created_at)}
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-md">
                                ID: {hp.id}
                              </span>
                              <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded-md">
                                Specialty ID: {hp.specialty_id}
                              </span>
                              <span className="text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded-md">
                                User ID: {hp.user_id}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Botones */}
                        <div className="flex gap-3 mt-5">
                          <button className="flex-1 bg-white border border-gray-200 text-gray-700 py-2.5 px-4 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all duration-300 hover:shadow-md active:scale-98">
                            Ver perfil
                          </button>
                          <button className="flex-1 py-2.5 px-4 rounded-lg text-sm font-medium bg-primary hover:bg-primary/90 text-white transition-all duration-300 hover:shadow-md active:scale-98">
                            Agendar cita
                          </button>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </>
  );
}
