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
                        placeholder="https://github.com/organization/repository"
                        onChange={(e) => onChange(e.target.value)}
                        className="py-1 text-sm font-mono placeholder:text-slate-500 placeholder:font-sans"
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
                    <MdOutlineAnalytics className="text-base" />
                    <span>{loading ? "Analyzing..." : "Analyze"}</span>
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