import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Star, Crown, Medal, Send, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useJourneyProgress } from "../lib/useJourneyProgress";
import { playClick, playCelebrate } from "../lib/sounds";
import { createUserScore, listUserScores } from "@/services/userScoreService";

const AVATAR_COLORS = [
  "from-purple-400 to-violet-600",
  "from-amber-400 to-orange-500",
  "from-blue-400 to-cyan-500",
  "from-green-400 to-emerald-500",
  "from-pink-400 to-rose-500",
  "from-indigo-400 to-purple-500",
];

const RankBadge = ({ rank }) => {
  if (rank === 1) return <Crown className="h-5 w-5 fill-amber-300 text-amber-400" />;
  if (rank === 2) return <Medal className="h-5 w-5 fill-slate-300 text-slate-400" />;
  if (rank === 3) return <Medal className="h-5 w-5 fill-amber-600 text-amber-700" />;

  return (
    <span className="w-5 text-center text-xs font-bold text-muted-foreground">
      {rank}º
    </span>
  );
};

export default function Ranking() {
  const [showForm, setShowForm] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const queryClient = useQueryClient();

  const { getTotalScore, getCompletedCount } = useJourneyProgress();

  const myScore = Number(getTotalScore() || 0);
  const myPhases = Number(getCompletedCount() || 0);

  const {
    data: scores = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["userScores"],
    queryFn: () => listUserScores(50),
  });

  const submitScore = useMutation({
    mutationFn: createUserScore,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userScores"] });
      setShowForm(false);
      setPlayerName("");
      playCelebrate();
    },
  });

  const handleSubmit = () => {
    if (!playerName.trim()) {
      return;
    }

    playClick();

    submitScore.mutate({
      player_name: playerName.trim(),
      score: myScore,
      completed_phases: myPhases,
      avatar_color: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
    });
  };

  const sorted = [...scores].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if ((b.completed_phases || 0) !== (a.completed_phases || 0)) {
      return (b.completed_phases || 0) - (a.completed_phases || 0);
    }

    return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
  });

  return (
    <div className="px-4 py-6 pb-28">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-1 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-200">
            <Trophy className="h-5 w-5 text-white" />
          </div>

          <div>
            <h1 className="text-2xl font-extrabold text-foreground">
              Caminhada dos participantes
            </h1>
            <p className="text-xs text-muted-foreground">
              Jornada Congresso 2026 — caminhada dos participantes
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mt-5 mb-5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 p-4 text-white shadow-xl shadow-purple-200/50"
      >
        <p className="mb-1 text-xs font-semibold opacity-80">Sua caminhada atual</p>

        <div className="flex items-end gap-2">
          <span className="text-4xl font-extrabold">{myScore}</span>
          <span className="mb-1 text-sm opacity-70">pontos da caminhada</span>
        </div>

        <p className="mt-1 text-xs leading-relaxed text-white/75">
          A pontuação é apenas um incentivo visual. O mais importante é participar,
          refletir e preparar o coração para o congresso.
        </p>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex gap-1">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                  item <= myPhases
                    ? "bg-white text-purple-600"
                    : "bg-white/20 text-white/40"
                }`}
              >
                {item <= myPhases ? "✓" : item}
              </div>
            ))}
          </div>

          <Button
            size="sm"
            onClick={() => {
              playClick();
              setShowForm(true);
            }}
            className="h-8 rounded-xl bg-white text-xs font-bold text-purple-700 hover:bg-white/90"
          >
            Registrar minha caminhada
          </Button>
        </div>
      </motion.div>

      <div className="space-y-2">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="h-7 w-7 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600" />
          </div>
        ) : isError ? (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-5 text-center text-red-700">
            <Trophy className="mx-auto mb-2 h-9 w-9 opacity-70" />
            <p className="text-sm font-bold">Não foi possível carregar a participação.</p>
            <p className="mt-1 text-xs">
              {error?.message || "Verifique a conexão com o Supabase e tente novamente."}
            </p>
          </div>
        ) : sorted.length === 0 ? (
          <div className="py-10 text-center text-muted-foreground">
            <Sparkles className="mx-auto mb-2 h-10 w-10 opacity-30" />
            <p className="text-sm font-medium">Nenhum participante registrado ainda.</p>
            <p className="mt-1 text-xs">Seja o primeiro a registrar sua caminhada.</p>
          </div>
        ) : (
          sorted.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.04 }}
              className={`flex items-center gap-3 rounded-2xl border p-3.5 ${
                index === 0
                  ? "border-amber-200 bg-amber-50"
                  : index === 1
                    ? "border-slate-200 bg-slate-50"
                    : index === 2
                      ? "border-orange-200 bg-orange-50"
                      : "border-gray-100 bg-white"
              }`}
            >
              <div className="flex w-7 items-center justify-center">
                <RankBadge rank={index + 1} />
              </div>

              <div
                className={`flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br ${
                  entry.avatar_color || "from-purple-400 to-violet-600"
                } shadow-md`}
              >
                <span className="text-sm font-extrabold text-white">
                  {entry.player_name?.[0]?.toUpperCase() || "?"}
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-foreground">
                  {entry.player_name}
                </p>

                <div className="mt-0.5 flex gap-0.5">
                  {[1, 2, 3].map((item) => (
                    <Star
                      key={item}
                      className={`h-2.5 w-2.5 ${
                        item <= (entry.completed_phases || 0)
                          ? "fill-amber-400 text-amber-400"
                          : "fill-gray-200 text-gray-200"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="text-right">
                <p className="font-extrabold text-foreground">{entry.score}</p>
                <p className="text-[10px] text-muted-foreground">pontos da caminhada</p>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 backdrop-blur-sm"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="w-full max-w-sm rounded-3xl bg-white p-6"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-extrabold text-foreground">
                  Registrar minha caminhada
                </h3>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowForm(false)}
                  className="h-8 w-8 rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <p className="mb-4 text-sm text-muted-foreground">
                Sua caminhada atual tem{" "}
                <span className="font-extrabold text-purple-600">{myScore} pontos da caminhada</span>.
                Como deseja aparecer na lista?
              </p>

              <Input
                placeholder="Seu nome ou apelido"
                value={playerName}
                onChange={(event) => setPlayerName(event.target.value)}
                className="mb-4 rounded-xl"
                maxLength={80}
                onKeyDown={(event) => event.key === "Enter" && handleSubmit()}
              />

              <Button
                onClick={handleSubmit}
                disabled={!playerName.trim() || submitScore.isPending}
                className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 py-5 font-bold text-white"
              >
                <Send className="mr-2 h-4 w-4" />
                {submitScore.isPending ? "Registrando..." : "Registrar minha caminhada"}
              </Button>

              {submitScore.isError && (
                <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-600">
                  {submitScore.error?.message ||
                    "Não foi possível registrar sua caminhada."}
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}