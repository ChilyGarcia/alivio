'use client';

import { montserrat } from "../../public/fonts/font";
import ClientFooter from "./client-footer";

export default function ClientBody({ children }: { children: React.ReactNode }) {
  return (
    <body suppressHydrationWarning className={`${montserrat.className} antialiased`}>
      <div suppressHydrationWarning>
        {children}
        <ClientFooter />
      </div>
    </body>
  );
}
