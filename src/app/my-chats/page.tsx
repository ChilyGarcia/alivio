"use client";

import { useState } from "react";
import Image from "next/image";
import NavBar from "@/components/navbar";

export default function ChatPage() {
  const [searchText, setSearchText] = useState("");

  const availableChats = [
    {
      id: 1,
      name: "Dr José Pérez",
      message: "Nuestra cita es para el día...",
      time: "10:45 PM",
      avatar: "/images/doc1.png",
      writing: false,
    },
    {
      id: 2,
      name: "Dr José Pérez",
      message: "Escribiendo...",
      time: "10:45 PM",
      avatar: "/images/doc1.png",
      writing: true,
    },
  ];

  const closedChats = [
    {
      id: 3,
      name: "Dr José Pérez",
      message: "Nuestra*",
      time: "10:45 PM",
      avatar: "/images/doc1.png",
      hasNotification: true,
    },
    {
      id: 4,
      name: "Dr José Pérez",
      message: "Nuestra cita es para el día...",
      time: "10:45 PM",
      avatar: "/images/doc1.png",
    },
    {
      id: 5,
      name: "Dr José Pérez",
      message: "Escribiendo...",
      time: "10:45 PM",
      avatar: "/images/doc1.png",
      writing: true,
    },
    {
      id: 6,
      name: "Dr José Pérez",
      message: "Nuestra*",
      time: "10:45 PM",
      avatar: "/images/doc1.png",
      hasNotification: true,
    },
  ];

  return (
    <>
      <NavBar></NavBar>

      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="border-b p-4">
          <div className="flex items-center gap-3">
            <button
              className="text-blue-800"
              onClick={() => console.log("back clicked")}
            >
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
        <div className="p-4">
          {/* Available Chats */}
          <div className="mb-6">
            <h2 className="mb-4 text-lg font-bold text-blue-800">
              Chats Disponibles
            </h2>
            <div className="space-y-4">
              {availableChats.map((chat) => (
                <div
                  key={chat.id}
                  className="flex items-center gap-3 rounded-lg p-2 hover:bg-gray-50"
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
                    <h3 className="font-semibold text-gray-900">{chat.name}</h3>
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
          </div>

          {/* Closed Chats */}
          <div>
            <h2 className="mb-4 text-lg font-bold text-blue-800">
              Chats Cerrados
            </h2>
            <div className="space-y-4">
              {closedChats.map((chat) => (
                <div
                  key={chat.id}
                  className="flex items-center gap-3 rounded-lg p-2 hover:bg-gray-50"
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
                    <h3 className="font-semibold text-gray-900">{chat.name}</h3>
                    <p
                      className={`truncate text-sm ${
                        chat.writing ? "text-blue-800" : "text-gray-500"
                      }`}
                    >
                      {chat.message}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs text-gray-500">{chat.time}</span>
                    {chat.hasNotification && (
                      <div className="h-2 w-2 rounded-full bg-blue-800"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

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
