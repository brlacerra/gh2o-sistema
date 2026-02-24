"use client";

import Image from "next/image";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faClock, faPhone } from "@fortawesome/free-solid-svg-icons";
import { faFacebookF, faInstagram, faLinkedin } from "@fortawesome/free-brands-svg-icons";

type MeResponse = {
  user: null | {
    codUsr: string;
    emailUsr: string;
    nomeUsr: string;
    role: "admin" | "user";
  }
}

interface NavbarProps {
  title?: string;
}

export function NavbarClient({ title }: NavbarProps) {

  const router = useRouter();

  const [me, setMe] = useState<MeResponse["user"]>(null);
  const [loadingMe, setLoadingMe] = useState(true);

  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadMe(){
      setLoadingMe(true);
      try {
        const res = await fetch("/api/auth/me", {cache: "no-store"});
        if (!res.ok){
          setMe(null);
          return;
        }

        const json = (await res.json()) as any;

        const user = "user" in json ? json.user : null;
        setMe(user ?? null);
      } catch {
        setMe(null);
      } finally {
        setLoadingMe(false);
      }
    }

    loadMe();

    return () => {
      cancelled = true;
    }
  }, []);

  useEffect(() => {
    function onDocClick(e:MouseEvent){
      if(!open) return;
      const el = menuRef.current;
      if(!el) return;
      if(e.target instanceof Node && !el.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  async function doLogout(){
    await fetch("/api/auth/logout", {method: "POST"}).catch(() => null);
    setOpen(false);
    setMe(null);
    router.refresh();
    router.push("/");
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 shadow-md">
      {!title?.includes("Dashboard") || title?.includes("Pluviometria") && (
        <nav className="hidden sm:flex items-center justify-between px-20 h-12 bg-gray-100">
        <nav className="flex items-center gap-10">
          <div className="flex gap-2 items-center text-sm">
        <FontAwesomeIcon icon={faLocationDot} className="text-emerald-500" />
        <p className="text-gray-600">Rua Joaquim Pinto, 520 Bairro Batuque, Monte Carmelo - MG</p>
          </div>
          <div className="flex gap-2 items-center">
        <FontAwesomeIcon icon={faClock} className="text-emerald-500" />
        <p className="text-gray-600">Seg. - Sex. : 07:30 - 17:30</p>
          </div>
        </nav>
        <nav className="flex items-center gap-10">
          <div className="flex gap-2 items-center text-sm">
        <FontAwesomeIcon icon={faPhone} className="text-emerald-500" />
        <p className="text-gray-600">(34) 3842-6447</p>
          </div>
          <div className="flex gap-2 items-center">
        <section className="flex gap-2 items-center text-emerald-500">
          <div className="bg-white p-1">
            <a href="https://www.facebook.com/fernandofariagestaorh/?locale=pt_BR">
          <FontAwesomeIcon icon={faFacebookF} />
            </a>
          </div>
          <div className="bg-white p-1">
            <a href="https://www.linkedin.com/company/gh2o-gest%C3%A3o-de-recursos-h%C3%ADdricos/">
          <FontAwesomeIcon icon={faLinkedin} />
            </a>
          </div>
          <div className="bg-white p-1">
            <a href="https://www.instagram.com/gh2orecursoshidricos/">
          <FontAwesomeIcon icon={faInstagram} />
            </a>
          </div>
        </section>
          </div>
        </nav>
      </nav>
      )}
      
      <nav className="flex items-center justify-between px-4 md:px-20 h-24
                      bg-white backdrop-blur-sm text-white">
        <div className="flex items-center gap-3 ">
          <a href="/">
            <Image src="/logoatg.jpeg" alt="Logo" width={70} height={100} />
          </a>
          <div className="hidden sm:flex">
            <h2 className="text-3xl font-sans ml-5 text-stone-600 font-bold">
              {title}
            </h2>
            </div>
        </div>

        <div className="flex items-center gap-3" ref={menuRef}>
          {loadingMe ? (
            <div className="text-stone-600 text-sm">...</div>
          ) : me ? (
            <div className="relative">
              <button
                type="button"
                className="px-5 py-1.5 bg-gray-200 hover:bg-gray-300 text-lg text-black border border-gray-300"
                onClick={() => setOpen(v => !v)}
              >
                Olá, {me.nomeUsr}
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-slate-800 border border-gray-400 shadow-md overflow-hidden">
                  <button
                    type="button"
                    className="block w-full text-left px-4 py-2 hover:bg-slate-50"
                    onClick={() => {
                      setOpen(false);
                      router.push("/conta"); // placeholder
                    }}
                  >
                    
                    Conta
                  </button>

                  <button
                    type="button"
                    className="block w-full text-left px-4 py-2 hover:bg-slate-50"
                    onClick={doLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              className="px-7 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-lg"
              onClick={() => router.push("/login")}
            >
              Login
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}