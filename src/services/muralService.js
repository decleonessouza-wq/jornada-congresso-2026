import { supabase } from "@/lib/supabaseClient";

const MURAL_TABLE = "mural_posts";

const VALID_POST_TYPES = ["expectation", "testimony"];

function normalizePostType(postType) {
  return VALID_POST_TYPES.includes(postType) ? postType : "expectation";
}

function normalizeMuralPost(post) {
  return {
    ...post,
    post_type: normalizePostType(post.post_type),
    created_date: post.created_at,
    updated_date: post.updated_at,
  };
}

function getSuccessMessage(postType) {
  if (postType === "testimony") {
    return "Testemunho enviado com sucesso. Após uma breve revisão da equipe, ele poderá aparecer no mural para edificar outros irmãos.";
  }

  return "Mensagem enviada com sucesso. Após uma breve revisão da equipe, ela poderá aparecer no mural da Jornada.";
}

export async function listMuralPosts(limit = 50, postType = null) {
  let query = supabase
    .from(MURAL_TABLE)
    .select(
      "id, author_name, message, post_type, is_approved, created_at, updated_at"
    )
    .eq("is_approved", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (postType && VALID_POST_TYPES.includes(postType)) {
    query = query.eq("post_type", postType);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message || "Não foi possível carregar o mural.");
  }

  return (data || []).map(normalizeMuralPost);
}

export async function createMuralPost(payload) {
  const authorName = payload.author_name?.trim() || "Anônimo";
  const message = payload.message?.trim();
  const postType = normalizePostType(payload.post_type);

  if (!message) {
    throw new Error(
      postType === "testimony"
        ? "Escreva seu testemunho antes de enviar."
        : "Escreva uma mensagem antes de compartilhar."
    );
  }

  if (authorName.length > 80) {
    throw new Error("O nome deve ter no máximo 80 caracteres.");
  }

  if (message.length < 3) {
    throw new Error(
      postType === "testimony"
        ? "O testemunho precisa ter pelo menos 3 caracteres."
        : "A mensagem precisa ter pelo menos 3 caracteres."
    );
  }

  if (message.length > 700) {
    throw new Error(
      postType === "testimony"
        ? "O testemunho deve ter no máximo 700 caracteres."
        : "A mensagem deve ter no máximo 700 caracteres."
    );
  }

  const { error } = await supabase.from(MURAL_TABLE).insert({
    author_name: authorName,
    message,
    post_type: postType,
    is_approved: false,
  });

  if (error) {
    throw new Error(
      error.message ||
        (postType === "testimony"
          ? "Não foi possível enviar seu testemunho."
          : "Não foi possível enviar sua mensagem.")
    );
  }

  return {
    success: true,
    status: "pending_review",
    post_type: postType,
    message: getSuccessMessage(postType),
  };
}