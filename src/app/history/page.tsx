import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { BiHistory, BiPlus } from "react-icons/bi";
import { auth } from "@/auth";
import { getCurrentUserId } from "@/lib/currentUser";
import { prisma } from "@/lib/prisma";
import { formatNumber } from "@/utils/formatNumber";
import { formatDate } from "@/utils/formatDate";

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
  const history = rawHistory.filter((item) => {
    if (seen.has(item.githubUrl)) return false;
    seen.add(item.githubUrl);
    return true;
  }).slice(0, 50);

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0e14] text-slate-100 font-sans">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto p-6 sm:p-8">
        {!userId || history.length === 0 ? (
        <div className="border border-[#1e2434] bg-[#121622] rounded-2xl p-10 sm:p-14 max-w-md w-full shadow-2xl space-y-5 mx-auto text-center">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#1c2234] border border-[#283147] flex items-center justify-center text-slate-400 text-2xl">
            <BiHistory />
          </div>

          <div>
            <h2 className="text-xl font-bold text-white">
              {userId ? "No analysis history yet" : "Sign in to view history"}
            </h2>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed font-mono">
              {userId
                ? "Repositories you analyze will appear here."
                : "Your analysis history is tied to your account."}
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 w-full bg-[#9bb8ff] hover:bg-[#8ab0ff] text-[#0a1020] font-semibold text-xs py-2.5 px-4 rounded-lg transition active:scale-[0.98] shadow"
          >
            <BiPlus className="text-base" />
            <span>New Analysis</span>
          </Link>
        </div>
        ) : (
          <div className="space-y-5">
            <div>
              <h1 className="text-xl font-bold text-white">History</h1>
              <p className="mt-1 text-xs text-slate-400 font-mono">
                Recent analyses for {session?.user?.email}
              </p>
            </div>

            <div className="space-y-3">
              {history.map((item) => (
                <a
                  key={item.id}
                  href={item.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block border border-[#1e2434] bg-[#121622] hover:bg-[#181d2a] rounded-xl p-5 transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="text-sm font-bold text-white truncate">
                        {item.fullName}
                      </h2>
                      <p className="mt-2 text-xs text-slate-400 line-clamp-2">
                        {item.description ?? "No description provided."}
                      </p>
                    </div>
                    <span className="text-[11px] text-slate-500 font-mono shrink-0">
                      {formatDate(item.createdAt.toISOString())}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center gap-3 text-[11px] text-slate-400 font-mono">
                    <span>{item.language ?? "Unknown"}</span>
                    <span>{formatNumber(item.stars ?? 0)} stars</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
