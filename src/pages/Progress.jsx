import { motion } from 'framer-motion';
import { Trophy, Award, ChevronRight, Sun, Shield, Flame, Check, Zap, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useJourneyProgress } from '../lib/useJourneyProgress';
import { phases } from '../lib/journeyData';

const iconMap = { Sun, Shield, Flame };

const messages = [
  "Cada passo nessa jornada prepara seu coração para ouvir a voz de Deus.",
  "Você já começou! Continue firme, Deus está com você nessa caminhada.",
  "Falta pouco! Seu coração está sendo preparado de forma especial.",
  "Jornada completa! Seu coração está pronto para o congresso. Glória a Deus!"
];

export default function ProgressPage() {
  const { progress, getOverallProgress, getCompletedCount, getTotalScore } = useJourneyProgress();
  const score = getTotalScore();
  const pct = getOverallProgress();
  const completed = getCompletedCount();
  const msg = messages[completed];

  return (
    <div className="px-4 py-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-extrabold text-foreground mb-0.5">Seu Progresso</h1>
        <p className="text-sm text-muted-foreground mb-6">Acompanhe sua jornada espiritual</p>
      </motion.div>

      {/* Score + Circular progress */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-4 mb-5 text-white shadow-xl shadow-purple-200/50"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold opacity-80 mb-1">Total de pontos</p>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-300 fill-amber-300" />
              <span className="text-4xl font-extrabold">{score}</span>
              <span className="text-sm opacity-70">pts</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs opacity-70 mb-1">Etapas</p>
            <div className="flex gap-1.5">
              {[1,2,3].map(i => (
                <div key={i} className={`w-9 h-9 rounded-xl flex items-center justify-center font-extrabold text-sm ${
                  i <= completed ? 'bg-white text-purple-700 shadow-md' : 'bg-white/20 text-white/40'
                }`}>{i <= completed ? '✓' : i}</div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Circular progress */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-purple-50 to-amber-50 rounded-2xl p-4 mb-6 border border-purple-100"
      >
        <p className="text-sm text-foreground text-center font-semibold">✨ {msg}</p>
      </motion.div>

      {/* Phase list */}
      <div className="space-y-3 mb-6">
        {phases.map((phase, idx) => {
          const done = progress.phases[phase.id]?.completed;
          const pData = progress.phases[phase.id];
          const quizScore = (pData?.quizCorrect?.length || 0) * 10;
          const crossScore = (pData?.crosswordSolved?.length || 0) * 15;
          const bonusScore = done ? 50 : 0;
          const phaseTotal = quizScore + crossScore + bonusScore;
          const Icon = iconMap[phase.iconName];
          return (
            <motion.div
              key={phase.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + idx * 0.1 }}
              className="bg-white rounded-2xl p-4 shadow-md border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  done ? `bg-gradient-to-br ${phase.gradient} shadow-md` : 'bg-gray-100'
                }`}>
                  {done ? <Award className="h-6 w-6 text-white" /> : <Icon className="h-6 w-6 text-gray-400" />}
                </div>
                <div className="flex-1">
                  <p className="font-extrabold text-sm text-foreground">{phase.title}</p>
                  <p className={`text-xs font-semibold ${
                    done ? 'text-green-600' : 'text-muted-foreground'
                  }`}>
                    {done ? `${phase.badge} ✓` : 'Pendente'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-extrabold text-foreground">{phaseTotal}</p>
                  <p className="text-[10px] text-muted-foreground">pts</p>
                </div>
              </div>
              {/* Sub-scores */}
              <div className="flex gap-1.5">
                {[{label:'Quiz', v:quizScore},{label:'Palavras', v:crossScore},{label:'Bônus', v:bonusScore}].map(s=>(
                  <div key={s.label} className={`flex-1 text-center rounded-lg py-1 text-[10px] font-bold ${
                    s.v > 0 ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-400'
                  }`}>
                    {s.label}<br /><span className="text-xs">{s.v}pts</span>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* CTA */}
      {completed < 3 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
          <Link to="/jornada">
            <Button className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-6 font-bold">
              Continuar jornada <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center bg-gradient-to-r from-amber-50 to-purple-50 rounded-2xl p-6 border border-amber-200"
        >
          <Trophy className="h-12 w-12 text-amber-500 mx-auto mb-3" />
          <h3 className="font-extrabold text-foreground text-lg">Jornada completa!</h3>
          <p className="text-sm text-muted-foreground mt-1">Seu coração está preparado. Glória a Deus! 🙌</p>
        </motion.div>
      )}
    </div>
  );
}