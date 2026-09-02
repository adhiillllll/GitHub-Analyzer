import Navbar from "@/components/layout/Navbar";
import BackButton from "@/components/ui/BackButton";
import UserAvatar from "@/components/ui/UserAvatar";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { auth, signIn, signOut } from "@/auth";

export default async function ProfilePage() {
  const session = await auth();

  const handleGoogleSignIn = async () => {
    "use server";
    await signIn("google", {
      redirectTo: "/profile",
    });
  };

  const handleGitHubSignIn = async () => {
    "use server";
    await signIn("github", {
      redirectTo: "/profile",
    });
  };

  const handleSignOut = async () => {
    "use server";
    await signOut({
      redirectTo: "/profile",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0e14] text-slate-100 font-sans">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto p-6 sm:p-8 flex flex-col justify-center items-center">
        <div className="w-full max-w-md mb-4 flex justify-start">
          <BackButton />
        </div>

        <div className="border border-[#1e2434] bg-[#121622] rounded-2xl p-8 sm:p-12 max-w-md w-full shadow-2xl space-y-6 text-center">

          <UserAvatar
            src={session?.user?.image}
            name={session?.user?.name}
            email={session?.user?.email}
            className="w-16 h-16 mx-auto rounded-full bg-[#1c2234] border border-[#283147] overflow-hidden flex items-center justify-center text-2xl font-bold uppercase text-slate-200"
          />

          {session?.user ? (
            <>

              <div>
                <span className="px-3 py-1 bg-[#062d24] text-[#00d68f] font-mono text-[11px] rounded-full uppercase tracking-wider border border-[#0b604b]">
                  Authenticated
                </span>

                <h2 className="mt-3 text-xl font-bold text-white">
                  {session.user.name ?? "CodeOrbit User"}
                </h2>

                <p className="mt-2 text-xs text-slate-400 font-mono break-all">
                  {session.user.email}
                </p>
              </div>

              <div className="border border-[#1e2434] bg-[#0d111a] rounded-xl p-4 text-left space-y-3">
                <div className="flex justify-between gap-4">
                  <span className="text-xs text-slate-500">Name</span>
                  <span className="text-xs text-slate-200 text-right">
                    {session.user.name ?? "Not available"}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-xs text-slate-500">Email</span>
                  <span className="text-xs text-slate-200 text-right break-all">
                    {session.user.email ?? "Not available"}
                  </span>
                </div>
              </div>

              <form action={handleSignOut}>
                <button
                  type="submit"
                  className="w-full bg-[#181d2a] hover:bg-[#252e46] border border-[#2b354d] text-white text-xs font-semibold py-3 px-4 rounded-xl transition"
                >
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <>
              <div>
                <span className="px-3 py-1 bg-[#1c2234] text-slate-400 font-mono text-[11px] rounded-full uppercase tracking-wider border border-[#283147]">
                  Guest Profile
                </span>

                <h2 className="mt-3 text-xl font-bold text-white">
                  Sign in to CodeOrbit
                </h2>

                <p className="mt-2 text-xs text-slate-400 leading-relaxed font-mono">
                  Sign in to save repository bookmarks, track analysis history,
                  and unlock custom AI settings.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <form action={handleGoogleSignIn}>
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-3 bg-[#1c2234] hover:bg-[#252e46] border border-[#2b354d] text-white text-xs font-semibold py-3 px-4 rounded-xl transition"
                  >
                    <FaGoogle className="text-base text-red-400" />
                    <span>Continue with Google</span>
                  </button>
                </form>

                <form action={handleGitHubSignIn}>
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-3 bg-[#181d2a] hover:bg-[#202738] border border-[#2b354d] text-white text-xs font-semibold py-3 px-4 rounded-xl transition"
                  >
                    <FaGithub className="text-base text-slate-200" />
                    <span>Continue with GitHub</span>
                  </button>
                </form>
              </div>

              <p className="text-[11px] text-slate-500 font-mono pt-2">
                Your account will be used for your CodeOrbit profile,
                favorites, and analysis history.
              </p>
            </>
          )}
        </div>
      </main>
    </div>
  );
}