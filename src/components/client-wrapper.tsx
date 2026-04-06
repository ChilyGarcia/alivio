'use client';

import { useState } from "react";
import { usePathname } from "next/navigation";
import NavBar from "./navbar";
import TabBar from "./TabBar";

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [hideNavBar, setHideNavBar] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <>
      {isHomePage && !hideNavBar && <NavBar />}
      {children}
      <TabBar onToggleNavBar={setHideNavBar} />
    </>
  );
}
