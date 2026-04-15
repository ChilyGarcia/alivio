"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, Check, File, ImageIcon, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import Pusher from "pusher-js";
import Cookies from "js-cookie";

// Fuerza https en producción para evitar mixed content
function normalizeImageUrl(url: string | null | undefined): string {
  if (!url) return "/images/doc1.png";
  if (typeof window !== "undefined" && window.location.protocol === "https:") {
    return url.replace(/^http:\/\//, "https://");
  }
  return url;
}

interface Message {
  id?: number;
  sender_id: number;
  receiver_id: number;
  message: string;
  image_url?: string | null;
  created_at?: string;
}

interface ChatProps {
  sender_id: number;
  receiver_id: number;
  messages: Message[];
}

interface Receiver {
  id: number;
  name: string;
  email: string;
  gender: string;
  age: null;
  phone_number: string;
  phone_indicator: string;
  email_verified_at: Date;
  created_at: Date;
  updated_at: Date;
  role: string;
  profile_image: string | null;
  profile_image_url: string | null;
}

export default function Chat({ sender_id, receiver_id, messages }: ChatProps) {
  const [messagesSubscribe, setMessages] = useState<Message[]>(messages);
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [senderImageUrl, setSenderImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [receiver, setReceiver] = useState<Receiver>({
    id: 0,
    name: "",
    email: "",
    gender: "",
    age: null,
    phone_number: "",
    phone_indicator: "",
    email_verified_at: new Date(),
    created_at: new Date(),
    updated_at: new Date(),
    role: "",
    profile_image: null,
    profile_image_url: null,
  });
  const router = useRouter();
  const token = Cookies.get("token");

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_PUSHER_APP_KEY) {
      console.error("PUSHER_APP_KEY no está configurado");
      return;
    }

    console.log("🔌 Inicializando Pusher...");
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY, {
      cluster: "mt1",
      enabledTransports: ["ws", "wss"],
    });

    const minId = Math.min(sender_id, receiver_id);
    const maxId = Math.max(sender_id, receiver_id);
    const channelName = `chat.${minId}.${maxId}`;

    console.log(`📡 Suscribiéndose al canal: ${channelName}`);
    console.log(`👤 Sender ID: ${sender_id}, Receiver ID: ${receiver_id}`);

    const channel = pusher.subscribe(channelName);

    // Eventos de conexión de Pusher
    pusher.connection.bind("connected", () => {
      console.log("✅ Pusher conectado exitosamente");
    });

    pusher.connection.bind("disconnected", () => {
      console.log("❌ Pusher desconectado");
    });

    pusher.connection.bind("error", (err: any) => {
      console.error("❌ Error de conexión Pusher:", err);
    });

    // Eventos de suscripción del canal
    channel.bind("pusher:subscription_succeeded", () => {
      console.log(`✅ Suscrito exitosamente al canal: ${channelName}`);
    });

    channel.bind("pusher:subscription_error", (status: any) => {
      console.error(`❌ Error al suscribirse al canal: ${channelName}`, status);
    });

    // Intentar con diferentes formatos del nombre del evento
    const eventNames = [
      "App\\Events\\MessageSent",
      "App.Events.MessageSent",
      "MessageSent",
      "message-sent",
    ];

    eventNames.forEach((eventName) => {
      channel.bind(eventName, (data: Message) => {
        setMessages((prev) => {
          // Si ya existe por ID, ignorar (ya fue agregado por el fetch del remitente)
          if (data.id && prev.some((m) => m.id === data.id)) return prev;
          return [...prev, data];
        });
      });
    });

    // Listener para todos los eventos (debug)
    channel.bind_global((eventName: string, data: any) => {
      console.log(`🔔 Evento global recibido: ${eventName}`, data);
    });

    return () => {
      console.log(`🔌 Desconectando del canal: ${channelName}`);
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, [sender_id, receiver_id]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Cargar datos del receiver
        const resReceiver = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/get-user-details/${receiver_id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (resReceiver.ok) {
          const data = await resReceiver.json();
          setReceiver(data);
        }

        // Cargar datos del sender (usuario autenticado)
        const resSender = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/get-user-details/${sender_id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (resSender.ok) {
          const senderData = await resSender.json();
          setSenderImageUrl(senderData.profile_image_url || null);
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    console.log("Este es el dato del receiver", receiver);
  }, [receiver]);

  // Auto-scroll al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesSubscribe]);

  const handleSendMessage = (imageFile?: File) => {
    if (!imageFile && messageInput.trim() === "") return;

    const messageToSend = messageInput;
    setMessageInput("");

    const tempId = `temp-${Date.now()}`;
    const optimisticMsg: Message & { tempId?: string } = {
      tempId,
      sender_id,
      receiver_id,
      message: messageToSend,
      image_url: imageFile ? URL.createObjectURL(imageFile) : null,
      created_at: new Date().toISOString().replace("T", " ").substring(0, 19),
    };
    setMessages((prev) => [...prev, optimisticMsg]);

    const formData = new FormData();
    formData.append("receiver_id", String(receiver_id));
    if (messageToSend.trim()) formData.append("message", messageToSend);
    if (imageFile) formData.append("image", imageFile);

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/message`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          console.error("Error al enviar mensaje:", data);
          // revertir optimista
          setMessages((prev) => prev.filter((m) => (m as any).tempId !== tempId));
        } else {
          // reemplazar el optimista con el real (Pusher lo ignorará por ID duplicado)
          setMessages((prev) =>
            prev.map((m) => ((m as any).tempId === tempId ? data.message : m))
          );
        }
      })
      .catch((error) => {
        console.error("Error al enviar mensaje:", error);
        setMessages((prev) => prev.filter((m) => (m as any).tempId !== tempId));
      });
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleSendMessage(file);
    e.target.value = "";
  };

  const handleRouterMyAppointments = () => {
    router.push("/");
  };

  return (
    <div className="flex flex-col h-screen w-full max-w-2xl mx-auto bg-gray-50">
      <header className="sticky top-0 z-10 flex items-center gap-4 p-4 bg-blue-700 text-white">
        <button className="p-1" onClick={() => router.back()}>
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-3 flex-1">
          <div className="relative w-10 h-10 rounded-full overflow-hidden">
            <Image
              src={normalizeImageUrl(receiver.profile_image_url)}
              alt="Profile picture"
              width={40}
              height={40}
              className="object-cover"
            />
          </div>
          <div>
            <h1 className="font-medium"> {receiver.name} </h1>
            <p className="text-xs text-white/80">{receiver.role}</p>
          </div>
        </div>
        <button className="p-1">
          <File className="w-6 h-6" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messagesSubscribe.map((msg, index) => (
          <div
            key={msg.id || (msg as any).tempId || `msg-${index}`}
            className={`flex ${msg.sender_id === sender_id ? "justify-end" : ""
              }`}
          >
            {msg.sender_id !== sender_id && (
              <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0 mt-2">
                <Image
                  src={normalizeImageUrl(receiver.profile_image_url)}
                  alt="User avatar"
                  width={32}
                  height={32}
                  className="object-cover"
                />
              </div>
            )}
            <div
              className={`max-w-[80%] p-3 rounded-2xl ${msg.sender_id === sender_id
                ? "bg-blue-700 text-white rounded-tr-sm"
                : "bg-gray-200 rounded-tl-sm"
                }`}
            >
              {msg.image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={normalizeImageUrl(msg.image_url)}
                  alt="imagen"
                  className="rounded-lg mb-1 max-w-[200px] object-cover"
                />
              )}
              {msg.message?.trim() && <p>{msg.message}</p>}
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500 pl-2">
              <span>{msg.created_at?.split(" ")[1]}</span>
              <Check className="w-4 h-4" />
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t bg-white flex items-center gap-2">
        <input
          type="text"
          placeholder="Escribe tu mensaje aquí"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
          className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:border-blue-500"
        />

        <button className="p-2" onClick={() => fileInputRef.current?.click()}>
          <ImageIcon className="w-6 h-6 text-gray-500" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageSelect}
        />
        <button
          className="p-2 bg-blue-700 rounded-full text-white"
          onClick={() => handleSendMessage()}
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
