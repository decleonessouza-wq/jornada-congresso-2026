export const PARTICIPANT_STORAGE_KEY = "jornada-congresso-2026:participant";

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function normalizeName(value) {
  return String(value || "")
    .trim()
    .replace(/\s+/g, " ");
}

function getFirstName(fullName) {
  return normalizeName(fullName).split(" ")[0] || "irmão";
}

function createId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `participant-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function getParticipant() {
  if (!canUseStorage()) {
    return null;
  }

  try {
    const raw = localStorage.getItem(PARTICIPANT_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveParticipant(fullName) {
  if (!canUseStorage()) {
    return null;
  }

  const normalizedName = normalizeName(fullName);

  if (normalizedName.length < 3) {
    throw new Error("Digite seu nome para entrar na Jornada.");
  }

  if (normalizedName.length > 80) {
    throw new Error("O nome deve ter no máximo 80 caracteres.");
  }

  const existing = getParticipant();

  const participant = {
    id: existing?.id || createId(),
    fullName: normalizedName,
    firstName: getFirstName(normalizedName),
    welcomed: false,
    createdAt: existing?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  localStorage.setItem(PARTICIPANT_STORAGE_KEY, JSON.stringify(participant));

  return participant;
}

export function completeParticipantWelcome() {
  if (!canUseStorage()) {
    return null;
  }

  const participant = getParticipant();

  if (!participant) {
    return null;
  }

  const updatedParticipant = {
    ...participant,
    welcomed: true,
    updatedAt: new Date().toISOString(),
  };

  localStorage.setItem(
    PARTICIPANT_STORAGE_KEY,
    JSON.stringify(updatedParticipant)
  );

  return updatedParticipant;
}

export function clearParticipant() {
  if (!canUseStorage()) {
    return;
  }

  localStorage.removeItem(PARTICIPANT_STORAGE_KEY);
}

export function exitParticipantSession() {
  clearParticipant();
}

export function resetParticipantSession() {
  clearParticipant();
}

export function hasParticipant() {
  return Boolean(getParticipant());
}

export function getParticipantDisplayName() {
  const participant = getParticipant();
  return participant?.fullName || "";
}

export function getParticipantFirstName() {
  const participant = getParticipant();
  return participant?.firstName || "irmão";
}