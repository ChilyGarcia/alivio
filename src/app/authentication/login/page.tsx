"use client";

import React from "react";
import NavBar from "@/components/navbar";
import Link from "next/link";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";

function Input({ className = "", ...props }) {
  return (
    <input
      className={`flex h-12 w-full rounded-x5 border-2 border-input bg-transparent px-4 py-2 text-base font-medium shadow-sm transition-colors placeholder:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}

function Eye(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOff(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
  );
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [errors, setErrors] = React.useState<{
    email?: string;
    password?: string;
  }>({});
  const [loginData, setLoginData] = React.useState(() => {
    // Check if there are saved credentials in localStorage
    if (typeof window !== "undefined") {
      const savedEmail = localStorage.getItem("rememberedEmail");
      const savedPassword = localStorage.getItem("rememberedPassword");
      if (savedEmail && savedPassword) {
        return {
          email: savedEmail,
          password: savedPassword,
          remember: true,
        };
      }
    }
    return {
      email: "",
      password: "",
      remember: false,
    };
  });
  const [isValidated, setIsValidated] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const router = useRouter();

  // Vvalidar datos
  React.useEffect(() => {
    validateForm(loginData.email, loginData.password);
  }, [loginData.email, loginData.password]);

  const validateField = (name: string, value: string) => {
    let error = "";
    if (name === "email" && !value.trim()) {
      error = "El correo es requerido.";
    } else if (name === "password" && !value.trim()) {
      error = "La contraseña es requerida.";
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateForm = (
    email = loginData.email,
    password = loginData.password
  ) => {
    // Direct validation without relying on the errors state
    const emailValid = email.trim() !== "";
    const passwordValid = password.trim() !== "";
    setIsValidated(emailValid && passwordValid);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    const updatedData = { ...loginData, [name]: newValue };
    setLoginData(updatedData);

    if (type !== "checkbox") {
      validateField(name, value);
      validateForm(
        name === "email" ? value : updatedData.email,
        name === "password" ? value : updatedData.password
      );
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    validateField(name, value);
    // Use current values directly
    const updatedData = { ...loginData, [name]: value };
    validateForm(updatedData.email, updatedData.password);
  };

  const fetchLogin = async () => {
    const appointmentDetails = localStorage.getItem("appointmentDetails");

    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginData),
        }
      );
      const data = await response.json();
      setIsLoading(false);

      if (!response.ok) {
        toast.error(data.error || "Error al iniciar sesión");
        return;
      }

      toast.success("Login exitoso!");
      Cookies.set("token", data.access_token, { expires: 1 });

      if (appointmentDetails) {
        router.push("/payments");
      } else {
        router.push("/");
      }
    } catch (error: any) {
      console.error("Error en el login:", error.message);
      toast.error("Error al iniciar sesión: " + error.message);
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Save or remove credentials based on remember me checkbox
    if (loginData.remember) {
      localStorage.setItem("rememberedEmail", loginData.email);
      localStorage.setItem("rememberedPassword", loginData.password);
    } else {
      localStorage.removeItem("rememberedEmail");
      localStorage.removeItem("rememberedPassword");
    }

    fetchLogin();
  };

  return (
    <>
      <NavBar />
      <Toaster />

      <div className="min-h-screen bg-white p-4 md:p-6 mt-12">
        <div className="mx-auto max-w-md space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold text-primary pb-6 pt-6">
              Iniciar sesión
            </h1>
            <h1 className="text-2xl font-extrabold text-primary pb-6">
              Bienvenido a aliviapp
            </h1>
            <p className="text-lg text-primary">
              Introduce tus credenciales para acceder
            </p>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Input
                className="rounded-full border-primary px-4 py-2"
                placeholder="Correo Electrónico"
                type="email"
                name="email"
                value={loginData.email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <div className="relative">
                <Input
                  className="rounded-full border-primary px-4 py-2 pr-10"
                  placeholder="Contraseña"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={loginData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-primary opacity-50"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <div className="flex items-center space-x-2 pt-4">
                <input
                  type="checkbox"
                  id="remember"
                  name="remember"
                  checked={loginData.remember}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-primary text-primary focus:ring-primary"
                />
                <label htmlFor="remember" className="text-sm text-gray-600">
                  Recordar
                </label>
              </div>
            </div>
            <div className="pt-3">
              <button
                type="submit"
                className={`inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 w-full rounded-full px-4 py-2 ${
                  isValidated
                    ? "bg-primary text-white hover:bg-primary/90"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                disabled={!isValidated}
              >
                {isLoading ? (
                  <span className="loading loading-spinner loading-md"></span>
                ) : (
                  "Iniciar sesión"
                )}
              </button>
            </div>
          </form>

          <p className="text-center text-sm text-primary">
            ¿No tienes cuenta?{" "}
            <Link
              href="/authentication/register"
              className="font-medium underline"
            >
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
