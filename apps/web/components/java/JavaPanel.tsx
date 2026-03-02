"use client";

import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import Editor from "@monaco-editor/react";
import { saveSession } from "@/lib/storage/sessionStore";

const starterTemplate = `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello Java Whiteboard");
    }
}`;

type RunResult = {
  stdout?: string;
  stderr?: string;
  compileError?: string;
  runtimeError?: string;
  timedOut?: boolean;
};

type JavaPanelProps = {
  initialCode?: string;
  sessionTitle: string;
  onCodeChange?: (value: string) => void;
};

export default function JavaPanel({
  initialCode = starterTemplate,
  sessionTitle,
  onCodeChange
}: JavaPanelProps) {
  const [code, setCode] = useState(initialCode);
  const [stdin, setStdin] = useState("");
  const [output, setOutput] = useState("Ready. Run Java code to see output.");
  const [isRunning, setIsRunning] = useState(false);

  const runButtonLabel = useMemo(() => (isRunning ? "Running..." : "Run Java"), [isRunning]);

  useEffect(() => {
    saveSession({
      title: sessionTitle,
      code,
      updatedAt: new Date().toISOString()
    });
  }, [code, sessionTitle]);

  useEffect(() => {
    onCodeChange?.(code);
  }, [code, onCodeChange]);

  const handleRun = async () => {
    setIsRunning(true);
    try {
      const response = await fetch("/api/run-java", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ code, stdin })
      });

      const result = (await response.json()) as RunResult;

      const merged = [
        result.compileError ? `Compile Error:\n${result.compileError}` : "",
        result.runtimeError ? `Runtime Error:\n${result.runtimeError}` : "",
        result.stderr ? `STDERR:\n${result.stderr}` : "",
        result.stdout ? `STDOUT:\n${result.stdout}` : "",
        result.timedOut ? "Execution timed out." : ""
      ]
        .filter(Boolean)
        .join("\n\n");

      setOutput(merged || "No output");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      setOutput(`Request failed: ${message}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <h2 className="m-0 text-sm font-semibold text-slate-800">Java Code Lab</h2>
        <button
          type="button"
          onClick={handleRun}
          disabled={isRunning}
          className="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {runButtonLabel}
        </button>
      </div>

      <div className="grid min-h-0 flex-1 grid-rows-[1fr_100px_160px]">
        <Editor
          height="100%"
          defaultLanguage="java"
          value={code}
          onChange={(value: string | undefined) => setCode(value ?? "")}
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            automaticLayout: true,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            wordWrap: "on"
          }}
        />

        <label className="flex min-h-0 flex-col border-y border-slate-200 px-4 py-2">
          <span className="mb-1 text-xs font-medium text-slate-600">STDIN</span>
          <textarea
            value={stdin}
            onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setStdin(event.target.value)}
            placeholder="Input for Scanner/System.in"
            className="h-full resize-none rounded-md border border-slate-200 px-2 py-1 text-xs text-slate-800 outline-none focus:border-slate-400"
          />
        </label>

        <div className="min-h-0 px-4 py-2">
          <div className="mb-1 text-xs font-medium text-slate-600">Output</div>
          <pre className="m-0 h-[126px] overflow-auto rounded-md bg-slate-950 p-3 text-xs text-slate-100">{output}</pre>
        </div>
      </div>
    </div>
  );
}
