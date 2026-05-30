import { supabase } from "@/lib/supabaseClient";

const USER_SCORES_TABLE = "user_scores";

function normalizeUserScore(score) {
  return {
    ...score,
    created_date: score.created_at,
    updated_date: score.updated_at,
  };
}

export async function listUserScores(limit = 50) {
  const { data, error } = await supabase
    .from(USER_SCORES_TABLE)
    .select("id, player_name, score, completed_phases, avatar_color, created_at, updated_at")
    .order("score", { ascending: false })
    .order("completed_phases", { ascending: false })
    .order("created_at", { ascending: true })
    .limit(limit);

  if (error) {
    throw new Error(error.message || "Não foi possível carregar a participação da jornada.");
  }

  return (data || []).map(normalizeUserScore);
}

export async function createUserScore(payload) {
  const playerName = payload.player_name?.trim();
  const score = Number(payload.score || 0);
  const completedPhases = Number(payload.completed_phases || 0);

  if (!playerName) {
    throw new Error("Informe seu nome ou apelido para registrar sua participação.");
  }

  if (playerName.length > 80) {
    throw new Error("O nome deve ter no máximo 80 caracteres.");
  }

  if (score < 0) {
    throw new Error("A pontuação não pode ser negativa.");
  }

  if (completedPhases < 0 || completedPhases > 3) {
    throw new Error("A quantidade de etapas concluídas precisa estar entre 0 e 3.");
  }

  const { data, error } = await supabase
    .from(USER_SCORES_TABLE)
    .insert({
      player_name: playerName,
      score,
      completed_phases: completedPhases,
      avatar_color: payload.avatar_color || "from-purple-400 to-violet-600",
    })
    .select("id, player_name, score, completed_phases, avatar_color, created_at, updated_at")
    .single();

  if (error) {
    throw new Error(error.message || "Não foi possível registrar sua participação.");
  }

  return normalizeUserScore(data);
}