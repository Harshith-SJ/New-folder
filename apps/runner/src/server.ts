import cors from "cors";
import express from "express";
import { randomUUID } from "node:crypto";
import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { z } from "zod";

const execFileAsync = promisify(execFile);
const app = express();
const port = Number(process.env.PORT ?? 4001);

const runJavaSchema = z.object({
  code: z.string().min(1),
  stdin: z.string().optional().default("")
});

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_request, response) => {
  response.json({ ok: true, service: "java-runner" });
});

app.post("/run-java", async (request, response) => {
  const parsed = runJavaSchema.safeParse(request.body);
  if (!parsed.success) {
    response.status(400).json({ runtimeError: "Invalid request payload" });
    return;
  }

  const { code, stdin } = parsed.data;
  const sessionId = randomUUID().slice(0, 8);
  const workDir = await mkdtemp(join(tmpdir(), `java-run-${sessionId}-`));
  const sourceFile = join(workDir, "Main.java");

  try {
    await writeFile(sourceFile, code, "utf8");

    try {
      await execFileAsync("javac", ["Main.java"], {
        cwd: workDir,
        timeout: 6000,
        maxBuffer: 1024 * 1024
      });
    } catch (error) {
      const compileError = error instanceof Error ? error.message : "Compilation failed";
      response.status(200).json({ compileError });
      return;
    }

    const stdinPath = join(workDir, "stdin.txt");
    await writeFile(stdinPath, stdin, "utf8");

    let stdout = "";
    let stderr = "";
    let timedOut = false;

    try {
      const result = await execFileAsync(
        "java",
        ["-Xmx128m", "-Dfile.encoding=UTF-8", "Main"],
        {
          cwd: workDir,
          timeout: 6000,
          maxBuffer: 1024 * 1024,
          windowsHide: true
        }
      );
      stdout = result.stdout;
      stderr = result.stderr;
    } catch (error) {
      if (typeof error === "object" && error && "killed" in error) {
        timedOut = true;
      }

      const runtimeError = error instanceof Error ? error.message : "Execution failed";
      const fallbackStdout = await readFile(stdinPath, "utf8").catch(() => "");

      response.status(200).json({
        runtimeError,
        stdout: fallbackStdout ? `Provided stdin:\n${fallbackStdout}` : "",
        timedOut
      });
      return;
    }

    response.status(200).json({ stdout, stderr, timedOut });
  } catch (error) {
    response.status(500).json({
      runtimeError: error instanceof Error ? error.message : "Unknown runner error"
    });
  } finally {
    await rm(workDir, { recursive: true, force: true });
  }
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Java runner listening on http://localhost:${port}`);
});
