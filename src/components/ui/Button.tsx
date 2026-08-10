import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

export default function Button({ children, className, ...props}:ButtonProps) {
    return(
        <button className={clsx('inline-flex items-center justify-center gap-2 rounded-lg bg-blue-400 px-6 py-3 font-medium text-slate-900 transition hover:bg-blue-300 disabled:cursor-not-allowed disabled:opacity-50',
        className)}{...props}>
            {children}
        </button>
    )
}