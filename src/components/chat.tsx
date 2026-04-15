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
  const [conversations, setConversations] = useState<any[]>([]);
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
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/conversations`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        const formatTime = (ts: string) => {
          if (!ts) return "";
          const d = new Date(ts);
          return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        };
        setConversations(data.map((c: any) => ({
          id: c.other_user.id,
          name: c.other_user.name,
          message: c.last_message?.message || "Sin mensajes",
          time: formatTime(c.last_message?.created_at),
          avatar: c.other_user.profile_image_url || "/images/doc1.png",
          hasNotification: c.unread_count > 0,
          receiver_id: c.other_user.id,
        })));
      } catch (e) {
        console.error("Error fetching conversations", e);
      }
    };
    fetchConversations();
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
    {/* ============ LAYOUT WRAPPER ============ */}
    <div className="flex h-screen w-full bg-gray-100">

      {/* ===== SIDEBAR — Lista de chats (solo desktop) ===== */}
      <aside className="hidden md:flex flex-col w-80 bg-white border-r border-gray-200 h-full shrink-0">
        {/* Header sidebar */}
        <div className="p-4 border-b flex items-center gap-3 bg-blue-700">
          <button onClick={() => router.back()} className="p-1 rounded-full hover:bg-white/20 text-white transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-white font-semibold text-base">Mis chats</h2>
        </div>

        {/* Conversations list */}
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2 py-10">
              <p className="text-sm">No hay conversaciones</p>
            </div>
          ) : (
            conversations.map((conv) => {
              const isActive = conv.receiver_id === receiver_id;
              return (
                <button
                  key={conv.id}
                  className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 text-left ${
                    isActive ? "bg-blue-50 border-l-4 border-l-blue-600" : ""
                  }`}
                  onClick={() => router.push(`/chat?sender_id=${sender_id}&receiver_id=${conv.receiver_id}`)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={normalizeImageUrl(conv.avatar)}
                    alt={conv.name}
                    className="w-11 h-11 rounded-full object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <span className={`text-sm font-semibold truncate ${isActive ? "text-blue-700" : "text-gray-900"}`}>
                        {conv.name}
                      </span>
                      <span className="text-xs text-gray-400 shrink-0 ml-1">{conv.time}</span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{conv.message}</p>
                  </div>
                  {conv.hasNotification && (
                    <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                  )}
                </button>
              );
            })
          )}
        </div>
      </aside>

      {/* ===== MAIN CHAT AREA ===== */}
      <div className="flex flex-col flex-1 h-full min-w-0">

        {/* Header */}
        <header className="flex items-center gap-4 p-4 bg-blue-700 text-white shrink-0">
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
          {/* Media button - solo mobile (en desktop está la sidebar) */}
          <button className="p-1 md:hidden" onClick={() => { setShowMediaPanel(true); setMediaPage(0); }}>
            <File className="w-6 h-6" />
          </button>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
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
                className={`max-w-[70%] md:max-w-[55%] p-3 rounded-2xl ${
                  msg.sender_id === sender_id
                    ? "bg-blue-700 text-white rounded-tr-sm"
                    : "bg-white shadow-sm rounded-tl-sm"
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
      </div>
    </div>

    {/* Lightbox */}
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

    {/* Media Screen */}
    {showMediaPanel && (
      <MediaGallery
        images={messagesSubscribe.filter((m) => m.image_url).map((m) => normalizeImageUrl(m.image_url))}
        onBack={() => setShowMediaPanel(false)}
        onImageClick={(url) => setLightboxUrl(url)}
      />
    )}
    </>
  );
}

