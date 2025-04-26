"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { authenticationService } from "@/services/auth.service";
import { User as UserInterface } from "@/interfaces/user.interface";
import Cookies from "js-cookie";
import { ArrowLeft, ChevronDown } from "lucide-react";
import Navbar from "@/components/navbar";

// Mover LabeledField fuera del componente principal
const LabeledField = React.memo(function LabeledField({
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
});

export default function EditProfilePage() {
  const [user, setUser] = React.useState<UserInterface | null>(null);
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();
  const [form, setForm] = React.useState({
    name: "",
    email: "",
    phone_number: "",
    document_type: "cc",
    document_number: "",
    profile_image: null as File | null,
  });
  const [previewImage, setPreviewImage] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const u = await authenticationService.userDetails();
        setUser(u);
        setForm(prev => ({
          ...prev,
          name: u.name || "",
          email: u.email || "",
          phone_number: u.phone_number || "",
          document_type: u.document_type || "cc",
          document_number: u.document_number || "",
        }));
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleChange = React.useCallback((field: string, value: string | File) => {
    setForm(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleImageChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      handleChange("profile_image", file);
      
      // Crear URL para vista previa
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [handleChange]);

  // Limpiar URL de vista previa al desmontar
  React.useEffect(() => {
    return () => {
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  const handleSave = async () => {
    try {
      const formData = new FormData();
      
      // Validar campos requeridos
      if (!form.name || !form.email || !form.phone_number) {
        alert("Por favor completa todos los campos requeridos");
        return;
      }

      // Agregar campos requeridos
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("phone_number", form.phone_number);
      
      // Agregar campos opcionales
      if (form.document_type) {
        formData.append("document_type", form.document_type);
      }
      if (form.document_number) {
        formData.append("document_number", form.document_number);
      }
      if (form.profile_image) {
        formData.append("profile_image", form.profile_image);
      }

      await authenticationService.updateUser(formData);
      router.back();
    } catch (error) {
      console.error(error);
      alert("Error al actualizar el perfil: " + (error as Error).message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-2xl mx-auto mt-12 animate-fade-in">
        <div className="px-4 py-6 space-y-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2.5 rounded-full hover:bg-white/80 transition-all duration-300 hover:shadow-md active:scale-95"
            >
              <ArrowLeft className="h-6 w-6 text-primary" />
            </button>
            <h3 className="text-xl font-bold text-primary">Datos personales</h3>
          </div>

          <LabeledField label="Foto de Perfil">
            <div className="flex items-center gap-4">
              <div className="relative h-12 w-12 rounded-full border-2 border-primary overflow-hidden group">
                <img
                  src={previewImage || user?.profile_image_url || "/images/doc1.png"}
                  alt="avatar"
                  className="h-full w-full object-cover transition-opacity duration-200 group-hover:opacity-75"
                />
                {form.profile_image && (
                  <div className="absolute inset-0 flex items-center justify-center bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <span className="text-[10px] text-primary font-medium text-center px-1">
                      Nueva foto
                    </span>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <label className="cursor-pointer text-sm text-gray-500 hover:text-primary transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  {form.profile_image ? 'Cambiar foto' : 'Subir foto'}
                </label>
                {form.profile_image && (
                  <button
                    onClick={() => {
                      handleChange("profile_image", null);
                      setPreviewImage(null);
                    }}
                    className="text-xs text-red-500 hover:text-red-600 transition-colors"
                  >
                    Eliminar foto
                  </button>
                )}
              </div>
            </div>
          </LabeledField>

          <LabeledField label="Nombre completo">
            <input
              type="text"
              value={form.name}
              onChange={e => handleChange("name", e.target.value)}
              className="flex-1 bg-transparent text-sm text-gray-900 outline-none"
              placeholder="Ingresa tu nombre completo"
            />
          </LabeledField>

          <LabeledField label="Correo Electrónico">
            <input
              type="email"
              value={form.email}
              onChange={e => handleChange("email", e.target.value)}
              className="flex-1 bg-transparent text-sm text-gray-900 outline-none"
              placeholder="correo@ejemplo.com"
            />
          </LabeledField>

          <LabeledField label="Número de Teléfono">
            <input
              type="tel"
              value={form.phone_number}
              onChange={e => handleChange("phone_number", e.target.value)}
              className="flex-1 bg-transparent text-sm text-gray-900 outline-none"
              placeholder="+57 300 000 0000"
            />
          </LabeledField>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <LabeledField label="Tipo de documento">
              <select
                value={form.document_type}
                onChange={e => handleChange("document_type", e.target.value)}
                className="flex-1 bg-transparent text-sm text-gray-900 outline-none appearance-none"
              >
                <option value="cc">Cédula de Ciudadanía</option>
                <option value="ce">Cédula de Extranjería</option>
                <option value="tp">Tarjeta de Pasaporte</option>
              </select>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </LabeledField>

            <LabeledField label="Número de documento">
              <input
                type="text"
                value={form.document_number}
                onChange={e => handleChange("document_number", e.target.value)}
                className="flex-1 bg-transparent text-sm text-gray-900 outline-none"
                placeholder="Ingresa tu número de documento"
              />
            </LabeledField>
          </div>

          <div className="mt-6 space-y-3 pb-6">
            <button
              onClick={() => router.back()}
              className="w-full h-12 border border-gray-200 rounded-full text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancelar
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
