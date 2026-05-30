import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LockKeyhole, Mail, ShieldCheck, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getCurrentAdminProfile, signInAdmin } from "@/services/adminService";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function checkExistingAdminSession() {
      try {
        const adminProfile = await getCurrentAdminProfile();

        if (adminProfile && isMounted) {
          navigate("/admin", { replace: true });
        }
      } catch {
        // Se não houver sessão ou permissão, apenas mantém na tela de login.
      } finally {
        if (isMounted) {
          setIsCheckingSession(false);
        }
      }
    }

    checkExistingAdminSession();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!email.trim() || !password) {
      setErrorMessage("Informe e-mail e senha para acessar o painel.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      await signInAdmin({
        email,
        password,
      });

      navigate("/admin", { replace: true });
    } catch (error) {
      setErrorMessage(
        error?.message || "Não foi possível acessar o painel administrativo."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isCheckingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 px-5">
        <div className="flex items-center gap-3 rounded-3xl border border-purple-100 bg-white px-5 py-4 shadow-xl">
          <Loader2 className="h-5 w-5 animate-spin text-purple-600" />
          <span className="text-sm font-bold text-slate-700">
            Verificando acesso...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 px-5 py-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md flex-col justify-center">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="mb-6 inline-flex w-fit items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-bold text-slate-600 shadow-sm transition hover:bg-white hover:text-purple-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para a jornada
        </button>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[2rem] border border-purple-100 bg-white p-6 shadow-2xl shadow-purple-200/50"
        >
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-200">
              <ShieldCheck className="h-8 w-8" />
            </div>

            <p className="mb-1 text-xs font-extrabold uppercase tracking-[0.18em] text-purple-500">
              Área restrita
            </p>

            <h1 className="text-2xl font-extrabold text-slate-900">
              Painel Administrativo
            </h1>

            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              Acesse para moderar o mural, acompanhar pedidos de oração e gerir a
              participação da Jornada Congresso 2026.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-bold text-slate-700">
                E-mail do administrador
              </label>

              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <Input
                  type="email"
                  autoComplete="email"
                  placeholder="seuemail@exemplo.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="h-12 rounded-2xl border-purple-100 bg-purple-50/40 pl-10"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-bold text-slate-700">
                Senha
              </label>

              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <Input
                  type="password"
                  autoComplete="current-password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="h-12 rounded-2xl border-purple-100 bg-purple-50/40 pl-10"
                />
              </div>
            </div>

            {errorMessage && (
              <p className="rounded-2xl border border-red-100 bg-red-50 px-3 py-2 text-xs font-semibold leading-relaxed text-red-600">
                {errorMessage}
              </p>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-12 w-full rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-sm font-extrabold text-white shadow-lg shadow-purple-200 disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                <>
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Acessar painel
                </>
              )}
            </Button>
          </form>

          <div className="mt-5 rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3">
            <p className="text-xs leading-relaxed text-amber-800">
              Este acesso é reservado à equipe responsável pela Jornada. As permissões
              são validadas pelo Supabase, não apenas pela interface do app.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}