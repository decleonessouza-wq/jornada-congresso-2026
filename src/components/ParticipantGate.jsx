import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  LockKeyhole,
  Sparkles,
  UserRound,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  clearParticipant,
  completeParticipantWelcome,
  getParticipant,
  saveParticipant,
} from "@/lib/participantSession";
import { playClick, playSplash } from "@/lib/sounds";

export default function ParticipantGate({ children }) {
  const navigate = useNavigate();

  const [participant, setParticipant] = useState(() => getParticipant());
  const [fullName, setFullName] = useState(() => participant?.fullName || "");
  const [errorMessage, setErrorMessage] = useState("");

  const isReady = Boolean(participant?.welcomed);

  function handleSubmit(event) {
    event.preventDefault();

    try {
      setErrorMessage("");
      playClick();

      const savedParticipant = saveParticipant(fullName);
      setParticipant(savedParticipant);
      playSplash();
    } catch (error) {
      setErrorMessage(error?.message || "Não foi possível entrar na Jornada.");
    }
  }

  function handleStartJourney() {
    playClick();

    const updatedParticipant = completeParticipantWelcome();
    setParticipant(updatedParticipant);

    navigate("/jornada", { replace: true });
  }

  function handleChangeName() {
    playClick();
    clearParticipant();
    setParticipant(null);
    setFullName("");
    setErrorMessage("");
  }

  if (isReady) {
    return children;
  }

  if (participant && !participant.welcomed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 via-white to-amber-50/40 px-5 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="w-full max-w-md rounded-[2rem] border border-purple-100 bg-white p-6 text-center shadow-2xl shadow-purple-200/50"
        >
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-200">
            <Sparkles className="h-10 w-10" />
          </div>

          <p className="mb-1 text-xs font-extrabold uppercase tracking-[0.18em] text-purple-500">
            Jornada Congresso 2026
          </p>

          <h1 className="text-2xl font-extrabold leading-tight text-slate-950">
            Bem-vindo, {participant.firstName}!
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            Que alegria ter você nesta caminhada. Antes do congresso começar,
            vamos preparar o coração com esperança, paciência e oração.
          </p>

          <div className="mt-5 rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3">
            <p className="text-sm font-bold leading-relaxed text-amber-800">
              “Alegrai-vos na esperança, sede pacientes na tribulação,
              perseverai na oração.”
            </p>
            <p className="mt-1 text-xs font-semibold text-amber-700">
              Romanos 12:12
            </p>
          </div>

          <Button
            type="button"
            onClick={handleStartJourney}
            className="mt-6 h-12 w-full rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-sm font-extrabold text-white shadow-lg shadow-purple-200"
          >
            Iniciar Jornada
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

          <button
            type="button"
            onClick={handleChangeName}
            className="mt-4 inline-flex items-center justify-center gap-2 text-xs font-bold text-slate-500 transition hover:text-purple-700"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Entrar com outro nome
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 via-white to-amber-50/40 px-5 py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md rounded-[2rem] border border-purple-100 bg-white p-6 shadow-2xl shadow-purple-200/50"
      >
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-200">
            <UserRound className="h-10 w-10" />
          </div>

          <p className="mb-1 text-xs font-extrabold uppercase tracking-[0.18em] text-purple-500">
            Jornada Congresso 2026
          </p>

          <h1 className="text-2xl font-extrabold leading-tight text-slate-950">
            Preparando o coração para o congresso
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            Informe seu nome para entrar na Jornada e receber uma saudação
            personalizada durante essa caminhada.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-bold text-slate-700">
              Nome completo
            </label>

            <Input
              value={fullName}
              onChange={(event) => {
                setFullName(event.target.value);
                setErrorMessage("");
              }}
              placeholder="Digite seu nome completo"
              maxLength={80}
              autoComplete="name"
              className="h-12 rounded-2xl border-purple-100 bg-purple-50/40"
            />
          </div>

          {errorMessage && (
            <p className="rounded-2xl border border-red-100 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600">
              {errorMessage}
            </p>
          )}

          <Button
            type="submit"
            className="h-12 w-full rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-sm font-extrabold text-white shadow-lg shadow-purple-200"
          >
            Entrar na Jornada
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>

        <div className="mt-5 rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3">
          <p className="text-xs leading-relaxed text-amber-800">
            Seu nome ficará salvo apenas neste navegador para personalizar a
            experiência. Não é necessário criar conta para participar.
          </p>
        </div>

        <Link
          to="/admin/login"
          onClick={playClick}
          className="mt-5 flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-extrabold text-slate-600 transition hover:border-purple-200 hover:bg-purple-50 hover:text-purple-700"
        >
          <LockKeyhole className="h-4 w-4" />
          Acesso Administrativo
          <ShieldCheck className="h-4 w-4" />
        </Link>
      </motion.div>
    </div>
  );
}