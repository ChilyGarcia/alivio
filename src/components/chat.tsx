"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, Check, File, ImageIcon, Send, X } from "lucide-react";
import { useRouter } from "next/navigation";
import Pusher from "pusher-js";
import Cookies from "js-cookie";
import MediaGallery from "@/components/MediaGallery";

// Fuerza https en producción para evitar mixed content
function normalizeImageUrl(url: string | null | undefined): string {
  if (!url || url === "null" || url.includes("null")) return "/images/doc1.png";
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
  temporary_id?: string;
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
  const sentMessageIds = useRef<Set<number>>(new Set());
  const [senderImageUrl, setSenderImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [showMediaPanel, setShowMediaPanel] = useState(false);
  const [mediaPage, setMediaPage] = useState(0);
  const MEDIA_PER_PAGE = 4;

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
          // Si el mensaje ya tiene ID real y ya está en la lista (evita duplicados de Pusher)
          if (data.id && prev.some((m) => m.id === data.id)) return prev;
          
          // Si el mensaje tiene temporary_id y coincide con uno de nuestros mensajes optimistas
          if (data.temporary_id && prev.some((m) => (m as any).tempId === data.temporary_id)) {
            return prev.map((m) => 
              (m as any).tempId === data.temporary_id ? { ...data, tempId: data.temporary_id } : m
            );
          }

          // Si el ID ya está en sentMessageIds, lo ignoramos porque ya lo procesamos en el callback de la petición POST
          if (data.id && sentMessageIds.current.has(data.id)) return prev;

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


  // Auto-scroll al último mensaje
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messagesSubscribe]);

  // Cerrar lightbox con tecla Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxUrl(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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

    // Para imágenes, el blob URL carga instantáneo → esperar al siguiente frame
    if (imageFile) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => scrollToBottom());
      });
    }

    const formData = new FormData();
    formData.append("receiver_id", String(receiver_id));
    if (messageToSend.trim()) formData.append("message", messageToSend);
    if (imageFile) formData.append("image", imageFile);
    formData.append("temporary_id", tempId);

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
          // marcar el ID como enviado por nosotros para que Pusher lo ignore
          if (data.message?.id) sentMessageIds.current.add(data.message.id);
          // reemplazar el optimista con el real, conservando tempId para estabilidad del key
          setMessages((prev) =>
            prev.map((m) =>
              (m as any).tempId === tempId
                ? { ...data.message, tempId }
                : m
            )
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
    <>
    <div className="flex flex-col w-full h-full min-w-0 bg-gray-50 relative">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center gap-4 p-4 bg-blue-700 text-white shrink-0">
        {/* Mobile back btn */}
        <button className="p-1 md:hidden" onClick={() => router.back()}>
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
          <Image
            src={normalizeImageUrl(receiver.profile_image_url)}
            alt="Profile picture"
            width={40}
            height={40}
            className="object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-semibold truncate">{receiver.name}</h1>
          <p className="text-xs text-white/80 capitalize">{receiver.role}</p>
        </div>
        {/* Media button */}
        <button className="p-1" onClick={() => { setShowMediaPanel(true); setMediaPage(0); }}>
          <File className="w-6 h-6" />
        </button>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messagesSubscribe.map((msg, index) => (
          <div
            key={msg.id || (msg as any).tempId || `msg-${index}`}
            className={`flex ${msg.sender_id === sender_id ? "justify-end" : ""}`}
          >
            {msg.sender_id !== sender_id && (
              <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0 mt-2 mr-2">
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
              className={`max-w-[80%] md:max-w-[65%] p-3 rounded-2xl ${
                msg.sender_id === sender_id
                  ? "bg-blue-700 text-white rounded-tr-sm"
                  : "bg-white shadow-sm rounded-tl-sm text-gray-800"
              }`}
            >
              {msg.image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={normalizeImageUrl(msg.image_url)}
                  alt="imagen"
                  className="rounded-lg mb-1 max-w-[220px] object-cover cursor-pointer hover:opacity-90 transition-opacity"
                  onLoad={scrollToBottom}
                  onClick={() => setLightboxUrl(normalizeImageUrl(msg.image_url))}
                />
              )}
              {msg.message?.trim() && <p className="text-sm">{msg.message}</p>}
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-400 pl-2 self-end mb-1">
              <span>{msg.created_at?.split(" ")[1]?.substring(0, 5)}</span>
              <Check className="w-3.5 h-3.5" />
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div className="p-3 md:p-4 border-t bg-white flex items-center gap-2 shrink-0">
        <input
          type="text"
          placeholder="Escribe tu mensaje aquí"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleSendMessage(); }}
          className="flex-1 px-4 py-2.5 rounded-full border border-gray-300 focus:outline-none focus:border-blue-500 text-sm"
        />
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" onClick={() => fileInputRef.current?.click()}>
          <ImageIcon className="w-5 h-5 text-gray-500" />
        </button>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
        <button
          className="p-2.5 bg-blue-700 hover:bg-blue-800 rounded-full text-white transition-colors"
          onClick={() => handleSendMessage()}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

      {/* Media Screen inside the panel */}
      {showMediaPanel && (
        <MediaGallery
          images={messagesSubscribe.filter((m) => m.image_url).map((m) => normalizeImageUrl(m.image_url))}
          onBack={() => setShowMediaPanel(false)}
          onImageClick={(url) => setLightboxUrl(url)}
        />
      )}
    </div>

    {/* Lightbox remains fixed/global */}
    {lightboxUrl && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
        onClick={() => setLightboxUrl(null)}>
        <button className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          onClick={() => setLightboxUrl(null)}>
          <X className="w-6 h-6" />
        </button>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={lightboxUrl} alt="imagen ampliada"
          className="max-w-[90vw] max-h-[90vh] rounded-xl object-contain shadow-2xl"
          onClick={(e) => e.stopPropagation()} />
      </div>
    )}
    </>

  );
}

