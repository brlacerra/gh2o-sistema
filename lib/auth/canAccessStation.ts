import "server-only";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";

export async function canAccessStation(codSta: string) {
    const user = await getCurrentUser();
    const station = await prisma.sta.findUnique({
        where: { codSta },
        select: {
            codSta: true,
            codUsr: true,
            is_public: true,
        },
    });

    if (!station) return { allowed: false as const, station: null, user, reason: "not_found" as const };
    
    if (station.is_public) return { allowed: true as const, station, user, reason: "public" as const };
    
    if (!user) return { allowed: false as const, station, user, reason: "unauthenticated" as const };

    if (user.role === "admin" || user.codUsr === station.codUsr) return { allowed: true as const, station, user, reason: "owner_or_admin" as const};

    return { allowed: false as const, station, user, reason: "forbidden" as const };
}