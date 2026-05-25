"use client";
import { Suspense, useState } from "react";
import { AuthForm } from "@/components/AuthForm";

export default function RegisterPage() {
  const [dark, setDark] = useState(false);
  return (
    <main className={`min-h-screen flex flex-col items-center px-6 py-12 ${dark ? "bg-black text-white" : "bg-white text-black"}`}>
      <button
        onClick={() => setDark(!dark)}
        className={`mb-4 px-4 py-2 border ${dark ? "border-white text-white bg-black" : "border-black text-black bg-white"} rounded`}
      >
        Toggle Theme
      </button>
      <Suspense fallback={null}>
        <AuthForm mode="register" />
      </Suspense>
    </main>
  );
};
