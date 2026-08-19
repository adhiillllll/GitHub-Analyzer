import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { BiBookOpen, BiShieldQuarter, BiBarChartAlt2, BiCodeAlt } from "react-icons/bi";

export default function DocsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0b0e14] text-slate-100 font-sans">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto p-6 sm:p-8 space-y-8">
        <header className="border-b border-[#1e2434] pb-6 space-y-2">
          <div className="flex items-center gap-3">
            <BiBookOpen className="text-2xl text-[#00d68f]" />
            <h1 className="text-2xl font-bold text-white tracking-tight">
              CodeOrbit Documentation
            </h1>
          </div>
          <p className="text-sm text-slate-400">
            Guide to AI-powered GitHub repository insights, code health metrics, and security scanning.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-[#1e2434] bg-[#121622] rounded-xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-[#00d68f]">
              <BiBarChartAlt2 className="text-xl" />
              <h3 className="text-base font-semibold text-white">AI Code Health Analysis</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-mono">
              Evaluates repository architecture, maintainability, type safety, documentation, and code quality using multi-tiered LLM provider routing.
            </p>
          </div>

          <div className="border border-[#1e2434] bg-[#121622] rounded-xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-[#00d68f]">
              <BiShieldQuarter className="text-xl" />
              <h3 className="text-base font-semibold text-white">Security & Dependencies</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-mono">
              Scans configuration files, package manifests, and source trees to highlight dependency patterns and potential security vulnerabilities.
            </p>
          </div>
        </section>

        <section className="border border-[#1e2434] bg-[#121622] rounded-xl p-6 space-y-4">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <BiCodeAlt className="text-lg text-[#00d68f]" />
            <span>Getting Started</span>
          </h3>
          <ol className="space-y-3 text-xs text-slate-300 font-mono">
            <li className="flex items-start gap-3">
              <span className="px-2 py-0.5 rounded bg-[#1e2434] text-[#00d68f] font-bold">1</span>
              <span>Paste any public GitHub repository URL into the search bar.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="px-2 py-0.5 rounded bg-[#1e2434] text-[#00d68f] font-bold">2</span>
              <span>Review full file trees, languages breakdown, and contributor statistics.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="px-2 py-0.5 rounded bg-[#1e2434] text-[#00d68f] font-bold">3</span>
              <span>Generate AI Code Health scores and engineering summaries on demand.</span>
            </li>
          </ol>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#00d68f] hover:underline"
            >
              <span>← Back to Repository Analyzer</span>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
