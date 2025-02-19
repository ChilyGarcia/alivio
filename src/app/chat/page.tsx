"use client";

import Chat from "@/components/chat";
import { authenticationService } from "@/services/auth.service";
import { useEffect, useState, Suspense } from "react";
import Cookies from "js-cookie";
import { useSearchParams } from "next/navigation";

function ChatContainer() {
  const [sender_id, setSender] = useState<number | null>(null);
  const [receiver_id, setReceiver] = useState<number | null>(null);
  const [messages, setMessages] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const token = Cookies.get("token");

  const searchParams = useSearchParams();
  const receiverIdFromUrl = searchParams.get("receiver_id");

  useEffect(() => {
    if (receiverIdFromUrl) {
      setReceiver(Number(receiverIdFromUrl));
    }

    const fetchUserDetails = async () => {
      try {
        const response = await authenticationService.userDetails();
        setSender(response.id);
        return response;
      } catch (error) {
        console.error("Error fetching user details:", (error as Error).message);
        return false;
      }
    };

    fetchUserDetails();
  }, [receiverIdFromUrl]);

  useEffect(() => {
    if (receiver_id === null || sender_id === null) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        receiver_id: receiver_id,
      }),
    })
      .then((response) => response.json())
      .then((messages) => {
        setMessages(messages);
        setIsLoaded(true);
      })
      .catch((error) => {
        console.error("Error fetching messages:", (error as Error).message);
      });
  }, [receiver_id, sender_id]);

  return (
    <>
      {isLoaded && sender_id !== null && receiver_id !== null && (
        <Chat
          sender_id={sender_id}
          receiver_id={receiver_id}
          messages={messages}
        />
      )}
    </>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChatContainer />
    </Suspense>
  );
}
