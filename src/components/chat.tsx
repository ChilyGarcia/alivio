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

export default function Chat({ sender_id, receiver_id, messages }: ChatProps) {
  const [messagesSubscribe, setMessages] = useState<Message[]>(messages);
  const [messageInput, setMessageInput] = useState("");
  const router = useRouter();
  const token = Cookies.get("token");

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY, {
      cluster: "mt1",
    });
    const minId = Math.min(sender_id, receiver_id);
    const maxId = Math.max(sender_id, receiver_id);
    const channel = pusher.subscribe(`chat.${minId}.${maxId}`);

    channel.bind("App\\Events\\MessageSent", (data: Message) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [sender_id, receiver_id]);

  const handleSendMessage = () => {
    if (messageInput.trim() === "") return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ message: messageInput, receiver_id: receiver_id }),
    }).then((response) => {
      if (response.ok) {
        setMessageInput("");
      }
    });
  };

  const handleRouterMyAppointments = () => {
    router.push("/my-appointments") 
  }

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-gray-50">
      {/* Header */}
      <header className="flex items-center gap-4 p-4 bg-blue-700 text-white">
        <button className="p-1" onClick={() => router.push("/my-appointments")}>
          <ChevronLeft className="w-6 h-6" onClick={() => handleRouterMyAppointments() } />
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
            <h1 className="font-medium">Pepito Pérez</h1>
            <p className="text-xs text-white/80">Especialista</p>
          </div>
        </div>
        <button className="p-1">
          <File className="w-6 h-6" />
        </button>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messagesSubscribe.map((msg, index) => (
          <div
            key={index}
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

      {/* Input Area */}
      <div className="p-4 border-t bg-white flex items-center gap-2">
        <input
          type="text"
          placeholder="Escribe tu mensaje aquí"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
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
