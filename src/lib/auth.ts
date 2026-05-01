const TOKEN_KEY = "ainative_token";
const USER_KEY = "ainative_user";

const API_BASE =
  import.meta.env.VITE_AINATIVE_API_URL ??
  "https://api.ainative.studio/api/v1/public";

export type User = { name: string; email: string };

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser(): User | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  return raw ? (JSON.parse(raw) as User) : null;
}

/** Store token + user info (used by both real and demo login) */
function saveSession(token: string, user: User) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

/**
 * Login via AINative /auth/login.
 * Falls back to demo mode (any credentials) when no VITE_AINATIVE_API_KEY is set
 * or when the server is unreachable.
 * Returns true on success, false on bad credentials.
 */
export async function login(
  email: string,
  password: string
): Promise<boolean> {
  const configuredKey = import.meta.env.VITE_AINATIVE_API_KEY as
    | string
    | undefined;

  if (!configuredKey) {
    // Demo mode — accept any credentials
    saveSession("mock-jwt-" + Date.now(), {
      name: email.split("@")[0],
      email,
    });
    return true;
  }

  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": configuredKey,
      },
      body: JSON.stringify({ email, password }),
    });

    if (res.status === 401 || res.status === 403) return false;
    if (!res.ok) {
      // Server error — fall back to demo so the UI doesn't break
      console.warn("Auth API unavailable, using demo mode");
      saveSession("mock-jwt-" + Date.now(), {
        name: email.split("@")[0],
        email,
      });
      return true;
    }

    const data = (await res.json()) as {
      token?: string;
      access_token?: string;
      user?: { name?: string; email?: string };
    };
    const token = data.token ?? data.access_token ?? configuredKey;
    saveSession(token, {
      name: data.user?.name ?? email.split("@")[0],
      email: data.user?.email ?? email,
    });
    return true;
  } catch {
    // Network error — fall back to demo
    saveSession("mock-jwt-" + Date.now(), {
      name: email.split("@")[0],
      email,
    });
    return true;
  }
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
