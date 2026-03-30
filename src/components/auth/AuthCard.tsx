"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LoaderCircle, ShieldCheck } from "lucide-react";
import { useState } from "react";

type AuthMode = "login" | "register";

type AuthCardProps = {
  mode: AuthMode;
  redirectTarget?: string;
};

export function AuthCard({ mode, redirectTarget = "/dashboard" }: AuthCardProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const payload = {
      name: String(formData.get("name") ?? ""),
      company: String(formData.get("company") ?? ""),
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    };

    try {
      if (mode === "register") {
        const registerResponse = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const registerData = (await registerResponse.json()) as { error?: string };
        if (!registerResponse.ok) {
          throw new Error(registerData.error || "Falha ao criar conta.");
        }

        setSuccess("Conta criada com sucesso. Agora faça login para acessar o dashboard.");
        router.push("/login");
        router.refresh();
        return;
      }

      const loginResponse = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: payload.email, password: payload.password }),
      });

      const loginData = (await loginResponse.json()) as { error?: string };
      if (!loginResponse.ok) {
        throw new Error(loginData.error || "Falha ao entrar.");
      }

      router.push(redirectTarget);
      router.refresh();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Erro inesperado.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="glass-card w-full max-w-xl rounded-[2rem] border border-white/10 p-6 shadow-[0_30px_120px_rgba(0,0,0,0.35)] md:p-8">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/15 bg-cyan-400/10 text-cyan-300">
          <ShieldCheck size={20} />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">AXION VPS HOST</p>
          <h1 className="mt-1 text-3xl font-semibold text-white">{mode === "login" ? "Entrar no painel" : "Criar conta"}</h1>
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-text-soft">
        {mode === "login"
          ? "Acesse seus servidores, faturas e recursos operacionais com autenticação segura em cookie httpOnly."
          : "Cadastre um cliente para liberar acesso ao dashboard, billing e gerenciamento dos VPS contratados."}
      </p>

      <form
        className="mt-8 space-y-4"
        action={async (formData) => {
          await handleSubmit(formData);
        }}
      >
        {mode === "register" ? (
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Nome" name="name" placeholder="Seu nome ou responsável" autoComplete="name" required />
            <Field label="Empresa (opcional)" name="company" placeholder="Sua empresa" autoComplete="organization" />
          </div>
        ) : null}

        <Field label="Email" name="email" type="email" placeholder="voce@empresa.com" autoComplete="email" required />
        <Field label="Senha" name="password" type="password" placeholder="••••••••" autoComplete={mode === "login" ? "current-password" : "new-password"} required />

        {error ? <p className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">{error}</p> : null}
        {success ? <p className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">{success}</p> : null}

        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-400 px-5 py-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? <LoaderCircle size={18} className="animate-spin" /> : null}
          {mode === "login" ? "Entrar e abrir dashboard" : "Criar conta"}
        </button>
      </form>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm text-text-soft">
        {mode === "login" ? (
          <p>
            Ainda não tem conta?{" "}
            <Link href="/register" className="font-semibold text-cyan-300 hover:text-cyan-200">
              Registrar agora
            </Link>
          </p>
        ) : (
          <p>
            Já possui acesso?{" "}
            <Link href="/login" className="font-semibold text-cyan-300 hover:text-cyan-200">
              Fazer login
            </Link>
          </p>
        )}
        <Link href="/marketplace" className="font-semibold text-white hover:text-cyan-200">
          Ver planos
        </Link>
      </div>
    </div>
  );
}

type FieldProps = {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
};

function Field({ label, name, type = "text", placeholder, autoComplete, required }: FieldProps) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-white">{label}</span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/40 focus:bg-white/10"
      />
    </label>
  );
}
