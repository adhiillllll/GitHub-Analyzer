import GoogleSignInButton from "@/components/auth/GoogleSignInButton";
import GitHubSignInButton from "@/components/auth/GitHubSignInButton";

export default function LoginPage() {
    return (

        <main className="min-h-screen bg-[#0b0e14] flex items-center justify-center px-4">
            <div className="w-full max-w-md rounded-2xl border border-[#1e2434] bg-[#121622] p-8">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-white">
                        Welcome to CodeOrbit
                    </h1>

                    <p className="mt-2 text-sm text-slate-400">
                        Sign in to manage your analyses, favorites and history.
                    </p>
                </div>

                <div className="space-y-3">
                    <GoogleSignInButton />
                    <GitHubSignInButton />
                </div>
            </div>
        </main>

    );
}