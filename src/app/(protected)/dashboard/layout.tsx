"use client";

import React from "react";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
export default function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();

  if (user?.role === "admin") {
    router.replace("admin-dashboard");
  }

  return <div>{children}</div>;
}
