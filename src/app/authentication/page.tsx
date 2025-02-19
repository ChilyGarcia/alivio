"use client";

import * as React from "react";
import NavBar from "@/components/navbar";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

function Checkbox({ id, className = "", ...props }) {
  return (
    <input
      type="checkbox"
      id={id}
      className={`h-4 w-4 rounded border border-input ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}

function Input({ className = "", ...props }) {
  return (
    <input
      className={`flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}

const CollapsibleContext = React.createContext(undefined);

function Collapsible({ open, onOpenChange, children }) {
  return (
    <CollapsibleContext.Provider value={{ open, onOpenChange }}>
      <div>{children}</div>
    </CollapsibleContext.Provider>
  );
}

function CollapsibleTrigger({ children, className = "" }) {
  const context = React.useContext(CollapsibleContext);
  if (!context) {
    throw new Error("CollapsibleTrigger must be used within Collapsible");
  }

  return (
    <button
      type="button"
      className={className}
      onClick={() => context.onOpenChange(!context.open)}
    >
      {children}
    </button>
  );
}

function CollapsibleContent({ children, className = "" }) {
  const context = React.useContext(CollapsibleContext);
  if (!context) {
    throw new Error("CollapsibleContent must be used within Collapsible");
  }

  if (!context.open) {
    return null;
  }

  return <div className={`${className}`}>{children}</div>;
}

function ChevronDown(props) {
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
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
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

export default function RegistroForm() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [errors, setErrors] = React.useState<{
    email?: string;
    password?: string;
    name?: string;
    password_confirmation?: string;
  }>({});
  const [registerData, setRegisterData] = React.useState({
    name: "",
    email: "",
    role: "patient",
    password: "",
    password_confirmation: "",
    gender: "male",
    age: 21,
    phone_number: "573169393922",
    phone_indicator: "+57",
  });
  const [loginData, setLoginData] = React.useState({
    email: "",
    password: "",
  });
  const [isValidated, setIsValidated] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const router = useRouter();

  const validateField = (name, value, isLogin = false) => {
    let error = "";

    if (name === "email" && !value.trim()) {
      error = "El correo es requerido.";
    }

    if (name === "password" && !value.trim()) {
      error = "La contraseña es requerida.";
    }

    if (!isLogin) {
      if (name === "name" && !value.trim()) {
        error = "El nombre es requerido.";
      }

      if (name === "password_confirmation" && value !== registerData.password) {
        error = "Las contraseñas no coinciden.";
      }
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateForm = () => {
    if (isOpen) {
      // Validar Login
      const isValid =
        loginData.email.trim() &&
        loginData.password.trim() &&
        !errors.email &&
        !errors.password;
      setIsValidated(isValid);
    } else {
      // Validar Registro
      const isValid =
        registerData.name.trim() &&
        registerData.email.trim() &&
        registerData.password.trim() &&
        registerData.password === registerData.password_confirmation &&
        Object.values(errors).every((error) => !error);

      setIsValidated(isValid);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value, isOpen);
    validateForm();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (isOpen) {
      setLoginData((prev) => ({ ...prev, [name]: value }));
    } else {
      setRegisterData((prev) => ({ ...prev, [name]: value }));
    }

    validateForm();
  };

  const fetchRegister = async () => {
    const appointmentDetails = localStorage.getItem("appointmentDetails");

    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(registerData),
        }
      ).finally(() => {
        setIsLoading(false);
      });
      const data = await response.json();
      console.log("Registro exitoso:", data);
      Cookies.set("token", data.access_token, { expires: 1 });

      if (appointmentDetails) {
        router.push("/payments");
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error("Error registrando:", error.message);
    }
  };

  const fetchLogin = async () => {
    const appointmentDetails = localStorage.getItem("appointmentDetails");

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
      console.log("Login exitoso:", data);

      if (appointmentDetails) {
        router.push("/payments");
      } else {
        router.push("/");
      }

      Cookies.set("token", data.access_token, { expires: 1 });
    } catch (error) {
      console.error("Error registrando:", error.message);
    }
  };

  const handleRegister = () => {
    if (isOpen) {
      console.log("Se llama la peticion del login");

      fetchLogin();
    } else {
      console.log("Se llama la peticion del register");

      fetchRegister();
    }
  };

  const handleInputFocus = () => {
    setIsOpen(false);
  };

  return (
    <>
      <NavBar></NavBar>

      <div className="min-h-screen bg-white p-4 md:p-6 mt-12">
        <div className="mx-auto max-w-md space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-primary">Registro</h1>
            <p className="text-lg text-primary">
              Introduce tu información correspondiente
            </p>
          </div>
          <form className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-primary">Tus datos</p>

              <Input
                className="rounded-full border-primary px-4 py-2"
                placeholder="Nombre"
                type="text"
                name="name"
                value={registerData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                onFocus={handleInputFocus}
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
                onFocus={handleInputFocus}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}

              <div className="relative">
                <Input
                  className="rounded-full border-primary px-4 py-2 pr-10"
                  placeholder="Contraseña"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={registerData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onFocus={handleInputFocus}
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
                  placeholder="Confirma tu ontraseña"
                  type={showPassword ? "text" : "password"}
                  name="password_confirmation"
                  value={registerData.password_confirmation}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onFocus={handleInputFocus}
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

            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
              <CollapsibleTrigger className="flex w-full items-center justify-between rounded-full border border-primary px-4 py-2">
                <span className="text-primary opacity-50">Iniciar Sesión</span>
                <ChevronDown
                  className={`h-4 w-4 text-primary opacity-50 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2 rounded-xl bg-white p-4 shadow-lg mt-2">
                <Input
                  className="rounded-full border-primary px-4 py-2"
                  placeholder="Correo Electrónico"
                  type="email"
                  name="email"
                  value={loginData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
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
              </CollapsibleContent>
            </Collapsible>

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
              className={`inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 w-full rounded-full px-4 py-2 ${
                isValidated
                  ? "bg-primary text-white hover:bg-primary/90"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              onClick={(e) => {
                e.preventDefault();
                handleRegister();
              }}
              disabled={!isValidated}
            >
              {isLoading ? (
                <span className="loading loading-spinner loading-md"></span>
              ) : isOpen ? (
                <label>Iniciar sesión</label>
              ) : (
                <label>Registrarse</label>
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
