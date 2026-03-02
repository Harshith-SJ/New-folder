"use client";

import { useEffect, useMemo, useState } from "react";
import WhiteboardCanvas from "@/components/board/WhiteboardCanvas";
import JavaPanel from "@/components/java/JavaPanel";
import RecognitionAssistant from "@/components/board/RecognitionAssistant";
import { loadSession } from "@/lib/storage/sessionStore";

export default function WhiteboardPage() {
  const [sessionTitle, setSessionTitle] = useState("Java Lesson Session");
  const [code, setCode] = useState<string | undefined>(undefined);

  useEffect(() => {
    const snapshot = loadSession();
    if (!snapshot) {
      return;
    }
    setSessionTitle(snapshot.title || "Java Lesson Session");
    setCode(snapshot.code);
  }, []);

  const lessonDate = useMemo(() => {
    return new Intl.DateTimeFormat("en", {
      dateStyle: "medium",
      timeStyle: "short"
    }).format(new Date());
  }, []);

  return (
    <main className="flex h-dvh w-full flex-col bg-slate-100">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-3">
        <div className="flex min-w-0 flex-col">
          <input
            value={sessionTitle}
            onChange={(event) => setSessionTitle(event.target.value)}
            className="w-full max-w-xl rounded-md border border-transparent px-2 py-1 text-lg font-semibold text-slate-900 outline-none hover:border-slate-200 focus:border-slate-300"
            aria-label="Session title"
          />
          <span className="text-xs text-slate-500">{lessonDate}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">Solo mode</span>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-blue-700">Java focused</span>
        </div>
      </header>

      <section className="grid min-h-0 flex-1 grid-cols-[1fr_440px] gap-3 p-3">
        <div className="min-h-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <WhiteboardCanvas />
        </div>
        <div className="grid min-h-0 grid-rows-[1fr_auto] gap-3">
          <div className="min-h-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <JavaPanel sessionTitle={sessionTitle} initialCode={code} onCodeChange={setCode} />
          </div>
          <RecognitionAssistant />
        </div>
      </section>
    </main>
  );
}
