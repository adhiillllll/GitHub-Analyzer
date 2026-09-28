import Navbar from "@/components/layout/Navbar";
import { auth } from "@/auth";
import { getCurrentUserId } from "@/lib/currentUser";
import { prisma } from "@/lib/prisma";
import HistoryList from "@/components/history/HistoryList";

export default async function HistoryPage() {
  const session = await auth();
  const userId = await getCurrentUserId();
  const rawHistory = userId
    ? await prisma.searchHistory.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 100,
      })
    : [];

  const seen = new Set<string>();
  const history = rawHistory
    .filter((item) => {
      if (seen.has(item.githubUrl)) return false;
      seen.add(item.githubUrl);
      return true;
    })
    .slice(0, 50)
    .map((item) => ({
      ...item,
      createdAt: item.createdAt.toISOString(),
    }));

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0e14] text-slate-100 font-sans">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto p-6 sm:p-8">
        <HistoryList
          initialHistory={history}
          userEmail={session?.user?.email}
          isLoggedIn={!!userId}
        />
      </main>
    </div>
  );
}
