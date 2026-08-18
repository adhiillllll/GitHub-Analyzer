export default function LogoSection() {
    return (
        <header className="text-center mb-8 flex flex-col items-center">

            <img
                src="/screen.png"
                alt="CodeOrbit"
                className="w-40 h-40 object-contain mb-4"
            />

            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
                CodeOrbit
            </h1>

            <p className="mt-3 max-w-xl text-base text-slate-400 font-normal leading-relaxed">
                Understand any GitHub repository with AI-powered engineering insights.
            </p>

        </header>
    )
}