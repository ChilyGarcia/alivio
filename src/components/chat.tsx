"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, Check, File, ImageIcon, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import Pusher from "pusher-js";
import Cookies from "js-cookie";

interface Message {
  id?: number;
  sender_id: number;
  receiver_id: number;
  message: string;
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
  profile_image: null;
  profile_image_url: null;
}

export default function Chat({ sender_id, receiver_id, messages }: ChatProps) {
  const [messagesSubscribe, setMessages] = useState<Message[]>(messages);
  const [messageInput, setMessageInput] = useState("");
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
        console.log(`📨 Evento recibido: ${eventName}`, data);
        setMessages((prevMessages) => {
          // Si el mensaje es del remitente actual, reemplazar el mensaje optimista
          if (data.sender_id === sender_id && data.id) {
            // Buscar el mensaje optimista (sin ID pero con el mismo contenido y sender)
            const optimisticIndex = prevMessages.findIndex(
              (msg) =>
                !msg.id &&
                msg.sender_id === data.sender_id &&
                msg.receiver_id === data.receiver_id &&
                msg.message === data.message
            );
            
            if (optimisticIndex !== -1) {
              // Reemplazar el mensaje optimista con el real
              console.log("🔄 Reemplazando mensaje optimista con el real");
              const newMessages = [...prevMessages];
              newMessages[optimisticIndex] = data;
              return newMessages;
            }
          }
          
          // Evitar duplicados por ID
          if (data.id) {
            const existsById = prevMessages.some(
              (msg) => msg.id === data.id
            );
            
            if (existsById) {
              console.log("⚠️ Mensaje duplicado detectado (por ID), ignorando");
              return prevMessages;
            }
          }
          
          // Si es un mensaje del remitente actual sin ID, podría ser duplicado
          if (data.sender_id === sender_id && !data.id) {
            const duplicateContent = prevMessages.some(
              (msg) =>
                msg.sender_id === data.sender_id &&
                msg.receiver_id === data.receiver_id &&
                msg.message === data.message &&
                Math.abs(
                  new Date(msg.created_at || 0).getTime() -
                  new Date(data.created_at || 0).getTime()
                ) < 5000 // Dentro de 5 segundos
            );
            
            if (duplicateContent) {
              console.log("⚠️ Mensaje duplicado detectado (por contenido), ignorando");
              return prevMessages;
            }
          }
          
          // Si es un mensaje de otro usuario, agregarlo normalmente
          return [...prevMessages, data];
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
    const fetchUserReceiver = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/get-user-details/${receiver_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

        setReceiver(data);
      } catch (error) {
        console.error("Failed to fetch user receiver:", error);
      }
    };

    fetchUserReceiver();
  }, []);

  useEffect(() => {
    console.log("Este es el dato del receiver", receiver);
  }, [receiver]);

  const handleSendMessage = () => {
    if (messageInput.trim() === "") return;

    const messageToSend = messageInput;
    setMessageInput("");

    // Crear mensaje optimista con timestamp único para identificarlo
    const tempId = `temp-${Date.now()}-${Math.random()}`;
    const newMessage: Message & { tempId?: string } = {
      sender_id: sender_id,
      receiver_id: receiver_id,
      message: messageToSend,
      created_at: new Date().toISOString(),
      tempId: tempId,
    };

    console.log("📤 Enviando mensaje:", newMessage);
    // Agregar mensaje optimista solo si es del remitente actual
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        message: messageToSend,
        receiver_id: receiver_id,
      }),
    })
      .then(async (response) => {
        const data = await response.json();
        console.log("✅ Respuesta del servidor:", data);
        
        if (!response.ok) {
          console.error("❌ Error al enviar mensaje:", data);
          // Remover el mensaje optimista si falla
          setMessages((prevMessages) =>
            prevMessages.filter((msg) => (msg as any).tempId !== tempId)
          );
        }
        // No actualizamos aquí porque el evento de Pusher lo hará
      })
      .catch((error) => {
        console.error("❌ Error al enviar mensaje:", error);
        // Remover el mensaje optimista si falla
        setMessages((prevMessages) =>
          prevMessages.filter((msg) => (msg as any).tempId !== tempId)
        );
      });
  };

  const handleRouterMyAppointments = () => {
    router.push("/");
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-gray-50">
      <header className="flex items-center gap-4 p-4 bg-blue-700 text-white">
        <button className="p-1" onClick={() => router.push("/")}>
          <ChevronLeft
            className="w-6 h-6"
            onClick={() => handleRouterMyAppointments()}
          />
        </button>
        <div className="flex items-center gap-3 flex-1">
          <div className="relative w-10 h-10 rounded-full overflow-hidden">
            <Image
              src="/images/doc1.png"
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
            className={`flex ${
              msg.sender_id === sender_id ? "justify-end" : ""
            }`}
          >
            {msg.sender_id !== sender_id && (
              <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0 mt-2">
                <Image
                  src="/images/doc1.png"
                  alt="User avatar"
                  width={32}
                  height={32}
                  className="object-cover"
                />
              </div>
            )}
            <div
              className={`max-w-[80%] p-3 rounded-2xl ${
                msg.sender_id === sender_id
                  ? "bg-blue-700 text-white rounded-tr-sm"
                  : "bg-gray-200 rounded-tl-sm"
              }`}
            >
              <p>{msg.message}</p>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500 pl-2">
              <span>{msg.created_at?.split(" ")[1]}</span>
              <Check className="w-4 h-4" />
            </div>
          </div>
        ))}
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

        <button className="p-2">
          <ImageIcon className="w-6 h-6 text-gray-500" />
        </button>
        <button
          className="p-2 bg-blue-700 rounded-full text-white"
          onClick={handleSendMessage}
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
