"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, FileText } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <FileText className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">CVManager</span>
          </div>

          {/* Desktop Navigation */}
          {isAuthenticated ? (
            // Authenticated state - show only logout button
            <div className="hidden md:flex items-center space-x-4">
              <Button
                variant="ghost"
                className=" hover:text-accent-foreground transition-all duration-200 bg-emerald-700 text-white hover:bg-emerald-600"
                onClick={() => logout()}
              >
                Logout
              </Button>
            </div>
          ) : (
            // Non-authenticated state - show features navigation and auth buttons
            <>
              <nav className="hidden md:flex items-center space-x-8">
                <a
                  href="#home"
                  className="text-sm font-medium text-foreground hover:text-primary transition-colors duration-200"
                >
                  Home
                </a>
                <a
                  href="#features"
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  Features
                </a>
                <a
                  href="#how-it-works"
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  How It Works
                </a>
                <a
                  href="#contact"
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  Contact
                </a>
              </nav>

              {/* Desktop Auth Buttons */}
              <div className="hidden md:flex items-center space-x-4">
                <Button
                  variant="ghost"
                  className=" hover:text-accent-foreground  bg-green-700 text-white transition-all duration-200 hover:scale-105"
                  onClick={() => router.replace("/login")}
                >
                  Login
                </Button>
                <Button
                  className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 hover:scale-105"
                  onClick={() => router.replace("/signup")}
                >
                  Sign Up
                </Button>
              </div>
            </>
          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-accent transition-colors duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t animate-fade-in-up">
            {isAuthenticated ? (
              // Authenticated state - show only logout button
              <nav className="flex flex-col space-y-4">
                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                >
                  Logout
                </Button>
              </nav>
            ) : (
              // Non-authenticated state - show features navigation and auth buttons
              <nav className="flex flex-col space-y-4">
                <a
                  href="#home"
                  className="text-sm font-medium text-foreground hover:text-primary transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </a>
                <a
                  href="#features"
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Features
                </a>
                <a
                  href="#how-it-works"
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  How It Works
                </a>
                <a
                  href="#contact"
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </a>
                <div className="flex flex-col space-y-2 pt-4 border-t">
                  <Button
                    variant="ghost"
                    className="justify-start"
                    onClick={() => router.replace("/login")}
                  >
                    Login
                  </Button>
                  <Button
                    className="justify-start bg-primary hover:bg-primary/90 text-primary-foreground"
                    onClick={() => router.replace("/signup")}
                  >
                    Sign Up
                  </Button>
                </div>
              </nav>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
