"use client";

import { useEffect, useState } from "react";
import WhiteboardCanvas from "@/components/board/WhiteboardCanvas";

const DEFAULT_SESSION_TITLE = "Free Drawing Session";
const SESSION_TITLE_STORAGE_KEY = "free-drawing-whiteboard:session-title";

export default function WhiteboardPage() {
  const [sessionTitle, setSessionTitle] = useState(DEFAULT_SESSION_TITLE);

  useEffect(() => {
    const storedTitle = window.localStorage.getItem(SESSION_TITLE_STORAGE_KEY);

    if (storedTitle) {
      setSessionTitle(storedTitle);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(SESSION_TITLE_STORAGE_KEY, sessionTitle);
  }, [sessionTitle]);

  return (
    <main className="flex h-dvh w-full flex-col bg-slate-100">
      <header className="border-b border-slate-200 bg-white px-4 py-3 lg:px-5">
        <input
          value={sessionTitle}
          onChange={(event) => setSessionTitle(event.target.value)}
          className="w-full max-w-xl rounded-md border border-transparent px-2 py-1 text-lg font-semibold text-slate-900 outline-none hover:border-slate-200 focus:border-slate-300"
          aria-label="Session title"
        />
      </header>

      <section className="h-full min-h-0 flex-1 p-2 lg:p-3">
        <div className="h-full min-h-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <WhiteboardCanvas />
        </div>
      </section>
    </main>
  );
}
