"use client";

import * as React from "react";
import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "ghost" | "default";
    size?: "icon" | "default";
  }
>(({ className, variant = "default", size = "default", ...props }, ref) => {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        {
          "bg-primary text-primary-foreground shadow hover:bg-primary/90":
            variant === "default",
          "hover:bg-primary/90 hover:text-accent-foreground":
            variant === "ghost",
          "h-9 px-4": size === "default",
          "h-9 w-9": size === "icon",
        },
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = "Button";

export default function NotificationComponent() {
  const router = useRouter();
  const [unreadNotifications, setUnreadNotifications] = React.useState(false);

  const handleNotification = () => {
    console.log("Notification button");
    router.push("/notifications");
  };

  const fetchNotifications = async () => {
    try {
      const token = Cookies.get("token");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/notifications`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();

      const hasUnread = data.some((notif) => !notif.read);
      setUnreadNotifications(hasUnread);
    } catch (error) {
      console.error("Error obteniendo notificaciones:", error);
    }
  };

  React.useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <>
      <Button
        variant="ghost"
        className="relative text-white hover:text-white/80"
        onClick={handleNotification}
      >
        <Bell className="h-6 w-6" />
        {unreadNotifications && (
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
        )}
      </Button>
    </>
  );
}

function cn(
  ...classes: (
    | string
    | boolean
    | undefined
    | null
    | { [key: string]: boolean }
  )[]
) {
  return classes
    .filter(Boolean)
    .map((className) => {
      if (typeof className === "object") {
        return Object.entries(className)
          .filter(([, value]) => value)
          .map(([key]) => key)
          .join(" ");
      }
      return className;
    })
    .join(" ");
}
