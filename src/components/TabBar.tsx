"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Home,
  Calendar,
  CreditCard,
  BriefcaseMedical,
  User,
  Menu,
  X,
  LogOut,
  Settings,
  Stethoscope,
} from "lucide-react";
import Cookies from "js-cookie";
import { authenticationService } from "@/services/auth.service";
import { User as UserType } from "@/interfaces/user.interface";
import { useRouter } from "next/navigation";

const TabBar = ({ onToggleNavBar }) => {
  const initialUser: UserType = {
    id: 0,
    name: "",
    email: "",
    email_verified_at: null,
    created_at: null,
    updated_at: new Date(),
    profile_image: "",
    role: "",
  };

  const [menuOpen, setMenuOpen] = useState(false);
  const [showTabBar, setShowTabBar] = useState(true);
  const [token, setToken] = useState("");
  const [user, setUser] = useState<UserType>(initialUser);
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

  useEffect(() => {
    const fetchData = async () => {
      const auth = Cookies.get("token");
      if (auth) {
        const response = await fetchUserDetails();

        Cookies.set("user", JSON.stringify(response));
        setToken(auth);
      }
    };
    fetchData();
  }, []);

  const handleTabItemAuthentication = (ref: string) => {
    const token = Cookies.get("token");
    if (!token && (ref === "/my-appointments" || ref === "/planes")) {
      router.push("/");
    } else {
      router.push(ref);
    }
  };

  const fetchLogOut = async () => {
    try {
      const response = authenticationService.logOut();

      console.log(response);
      if (response) {
        Cookies.remove("token");
        window.location.href = "/";
      }
      return response;
    } catch (error) {
      console.error("Error logging in:", (error as Error).message);
      return;
    }
  };

  const handleLogOut = (ref: string) => {
    console.log("Este es el desencadenador del cerrar sesion");

    fetchLogOut();
  };

  const getShortName = (fullName: string) => {
    if (!fullName) return "";
    const firstWord = fullName.split(" ")[0];
    return firstWord.length > 10 ? firstWord.slice(0, 10) + "..." : firstWord;
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    onToggleNavBar(!menuOpen);
    setShowTabBar(menuOpen);
  };

  return (
    <>
      {showTabBar && (
        <nav className="fixed bottom-0 left-0 w-full bg-white shadow-md p-2 flex justify-around items-center border-t border-gray-300 z-[9000]">
          <TabItem
            href="/"
            icon={<Home size={24} />}
            label="Inicio"
            onClick={() => handleTabItemAuthentication("/")}
          />
          {token && (
            <>
              {user.role == "patient" ? (
                <TabItem
                  href="/my-appointments"
                  icon={<Calendar size={24} />}
                  label="Citas"
                  onClick={() =>
                    handleTabItemAuthentication("/my-appointments")
                  }
                />
              ) : (
                <TabItem
                  href="/professionals/my-patients"
                  icon={<Calendar size={24} />}
                  label="Citas"
                  onClick={() =>
                    handleTabItemAuthentication("/my-appointments")
                  }
                />
              )}
            </>
          )}
          <TabItem
            href="/services"
            icon={<CreditCard size={24} />}
            label="Planes"
            onClick={() => handleTabItemAuthentication("/planes")}
          />
          {token ? (
            <TabItem
              href={
                user?.role === "professional"
                  ? "/professionals/profile"
                  : "/profile"
              }
              icon={<User size={24} />}
              label={getShortName(user.name)}
              onClick={(e) => {
                e.preventDefault();
                const profilePath =
                  user?.role === "professional"
                    ? "/professionals/profile"
                    : "/profile";
                handleTabItemAuthentication(profilePath);
              }}
            />
          ) : (
            <TabItem
              href="/authentication/login"
              icon={<User size={24} />}
              label="Ingresar"
              onClick={() =>
                handleTabItemAuthentication("/authentication/login")
              }
            />
          )}
          <button
            onClick={toggleMenu}
            className="flex flex-col items-center text-primary hover:text-blue-500 transition-all"
          >
            <Menu size={24} />
          </button>
        </nav>
      )}

      {menuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-md z-40"
            onClick={toggleMenu}
          ></div>

          <div className="fixed top-0 right-0 w-64 h-full bg-white shadow-lg p-6 flex flex-col z-50 border-l border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <img src="/images/LogoAlivio.png" className="w-32" />
              <button className="text-primary" onClick={toggleMenu}>
                <X size={28} />
              </button>
            </div>
            <nav className="space-y-4">
              <NavItem
                href="/"
                icon={<Home size={20} />}
                label="Inicio"
                active
              />
              <DropdownMenu label="Pilares">
                {token && (
                  <>
                    <NavItem
                      href="/my-appointments"
                      icon={<Calendar size={20} />}
                      label="Citas"
                      active={false}
                    />
                  </>
                )}
                <NavItem
                  href="/services"
                  icon={<CreditCard size={20} />}
                  label="Planes"
                  active={false}
                />
                <NavItem
                  href="/services"
                  icon={<BriefcaseMedical size={20} />}
                  label="Servicios Especiales"
                  active={false}
                />
              </DropdownMenu>
              {/* <NavItem
                href="/farmacias"
                icon={<Store size={20} />}
                label="Farmacias"
                active={false}
              /> */}
              {/* <NavItem
                href="/my-chats"
                icon={<MessageCircle size={20} />}
                label="Chats disponibles"
                active={false}
              /> */}
              {user.role === "professional" ? (
                <>
                  <NavItem
                    href="/professionals/professional-configuration"
                    icon={<Stethoscope size={20} />}
                    label="Profesional"
                    active={false}
                  />
                </>
              ) : (
                <></>
              )}
            </nav>
            <div className="mt-auto border-t pt-4">
              {token ? (
                <>
                  <NavItem
                    href={
                      user?.role === "professional"
                        ? "/professionals/profile"
                        : "/profile"
                    }
                    icon={<User size={20} />}
                    label={user?.name ? getShortName(user.name) : "Perfil"}
                    active={false}
                  />
                  <NavItem
                    href="/configuracion"
                    icon={<Settings size={20} />}
                    label="Configuración"
                    active={false}
                  />
                  <Link
                    href="/"
                    className={`flex items-center p-3 rounded-lg  text-primary transition-all`}
                    onClick={() => handleLogOut("/")}
                  >
                    <LogOut size={20}></LogOut>
                    <span className="ml-3">Cerrar sesion</span>
                  </Link>
                </>
              ) : (
                <>
                  <NavItem
                    href="/authentication/login"
                    icon={<User size={20} />}
                    label="Ingresar"
                    active={false}
                  />
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

const TabItem = ({ href, icon, label, onClick }) => {
  return (
    <Link
      href={href}
      className="flex flex-col items-center text-primary hover:text-blue-500 transition-all"
      onClick={onClick}
    >
      {icon}
      <span className="text-xs font-medium mt-1">{label}</span>
    </Link>
  );
};

const NavItem = ({ href, icon, label, active }) => (
  <Link
    href={href}
    className={`flex items-center p-3 rounded-lg ${
      active ? "bg-blue-100" : "hover:bg-gray-100"
    } text-primary transition-all`}
  >
    {icon}
    <span className="ml-3">{label}</span>
  </Link>
);

const DropdownMenu = ({ label, children }) => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        className="flex items-center justify-between w-full p-3 text-primary hover:bg-gray-100 rounded-lg"
        onClick={() => setOpen(!open)}
      >
        <span>{label}</span>
        <span>
          {open ? (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m4.5 15.75 7.5-7.5 7.5 7.5"
                />
              </svg>
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m19.5 8.25-7.5 7.5-7.5-7.5"
                />
              </svg>
            </>
          )}
        </span>
      </button>
      {open && <div className="ml-4 space-y-1">{children}</div>}
    </div>
  );
};

export default TabBar;
