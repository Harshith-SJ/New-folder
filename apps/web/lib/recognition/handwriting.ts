import type { Point } from "./shapeRecognizer";

export type HandwritingMode = "ink" | "text" | "hybrid";

export type HandwritingResult = {
  mode: HandwritingMode;
  suggestion: string;
  confidence: number;
};

function normalizeStrokeDensity(points: Point[]) {
  if (points.length < 2) {
    return 0;
  }

  let length = 0;
  for (let i = 1; i < points.length; i += 1) {
    const dx = points[i].x - points[i - 1].x;
    const dy = points[i].y - points[i - 1].y;
    length += Math.hypot(dx, dy);
  }
  return points.length / Math.max(1, length);
}

export function analyzeHandwriting(points: Point[]): HandwritingResult {
  if (points.length < 5) {
    return {
      mode: "ink",
      suggestion: "Keep writing to analyze handwriting.",
      confidence: 0.2
    };
  }

  const density = normalizeStrokeDensity(points);

  if (density > 0.35) {
    return {
      mode: "text",
      suggestion: "Detected compact stroke pattern. Convert to text for headings.",
      confidence: 0.74
    };
  }

  if (density > 0.2) {
    return {
      mode: "hybrid",
      suggestion: "Mixed pattern detected. Use hybrid mode (ink + text).",
      confidence: 0.66
    };
  }

  return {
    mode: "ink",
    suggestion: "Likely diagram-style writing. Keep as ink.",
    confidence: 0.7
  };
}
