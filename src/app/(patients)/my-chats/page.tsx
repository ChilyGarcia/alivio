"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import NavBar from "@/components/navbar";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface Chat {
  id: number;
  name: string;
  message: string;
  time: string;
  avatar: string;
  writing?: boolean;
  hasNotification?: boolean;
  receiver_id: number;
  status?: string;
}

export default function ChatPage() {
  const [searchText, setSearchText] = useState("");
  const [availableChats, setAvailableChats] = useState<Chat[]>([]);
  const [closedChats, setClosedChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      const token = Cookies.get("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/conversations`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al obtener los chats");
      }

      const data = await response.json();

      // El backend debería retornar las conversaciones con el último mensaje
      // Mapear los datos del backend al formato esperado
      const mappedChats = data.map((conversation: any) => ({
        id: conversation.other_user.id,
        name: conversation.other_user.name,
        message: conversation.last_message.message || "Sin mensajes",
        time: formatTime(conversation.last_message.created_at),
        avatar: conversation.other_user.profile_image_url || "/images/doc1.png",
        writing: false,
        hasNotification: conversation.unread_count > 0,
        receiver_id: conversation.other_user.id,
        status: conversation.status || "active",
      }));

      // Separar chats activos y cerrados
      const active = mappedChats.filter(
        (chat: Chat) => chat.status === "active" || !chat.status
      );
      const closed = mappedChats.filter(
        (chat: Chat) => chat.status === "closed"
      );

      setAvailableChats(active);
      setClosedChats(closed);
    } catch (error) {
      console.error("Error fetching chats:", error);
      // En caso de error, mantener arrays vacíos
      setAvailableChats([]);
      setClosedChats([]);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString: string) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 24) {
      return date.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return date.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
      });
    }
  };

  const handleChatClick = (receiverId: number) => {
    router.push(`/chat?receiver_id=${receiverId}`);
  };

  const filteredAvailableChats = availableChats.filter((chat) =>
    chat.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const filteredClosedChats = closedChats.filter((chat) =>
    chat.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <>
      <NavBar></NavBar>

      <div className="min-h-screen bg-white mt-12">
        {/* Header */}
        <header className="border-b p-4">
          <div className="flex items-center gap-3">
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
            <h1 className="text-xl font-bold text-blue-800">Chats</h1>
          </div>

          {/* Search Bar */}
          <div className="relative mt-4">
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
            <input
              type="text"
              placeholder="Puedes buscar especialistas o clínicas"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-10 text-sm focus:border-blue-800 focus:outline-none focus:ring-1 focus:ring-blue-800"
            />
            {searchText && (
              <button
                onClick={() => setSearchText("")}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
        </header>

        {/* Chat Lists */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="p-4">
            {/* Available Chats */}
            <div className="mb-6">
              <h2 className="mb-4 text-lg font-bold text-blue-800">
                Chats Disponibles
              </h2>
              {filteredAvailableChats.length > 0 ? (
                <div className="space-y-4">
                  {filteredAvailableChats.map((chat) => (
                    <div
                      key={chat.id}
                      className="flex items-center gap-3 rounded-lg p-2 hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleChatClick(chat.receiver_id)}
                    >
                      <div className="relative h-12 w-12 flex-shrink-0">
                        <Image
                          src={chat.avatar || "/placeholder.svg"}
                          alt={chat.name}
                          fill
                          className="rounded-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900">
                          {chat.name}
                        </h3>
                        <p
                          className={`truncate text-sm ${
                            chat.writing ? "text-blue-800" : "text-gray-500"
                          }`}
                        >
                          {chat.message}
                        </p>
                      </div>
                      <div className="text-xs text-gray-500">{chat.time}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No hay chats disponibles
                </p>
              )}
            </div>

            {/* Closed Chats */}
            <div>
              <h2 className="mb-4 text-lg font-bold text-blue-800">
                Chats Cerrados
              </h2>
              {filteredClosedChats.length > 0 ? (
                <div className="space-y-4">
                  {filteredClosedChats.map((chat) => (
                    <div
                      key={chat.id}
                      className="flex items-center gap-3 rounded-lg p-2 hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleChatClick(chat.receiver_id)}
                    >
                      <div className="relative h-12 w-12 flex-shrink-0">
                        <Image
                          src={chat.avatar || "/placeholder.svg"}
                          alt={chat.name}
                          fill
                          className="rounded-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900">
                          {chat.name}
                        </h3>
                        <p
                          className={`truncate text-sm ${
                            chat.writing ? "text-blue-800" : "text-gray-500"
                          }`}
                        >
                          {chat.message}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-xs text-gray-500">
                          {chat.time}
                        </span>
                        {chat.hasNotification && (
                          <div className="h-2 w-2 rounded-full bg-blue-800"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No hay chats cerrados
                </p>
              )}
            </div>
          </div>
        )}

        <style jsx global>{`
          @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");

          body {
            font-family: "Inter", sans-serif;
          }
        `}</style>
      </div>
    </>
  );
}
