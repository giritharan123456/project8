// Profile API layer (Sections 5–9, 14). Follows the same USE_MOCK_API
// switch as endpoints.js: mock mode reads/writes playerStore's
// localStorage-backed state, real mode calls the Express backend added in
// server/src/routes/profile.js. Every function keeps the same async
// signature and return shape either way, so ProfilePage.jsx never needs
// to know which mode is active.
import { USE_MOCK_API } from "./config.js";
import { apiFetch, invalidateCache } from "./client.js";
import { MOCK_PLAYER } from "../data/content.js";
import {
  getPlayerState,
  updateProfileFields,
  setProfilePhoto,
  removeProfilePhoto,
  setLanguagePreference,
} from "../store/playerStore.js";

// GET /api/profile — { id, name, email, grade, board, level, xp, xpToNext,
// coins, streak, profilePhoto, language }.
export async function getProfile() {
  if (USE_MOCK_API) {
    const state = getPlayerState();
    return {
      id: "mock-player",
      name: state.name ?? MOCK_PLAYER.name,
      email: null,
      grade: "9",
      board: "CBSE",
      level: MOCK_PLAYER.level,
      xp: state.xp,
      xpToNext: MOCK_PLAYER.xpToNext,
      coins: state.coins,
      streak: state.streak,
      profilePhoto: state.profilePhoto ?? null,
      language: state.language ?? "en",
    };
  }
  return apiFetch("/profile");
}

// PUT /api/profile — { name?, grade?, board? }. Email is never sent here:
// it's the sign-in credential and isn't editable from this form (see
// server/src/routes/profile.js's comment for why).
export async function updateProfile({ name, grade, board }) {
  if (USE_MOCK_API) {
    updateProfileFields({ name });
    return getProfile();
  }
  return apiFetch("/profile", { method: "PUT", body: { name, grade, board } }).then((res) => {
    invalidateCache("/profile");
    return res;
  });
}

// POST /api/profile/photo — { imageBase64 } where imageBase64 is a
// "data:image/...;base64,..." string. Caller (ProfilePage) is responsible
// for file-type/size validation before calling this, same as the server
// re-validates independently.
export async function uploadProfilePhoto(imageBase64) {
  if (USE_MOCK_API) {
    setProfilePhoto(imageBase64);
    return { ok: true, profilePhoto: imageBase64 };
  }
  return apiFetch("/profile/photo", { method: "POST", body: { imageBase64 } }).then((res) => {
    invalidateCache("/profile");
    return res;
  });
}

// DELETE /api/profile/photo
export async function deleteProfilePhoto() {
  if (USE_MOCK_API) {
    removeProfilePhoto();
    return { ok: true };
  }
  return apiFetch("/profile/photo", { method: "DELETE" }).then((res) => {
    invalidateCache("/profile");
    return res;
  });
}

// PUT /api/profile/language — { language: "en" | "ta" | "hi" }.
export async function updateLanguage(language) {
  if (USE_MOCK_API) {
    setLanguagePreference(language);
    return { ok: true, language };
  }
  return apiFetch("/profile/language", { method: "PUT", body: { language } }).then((res) => {
    invalidateCache("/profile");
    return res;
  });
}
