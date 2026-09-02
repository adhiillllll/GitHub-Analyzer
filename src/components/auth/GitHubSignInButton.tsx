"use client";

import { signIn } from "next-auth/react";
import { FaGithub } from "react-icons/fa";

export default function GitHubSignInButton() {
    return (
        <button
            type="button"
            onClick={() => signIn("github", { callbackUrl: "/profile" })}
            className="w-full flex items-center justify-center gap-3 rounded-lg border border-[#2a3142] bg-[#121622] px-4 py-3 text-sm font-medium text-slate-100 transition hover:bg-[#181d2a]">
            <FaGithub className="text-base text-slate-200" />
            <span>Continue with GitHub</span>
        </button>
    );
}
