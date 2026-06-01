import { motion } from "framer-motion";
import {
  Trophy,
  Award,
  ChevronRight,
  Sun,
  Shield,
  Flame,
  Zap,
  LogOut,
  RotateCcw,
  Search,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useJourneyProgress } from "../lib/useJourneyProgress";
import { phases, finalMessage } from "../lib/journeyData";
import { playClick, playWrong } from "../lib/sounds";
import { clearParticipant } from "@/lib/participantSession";

const iconMap = { Sun, Shield, Flame };

const messages = [
  "Cada passo nessa jornada prepara seu coração para ouvir a voz de Deus.",
  "Você já começou! Continue firme, Deus está com você nessa caminhada.",
  "Falta pouco! Seu coração está sendo preparado de forma especial.",
  "Jornada completa! Seu coração está pronto para o congresso. Glória a Deus!",
];

function countCorrectAnswers(savedAnswers = [], questions = []) {
  return savedAnswers.reduce((total, answer, index) => {
    return answer === questions[index]?.correct ? total + 1 : total;
  }, 0);
}

export default function ProgressPage() {
  const {
    progress,
    getOverallProgress,
    getCompletedCount,
    getTotalScore,
    resetProgress,
  } = useJourneyProgress();

  const score = getTotalScore();
  const pct = getOverallProgress();
  const completed = getCompletedCount();
  const msg = messages[completed] || messages[0];

  function handleExitJourney() {
    const shouldExit = window.confirm(
      "Deseja sair da caminhada? Seu progresso será mantido, mas você voltará para a tela inicial e poderá entrar com outro nome ou acessar o painel administrativo."
    );

    if (!shouldExit) {
      return;
    }

    playClick();
    clearParticipant();
    window.location.assign("/");
  }

  function handleRestartJourney() {
    const shouldRestart = window.confirm(
      "Deseja reiniciar a caminhada? Isso apagará o progresso salvo neste navegador, incluindo quizzes, pegadinhas, palavras, caça-palavras e reflexões."
    );

    if (!shouldRestart) {
      return;
    }

    playWrong();
    resetProgress();
    clearParticipant();
    window.location.assign("/");
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
              {phases.map((phase, index) => {
                const item = index + 1;

                return (
                  <div
                    key={phase.id}
                    className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm font-extrabold ${
                      item <= completed
                        ? "bg-white text-purple-700 shadow-md"
                        : "bg-white/20 text-white/40"
                    }`}
                  >
                    {item <= completed ? "✓" : item}
                  </div>
                );
              })}
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
          const phaseData = progress.phases[phase.id] || {};
          const done = Boolean(phaseData.completed);

          const quizCorrectCount = countCorrectAnswers(
            phaseData.quizCorrect || [],
            phase.quiz || []
          );

          const funnyCorrectCount = countCorrectAnswers(
            phaseData.funnyCorrect || [],
            phase.funnyQuestions || []
          );

          const quizScore = quizCorrectCount * 10;
          const funnyScore = funnyCorrectCount * 5;
          const crossScore = (phaseData.crosswordSolved?.length || 0) * 15;

          const wordSearchSolvedCount = phaseData.wordSearchSolved?.length || 0;
          const wordSearchTotal = phase.wordSearch?.words?.length || 0;
          const wordSearchScore = wordSearchSolvedCount * 10;
          const wordSearchDone =
            wordSearchTotal > 0 && wordSearchSolvedCount >= wordSearchTotal;

          const bonusScore = done ? 50 : 0;
          const phaseTotal =
            quizScore + funnyScore + crossScore + wordSearchScore + bonusScore;

          const quizDone =
            (phaseData.quizCorrect?.length || 0) >= (phase.quiz || []).length;

          const funnyDone =
            (phaseData.funnyCorrect?.length || 0) >=
            (phase.funnyQuestions || []).length;

          const crosswordDone =
            (phaseData.crosswordSolved?.length || 0) >=
            (phase.crossword || []).length;

          const reflectionDone = Boolean(phaseData.reflection?.trim());

          const Icon = iconMap[phase.iconName];

          return (
            <motion.div
              key={phase.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 + index * 0.1 }}
              className="rounded-2xl border border-gray-100 bg-white p-4 shadow-md"
            >
              <div className="mb-3 flex items-center gap-3">
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

              <div className="grid grid-cols-5 gap-1.5">
                {[
                  {
                    label: "Quiz",
                    value: quizScore,
                    done: quizDone,
                  },
                  {
                    label: "Peg.",
                    value: funnyScore,
                    done: funnyDone,
                  },
                  {
                    label: "Pal.",
                    value: crossScore,
                    done: crosswordDone,
                  },
                  {
                    label: "Caça",
                    value: wordSearchScore,
                    done: wordSearchDone,
                  },
                  {
                    label: "Bônus",
                    value: bonusScore,
                    done: done || reflectionDone,
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className={`rounded-lg py-1 text-center text-[9px] font-bold ${
                      item.value > 0 || item.done
                        ? "bg-green-50 text-green-700"
                        : "bg-gray-50 text-gray-400"
                    }`}
                  >
                    {item.label}
                    <br />
                    <span className="text-[11px]">{item.value}pts</span>
                  </div>
                ))}
              </div>

              <div className="mt-3 grid grid-cols-5 gap-1.5">
                {[
                  { label: "Quiz", done: quizDone },
                  { label: "Peg.", done: funnyDone },
                  { label: "Pal.", done: crosswordDone },
                  { label: "Caça", done: wordSearchDone },
                  { label: "Ref.", done: reflectionDone },
                ].map((item) => (
                  <div
                    key={item.label}
                    className={`rounded-full px-2 py-1 text-center text-[9px] font-extrabold ${
                      item.done
                        ? "bg-purple-100 text-purple-700"
                        : "bg-slate-50 text-slate-400"
                    }`}
                  >
                    {item.done ? "✓ " : ""}
                    {item.label}
                  </div>
                ))}
              </div>

              {phase.wordSearch && (
                <div
                  className={`mt-3 rounded-2xl border px-3 py-2 ${
                    wordSearchDone
                      ? "border-green-200 bg-green-50"
                      : "border-amber-100 bg-amber-50"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <Search
                      className={`mt-0.5 h-4 w-4 ${
                        wordSearchDone ? "text-green-600" : "text-amber-600"
                      }`}
                    />

                    <div>
                      <p
                        className={`text-xs font-extrabold ${
                          wordSearchDone ? "text-green-700" : "text-amber-700"
                        }`}
                      >
                        {wordSearchDone
                          ? "Caça-palavras concluído"
                          : "Caça-palavras disponível"}
                      </p>

                      <p
                        className={`mt-0.5 text-[11px] font-semibold ${
                          wordSearchDone
                            ? "text-green-700/80"
                            : "text-amber-700/80"
                        }`}
                      >
                        {wordSearchSolvedCount}/{wordSearchTotal} palavras encontradas ·{" "}
                        {wordSearchScore} pontos extras
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className="mb-6 rounded-2xl border border-purple-100 bg-white p-4 shadow-md"
      >
        <h2 className="mb-2 text-sm font-extrabold text-foreground">
          Controles da caminhada
        </h2>

        <p className="mb-4 text-xs leading-relaxed text-muted-foreground">
          Use estas opções para voltar à tela inicial, entrar com outro nome,
          acessar o painel administrativo ou reiniciar tudo para testar novamente.
        </p>

        <div className="grid gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleExitJourney}
            className="rounded-xl border-purple-100 bg-purple-50 py-5 text-xs font-extrabold text-purple-700"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair da caminhada
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handleRestartJourney}
            className="rounded-xl border-red-100 bg-red-50 py-5 text-xs font-extrabold text-red-600"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reiniciar caminhada
          </Button>
        </div>
      </motion.section>

      {completed < phases.length ? (
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

          <Link to="/ranking" onClick={playClick}>
            <Button className="mt-5 w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 py-6 font-bold text-white">
              Registrar minha caminhada
            </Button>
          </Link>
        </motion.div>
      )}
    </div>
  );
}