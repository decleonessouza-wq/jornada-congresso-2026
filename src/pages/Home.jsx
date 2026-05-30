import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Sparkles, BookOpen, ArrowRight, Star, Zap, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { playClick } from "../lib/sounds";
import { getParticipant } from "@/lib/participantSession";

const starSizeClasses = {
  2: "h-2 w-2",
  3: "h-3 w-3",
  4: "h-4 w-4",
};

const FloatingStar = ({ x, y, delay, size = 3 }) => (
  <motion.div
    className="pointer-events-none absolute"
    style={{ left: `${x}%`, top: `${y}%` }}
    animate={{ y: [0, -8, 0], opacity: [0.4, 1, 0.4] }}
    transition={{
      duration: 2.5 + delay,
      repeat: Infinity,
      delay,
      ease: "easeInOut",
    }}
  >
    <Star
      className={`${starSizeClasses[size] || starSizeClasses[3]} fill-amber-300 text-amber-300`}
    />
  </motion.div>
);

export default function Home() {
  const participant = getParticipant();
  const firstName = participant?.firstName || "irmão";

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-10 text-center">
      {/* Background gradient blobs */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50" />
      <div className="absolute right-[-60px] top-[-80px] h-72 w-72 rounded-full bg-purple-300/30 blur-3xl" />
      <div className="absolute bottom-[-60px] left-[-40px] h-56 w-56 rounded-full bg-amber-300/30 blur-3xl" />
      <div className="absolute left-[-80px] top-1/2 h-48 w-48 rounded-full bg-blue-300/20 blur-3xl" />

      {/* Floating stars */}
      <FloatingStar x={8} y={15} delay={0} />
      <FloatingStar x={88} y={20} delay={0.6} size={4} />
      <FloatingStar x={15} y={75} delay={1.2} size={2} />
      <FloatingStar x={82} y={70} delay={0.3} size={3} />
      <FloatingStar x={50} y={8} delay={0.9} size={2} />
      <FloatingStar x={70} y={85} delay={1.5} size={3} />

      <div className="relative z-10 flex flex-col items-center">
        {/* Logo badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0, rotate: -20 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.1 }}
          className="relative mb-5"
        >
          <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-300 via-yellow-400 to-orange-500 shadow-2xl shadow-amber-300/50">
            <Sparkles className="h-12 w-12 text-white drop-shadow-lg" />
          </div>

          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-3 rounded-[2rem] border-2 border-dashed border-amber-300/60"
          />

          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -inset-1 rounded-[1.75rem] bg-amber-300/10"
          />
        </motion.div>

        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
          className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-100 bg-white/80 px-4 py-2 shadow-sm backdrop-blur-md"
        >
          <UserRound className="h-4 w-4 text-purple-500" />
          <span className="text-xs font-extrabold text-purple-700">
            Olá, {firstName}! Que bom ter você aqui.
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-1 bg-gradient-to-r from-purple-600 via-violet-500 to-indigo-600 bg-clip-text text-5xl font-extrabold leading-tight text-transparent"
        >
          Jornada Congresso 2026
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-7 text-sm font-semibold tracking-wide text-muted-foreground"
        >
          Preparando o coração para o congresso
        </motion.p>

        {/* Verse card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="mb-5 w-full max-w-xs rounded-2xl border border-purple-100/60 bg-white/70 p-6 shadow-xl shadow-purple-100/60 backdrop-blur-md"
        >
          <div className="mx-auto mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
            <BookOpen className="h-4 w-4 text-purple-600" />
          </div>

          <p className="text-sm font-medium italic leading-relaxed text-foreground">
            “Alegrai-vos na esperança, sede pacientes na tribulação, perseverai na oração.”
          </p>

          <div className="mt-3 inline-block rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 px-3 py-1">
            <p className="text-xs font-bold tracking-widest text-white">
              ROMANOS 12:12
            </p>
          </div>
        </motion.div>

        {/* Personal encouragement */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.64 }}
          className="mb-6 w-full max-w-xs rounded-2xl border border-amber-100 bg-amber-50/80 px-4 py-3"
        >
          <p className="text-xs font-semibold leading-relaxed text-amber-800">
            {firstName}, avance por cada etapa com calma. Esta jornada é um convite para
            preparar o coração e chegar ao congresso atento ao que Deus deseja falar.
          </p>
        </motion.div>

        {/* Three phases preview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mb-7 flex gap-2"
        >
          {[
            { label: "Alegria", color: "bg-amber-400", emoji: "☀️" },
            { label: "Paciência", color: "bg-blue-400", emoji: "🛡️" },
            { label: "Oração", color: "bg-violet-500", emoji: "🔥" },
          ].map((phase, index) => (
            <motion.div
              key={phase.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75 + index * 0.1 }}
              className="flex flex-col items-center gap-1"
            >
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-2xl ${phase.color} text-lg shadow-md`}
              >
                {phase.emoji}
              </div>

              <span className="text-[10px] font-bold text-muted-foreground">
                {phase.label}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95 }}
        >
          <Link to="/jornada" onClick={playClick}>
            <Button
              size="lg"
              className="rounded-2xl bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 px-10 py-7 text-lg font-extrabold text-white shadow-2xl shadow-purple-400/40 transition-all hover:scale-105 hover:shadow-purple-400/60 active:scale-95"
            >
              <Zap className="mr-2 h-5 w-5 fill-white" />
              Continuar jornada
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-5 max-w-[240px] text-xs leading-relaxed text-muted-foreground"
        >
          3 etapas · Quizzes bíblicos · Desafios práticos · Caminhada espiritual
        </motion.p>
      </div>
    </div>
  );
}