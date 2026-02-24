import "server-only"

import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { AUTH_COOKIE_NAME } from "./constants";

export type CurrentUser = {
  codUsr: string;
  emailUsr: string;
  role: "admin" | "user";
};

export async function getCurrentUser(): Promise<CurrentUser | null> {
    const cookieStore = cookies();
    const token = (await cookieStore).get(AUTH_COOKIE_NAME)?.value;
    if (!token) return null;

    const now = new Date();

    const session = await prisma.session.findUnique({
        where: { sessionToken: token },
        select: {
            expires: true,
            usuario: {
                select: {
                    codUsr: true,
                    emailUsr: true,
                    nomeUsr: true,
                    role: true,
                }
            }
        }
    });

    if (!session) return null;
    if(session.expires <= now) return null;

    return session.usuario;
}
