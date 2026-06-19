"use client";

import { LoginForm } from "@/components/login-page";
import { Shield } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  return (
    <>
      <header className="sticky top-0 z-50 border-b border-indigo-100 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div
            className="flex cursor-pointer items-center gap-3"
            onClick={() => router.push("/")}
          >
            <div className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-blue-600">SecureGate</h1>
            </div>
          </div>
        </div>
      </header>
      <main className="flex min-h-svh items-center justify-center px-4 py-12">
        <LoginForm />
      </main>
      ;
    </>
  );
}
