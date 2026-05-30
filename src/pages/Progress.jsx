import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Award,
  ChevronRight,
  Sun,
  Shield,
  Flame,
  Zap,
  Star,
  Smile,
  Check,
  X,
  HelpCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useJourneyProgress } from "../lib/useJourneyProgress";
import { phases, funnyQuestions, finalMessage } from "../lib/journeyData";
import { playClick, playCorrect, playWrong, playComplete } from "../lib/sounds";

const iconMap = { Sun, Shield, Flame };

const messages = [
  "Cada passo nessa jornada prepara seu coração para ouvir a voz de Deus.",
  "Você já começou! Continue firme, Deus está com você nessa caminhada.",
  "Falta pouco! Seu coração está sendo preparado de forma especial.",
  "Jornada completa! Seu coração está pronto para o congresso. Glória a Deus!",
];

export default function ProgressPage() {
  const { progress, getOverallProgress, getCompletedCount, getTotalScore } =
    useJourneyProgress();

  const [funnyIndex, setFunnyIndex] = useState(0);
  const [funnySelected, setFunnySelected] = useState(null);
  const [showFunnyResult, setShowFunnyResult] = useState(false);
  const [funnyDone, setFunnyDone] = useState(false);

  const score = getTotalScore();
  const pct = getOverallProgress();
  const completed = getCompletedCount();
  const msg = messages[completed];

  const currentFunny = funnyQuestions?.[funnyIndex];

  function handleFunnyAnswer(optionIndex) {
    if (showFunnyResult || !currentFunny) return;

    setFunnySelected(optionIndex);
    setShowFunnyResult(true);

    if (optionIndex === currentFunny.correct) {
      playCorrect();
    } else {
      playWrong();
    }

    setTimeout(() => {
      if (funnyIndex < funnyQuestions.length - 1) {
        setFunnyIndex((current) => current + 1);
        setFunnySelected(null);
        setShowFunnyResult(false);
      } else {
        setFunnyDone(true);
        playComplete();
      }
    }, 2300);
  }

  function restartFunnyQuiz() {
    playClick();
    setFunnyIndex(0);
    setFunnySelected(null);
    setShowFunnyResult(false);
    setFunnyDone(false);
  }

  return (
    <div className="px-4 py-6 pb-28">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="mb-0.5 text-2xl font-extrabold text-foreground">
          Seu Progresso
        </h1>
        <p className="mb-6 text-sm text-muted-foreground">
          Acompanhe sua jornada espiritual.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 p-4 text-white shadow-xl shadow-purple-200/50"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="mb-1 text-xs font-semibold opacity-80">
              Pontuação da caminhada
            </p>

            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 fill-amber-300 text-amber-300" />
              <span className="text-4xl font-extrabold">{score}</span>
              <span className="text-sm opacity-70">pts</span>
            </div>

            <p className="mt-1 max-w-[190px] text-[11px] leading-relaxed text-white/75">
              Os pontos são apenas incentivo visual. O principal é preparar o coração.
            </p>
          </div>

          <div className="text-right">
            <p className="mb-1 text-xs opacity-70">Etapas</p>

            <div className="flex gap-1.5">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm font-extrabold ${
                    item <= completed
                      ? "bg-white text-purple-700 shadow-md"
                      : "bg-white/20 text-white/40"
                  }`}
                >
                  {item <= completed ? "✓" : item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-white/20">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8 }}
            className="h-full rounded-full bg-white"
          />
        </div>

        <p className="mt-1 text-right text-[11px] font-bold text-white/80">
          {pct}% concluído
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="mb-6 rounded-2xl border border-purple-100 bg-gradient-to-r from-purple-50 to-amber-50 p-4"
      >
        <p className="text-center text-sm font-semibold text-foreground">
          ✨ {msg}
        </p>
      </motion.div>

      <div className="mb-6 space-y-3">
        {phases.map((phase, index) => {
          const done = progress.phases[phase.id]?.completed;
          const phaseData = progress.phases[phase.id];
          const quizScore = (phaseData?.quizCorrect?.length || 0) * 10;
          const crossScore = (phaseData?.crosswordSolved?.length || 0) * 15;
          const bonusScore = done ? 50 : 0;
          const phaseTotal = quizScore + crossScore + bonusScore;
          const Icon = iconMap[phase.iconName];

          return (
            <motion.div
              key={phase.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 + index * 0.1 }}
              className="rounded-2xl border border-gray-100 bg-white p-4 shadow-md"
            >
              <div className="mb-2 flex items-center gap-3">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                    done
                      ? `bg-gradient-to-br ${phase.gradient} shadow-md`
                      : "bg-gray-100"
                  }`}
                >
                  {done ? (
                    <Award className="h-6 w-6 text-white" />
                  ) : (
                    <Icon className="h-6 w-6 text-gray-400" />
                  )}
                </div>

                <div className="flex-1">
                  <p className="text-sm font-extrabold text-foreground">
                    {phase.title}
                  </p>

                  <p
                    className={`text-xs font-semibold ${
                      done ? "text-green-600" : "text-muted-foreground"
                    }`}
                  >
                    {done ? `${phase.badge} ✓` : "Pendente"}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-extrabold text-foreground">{phaseTotal}</p>
                  <p className="text-[10px] text-muted-foreground">pts</p>
                </div>
              </div>

              <div className="flex gap-1.5">
                {[
                  { label: "Quiz", value: quizScore },
                  { label: "Palavras", value: crossScore },
                  { label: "Bônus", value: bonusScore },
                ].map((item) => (
                  <div
                    key={item.label}
                    className={`flex-1 rounded-lg py-1 text-center text-[10px] font-bold ${
                      item.value > 0
                        ? "bg-green-50 text-green-700"
                        : "bg-gray-50 text-gray-400"
                    }`}
                  >
                    {item.label}
                    <br />
                    <span className="text-xs">{item.value}pts</span>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Pegadinhas */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }}
        className="mb-6 rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-purple-50 p-4 shadow-md"
      >
        <div className="mb-3 flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
            <Smile className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-sm font-extrabold text-foreground">
              Pegadinhas da Jornada
            </h2>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Um quebra-gelo bíblico com humor leve para fixar Romanos 12:12.
            </p>
          </div>
        </div>

        {funnyDone ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl border border-green-200 bg-green-50 p-4 text-center"
          >
            <Trophy className="mx-auto mb-2 h-9 w-9 text-green-600" />
            <h3 className="text-sm font-extrabold text-green-700">
              Pegadinhas concluídas!
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-green-700/80">
              Você passou pelo momento descontraído sem sair do foco bíblico. 🙌
            </p>

            <Button
              type="button"
              onClick={restartFunnyQuiz}
              variant="outline"
              className="mt-4 rounded-xl border-green-200 text-green-700"
            >
              Refazer pegadinhas
            </Button>
          </motion.div>
        ) : (
          currentFunny && (
            <div>
              <div className="mb-3 flex items-center justify-between">
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700">
                  {funnyIndex + 1}/{funnyQuestions.length}
                </span>

                <span className="text-[11px] font-semibold text-muted-foreground">
                  Desafio extra
                </span>
              </div>

              <p className="mb-3 text-sm font-bold leading-relaxed text-foreground">
                {currentFunny.question}
              </p>

              <div className="space-y-2">
                {currentFunny.options.map((option, index) => {
                  const isCorrect = index === currentFunny.correct;
                  const isSelected = index === funnySelected;

                  let className =
                    "border-gray-200 bg-white hover:border-amber-200 hover:bg-amber-50";

                  if (showFunnyResult && isCorrect) {
                    className = "border-green-300 bg-green-50 text-green-700";
                  } else if (showFunnyResult && isSelected && !isCorrect) {
                    className = "border-red-300 bg-red-50 text-red-600";
                  } else if (showFunnyResult) {
                    className = "border-gray-100 bg-gray-50 text-gray-400";
                  }

                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleFunnyAnswer(index)}
                      disabled={showFunnyResult}
                      className={`flex w-full items-center justify-between rounded-xl border px-3 py-3 text-left text-xs font-semibold transition-all active:scale-[0.98] ${className}`}
                    >
                      <span>{option}</span>

                      {showFunnyResult && isCorrect && (
                        <Check className="h-4 w-4 shrink-0 text-green-600" />
                      )}

                      {showFunnyResult && isSelected && !isCorrect && (
                        <X className="h-4 w-4 shrink-0 text-red-500" />
                      )}
                    </button>
                  );
                })}
              </div>

              <AnimatePresence>
                {showFunnyResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-3 rounded-xl border border-purple-100 bg-white px-3 py-2 text-xs leading-relaxed text-muted-foreground"
                  >
                    <HelpCircle className="mr-1 inline h-3.5 w-3.5 text-purple-500" />
                    {currentFunny.comment}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        )}
      </motion.section>

      {completed < 3 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Link to="/jornada" onClick={playClick}>
            <Button className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 py-6 font-bold text-white">
              Continuar jornada <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-purple-50 p-6 text-center"
        >
          <Trophy className="mx-auto mb-3 h-12 w-12 text-amber-500" />

          <h3 className="text-lg font-extrabold text-foreground">
            Jornada completa!
          </h3>

          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            {finalMessage || "Seu coração está preparado. Glória a Deus! 🙌"}
          </p>
        </motion.div>
      )}
    </div>
  );
}