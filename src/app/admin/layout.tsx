"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";
import AdminNav from "@/components/admin/AdminNav";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <div className="min-h-screen bg-background">
        <AdminNav />
        <main className="p-8">
          {children}
        </main>
      </div>
    </SessionProvider>
  );
}