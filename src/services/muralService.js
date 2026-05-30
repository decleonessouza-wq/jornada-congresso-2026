import { supabase } from "@/lib/supabaseClient";

const MURAL_TABLE = "mural_posts";

function normalizeMuralPost(post) {
  return {
    ...post,
    created_date: post.created_at,
    updated_date: post.updated_at,
  };
}

export async function listMuralPosts(limit = 50) {
  const { data, error } = await supabase
    .from(MURAL_TABLE)
    .select("id, author_name, message, is_approved, created_at, updated_at")
    .eq("is_approved", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(error.message || "Não foi possível carregar o mural.");
  }

  return (data || []).map(normalizeMuralPost);
}

export async function createMuralPost(payload) {
  const authorName = payload.author_name?.trim() || "Anônimo";
  const message = payload.message?.trim();

  if (!message) {
    throw new Error("Escreva uma mensagem antes de compartilhar.");
  }

  if (authorName.length > 80) {
    throw new Error("O nome deve ter no máximo 80 caracteres.");
  }

  if (message.length < 3) {
    throw new Error("A mensagem precisa ter pelo menos 3 caracteres.");
  }

  if (message.length > 500) {
    throw new Error("A mensagem deve ter no máximo 500 caracteres.");
  }

  const { error } = await supabase.from(MURAL_TABLE).insert({
    author_name: authorName,
    message,
    is_approved: false,
  });

  if (error) {
    throw new Error(error.message || "Não foi possível enviar sua mensagem.");
  }

  return {
    success: true,
    status: "pending_review",
    message:
      "Mensagem enviada com sucesso. Após uma breve revisão da equipe, ela poderá aparecer no mural da Jornada.",
  };
}