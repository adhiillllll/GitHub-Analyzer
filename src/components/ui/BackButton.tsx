"use client";

import { useRouter } from "next/navigation";
import { BiArrowBack } from "react-icons/bi";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="inline-flex items-center gap-2 text-xs font-medium text-slate-300 hover:text-white bg-[#141824] hover:bg-[#1c2234] border border-[#232a3d] hover:border-[#323d57] px-3.5 py-2 rounded-xl transition shadow-sm"
      title="Return to previous page"
    >
      <BiArrowBack className="text-sm text-slate-400" />
      <span>Back</span>
    </button>
  );
}
