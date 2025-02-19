"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, User, ChevronLeft } from "lucide-react";
import { Credentials } from "@/interfaces/credentials.interface";
import { authenticationService } from "@/services/auth.service";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [credentials, setCredentials] = useState<Credentials>({
    email: "",
    password: "",
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const fetchLogin = async (credentials: Credentials) => {
    try {
      const response = await authenticationService.login(credentials);
      return response;
    } catch (error) {
      console.error("Error logging in:", (error as Error).message);
      return;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const login = await fetchLogin(credentials);

    console.log(login);

    if (login) {
      Cookies.set("token", login.access_token, { expires: 1 });

      router.push("/");
    }
  };

  const handleGoogleLogin = () => {
    console.log("Attempting to log in with Google");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-2 text-4xl font-extrabold text-gray-900 leading-tight">
            Bienvenido a <span className="text-blue-600">CSalud</span>
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Ingresa tus datos para iniciar sesión
          </p>
        </div>

        <Link
          href="/"
          className="flex items-center justify-center text-blue-600 hover:text-blue-500 mb-4"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          <span>Volver a la página principal</span>
        </Link>
        <div className="mt-8 bg-white py-8 px-4 shadow-lg sm:rounded-xl sm:px-10 space-y-6">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label
                htmlFor="email-address"
                className="block text-sm font-medium text-gray-700"
              >
                Correo electrónico
              </label>
              <div className="flex items-center space-x-2">
                <input
                  id="email-address"
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="ejemplo@gmail.com"
                  className="input input-bordered w-full"
                  value={credentials.email}
                  onChange={(e) =>
                    setCredentials({ ...credentials, email: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Contraseña
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"></div>

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  className="input input-bordered w-full max-w-xs"
                  value={credentials.password}
                  onChange={(e) =>
                    setCredentials({ ...credentials, password: e.target.value })
                  }
                />

                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff
                        className="h-5 w-5 text-gray-400 hover:text-gray-500"
                        aria-hidden="true"
                      />
                    ) : (
                      <Eye
                        className="h-5 w-5 text-gray-400 hover:text-gray-500"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Recuérdame
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <User className="h-5 w-5 mr-2" aria-hidden="true" />
                Iniciar sesión
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  O continúa con
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" />
                </svg>
                Iniciar sesión con Google
              </button>
            </div>
          </div>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              ¿No tienes una cuenta?{" "}
              <Link
                href="/registro"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
