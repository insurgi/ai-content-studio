const KEY = "ainative_token";
const USER_KEY = "ainative_user";

export type User = { name: string; email: string };

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(KEY);
}

export function getUser(): User | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function login(email: string, name = "Creator") {
  localStorage.setItem(KEY, "mock-jwt-" + Date.now());
  localStorage.setItem(USER_KEY, JSON.stringify({ name, email }));
}

export function logout() {
  localStorage.removeItem(KEY);
  localStorage.removeItem(USER_KEY);
}