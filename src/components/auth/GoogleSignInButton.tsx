"use client";

import { signIn } from "next-auth/react";
import { FaGoogle } from "react-icons/fa";

export default function GoogleSignInButton() {
    return (
        <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/profile" })}
            className="w-full flex items-center justify-center gap-3 rounded-lg border border-[#2a3142] bg-[#121622] px-4 py-3 text-sm font-medium text-slate-100 transition hover:bg-[#181d2a]">
            <FaGoogle className="text-base text-red-400" />
            <span>Continue with Google</span>
        </button>
    );
}