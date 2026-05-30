import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, BookOpen, Sparkles, Check, Sun, Shield, Flame, Lock, Award, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import confetti from 'canvas-confetti';
import { getPhaseById } from '../lib/journeyData';
import { useJourneyProgress } from '../lib/useJourneyProgress';
import QuizSection from '../components/QuizSection';
import CrosswordPuzzle from '../components/CrosswordPuzzle';
import { playClick, playCelebrate } from '../lib/sounds';

const iconMap = { Sun, Shield, Flame };

export default function Phase() {
  const { phaseId } = useParams();
  const navigate = useNavigate();
  const phase = getPhaseById(phaseId);
  const { progress, updatePhase, completePhase, isPhaseUnlocked } = useJourneyProgress();

  const [reflection, setReflection] = useState('');
  const [celebrating, setCelebrating] = useState(false);

  const phaseProgress = progress.phases[phaseId] || {};

  useEffect(() => {
    setReflection(phaseProgress.reflection || '');
  }, [phaseId]);

  if (!phase) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Etapa não encontrada</p>
        <Link to="/jornada"><Button variant="link" className="mt-2">Voltar ao mapa</Button></Link>
      </div>
    );
  }

  if (!isPhaseUnlocked(phaseId)) {
    return (
      <div className="p-8 text-center">
        <Lock className="h-8 w-8 text-gray-400 mx-auto mb-3" />
        <p className="text-muted-foreground font-medium">Complete a etapa anterior primeiro</p>
        <Link to="/jornada"><Button variant="link" className="text-purple-600 mt-2">Voltar ao mapa</Button></Link>
      </div>
    );
  }

  const Icon = iconMap[phase.iconName];
  const isCompleted = phaseProgress.completed;

  const tasks = [
    { label: 'Quiz', done: (phaseProgress.quizCorrect?.length || 0) >= phase.quiz.length, emoji: '❓' },
    { label: 'Palavras', done: (phaseProgress.crosswordSolved?.length || 0) >= phase.crossword.length, emoji: '✏️' },
    { label: 'Reflexão', done: !!phaseProgress.reflection, emoji: '💬' },
  ];
  const tasksDone = tasks.filter(t => t.done).length;

  const handleComplete = () => {
    updatePhase(phaseId, { reflection });
    completePhase(phaseId);
    setCelebrating(true);
    playCelebrate();
    confetti({ particleCount: 150, spread: 90, origin: { y: 0.55 }, colors: ['#7C3AED', '#F59E0B', '#10B981', '#3B82F6', '#EC4899', '#FFFFFF'] });
    setTimeout(() => {
      confetti({ particleCount: 80, angle: 60, spread: 60, origin: { x: 0 }, colors: ['#7C3AED', '#F59E0B'] });
      confetti({ particleCount: 80, angle: 120, spread: 60, origin: { x: 1 }, colors: ['#10B981', '#3B82F6'] });
    }, 400);
    setTimeout(() => { setCelebrating(false); navigate('/jornada'); }, 3500);
  };

  const handleSaveReflection = () => {
    updatePhase(phaseId, { reflection });
    playClick();
  };

  if (celebrating) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 text-center bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50">
        <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 12 }}>
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className={`w-28 h-28 rounded-3xl bg-gradient-to-br ${phase.gradient} flex items-center justify-center mb-6 mx-auto shadow-2xl`}
          >
            <Award className="h-14 w-14 text-white drop-shadow-lg" />
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-3xl font-extrabold text-foreground mb-2">
            Incrível! 🎉
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-muted-foreground mb-3">
            Você completou <strong>{phase.title}</strong>
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, type: 'spring' }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl px-5 py-2.5 text-white font-extrabold shadow-lg shadow-amber-200"
          >
            <Star className="h-4 w-4 fill-white" /> {phase.badge} conquistado!
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 pb-28">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <Link to="/jornada" onClick={playClick}>
          <Button variant="ghost" size="icon" className="rounded-full h-9 w-9">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <p className="text-xs text-muted-foreground font-semibold">Etapa {phase.id} de 3</p>
          <h1 className="text-lg font-extrabold text-foreground">{phase.title}</h1>
        </div>
        {isCompleted && (
          <div className="ml-auto">
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">✓ Concluída</span>
          </div>
        )}
      </div>

      {/* Sub-task progress */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-4 shadow-sm border border-purple-50 mb-5"
      >
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold text-muted-foreground">Progresso da etapa</span>
          <span className="text-xs font-extrabold text-purple-600">{tasksDone}/3 tarefas</span>
        </div>
        <div className="h-2.5 bg-purple-50 rounded-full overflow-hidden mb-3">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(tasksDone / 3) * 100}%` }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            className={`h-full rounded-full bg-gradient-to-r ${phase.gradient}`}
          />
        </div>
        <div className="flex gap-2">
          {tasks.map((task, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 * i }}
              className={`flex-1 flex flex-col items-center py-2 rounded-xl text-[11px] font-bold transition-all ${
                task.done ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-gray-50 text-gray-400'
              }`}
            >
              <span className="text-base mb-0.5">{task.done ? '✅' : task.emoji}</span>
              {task.label}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-gradient-to-r ${phase.gradient} rounded-2xl p-5 text-white mb-5 shadow-xl`}
      >
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold opacity-80 uppercase tracking-wide">{phase.subtitle}</p>
            <p className="text-sm mt-1 opacity-90 leading-relaxed italic">"{phase.summary.slice(0, 80)}..."</p>
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
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 mb-4">
        <h3 className="font-bold text-sm text-foreground flex items-center gap-2 mb-2">
          <BookOpen className="h-4 w-4 text-purple-500" /> Resumo
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{phase.summary}</p>
      </motion.div>

      {/* Quiz */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <QuizSection
          quiz={phase.quiz}
          savedAnswers={phaseProgress.quizCorrect}
          onComplete={(answers) => updatePhase(phaseId, { quizCorrect: answers })}
        />
      </motion.div>

      {/* Crossword */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <CrosswordPuzzle
          words={phase.crossword}
          savedSolved={phaseProgress.crosswordSolved?.length > 0 ? phaseProgress.crosswordSolved : null}
          onComplete={(solved) => updatePhase(phaseId, { crosswordSolved: solved })}
        />
      </motion.div>

      {/* Challenge */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 shadow-md border border-amber-200 mb-4">
        <h3 className="font-bold text-sm text-foreground flex items-center gap-2 mb-2">
          <Sparkles className="h-4 w-4 text-amber-500" /> Desafio Prático
        </h3>
        <p className="text-sm text-amber-800 leading-relaxed">{phase.challenge}</p>
      </motion.div>

      {/* Reflection */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="bg-white rounded-2xl p-4 shadow-md border border-purple-100 mb-6">
        <h3 className="font-bold text-sm text-foreground mb-3">💬 O que Deus falou comigo?</h3>
        <Textarea
          placeholder="Escreva aqui sua reflexão pessoal..."
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          className="min-h-[100px] rounded-xl border-purple-100 focus:border-purple-300 text-sm"
        />
        {reflection && (
          <Button variant="ghost" size="sm" className="mt-2 text-purple-600 text-xs" onClick={handleSaveReflection}>
            <Check className="h-3 w-3 mr-1" /> Salvar reflexão
          </Button>
        )}
      </motion.div>

      {/* Complete / Already done */}
      {isCompleted ? (
        <div className="text-center p-5 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200 shadow-md">
          <Award className="h-10 w-10 text-green-600 mx-auto mb-2" />
          <p className="font-extrabold text-green-700 text-base">Etapa já concluída! 🏆</p>
          <Link to="/jornada" onClick={playClick}>
            <Button variant="link" className="text-purple-600 mt-1">Voltar ao mapa</Button>
          </Link>
        </div>
      ) : (
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
        <Button
          onClick={handleComplete}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className={`w-full rounded-2xl py-7 text-base font-extrabold bg-gradient-to-r ${phase.gradient} hover:opacity-90 text-white shadow-xl active:scale-[0.97] transition-all`}
        >
          <Check className="h-5 w-5 mr-2" /> Concluir etapa — {phase.badge}!
        </Button>
        </motion.div>
      )}
    </div>
  );
}