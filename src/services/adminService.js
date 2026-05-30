import { supabase } from "@/lib/supabaseClient";

const MURAL_TABLE = "mural_posts";
const PRAYER_TABLE = "prayer_requests";
const SCORES_TABLE = "user_scores";
const ADMINS_TABLE = "app_admins";

function normalizeDateFields(item) {
  return {
    ...item,
    created_date: item.created_at,
    updated_date: item.updated_at,
  };
}

export async function signInAdmin({ email, password }) {
  const cleanEmail = email?.trim();

  if (!cleanEmail) {
    throw new Error("Informe o e-mail do administrador.");
  }

  if (!password) {
    throw new Error("Informe a senha do administrador.");
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: cleanEmail,
    password,
  });

  if (error) {
    throw new Error(error.message || "Não foi possível entrar no painel.");
  }

  const adminProfile = await getCurrentAdminProfile();

  if (!adminProfile) {
    await supabase.auth.signOut();
    throw new Error("Este usuário não possui permissão de administrador.");
  }

  return {
    user: data.user,
    session: data.session,
    adminProfile,
  };
}

export async function signOutAdmin() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message || "Não foi possível sair do painel.");
  }

  return true;
}

export async function getCurrentSession() {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw new Error(error.message || "Não foi possível verificar a sessão.");
  }

  return data.session;
}

export async function getCurrentAdminProfile() {
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

  if (sessionError) {
    throw new Error(sessionError.message || "Não foi possível verificar a sessão.");
  }

  const userId = sessionData.session?.user?.id;

  if (!userId) {
    return null;
  }

  const { data, error } = await supabase
    .from(ADMINS_TABLE)
    .select("user_id, full_name, role, created_at")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message || "Não foi possível verificar o administrador.");
  }

  return data;
}

export async function listMuralMessagesForAdmin() {
  const { data, error } = await supabase
    .from(MURAL_TABLE)
    .select("id, author_name, message, is_approved, created_at, updated_at")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message || "Não foi possível carregar as mensagens do mural.");
  }

  return (data || []).map(normalizeDateFields);
}

export async function approveMuralMessage(id) {
  if (!id) {
    throw new Error("Mensagem inválida.");
  }

  const { data, error } = await supabase
    .from(MURAL_TABLE)
    .update({
      is_approved: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("id, author_name, message, is_approved, created_at, updated_at")
    .single();

  if (error) {
    throw new Error(error.message || "Não foi possível aprovar a mensagem.");
  }

  return normalizeDateFields(data);
}

export async function hideMuralMessage(id) {
  if (!id) {
    throw new Error("Mensagem inválida.");
  }

  const { data, error } = await supabase
    .from(MURAL_TABLE)
    .update({
      is_approved: false,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("id, author_name, message, is_approved, created_at, updated_at")
    .single();

  if (error) {
    throw new Error(error.message || "Não foi possível ocultar a mensagem.");
  }

  return normalizeDateFields(data);
}

export async function deleteMuralMessage(id) {
  if (!id) {
    throw new Error("Mensagem inválida.");
  }

  const { error } = await supabase.from(MURAL_TABLE).delete().eq("id", id);

  if (error) {
    throw new Error(error.message || "Não foi possível excluir a mensagem.");
  }

  return true;
}

export async function listPrayerRequestsForAdmin() {
  const { data, error } = await supabase
    .from(PRAYER_TABLE)
    .select(
      "id, author_name, prayer_text, is_anonymous, is_prayed, is_archived, created_at, updated_at"
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message || "Não foi possível carregar os pedidos de oração.");
  }

  return (data || []).map(normalizeDateFields);
}

export async function markPrayerAsPrayed(id, isPrayed = true) {
  if (!id) {
    throw new Error("Pedido inválido.");
  }

  const { data, error } = await supabase
    .from(PRAYER_TABLE)
    .update({
      is_prayed: Boolean(isPrayed),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select(
      "id, author_name, prayer_text, is_anonymous, is_prayed, is_archived, created_at, updated_at"
    )
    .single();

  if (error) {
    throw new Error(error.message || "Não foi possível atualizar o pedido.");
  }

  return normalizeDateFields(data);
}

export async function archivePrayerRequest(id, isArchived = true) {
  if (!id) {
    throw new Error("Pedido inválido.");
  }

  const { data, error } = await supabase
    .from(PRAYER_TABLE)
    .update({
      is_archived: Boolean(isArchived),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select(
      "id, author_name, prayer_text, is_anonymous, is_prayed, is_archived, created_at, updated_at"
    )
    .single();

  if (error) {
    throw new Error(error.message || "Não foi possível arquivar o pedido.");
  }

  return normalizeDateFields(data);
}

export async function deletePrayerRequest(id) {
  if (!id) {
    throw new Error("Pedido inválido.");
  }

  const { error } = await supabase.from(PRAYER_TABLE).delete().eq("id", id);

  if (error) {
    throw new Error(error.message || "Não foi possível excluir o pedido.");
  }

  return true;
}

export async function listUserScoresForAdmin() {
  const { data, error } = await supabase
    .from(SCORES_TABLE)
    .select("id, player_name, score, completed_phases, avatar_color, created_at, updated_at")
    .order("score", { ascending: false })
    .order("completed_phases", { ascending: false })
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message || "Não foi possível carregar as participações.");
  }

  return (data || []).map(normalizeDateFields);
}

export async function deleteUserScore(id) {
  if (!id) {
    throw new Error("Participação inválida.");
  }

  const { error } = await supabase.from(SCORES_TABLE).delete().eq("id", id);

  if (error) {
    throw new Error(error.message || "Não foi possível excluir a participação.");
  }

  return true;
}