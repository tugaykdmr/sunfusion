"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type LoginResponse = {
  success?: boolean;
  redirectTo?: string;
  message?: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = (await response.json()) as LoginResponse;

      if (!response.ok) {
        setError(data.message ?? "Giris basarisiz. Bilgileri kontrol edin.");
        return;
      }

      router.push(data.redirectTo ?? "/dashboard");
    } catch {
      setError("Sunucuya ulasilamadi. Lutfen tekrar deneyin.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="sf-shell min-h-screen">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-6 py-10">
        <div className="sf-panel grid w-full max-w-5xl overflow-hidden rounded-2xl md:grid-cols-2">
          <div className="sf-card hidden flex-col justify-between p-10 md:flex">
            <div className="flex items-center gap-3">
              <div className="sf-btn-primary h-9 w-9 rounded-xl" />
              <span className="text-xl font-semibold tracking-wide">SunFusion</span>
            </div>
            <div>
              <p className="sf-accent text-sm uppercase tracking-[0.25em]">
                Energy Management SaaS
              </p>
              <h1 className="mt-3 text-3xl font-semibold leading-tight">
                Multi-tenant operasyonlarinizi tek panelden yonetin.
              </h1>
            </div>
          </div>

          <div className="p-8 sm:p-10">
            <div className="mb-8">
              <div className="mb-4 flex items-center gap-3 md:hidden">
                <div className="sf-btn-primary h-9 w-9 rounded-xl" />
                <span className="text-xl font-semibold tracking-wide">SunFusion</span>
              </div>
              <h2 className="text-2xl font-semibold">Hesabina giris yap</h2>
              <p className="sf-muted mt-2 text-sm">
                Kullanici adin ve sifren ile platforma eris.
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleLogin}>
              <div>
                <label
                  htmlFor="username"
                  className="mb-2 block text-sm font-medium"
                >
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  autoComplete="username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  className="sf-input"
                  placeholder="ornek: admin.sunfusion"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="sf-input"
                  placeholder="••••••••"
                  required
                />
              </div>

              {error ? (
                <p
                  className="rounded-xl px-4 py-3 text-sm"
                  style={{
                    border: "1px solid var(--color-danger)",
                    color: "var(--color-danger)",
                    background: "var(--color-bg-primary)",
                  }}
                >
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={isLoading}
                className="sf-btn-primary inline-flex w-full items-center justify-center px-4 py-3 text-sm font-semibold transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading ? "Giris yapiliyor..." : "Login"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
