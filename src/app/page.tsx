"use client";

import NavBar from "@/components/navbar";
import Hero from "@/components/hero";
import TabBar from "@/components/TabBar";
import { useState } from "react";

export default function LandingPage() {
  const [hideNavBar, setHideNavBar] = useState(false);
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {!hideNavBar && <NavBar />}
      <Hero />
      <TabBar onToggleNavBar={setHideNavBar}></TabBar>
    </div>
  );
}
