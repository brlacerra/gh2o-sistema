"use client";

import Image from "next/image";

interface NavbarProps {
  title?: string;
}

export function NavbarClient() {
  return (
    <header className="absolute top-0 left-0 right-0 z-20">
      <nav className="flex items-center justify-between px-6 h-24
                      bg-white backdrop-blur-sm text-white border-b border-white/10">
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="Logo" width={150} height={100} />
          <h2 className="text-3xl font-sans ms-5 text-stone-600 font-bold">Sistema de gerenciamento</h2>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-7 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-lg">
            Login
          </button>
        </div>
      </nav>
    </header>
  );
}