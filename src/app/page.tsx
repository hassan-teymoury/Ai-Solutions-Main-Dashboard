"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useThemeStore } from "@/lib/theme";
import { useAuthStore } from "@/lib/store";
import { LoginForm } from "@/components/auth/login-form";
import { SignupForm } from "@/components/auth/signup-form";

export default function HomePage() {
  const [isLogin, setIsLogin] = useState(true);
  const { isLoading, user, access_token, hydrated } = useAuthStore();
  const { theme } = useThemeStore();
  const router = useRouter();

  // Determine which logo to use based on theme (client-side only)
  const [logoSrc, setLogoSrc] = useState("/FinitX Logo T - dark.png"); // Default for SSR

  useEffect(() => {
    const isDarkMode =
      theme === "dark" ||
      (theme === "system" &&
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    setLogoSrc(
      isDarkMode ? "/FinitX Logo T - light 1.png" : "/FinitX Logo T - dark.png"
    );
  }, [theme]);

  useEffect(() => {
    // Only redirect if store is hydrated and we have valid auth data
    if (hydrated && !isLoading && user && access_token) {
      router.push("/dashboard");
    }
  }, [hydrated, isLoading, user, access_token, router]);

  // Show loading while store is hydrating
  if (!hydrated || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary via-background to-secondary/50 dark:from-background dark:via-background dark:to-muted">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-cyan border-t-transparent mx-auto"></div>
          <p className="mt-4 text-muted-foreground font-medium">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  // Don't render anything if user is authenticated (will redirect)
  if (user && access_token) {
    return null;
  }

  return (
    <>
      <div className="min-h-screen flex">
        {/* Left Side - Background Pattern */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-cyan/20 via-primary/10 to-accent/20 dark:from-background dark:via-muted dark:to-background relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-30 dark:opacity-15">
            <div className="absolute top-0 left-0 w-72 h-72 bg-secondary-foreground dark:bg-cyan rounded-full mix-blend-multiply filter blur-xl opacity-85 animate-blob"></div>
            <div className="absolute top-0 right-0 w-72 h-72 bg-cyan rounded-full mix-blend-multiply filter blur-xl opacity-85 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-accent rounded-full mix-blend-multiply filter blur-xl opacity-85 animate-blob animation-delay-4000"></div>
          </div>

          {/* Content */}
          <div className="relative mx-auto z-10 flex flex-col justify-center px-12 text-secondary dark:text-foreground">
            <div className="max-w-md">
              {/* Logo */}
              <div className="flex items-center gap-4">
                <Image
                  src={logoSrc}
                  alt="FinitX Logo"
                  width={150}
                  height={40}
                  priority
                />
                <Image
                  src="/OBWB Logo.png"
                  alt="OBWB Logo"
                  width={150}
                  height={40}
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Forms */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 bg-secondary dark:bg-background">
          <div className="w-full max-w-md">
            {/* Logo for mobile */}
            <div className="text-center lg:hidden mb-8">
              <div className="flex items-center gap-4 mb-4">
                <Image
                  src={logoSrc}
                  alt="FinitX Logo"
                  width={150}
                  height={40}
                  className="h-20 w-auto mx-auto"
                  priority
                />
                <Image
                  src="/OBWB Logo.png"
                  alt="OBWB Logo"
                  width={150}
                  height={40}
                  className="h-20 w-auto mx-auto"
                  priority
                />
              </div>
            </div>

            {/* Auth Tabs */}
            <div className="bg-card rounded-2xl shadow-xl border border-border overflow-hidden">
              <div className="flex">
                <button
                  onClick={() => setIsLogin(true)}
                  className={`flex-1 py-4 px-6 text-sm font-medium transition-all duration-200 ${
                    isLogin
                      ? "bg-cyan/10 text-cyan border-b-2 border-cyan"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setIsLogin(false)}
                  className={`flex-1 py-4 px-6 text-sm font-medium transition-all duration-200 ${
                    !isLogin
                      ? "bg-cyan/10 text-cyan border-b-2 border-cyan"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  Sign Up
                </button>
              </div>

              <div
                className={`p-8 flex items-center transition-all duration-300`}
              >
                <div className="w-full">
                  {isLogin ? (
                    <LoginForm onSwitchToSignup={() => setIsLogin(false)} />
                  ) : (
                    <SignupForm onSwitchToLogin={() => setIsLogin(true)} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Development Panel */}
      {/* <DevelopmentPanel /> */}
    </>
  );
}
