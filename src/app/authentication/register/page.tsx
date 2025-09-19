"use client";

import React from "react";
import NavBar from "@/components/navbar";
import Link from "next/link";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";

function Checkbox({ id, className = "", ...props }) {
  return (
    <input
      type="checkbox"
      id={id}
      className={`h-4 w-4 rounded border-2 border-input ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}

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

export default function RegisterPage() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [errors, setErrors] = React.useState<{
    email?: string;
    password?: string;
    name?: string;
    password_confirmation?: string;
    phone_number?: string;
  }>({});

  const [registerData, setRegisterData] = React.useState({
    name: "",
    email: "",
    role: "patient",
    password: "",
    password_confirmation: "",
    gender: "male",
    age: 21,
    phone_number: "",
    phone_indicator: "+57",
  });
  const [isValidated, setIsValidated] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const router = useRouter();

  const validateField = (name: string, value: string) => {
    let error = "";

    if (name === "email" && !value.trim()) {
      error = "El correo es requerido.";
    } else if (name === "password" && !value.trim()) {
      error = "La contraseña es requerida.";
    } else if (name === "name" && !value.trim()) {
      error = "El nombre es requerido.";
    } else if (
      name === "password_confirmation" &&
      value !== registerData.password
    ) {
      error = "Las contraseñas no coinciden.";
    } else if (name === "phone_number" && !value.trim()) {
      error = "El número de teléfono es requerido.";
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateForm = () => {
    const isValid =
      registerData.name.trim() &&
      registerData.email.trim() &&
      registerData.password.trim() &&
      registerData.password === registerData.password_confirmation &&
      Object.values(errors).every((error) => !error);

    setIsValidated(!!isValid);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    validateField(name, value);
    validateForm();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
    validateForm();
  };

  const fetchRegister = async () => {
    const appointmentDetails = localStorage.getItem("appointmentDetails");

    setIsLoading(true);
    try {
      const modifiedRegisterData = {
        ...registerData,
        phone_number: `57${registerData.phone_number}`,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(modifiedRegisterData),
        }
      );
      const data = await response.json();
      setIsLoading(false);

      if (!response.ok) {
        if (data.errors) {
          const firstErrorKey = Object.keys(data.errors)[0];
          const firstErrorMessage = data.errors[firstErrorKey][0];
          toast.error(firstErrorMessage || "Error en el registro");
        } else {
          toast.error(data.error || "Error en el registro");
        }
        return;
      }

      toast.success("Registro exitoso!");
      Cookies.set("token", data.access_token, { expires: 1 });

      if (appointmentDetails) {
        router.push("/payments");
      } else {
        router.push("/");
      }
    } catch (error: any) {
      console.error("Error registrando:", error.message);
      toast.error("Error registrando: " + error.message);
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRegister();
  };

  return (
    <>
      <NavBar />
      <Toaster />

      <div className="min-h-screen bg-white p-4 md:p-6 mt-12">
        <div className="mx-auto max-w-md space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-primary pb-6">Registro</h1>
            <h1 className="text-2xl font-bold text-primary pb-6">
              Registrate y empieza a cuidar de ti
            </h1>
            <p className="text-lg text-primary">
              Introduce tu información correspondiente
            </p>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <p className="text-sm font-bold text-primary">
                Completa tus datos
              </p>
              <Input
                className="rounded-full border-primary px-4 py-2"
                placeholder="Nombre"
                type="text"
                name="name"
                value={registerData.name}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
              <Input
                className="rounded-full border-primary px-4 py-2"
                placeholder="Correo Electrónico"
                type="email"
                name="email"
                value={registerData.email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
              <div className="relative">
                <Input
                  className="rounded-full border-primary px-4 py-2"
                  placeholder="Número de teléfono"
                  type="tel"
                  name="phone_number"
                  value={registerData.phone_number}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.phone_number && (
                  <p className="text-sm text-red-500">{errors.phone_number}</p>
                )}
              </div>
              <div className="relative">
                <Input
                  className="rounded-full border-primary px-4 py-2 pr-10"
                  placeholder="Contraseña"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={registerData.password}
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
              <div className="relative">
                <Input
                  className="rounded-full border-primary px-4 py-2 pr-10"
                  placeholder="Confirma tu contraseña"
                  type={showPassword ? "text" : "password"}
                  name="password_confirmation"
                  value={registerData.password_confirmation}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.password_confirmation && (
                  <p className="text-sm text-red-500">
                    {errors.password_confirmation}
                  </p>
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
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                className="border-primary data-[state=checked]:bg-primary"
              />
              <label
                htmlFor="terms"
                className="text-sm leading-none text-primary"
              >
                Acepta nuestros términos y condiciones como...
              </label>
            </div>
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
                "Registrarse"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-primary">
            ¿Ya tienes cuenta?{" "}
            <Link
              href="/authentication/login"
              className="font-medium underline"
            >
              Iniciar sesión
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
