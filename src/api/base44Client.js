const STORAGE_KEYS = {
  muralPosts: "jornada-congresso-2026:mural-posts",
  prayerRequests: "jornada-congresso-2026:prayer-requests",
  userScores: "jornada-congresso-2026:user-scores",
  authUser: "jornada-congresso-2026:auth-user",
};

function readStorage(key, fallback = []) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function createLocalEntity(storageKey) {
  return {
    async list(orderBy = "-created_date", limit = 50) {
      const items = readStorage(storageKey, []);

      const sorted = [...items].sort((a, b) => {
        const direction = orderBy.startsWith("-") ? -1 : 1;
        const field = orderBy.replace("-", "");

        const valueA = a[field] ?? "";
        const valueB = b[field] ?? "";

        if (valueA < valueB) return -1 * direction;
        if (valueA > valueB) return 1 * direction;
        return 0;
      });

      return sorted.slice(0, limit);
    },

    async create(data) {
      const items = readStorage(storageKey, []);
      const now = new Date().toISOString();

      const newItem = {
        id: crypto.randomUUID(),
        ...data,
        created_date: now,
        updated_date: now,
      };

      const updated = [newItem, ...items];
      writeStorage(storageKey, updated);

      return newItem;
    },

    async update(id, data) {
      const items = readStorage(storageKey, []);
      const updated = items.map((item) =>
        item.id === id
          ? {
              ...item,
              ...data,
              updated_date: new Date().toISOString(),
            }
          : item
      );

      writeStorage(storageKey, updated);
      return updated.find((item) => item.id === id) ?? null;
    },

    async delete(id) {
      const items = readStorage(storageKey, []);
      const updated = items.filter((item) => item.id !== id);
      writeStorage(storageKey, updated);

      return { success: true };
    },
  };
}

function getLocalUser() {
  return readStorage(STORAGE_KEYS.authUser, null);
}

function setLocalUser(user) {
  writeStorage(STORAGE_KEYS.authUser, user);
}

export const base44 = {
  entities: {
    MuralPost: createLocalEntity(STORAGE_KEYS.muralPosts),
    PrayerRequest: createLocalEntity(STORAGE_KEYS.prayerRequests),
    UserScore: createLocalEntity(STORAGE_KEYS.userScores),
  },

  auth: {
    async me() {
      const user = getLocalUser();

      if (!user) {
        throw new Error("Usuário não autenticado localmente.");
      }

      return user;
    },

    async loginViaEmailPassword(email) {
      const user = {
        id: crypto.randomUUID(),
        email,
        full_name: email.split("@")[0],
        role: "user",
      };

      setLocalUser(user);
      return user;
    },

    async register({ email }) {
      const user = {
        id: crypto.randomUUID(),
        email,
        full_name: email.split("@")[0],
        role: "user",
      };

      setLocalUser(user);
      return user;
    },

    async verifyOtp() {
      return {
        access_token: "local-dev-token",
      };
    },

    setToken() {
      return true;
    },

    async resendOtp() {
      return true;
    },

    async resetPasswordRequest() {
      return true;
    },

    async resetPassword() {
      return true;
    },

    loginWithProvider() {
      const user = {
        id: crypto.randomUUID(),
        email: "participante@jornada.local",
        full_name: "Participante",
        role: "user",
      };

      setLocalUser(user);
      window.location.href = "/";
    },

    redirectToLogin() {
      window.location.href = "/login";
    },

    logout(redirectTo) {
      localStorage.removeItem(STORAGE_KEYS.authUser);

      if (redirectTo) {
        window.location.href = "/";
      }
    },
  },
};