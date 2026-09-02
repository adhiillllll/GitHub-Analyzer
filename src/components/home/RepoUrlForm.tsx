import Input from "../ui/Input";
import { IoLink } from "react-icons/io5";
import { MdOutlineAnalytics } from "react-icons/md";

type RepoUrlFormProps = {
    url: string;
    loading: boolean;
    error: string;
    onChange: (value: string) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function RepoUrlForm({
    url,
    loading,
    error,
    onChange,
    onSubmit
}: RepoUrlFormProps) {
    return (
        <div className="w-full rounded-2xl border border-[#1e2434] bg-[#121622] p-6 shadow-xl">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Target Repository URL
            </h3>

            <form
                onSubmit={onSubmit}
                className="mt-3 flex flex-col sm:flex-row gap-3"
            >
                <div className="flex-1 flex items-center gap-3 rounded-lg border border-[#1f2638] bg-[#0d1017] px-3.5 py-2.5 transition focus-within:border-slate-400">
                    <IoLink className="text-slate-400 text-lg shrink-0" />

                    <Input
                        value={url}
                        disabled={loading}
                        placeholder="https://github.com/organization/repository"
                        onChange={(e) => onChange(e.target.value)}
                        className="py-1 text-sm font-mono placeholder:text-slate-500 placeholder:font-sans disabled:opacity-50 disabled:cursor-not-allowed"
                    />

                    <span className="hidden sm:inline-block rounded border border-[#232a3d] bg-[#171c2a] px-2 py-0.5 text-[11px] font-mono text-slate-400 select-none shrink-0">
                        github.com
                    </span>
                </div>

                <button
                    type="submit"
                    disabled={loading || !url.trim()}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#9bb8ff] px-6 py-2.5 text-sm font-semibold text-[#0a1020] transition hover:bg-[#8ab0ff] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 shrink-0"
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin h-4 w-4 text-[#0a1020]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Analyzing...</span>
                        </>
                    ) : (
                        <>
                            <MdOutlineAnalytics className="text-base" />
                            <span>Analyze</span>
                        </>
                    )}
                </button>
            </form>

            {error && (
                <p className="mt-3 text-xs text-red-400 font-medium">
                    {error}
                </p>
            )}
        </div>
    )
}