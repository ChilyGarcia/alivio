"use client";

import Chat from "@/components/chat";
import { authenticationService } from "@/services/auth.service";
import { useEffect, useState, Suspense, useCallback } from "react";
import Cookies from "js-cookie";
import { useSearchParams, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

function normalizeImageUrl(url: string | null | undefined): string {
  if (!url || url === "null" || url.includes("null")) return "/images/doc1.png";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "")}/${url.replace(/^\//, "")}`;
}

function ChatContainer() {
  const [sender_id, setSender] = useState<number | null>(null);
  const [receiver_id, setReceiver] = useState<number | null>(null);
  const [messages, setMessages] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [conversations, setConversations] = useState<any[]>([]);
  const token = Cookies.get("token");
  const router = useRouter();

  const searchParams = useSearchParams();
  const receiverIdFromUrl = searchParams.get("receiver_id");

  // Fetch sender
  useEffect(() => {
    if (receiverIdFromUrl) setReceiver(Number(receiverIdFromUrl));
    authenticationService.userDetails()
      .then((r) => setSender(r.id))
      .catch(console.error);
  }, [receiverIdFromUrl]);

  // Fetch conversations for sidebar (once, stable)
  useEffect(() => {
    if (!token) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/conversations`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        const fmt = (ts: string) => {
          if (!ts) return "";
          return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        };
        setConversations(data.map((c: any) => ({
          id: c.other_user.id,
          name: c.other_user.name,
          message: c.last_message?.message || "Sin mensajes",
          time: fmt(c.last_message?.created_at),
          avatar: c.other_user.profile_image_url || "/images/doc1.png",
          hasNotification: c.unread_count > 0,
          receiver_id: c.other_user.id,
        })));
      })
      .catch(console.error);
  }, [token]);

  // Fetch messages when receiver changes
  useEffect(() => {
    if (receiver_id === null || sender_id === null) return;
    setIsLoaded(false);
    setMessages([]);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ receiver_id }),
    })
      .then((r) => r.json())
      .then((msgs) => { setMessages(msgs); setIsLoaded(true); })
      .catch(() => setIsLoaded(true));
  }, [receiver_id, sender_id, token]);

  const handleConvClick = useCallback((convReceiverId: number) => {
    router.replace(`/chat?sender_id=${sender_id}&receiver_id=${convReceiverId}`);
  }, [sender_id, router]);

  return (
    <div className="flex h-screen w-full bg-gray-100">

      {/* ===== SIDEBAR — stable, never remounts ===== */}
      <aside className="hidden md:flex flex-col w-80 bg-white border-r border-gray-200 h-full shrink-0">
        <div className="p-4 border-b flex items-center gap-3 bg-blue-700">
          <button onClick={() => router.back()} className="p-1 rounded-full hover:bg-white/20 text-white transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-white font-semibold text-base">Mis chats</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-10">No hay conversaciones</p>
          ) : (
            conversations.map((conv) => {
              const isActive = conv.receiver_id === receiver_id;
              return (
                <button
                  key={conv.id}
                  className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 text-left ${isActive ? "bg-blue-50 border-l-4 border-l-blue-600" : ""}`}
                  onClick={() => handleConvClick(conv.receiver_id)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={normalizeImageUrl(conv.avatar)} alt={conv.name} className="w-11 h-11 rounded-full object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <span className={`text-sm font-semibold truncate ${isActive ? "text-blue-700" : "text-gray-900"}`}>{conv.name}</span>
                      <span className="text-xs text-gray-400 shrink-0 ml-1">{conv.time}</span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{conv.message}</p>
                  </div>
                  {conv.hasNotification && <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />}
                </button>
              );
            })
          )}
        </div>
      </aside>

      {/* ===== RIGHT PANEL — only this area changes ===== */}
      <div className="flex flex-col flex-1 h-full min-w-0">
        {!isLoaded || sender_id === null || receiver_id === null ? (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600" />
          </div>
        ) : (
          <Chat
            key={receiver_id}
            sender_id={sender_id}
            receiver_id={receiver_id}
            messages={messages}
          />
        )}
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full bg-gray-100">
          <div className="hidden md:block w-80 bg-white border-r border-gray-200 shrink-0" />
          <div className="flex-1 flex justify-center items-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600" />
          </div>
        </div>
      }
    >
      <ChatContainer />
    </Suspense>
  );
}
