const BOARD_SESSION_KEY = "java-teaching-whiteboard:session";

export type SessionSnapshot = {
  title: string;
  code: string;
  updatedAt: string;
};

export function saveSession(snapshot: SessionSnapshot) {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(BOARD_SESSION_KEY, JSON.stringify(snapshot));
}

export function loadSession(): SessionSnapshot | null {
  if (typeof window === "undefined") {
    return null;
  }

  const data = window.localStorage.getItem(BOARD_SESSION_KEY);
  if (!data) {
    return null;
  }

  try {
    return JSON.parse(data) as SessionSnapshot;
  } catch {
    return null;
  }
}
