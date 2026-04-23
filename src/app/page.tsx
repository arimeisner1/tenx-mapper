import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Home() {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-neutral-900 px-4 text-center">
        <div className="max-w-2xl mx-auto space-y-8">
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-white">
            TenX Mapper
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 max-w-lg mx-auto leading-relaxed">
            Visually map software integrations and workflows for your clients
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-3 text-sm font-semibold text-neutral-900 hover:bg-neutral-100 transition shadow-lg"
            >
              Get Started
            </Link>
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center rounded-lg border border-slate-500 px-8 py-3 text-sm font-medium text-slate-200 hover:bg-slate-800 transition"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
