import { NextResponse } from "next/server";

import { getCurrentUserId } from "@/lib/currentUser";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const userId = await getCurrentUserId();

  if (!userId) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const rawHistory = await prisma.searchHistory.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const seen = new Set<string>();
  const history = rawHistory.filter((item) => {
    if (seen.has(item.githubUrl)) {
      return false;
    }
    seen.add(item.githubUrl);
    return true;
  });

  return NextResponse.json({ success: true, history: history.slice(0, 50) });
}
