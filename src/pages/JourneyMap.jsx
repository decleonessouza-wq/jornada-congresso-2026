import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, Shield, Flame, Lock, Check, ChevronRight, Award, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useJourneyProgress } from '../lib/useJourneyProgress';
import { phases } from '../lib/journeyData';
import { playClick } from '../lib/sounds';

const iconMap = { Sun, Shield, Flame };

export default function JourneyMap() {
  const { progress, getOverallProgress, getCompletedCount, isPhaseUnlocked, getTotalScore } = useJourneyProgress();
  const completed = getCompletedCount();
  const pct = getOverallProgress();
  const score = getTotalScore();
  const allDone = completed === 3;
  const [showComplete, setShowComplete] = useState(false);

  useEffect(() => {
    if (allDone) setTimeout(() => setShowComplete(true), 600);
  }, [allDone]);

  return (
    <div className="px-4 py-6 pb-28">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-5">
        <h1 className="text-2xl font-extrabold text-foreground mb-0.5">Mapa da Jornada</h1>
        <p className="text-xs text-muted-foreground">Sua trilha de preparação espiritual</p>
      </motion.div>

      {/* Score + progress banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-4 shadow-xl shadow-purple-200/50 mb-5 text-white"
      >
        <div className="flex justify-between items-center mb-3">
          <div>
            <p className="text-xs font-semibold opacity-80">Progresso geral</p>
            <div className="flex items-end gap-1">
              <span className="text-3xl font-extrabold">{pct}%</span>
              <span className="text-xs opacity-70 mb-1">{completed}/3 etapas</span>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 justify-end">
              <Zap className="h-4 w-4 text-amber-300 fill-amber-300" />
              <span className="text-2xl font-extrabold">{score}</span>
            </div>
            <p className="text-xs opacity-70">pontos</p>
          </div>
        </div>
        <div className="h-3 bg-white/20 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
            className="h-full bg-white rounded-full"
          />
        </div>
      </motion.div>

      {/* Completion banner */}
      {allDone && showComplete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 180, damping: 14 }}
          className="mb-5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 p-5 text-white shadow-xl shadow-amber-200/60 text-center"
        >
          <motion.div
            animate={{ rotate: [0, -10, 10, -8, 8, 0] }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-4xl mb-2"
          >🏆</motion.div>
          <h2 className="text-lg font-extrabold mb-1">Jornada Concluída!</h2>
          <p className="text-sm opacity-90 leading-relaxed">
            Seu coração está preparado para receber tudo que Deus tem para você no congresso. 🙌
          </p>
          <div className="mt-3 flex justify-center gap-2">
            {['☀️ Alegria', '🛡️ Paciência', '🔥 Oração'].map(s => (
              <span key={s} className="text-xs bg-white/30 rounded-full px-2 py-0.5 font-bold">{s}</span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Seals row */}
      <div className="flex justify-center gap-4 mb-6">
        {phases.map((phase, idx) => {
          const done = progress.phases[phase.id]?.completed;
          const Icon = iconMap[phase.iconName];
          return (
            <motion.div
              key={phase.id}
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3 + idx * 0.1, type: 'spring', stiffness: 200 }}
              className="flex flex-col items-center gap-1.5"
            >
              <motion.div whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.08 }}>
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
                  done
                    ? `bg-gradient-to-br ${phase.gradient} shadow-lg shadow-purple-200/50`
                    : 'bg-gray-100 border-2 border-dashed border-gray-300'
                }`}>
                  {done ? (
                    <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                      <Award className="h-7 w-7 text-white drop-shadow" />
                    </motion.div>
                  ) : (
                    <Icon className="h-6 w-6 text-gray-400" />
                  )}
                </div>
              </motion.div>
              <span className={`text-[10px] font-bold ${done ? 'text-green-600' : 'text-muted-foreground'}`}>
                {done ? '✓ ' + phase.badge.split(' ')[1] : `Etapa ${idx + 1}`}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Phase cards with trail line */}
      <div className="relative space-y-4">
        <div className="absolute left-7 top-6 bottom-6 w-0.5 bg-gradient-to-b from-amber-400 via-blue-400 to-violet-500 rounded-full opacity-40" />

        {phases.map((phase, idx) => {
          const phaseData = progress.phases[phase.id];
          const done = phaseData?.completed;
          const unlocked = isPhaseUnlocked(phase.id);
          const Icon = iconMap[phase.iconName];

          return (
            <motion.div
              key={phase.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + idx * 0.12 }}
              className="relative pl-16"
            >
              {/* Trail node */}
              <motion.div
                className={`absolute left-4 top-5 w-7 h-7 rounded-full flex items-center justify-center z-10 border-2 border-white shadow-md ${
                  done ? `bg-gradient-to-br ${phase.gradient}` : unlocked ? 'bg-purple-600' : 'bg-gray-300'
                }`}
                animate={unlocked && !done ? { scale: [1, 1.15, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {done ? <Check className="h-3.5 w-3.5 text-white" /> :
                  unlocked ? <span className="text-xs font-extrabold text-white">{idx + 1}</span> :
                  <Lock className="h-3 w-3 text-white" />}
              </motion.div>

              <div className={`rounded-2xl p-4 shadow-md border transition-all ${
                done
                  ? `bg-gradient-to-br from-white to-purple-50/40 ${phase.borderColor}`
                  : unlocked
                  ? 'bg-white border-purple-100'
                  : 'bg-white border-gray-100 opacity-50'
              }`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center bg-gradient-to-br ${phase.gradient} shadow-md`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-foreground text-sm">{phase.title}</h3>
                      {done && <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">✓ Completo</span>}
                    </div>
                    <p className="text-xs text-muted-foreground">{phase.subtitle}</p>
                  </div>
                </div>

                {/* Mini progress indicators */}
                <div className="flex gap-2 mb-3">
                  {['Quiz', 'Palavras', 'Reflexão'].map((label, i) => {
                    const filled = i === 0 ? (phaseData?.quizCorrect?.length > 0) :
                                   i === 1 ? (phaseData?.crosswordSolved?.length > 0) :
                                   (phaseData?.reflection?.length > 0);
                    return (
                      <div key={i} className={`flex-1 py-1 rounded-lg text-center text-[10px] font-bold transition-all ${
                        filled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'
                      }`}>
                        {filled ? '✓ ' : ''}{label}
                      </div>
                    );
                  })}
                </div>

                {unlocked ? (
                  <Link to={`/fase/${phase.id}`} onClick={playClick}>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                      <Button size="sm" className={`w-full rounded-xl bg-gradient-to-r ${phase.gradient} hover:opacity-90 text-white font-bold shadow-md`}>
                        {done ? '↩ Revisar etapa' : '▶ Iniciar etapa'}
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </motion.div>
                  </Link>
                ) : (
                  <Button size="sm" disabled variant="outline" className="w-full rounded-xl opacity-40">
                    <Lock className="h-3 w-3 mr-1" /> Complete a etapa anterior
                  </Button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}