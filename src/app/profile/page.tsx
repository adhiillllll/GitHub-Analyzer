import Navbar from "@/components/layout/Navbar";
import { BiUser } from "react-icons/bi";
import { FaGoogle, FaGithub } from "react-icons/fa";

export default function ProfilePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0b0e14] text-slate-100 font-sans">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto p-6 sm:p-8 flex flex-col justify-center items-center text-center">
        <div className="border border-[#1e2434] bg-[#121622] rounded-2xl p-8 sm:p-12 max-w-md w-full shadow-2xl space-y-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#1c2234] border border-[#283147] flex items-center justify-center text-slate-300 text-3xl">
            <BiUser />
          </div>

          <div>
            <span className="px-3 py-1 bg-[#1c2234] text-slate-400 font-mono text-[11px] rounded-full uppercase tracking-wider border border-[#283147]">
              Guest Profile
            </span>
            <h2 className="mt-3 text-xl font-bold text-white">
              Sign in to CodeOrbit
            </h2>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed font-mono">
              Sign in to save repository bookmarks, track analysis history, and unlock custom AI settings.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 bg-[#1c2234] hover:bg-[#252e46] border border-[#2b354d] text-white text-xs font-semibold py-3 px-4 rounded-xl transition"
            >
              <FaGoogle className="text-base text-red-400" />
              <span>Continue with Google</span>
            </button>

            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 bg-[#181d2a] hover:bg-[#202738] border border-[#2b354d] text-white text-xs font-semibold py-3 px-4 rounded-xl transition"
            >
              <FaGithub className="text-base text-slate-200" />
              <span>Continue with GitHub</span>
            </button>
          </div>

          <p className="text-[11px] text-slate-500 font-mono pt-2">
            Authentication setup in progress.
          </p>
        </div>
      </main>
    </div>
  );
}
