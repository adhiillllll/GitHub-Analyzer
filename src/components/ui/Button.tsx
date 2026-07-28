import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

export default function Button({ children, className, ...props}:ButtonProps) {
    return(
        <button className={clsx('w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled-cursor not-allowed disabled-opacity-50',
        className)}{...props}>
            {children}
        </button>
    )
}