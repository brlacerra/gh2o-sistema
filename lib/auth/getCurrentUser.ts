import "server-only"

import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { AUTH_COOKIE_NAME } from "./constants";
import { Decimal } from "@prisma/client/runtime/library";

export type CurrentUser = {
  codUsr: string;
  emailUsr: string;
  role: "admin" | "user";
  latMap?: Decimal | null;
  longMap?: Decimal | null;
  zoomMap?: Decimal | null;
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
                    latMap: true,
                    longMap: true,
                    zoomMap: true,
                }
            }
        }
    });

    if (!session) return null;
    if(session.expires <= now) return null;

    return session.usuario;
}
