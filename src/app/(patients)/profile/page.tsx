"use client";

import {
  ArrowLeft,
  Bell,
  Settings,
  User,
  Calendar,
  MessageSquare,
  History,
  ShoppingCart,
  Package2,
  PenToolIcon as Tool,
  Heart,
} from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { authenticationService } from "@/services/auth.service";
import { User as UserInterface } from "@/interfaces/user.interface";
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

// Avatar Components
const Avatar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  />
));
Avatar.displayName = "Avatar";

const AvatarImage = React.forwardRef<
  HTMLImageElement,
  React.ImgHTMLAttributes<HTMLImageElement>
>(({ className, ...props }, ref) => (
  <img
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
));
AvatarImage.displayName = "AvatarImage";

const AvatarFallback = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    )}
    {...props}
  />
));
AvatarFallback.displayName = "AvatarFallback";

const initialUserState: UserInterface = {
  id: 0,
  name: "",
  email: "",
  email_verified_at: null,
  created_at: null,
  updated_at: new Date(),
  profile_image: "",
  role: "",
};

export default function ProfilePage() {
  const [user, setUser] = React.useState<UserInterface>(initialUserState);
  const [unreadNotifications, setUnreadNotifications] = React.useState(false);
  const router = useRouter();

  const fetchUserDetails = async () => {
    try {
      const response = await authenticationService.userDetails();

      setUser(response);
      return response;
    } catch (error) {
      console.error(error);
    }
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
    fetchUserDetails();
    fetchNotifications();
  }, []);

  const handleBack = () => {
    console.log("Back button");
    router.push("/");
  };

  const handleNotification = () => {
    console.log("Notification button");
    router.push("/notifications");
  };

  const handleSettings = () => {
    console.log("Settings button");
    router.push("/settings");
  };

  return (
    <div className="min-h-screen bg-[#0000CC]">
      <div className="relative flex items-center justify-between p-4 text-white">
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:text-white/80"
          onClick={() => handleBack()}
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>

        <div className="flex gap-2">
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
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:text-white/80"
            onClick={() => handleSettings()}
          >
            <Settings className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Profile Section */}
      <div className="flex flex-col items-center pt-4 pb-6 text-white">
        <Avatar className="h-24 w-24 border-2 border-white">
          <AvatarImage
            src={user.profile_image || "/images/doc1.png"}
            alt="Profile picture"
          />
          <AvatarFallback>PP</AvatarFallback>
        </Avatar>
        <h1 className="mt-2 text-xl font-semibold"> {user.name}</h1>
      </div>

      {/* Menu Items */}
      <div className="rounded-t-3xl bg-white p-4">
        <div className="space-y-2">
          <MenuItem icon={User} label="Datos Personales" sublabel={user.name} />
          <MenuItem
            icon={Calendar}
            label="Citas"
            sublabel="Prev. Cita - 22.01.25 08:00 AM."
          />
          <MenuItem
            icon={MessageSquare}
            label="Chats"
            sublabel="Chat para hablar con los especialistas"
          />
          <MenuItem
            icon={History}
            label="Tu Historial"
            sublabel="Consulta o edita tu información, históricos e informes de especialistas."
          />
          <MenuItem
            icon={ShoppingCart}
            label="Compras"
            sublabel="Aquí puedes ver tus compras realizadas."
          />
          <MenuItem
            icon={Package2}
            label="Planes y Servicios"
            sublabel="Puedes ver los planes y servicios que has comprado."
          />
          <MenuItem
            icon={Tool}
            label="Herramientas"
            sublabel="Herramientas para tu salud."
          />
          <MenuItem
            icon={Heart}
            label="Guardados"
            sublabel="Puedes ver y categorizar tus especialistas, planes y servicios guardados."
          />
        </div>
      </div>
    </div>
  );
}

function MenuItem({
  icon: Icon,
  label,
  sublabel,
}: {
  icon: any;
  label: string;
  sublabel: string;
}) {
  return (
    <Link
      href="#"
      className="flex items-start gap-4 rounded-lg p-3 transition-colors hover:bg-gray-50"
    >
      <div className="rounded-full bg-blue-50 p-2 text-blue-600">
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <h3 className="font-medium text-gray-900">{label}</h3>
        <p className="text-sm text-gray-500">{sublabel}</p>
      </div>
    </Link>
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
