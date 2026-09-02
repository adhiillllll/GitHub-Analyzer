import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { BiStar, BiPlus } from "react-icons/bi";
import { auth } from "@/auth";
import { getCurrentUserId } from "@/lib/currentUser";
import { prisma } from "@/lib/prisma";
import { formatNumber } from "@/utils/formatNumber";

export default async function FavoritesPage() {
  const session = await auth();
  const userId = await getCurrentUserId();
  const rawFavorites = userId
    ? await prisma.favorite.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      })
    : [];

  const seen = new Set<string>();
  const favorites = rawFavorites.filter((favorite) => {
    if (seen.has(favorite.githubUrl)) return false;
    seen.add(favorite.githubUrl);
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0e14] text-slate-100 font-sans">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto p-6 sm:p-8">
        {!userId || favorites.length === 0 ? (
        <div className="border border-[#1e2434] bg-[#121622] rounded-2xl p-10 sm:p-14 max-w-md w-full shadow-2xl space-y-5 mx-auto text-center">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#1c2234] border border-[#283147] flex items-center justify-center text-amber-400 text-2xl">
            <BiStar />
          </div>

          <div>
            <h2 className="text-xl font-bold text-white">
              {userId ? "No favorite repositories yet" : "Sign in to view favorites"}
            </h2>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed font-mono">
              {userId
                ? "Save repositories to access them quickly."
                : "Your saved repositories are tied to your account."}
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
              <h1 className="text-xl font-bold text-white">Favorites</h1>
              <p className="mt-1 text-xs text-slate-400 font-mono">
                Saved repositories for {session?.user?.email}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {favorites.map((favorite) => (
                <a
                  key={favorite.id}
                  href={favorite.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-[#1e2434] bg-[#121622] hover:bg-[#181d2a] rounded-xl p-5 transition"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h2 className="text-sm font-bold text-white truncate">
                        {favorite.fullName}
                      </h2>
                      <p className="mt-2 text-xs text-slate-400 line-clamp-2">
                        {favorite.description ?? "No description provided."}
                      </p>
                    </div>
                    <BiStar className="text-amber-400 text-xl shrink-0" />
                  </div>

                  <div className="mt-4 flex items-center gap-3 text-[11px] text-slate-400 font-mono">
                    <span>{favorite.language ?? "Unknown"}</span>
                    <span>{formatNumber(favorite.stars ?? 0)} stars</span>
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
