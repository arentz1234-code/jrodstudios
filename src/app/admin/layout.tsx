"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "@/components/admin/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const auth = localStorage.getItem("admin_auth");
    setIsAuthenticated(auth === "true");

    if (auth !== "true" && pathname !== "/admin/login") {
      router.push("/admin/login");
    }
  }, [router, pathname]);

  // Show loading state while checking auth
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest"></div>
      </div>
    );
  }

  // Login page doesn't need sidebar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      {/* Mobile: top header (h-14) + bottom nav (h-16), Desktop: sidebar (w-64) */}
      <main className="pt-14 pb-20 px-4 lg:pt-0 lg:pb-0 lg:ml-64 lg:p-8">
        {children}
      </main>
    </div>
  );
}
