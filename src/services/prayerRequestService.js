import { supabase } from "@/lib/supabaseClient";

const PRAYER_REQUESTS_TABLE = "prayer_requests";

export async function createPrayerRequest(payload) {
  const isAnonymous = Boolean(payload.is_anonymous);
  const authorName = isAnonymous
    ? "Anônimo"
    : payload.author_name?.trim() || "Anônimo";

  const prayerText = payload.prayer_text?.trim();

  if (!prayerText) {
    throw new Error("Escreva seu pedido de oração antes de enviar.");
  }

  if (prayerText.length < 3) {
    throw new Error("O pedido de oração precisa ter pelo menos 3 caracteres.");
  }

  if (prayerText.length > 1000) {
    throw new Error("O pedido de oração deve ter no máximo 1000 caracteres.");
  }

  const { error } = await supabase.from(PRAYER_REQUESTS_TABLE).insert({
    author_name: authorName,
    prayer_text: prayerText,
    is_anonymous: isAnonymous,
  });

  if (error) {
    throw new Error(error.message || "Não foi possível enviar seu pedido de oração.");
  }

  return {
    success: true,
  };
}