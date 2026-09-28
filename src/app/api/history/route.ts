import { NextRequest, NextResponse } from "next/server";
import { SearchHistory } from "@prisma/client";
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
  const history = rawHistory.filter((item: SearchHistory) => {
    if (seen.has(item.githubUrl)) {
      return false;
    }
    seen.add(item.githubUrl);
    return true;
  });

  return NextResponse.json({ success: true, history: history.slice(0, 50) });
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const clearAll = searchParams.get("clearAll") === "true";

    if (clearAll) {
      await prisma.searchHistory.deleteMany({
        where: { userId },
      });
      return NextResponse.json({ success: true, message: "All history cleared." });
    }

    if (id) {
      // Find history item by ID or githubUrl associated with this user
      const targetItem = await prisma.searchHistory.findFirst({
        where: { id, userId },
      });

      if (!targetItem) {
        return NextResponse.json({ success: false, error: "History item not found." }, { status: 404 });
      }

      // Delete all history records for this githubUrl for this user to ensure deduplication
      await prisma.searchHistory.deleteMany({
        where: {
          userId,
          githubUrl: targetItem.githubUrl,
        },
      });

      return NextResponse.json({ success: true, message: "History item deleted." });
    }

    return NextResponse.json(
      { success: false, error: "Missing id or clearAll parameter." },
      { status: 400 }
    );
  } catch (error) {
    console.error("Delete history error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete history item." },
      { status: 500 }
    );
  }
}
