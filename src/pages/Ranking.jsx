import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Crown, Medal, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useJourneyProgress } from '../lib/useJourneyProgress';
import { playClick, playCelebrate } from '../lib/sounds';

const AVATAR_COLORS = [
  'from-purple-400 to-violet-600',
  'from-amber-400 to-orange-500',
  'from-blue-400 to-cyan-500',
  'from-green-400 to-emerald-500',
  'from-pink-400 to-rose-500',
  'from-indigo-400 to-purple-500',
];

const RankBadge = ({ rank }) => {
  if (rank === 1) return <Crown className="h-5 w-5 text-amber-400 fill-amber-300" />;
  if (rank === 2) return <Medal className="h-5 w-5 text-slate-400 fill-slate-300" />;
  if (rank === 3) return <Medal className="h-5 w-5 text-amber-700 fill-amber-600" />;
  return <span className="text-xs font-bold text-muted-foreground w-5 text-center">{rank}º</span>;
};

export default function Ranking() {
  const [showForm, setShowForm] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const queryClient = useQueryClient();
  const { getTotalScore, getCompletedCount } = useJourneyProgress();
  const myScore = getTotalScore();
  const myPhases = getCompletedCount();

  const { data: scores = [], isLoading } = useQuery({
    queryKey: ['userScores'],
    queryFn: () => base44.entities.UserScore.list('-score', 50),
  });

  const submitScore = useMutation({
    mutationFn: (data) => base44.entities.UserScore.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userScores'] });
      setShowForm(false);
      setPlayerName('');
      playCelebrate();
    },
  });

  const handleSubmit = () => {
    if (!playerName.trim()) return;
    playClick();
    submitScore.mutate({
      player_name: playerName.trim(),
      score: myScore,
      completed_phases: myPhases,
      avatar_color: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
    });
  };

  const sorted = [...scores].sort((a, b) => b.score - a.score);

  return (
    <div className="px-4 py-6 pb-28">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-200">
            <Trophy className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-foreground">Ranking</h1>
            <p className="text-xs text-muted-foreground">Jornada 12:12 — Classificação geral</p>
          </div>
        </div>
      </motion.div>

      {/* My score card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-4 mt-5 mb-5 text-white shadow-xl shadow-purple-200/50"
      >
        <p className="text-xs font-semibold opacity-80 mb-1">Sua pontuação atual</p>
        <div className="flex items-end gap-2">
          <span className="text-4xl font-extrabold">{myScore}</span>
          <span className="text-sm opacity-70 mb-1">pts</span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="flex gap-1">
            {[1, 2, 3].map(i => (
              <div key={i} className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                i <= myPhases ? 'bg-white text-purple-600' : 'bg-white/20 text-white/40'
              }`}>
                {i <= myPhases ? '✓' : i}
              </div>
            ))}
          </div>
          <Button
            size="sm"
            onClick={() => { playClick(); setShowForm(true); }}
            className="rounded-xl bg-white text-purple-700 hover:bg-white/90 font-bold text-xs h-8"
          >
            Registrar pontuação
          </Button>
        </div>
      </motion.div>

      {/* Leaderboard */}
      <div className="space-y-2">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="w-7 h-7 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
          </div>
        ) : sorted.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            <Trophy className="h-10 w-10 mx-auto mb-2 opacity-20" />
            <p className="text-sm font-medium">Nenhum participante ainda</p>
            <p className="text-xs mt-1">Seja o primeiro a registrar sua pontuação!</p>
          </div>
        ) : (
          sorted.map((entry, idx) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.04 }}
              className={`flex items-center gap-3 p-3.5 rounded-2xl border ${
                idx === 0 ? 'bg-amber-50 border-amber-200' :
                idx === 1 ? 'bg-slate-50 border-slate-200' :
                idx === 2 ? 'bg-orange-50 border-orange-200' :
                'bg-white border-gray-100'
              }`}
            >
              <div className="w-7 flex items-center justify-center">
                <RankBadge rank={idx + 1} />
              </div>
              <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${entry.avatar_color || 'from-purple-400 to-violet-600'} flex items-center justify-center shadow-md`}>
                <span className="text-white font-extrabold text-sm">{entry.player_name?.[0]?.toUpperCase() || '?'}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-foreground truncate">{entry.player_name}</p>
                <div className="flex gap-0.5 mt-0.5">
                  {[1,2,3].map(i => (
                    <Star key={i} className={`h-2.5 w-2.5 ${i <= (entry.completed_phases || 0) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`} />
                  ))}
                </div>
              </div>
              <div className="text-right">
                <p className="font-extrabold text-foreground">{entry.score}</p>
                <p className="text-[10px] text-muted-foreground">pontos</p>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Submit form modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-center p-4"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="bg-white rounded-3xl p-6 w-full max-w-sm"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-extrabold text-foreground text-lg">Registrar pontuação</h3>
                <Button variant="ghost" size="icon" onClick={() => setShowForm(false)} className="rounded-full h-8 w-8">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Sua pontuação é <span className="font-extrabold text-purple-600">{myScore} pts</span>. Como quer aparecer no ranking?
              </p>
              <Input
                placeholder="Seu nome ou apelido"
                value={playerName}
                onChange={e => setPlayerName(e.target.value)}
                className="rounded-xl mb-4"
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              />
              <Button
                onClick={handleSubmit}
                disabled={!playerName.trim() || submitScore.isPending}
                className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-5"
              >
                <Send className="h-4 w-4 mr-2" /> Entrar no ranking!
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}