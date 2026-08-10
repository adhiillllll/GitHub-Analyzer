import { InputHTMLAttributes } from 'react';
import clsx from 'clsx';

type InputProps = InputHTMLAttributes<HTMLInputElement>

export default function input({ className, ...props}:InputProps) {
    return(
        <input className={clsx('w-full bg-transparent text-white placeholder:text-slate-500 outline-none',
        className)} {...props}/>
    )
}