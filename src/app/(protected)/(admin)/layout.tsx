"use client";

import { useAuth } from "@/context/auth-context";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (user?.role !== "admin") {
    return <div>Access Denied</div>;
  }

  return <div>{children}</div>;
}
