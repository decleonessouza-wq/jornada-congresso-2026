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

  const { data, error } = await supabase
    .from(MURAL_TABLE)
    .insert({
      author_name: authorName,
      message,
    })
    .select("id, author_name, message, is_approved, created_at, updated_at")
    .single();

  if (error) {
    throw new Error(error.message || "Não foi possível enviar sua mensagem.");
  }

  return normalizeMuralPost(data);
}