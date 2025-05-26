"use client";

import Chat from "@/components/chat";
import { authenticationService } from "@/services/auth.service";
import { useEffect, useState, Suspense } from "react";
import Cookies from "js-cookie";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      when: "beforeChildren",
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};

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
  }, [receiver_id, sender_id, token]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-white"
    >
      <motion.div variants={itemVariants} className="w-full h-full">
        {sender_id !== null && receiver_id !== null && (
          <Chat
            sender_id={sender_id}
            receiver_id={receiver_id}
            messages={messages}
          />
        )}
      </motion.div>
    </motion.div>
  );
}

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      }
    >
      <ChatContainer />
    </Suspense>
  );
}
