import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { BiStar, BiPlus } from "react-icons/bi";

export default function FavoritesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0b0e14] text-slate-100 font-sans">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto p-6 sm:p-8 flex flex-col justify-center items-center text-center">
        <div className="border border-[#1e2434] bg-[#121622] rounded-2xl p-10 sm:p-14 max-w-md w-full shadow-2xl space-y-5">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#1c2234] border border-[#283147] flex items-center justify-center text-amber-400 text-2xl">
            <BiStar />
          </div>

          <div>
            <h2 className="text-xl font-bold text-white">
              No favorite repositories yet
            </h2>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed font-mono">
              Save repositories to access them quickly.
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
      </main>
    </div>
  );
}
