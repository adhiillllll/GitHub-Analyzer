import { InputHTMLAttributes } from 'react';
import clsx from 'clsx';

type InputProps = InputHTMLAttributes<HTMLInputElement>

export default function input({ className, ...props}:InputProps) {
    return(
        <input className={clsx('w-full rounded-lg boarder boarder-slate-700 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:boarder-blue-500',
        className)} {...props}/>
    )
}