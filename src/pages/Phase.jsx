import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Play,
  BookOpen,
  Sparkles,
  Check,
  Sun,
  Shield,
  Flame,
  Lock,
  Award,
  Star,
  Smile,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import confetti from "canvas-confetti";
import { getPhaseById } from "../lib/journeyData";
import { useJourneyProgress } from "../lib/useJourneyProgress";
import QuizSection from "../components/QuizSection";
import CrosswordPuzzle from "../components/CrosswordPuzzle";
import { playClick, playCelebrate } from "../lib/sounds";

const iconMap = { Sun, Shield, Flame };

export default function Phase() {
  const { phaseId } = useParams();
  const navigate = useNavigate();
  const phase = getPhaseById(phaseId);
  const { progress, updatePhase, completePhase, isPhaseUnlocked } =
    useJourneyProgress();

  const [reflection, setReflection] = useState("");
  const [celebrating, setCelebrating] = useState(false);

  const phaseProgress = progress.phases[phaseId] || {};

  useEffect(() => {
    setReflection(phaseProgress.reflection || "");
  }, [phaseId, phaseProgress.reflection]);

  if (!phase) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Etapa não encontrada</p>

        <Link to="/jornada">
          <Button variant="link" className="mt-2">
            Voltar ao mapa
          </Button>
        </Link>
      </div>
    );
  }

  if (!isPhaseUnlocked(phaseId)) {
    return (
      <div className="p-8 text-center">
        <Lock className="mx-auto mb-3 h-8 w-8 text-gray-400" />

        <p className="font-medium text-muted-foreground">
          Complete a etapa anterior primeiro
        </p>

        <Link to="/jornada">
          <Button variant="link" className="mt-2 text-purple-600">
            Voltar ao mapa
          </Button>
        </Link>
      </div>
    );
  }

  const Icon = iconMap[phase.iconName];
  const isCompleted = phaseProgress.completed;

  const quizDone =
    (phaseProgress.quizCorrect?.length || 0) >= (phase.quiz || []).length;

  const funnyDone =
    (phaseProgress.funnyCorrect?.length || 0) >=
    (phase.funnyQuestions || []).length;

  const crosswordDone =
    (phaseProgress.crosswordSolved?.length || 0) >=
    (phase.crossword || []).length;

  const reflectionDone = Boolean(phaseProgress.reflection?.trim());

  const tasks = [
    {
      label: "Quiz",
      done: quizDone,
      emoji: "❓",
    },
    {
      label: "Pegadinhas",
      done: funnyDone,
      emoji: "😄",
    },
    {
      label: "Palavras",
      done: crosswordDone,
      emoji: "✏️",
    },
    {
      label: "Reflexão",
      done: reflectionDone,
      emoji: "💬",
    },
  ];

  const tasksDone = tasks.filter((task) => task.done).length;
  const totalTasks = tasks.length;

  const handleComplete = () => {
    updatePhase(phaseId, { reflection });
    completePhase(phaseId);
    setCelebrating(true);
    playCelebrate();

    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.55 },
      colors: [
        "#7C3AED",
        "#F59E0B",
        "#10B981",
        "#3B82F6",
        "#EC4899",
        "#FFFFFF",
      ],
    });

    setTimeout(() => {
      confetti({
        particleCount: 80,
        angle: 60,
        spread: 60,
        origin: { x: 0 },
        colors: ["#7C3AED", "#F59E0B"],
      });

      confetti({
        particleCount: 80,
        angle: 120,
        spread: 60,
        origin: { x: 1 },
        colors: ["#10B981", "#3B82F6"],
      });
    }, 400);

    setTimeout(() => {
      setCelebrating(false);
      navigate("/jornada");
    }, 3500);
  };

  const handleSaveReflection = () => {
    updatePhase(phaseId, { reflection });
    playClick();
  };

  if (celebrating) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50 px-6 text-center">
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 12 }}
        >
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className={`mx-auto mb-6 flex h-28 w-28 items-center justify-center rounded-3xl bg-gradient-to-br ${phase.gradient} shadow-2xl`}
          >
            <Award className="h-14 w-14 text-white drop-shadow-lg" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-2 text-3xl font-extrabold text-foreground"
          >
            Incrível! 🎉
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mb-3 text-muted-foreground"
          >
            Você completou <strong>{phase.title}</strong>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, type: "spring" }}
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 px-5 py-2.5 font-extrabold text-white shadow-lg shadow-amber-200"
          >
            <Star className="h-4 w-4 fill-white" />
            {phase.badge} conquistado!
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 pb-28">
      {/* Header */}
      <div className="mb-5 flex items-center gap-3">
        <Link to="/jornada" onClick={playClick}>
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>

        <div>
          <p className="text-xs font-semibold text-muted-foreground">
            Etapa {phase.id} de 3
          </p>
          <h1 className="text-lg font-extrabold text-foreground">
            {phase.title}
          </h1>
        </div>

        {isCompleted && (
          <div className="ml-auto">
            <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-bold text-green-700">
              ✓ Concluída
            </span>
          </div>
        )}
      </div>

      {/* Sub-task progress */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-5 rounded-2xl border border-purple-50 bg-white p-4 shadow-sm"
      >
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-bold text-muted-foreground">
            Progresso da etapa
          </span>

          <span className="text-xs font-extrabold text-purple-600">
            {tasksDone}/{totalTasks} tarefas
          </span>
        </div>

        <div className="mb-3 h-2.5 overflow-hidden rounded-full bg-purple-50">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(tasksDone / totalTasks) * 100}%` }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className={`h-full rounded-full bg-gradient-to-r ${phase.gradient}`}
          />
        </div>

        <div className="grid grid-cols-4 gap-2">
          {tasks.map((task, index) => (
            <motion.div
              key={task.label}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 * index }}
              className={`flex flex-col items-center rounded-xl py-2 text-center text-[10px] font-bold transition-all ${
                task.done
                  ? "border border-green-200 bg-green-50 text-green-700"
                  : "bg-gray-50 text-gray-400"
              }`}
            >
              <span className="mb-0.5 text-base">
                {task.done ? "✅" : task.emoji}
              </span>
              {task.label}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`mb-5 rounded-2xl bg-gradient-to-r ${phase.gradient} p-5 text-white shadow-xl`}
      >
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/20">
            <Icon className="h-6 w-6" />
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wide opacity-80">
              {phase.subtitle}
            </p>

            <p className="mt-1 text-sm italic leading-relaxed opacity-90">
              “{phase.summary.slice(0, 90)}...”
            </p>
          </div>
        </div>
      </motion.div>

      {/* Video */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-md"
      >
        <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground">
          <Play className="h-4 w-4 text-purple-500" />
          Vídeo da Etapa
        </h3>

        {phase.videoUrl ? (
          <div className="overflow-hidden rounded-xl border border-purple-100 bg-black shadow-sm">
            <iframe
              className="aspect-video w-full"
              src={phase.videoUrl}
              title={`Vídeo da etapa ${phase.title}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="flex aspect-video items-center justify-center rounded-xl border border-purple-100 bg-gradient-to-br from-purple-50 to-indigo-50">
            <div className="text-center text-muted-foreground">
              <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-lg">
                <Play className="ml-0.5 h-6 w-6 text-purple-500" />
              </div>

              <p className="text-xs font-semibold text-purple-400">
                Vídeo em breve
              </p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-md"
      >
        <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-foreground">
          <BookOpen className="h-4 w-4 text-purple-500" />
          Resumo
        </h3>

        <p className="text-sm leading-relaxed text-muted-foreground">
          {phase.summary}
        </p>
      </motion.div>

      {/* Quiz */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <QuizSection
          quiz={phase.quiz || []}
          savedAnswers={phaseProgress.quizCorrect || []}
          onComplete={(answers) => updatePhase(phaseId, { quizCorrect: answers })}
        />
      </motion.div>

      {/* Funny questions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.23 }}
        className="mb-4 rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-purple-50 p-4 shadow-md"
      >
        <h3 className="mb-2 flex items-center gap-2 text-sm font-extrabold text-foreground">
          <Smile className="h-4 w-4 text-amber-500" />
          Pegadinhas da fase
        </h3>

        <p className="mb-4 text-xs leading-relaxed text-muted-foreground">
          Um momento descontraído para fixar a mensagem bíblica sem perder o foco
          espiritual.
        </p>

        <QuizSection
          quiz={phase.funnyQuestions || []}
          savedAnswers={phaseProgress.funnyCorrect || []}
          onComplete={(answers) =>
            updatePhase(phaseId, { funnyCorrect: answers })
          }
        />
      </motion.div>

      {/* Crossword */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <CrosswordPuzzle
          words={phase.crossword || []}
          savedSolved={
            phaseProgress.crosswordSolved?.length > 0
              ? phaseProgress.crosswordSolved
              : null
          }
          onComplete={(solved) =>
            updatePhase(phaseId, { crosswordSolved: solved })
          }
        />
      </motion.div>

      {/* Challenge */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-4 rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-4 shadow-md"
      >
        <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-foreground">
          <Sparkles className="h-4 w-4 text-amber-500" />
          Desafio Prático
        </h3>

        <p className="text-sm leading-relaxed text-amber-800">
          {phase.challenge}
        </p>
      </motion.div>

      {/* Reflection */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="mb-6 rounded-2xl border border-purple-100 bg-white p-4 shadow-md"
      >
        <h3 className="mb-3 text-sm font-bold text-foreground">
          💬 O que Deus falou comigo?
        </h3>

        <Textarea
          placeholder="Escreva aqui sua reflexão pessoal..."
          value={reflection}
          onChange={(event) => setReflection(event.target.value)}
          className="min-h-[100px] rounded-xl border-purple-100 text-sm focus:border-purple-300"
        />

        {reflection && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 text-xs text-purple-600"
            onClick={handleSaveReflection}
          >
            <Check className="mr-1 h-3 w-3" />
            Salvar reflexão
          </Button>
        )}
      </motion.div>

      {/* Complete / Already done */}
      {isCompleted ? (
        <div className="rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-5 text-center shadow-md">
          <Award className="mx-auto mb-2 h-10 w-10 text-green-600" />

          <p className="text-base font-extrabold text-green-700">
            Etapa já concluída! 🏆
          </p>

          <Link to="/jornada" onClick={playClick}>
            <Button variant="link" className="mt-1 text-purple-600">
              Voltar ao mapa
            </Button>
          </Link>
        </div>
      ) : (
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
          <Button
            onClick={handleComplete}
            className={`w-full rounded-2xl bg-gradient-to-r ${phase.gradient} py-7 text-base font-extrabold text-white shadow-xl transition-all hover:opacity-90 active:scale-[0.97]`}
          >
            <Check className="mr-2 h-5 w-5" />
            Concluir etapa — {phase.badge}!
          </Button>
        </motion.div>
      )}
    </div>
  );
}