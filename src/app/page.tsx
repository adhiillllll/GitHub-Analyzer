import { Suspense } from "react";
import SearchForm from "@/components/repository/SearchForm";

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#0b0e14]">
          <div className="animate-spin h-8 w-8 border-4 border-slate-700 border-t-[#9bb8ff] rounded-full" />
        </div>
      }
    >
      <SearchForm />
    </Suspense>
  );
}