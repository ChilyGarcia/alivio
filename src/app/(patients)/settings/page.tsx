import { Metadata } from "next";
import { SettingsScreen } from "@/components/settings/SettingsScreen";

export const metadata: Metadata = {
  title: "Configuración - Alivio",
  description: "Configura tu cuenta y preferencias en Alivio",
};

export default function SettingsPage() {
  return <SettingsScreen />;
}
