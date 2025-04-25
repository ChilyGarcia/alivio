"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { authenticationService } from "@/services/auth.service";
import { User as UserInterface } from "@/interfaces/user.interface";
import Cookies from "js-cookie";
import { ArrowLeft, ChevronDown } from "lucide-react";
import Navbar from "@/components/navbar";

export default function EditProfilePage() {
  const [user, setUser] = React.useState<UserInterface | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [form, setForm] = React.useState<any>({});
  const router = useRouter();

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const u = await authenticationService.userDetails();
        setUser(u);
        setForm({
          username: u.email?.split("@")[0] || "",
          firstName: u.name || "",
          lastName: "",
          idType: "Cédula de Ciudadanía",
          idNumber: "",
          email: u.email || "",
          phone: "",
          birthDate: "",
          gender: "Masculino",
          department: "Norte de Santander",
          city: "Cúcuta",
        });
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleChange = (field: string, value: string) => {
    setForm((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleRestore = () => {
    if (user) {
      setForm((prev: any) => ({
        ...prev,
        username: user.email?.split("@")[0] || "",
        firstName: user.name,
      }));
    }
  };

  const handleSave = async () => {
    try {
      await authenticationService.updateUser(form);
      router.back();
    } catch (e) {
      console.error(e);
    }
  };

  // Common wrapper for labeled input/select
  function LabeledField({
    label,
    children,
    className = "",
  }: {
    label: string;
    children: React.ReactNode;
    className?: string;
  }) {
    return (
      <div
        className={`relative border border-primary rounded-full px-4 py-3 ${className}`}
      >
        <p className="text-xs text-primary font-medium">{label}</p>
        <div className="flex items-center justify-between mt-1">{children}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar></Navbar>

      <div className="max-w-2xl mx-auto mt-12 animate-fade-in">
        <div className="px-4 py-6 space-y-6">
          <div className="flex items-center gap-4 animate-fade-in">
            <button
              onClick={() => router.back()}
              className="p-2.5 rounded-full hover:bg-white/80 transition-all duration-300 hover:shadow-md active:scale-95"
            >
              <ArrowLeft className="h-6 w-6 text-primary" />
            </button>
            <h3 className="text-xl font-bold text-primary">Datos personales</h3>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-gray-700">Nombre de Usuario</p>
            <p className="mt-1 text-sm text-gray-900 font-medium">
              {form.username}
            </p>
          </div>

          <LabeledField label="Foto de Perfil">
            <p className="text-sm text-gray-500">
              Puedes editar tu foto de perfil
            </p>
            <div className="h-12 w-12 rounded-full border-2 border-primary overflow-hidden">
              <img
                src={user.profile_image || "/images/doc1.png"}
                alt="avatar"
                className="h-full w-full object-cover"
              />
            </div>
          </LabeledField>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <LabeledField label="Nombre">
              <input
                type="text"
                value={form.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                className="flex-1 bg-transparent text-sm text-gray-900 outline-none"
              />
              <button>
                <img
                  src="/icons/edit-icon.svg"
                  className="h-full w-full object-cover"
                />
              </button>
            </LabeledField>

            <LabeledField label="Apellidos">
              <input
                type="text"
                value={form.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                className="flex-1 bg-transparent text-sm text-gray-900 outline-none"
              />
              <button>
                <img
                  src="/icons/edit-icon.svg"
                  className="h-full w-full object-cover"
                />
              </button>
            </LabeledField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <LabeledField label="Tipo de documento de identidad">
              <select
                value={form.idType}
                onChange={(e) => handleChange("idType", e.target.value)}
                className="flex-1 bg-transparent text-sm text-gray-900 outline-none appearance-none"
              >
                <option>Cédula de Ciudadanía</option>
                <option>Tarjeta de Identidad</option>
                <option>Cédula de Extranjería</option>
              </select>
              <button>
                <ChevronDown className="h-5 w-5 text-gray-500" />
              </button>
            </LabeledField>

            <LabeledField label="Documento de identidad">
              <input
                type="text"
                value={form.idNumber}
                onChange={(e) => handleChange("idNumber", e.target.value)}
                className="flex-1 bg-transparent text-sm text-gray-900 outline-none"
              />
              <button>
                <img
                  src="/icons/edit-icon.svg"
                  className="h-full w-full object-cover"
                />
              </button>
            </LabeledField>
          </div>

          <LabeledField label="Correo Electrónico">
            <input
              type="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="flex-1 bg-transparent text-sm text-gray-900 outline-none"
            />
            <button>
              <img
                src="/icons/edit-icon.svg"
                className="h-full w-full object-cover"
              />
            </button>
          </LabeledField>

          <LabeledField label="Número de Teléfono">
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="flex-1 bg-transparent text-sm text-gray-900 outline-none"
            />
            <button>
              <img
                src="/icons/edit-icon.svg"
                className="h-full w-full object-cover"
              />
            </button>
          </LabeledField>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <LabeledField label="Fecha de nacimiento">
              <input
                type="date"
                value={form.birthDate}
                onChange={(e) => handleChange("birthDate", e.target.value)}
                className="flex-1 bg-transparent text-sm text-gray-900 outline-none cursor-pointer"
              />
            </LabeledField>

            <LabeledField label="Género">
              <select
                value={form.gender}
                onChange={(e) => handleChange("gender", e.target.value)}
                className="flex-1 bg-transparent text-sm text-gray-900 outline-none appearance-none"
              >
                <option>Masculino</option>
                <option>Femenino</option>
                <option>Otro</option>
              </select>
              <button>
                <ChevronDown className="h-5 w-5 text-gray-500" />
              </button>
            </LabeledField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <LabeledField label="Departamento de residencia">
              <select
                value={form.department}
                onChange={(e) => handleChange("department", e.target.value)}
                className="flex-1 bg-transparent text-sm text-gray-900 outline-none appearance-none"
              >
                <option>Norte de Santander</option>
                <option>Antioquia</option>
                <option>Cundinamarca</option>
              </select>
              <button>
                <ChevronDown className="h-5 w-5 text-gray-500" />
              </button>
            </LabeledField>

            <LabeledField label="Municipio de residencia">
              <select
                value={form.city}
                onChange={(e) => handleChange("city", e.target.value)}
                className="flex-1 bg-transparent text-sm text-gray-900 outline-none appearance-none"
              >
                <option>Cúcuta</option>
                <option>Bucaramanga</option>
              </select>
              <button>
                <ChevronDown className="h-5 w-5 text-gray-500" />
              </button>
            </LabeledField>
          </div>

          <div className="mt-6 space-y-3 pb-6">
            <button
              onClick={handleRestore}
              className="w-full h-12 border border-gray-300 rounded-full text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
            >
              Restaurar
            </button>
            <button
              onClick={handleSave}
              className="w-full h-12 bg-primary rounded-full text-sm font-medium text-white hover:bg-primary/90 transition-colors"
            >
              Guardar cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
