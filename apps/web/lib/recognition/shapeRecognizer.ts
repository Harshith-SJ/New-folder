export type Point = { x: number; y: number };

export type ShapeKind = "line" | "rectangle" | "circle" | "arrow" | "freehand";

export type ShapeRecognitionResult = {
  shape: ShapeKind;
  confidence: number;
};

function distance(a: Point, b: Point) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function getBounds(points: Point[]) {
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  return { minX, maxX, minY, maxY, width: maxX - minX, height: maxY - minY };
}

function mean(values: number[]) {
  if (!values.length) {
    return 0;
  }
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function detectLine(points: Point[]) {
  const start = points[0];
  const end = points[points.length - 1];
  const chord = distance(start, end);
  const pathLength = points.slice(1).reduce((sum, p, idx) => sum + distance(points[idx], p), 0);
  if (!pathLength) {
    return 0;
  }
  return Math.min(1, chord / pathLength);
}

function detectCircle(points: Point[]) {
  const bounds = getBounds(points);
  if (bounds.width < 8 || bounds.height < 8) {
    return 0;
  }

  const center = {
    x: bounds.minX + bounds.width / 2,
    y: bounds.minY + bounds.height / 2
  };

  const radii = points.map((p) => distance(p, center));
  const avgRadius = mean(radii);
  if (!avgRadius) {
    return 0;
  }

  const avgDeviation = mean(radii.map((r) => Math.abs(r - avgRadius) / avgRadius));
  const aspect = Math.min(bounds.width, bounds.height) / Math.max(bounds.width, bounds.height);
  const closure = 1 - Math.min(1, distance(points[0], points[points.length - 1]) / Math.max(bounds.width, bounds.height));
  return Math.max(0, Math.min(1, (1 - avgDeviation) * aspect * closure));
}

function detectRectangle(points: Point[]) {
  const bounds = getBounds(points);
  if (bounds.width < 10 || bounds.height < 10) {
    return 0;
  }

  const perimeter = 2 * (bounds.width + bounds.height);
  const pathLength = points.slice(1).reduce((sum, p, idx) => sum + distance(points[idx], p), 0);
  if (!pathLength) {
    return 0;
  }

  const closure = 1 - Math.min(1, distance(points[0], points[points.length - 1]) / Math.max(bounds.width, bounds.height));
  const lengthFit = 1 - Math.min(1, Math.abs(pathLength - perimeter) / perimeter);
  return Math.max(0, Math.min(1, closure * lengthFit));
}

function detectArrow(points: Point[]) {
  if (points.length < 6) {
    return 0;
  }

  const tailToHead = detectLine(points.slice(0, Math.floor(points.length * 0.7)));
  const end = points[points.length - 1];
  const prev = points[Math.floor(points.length * 0.85)];
  const prePrev = points[Math.floor(points.length * 0.75)];
  const angleA = Math.atan2(end.y - prev.y, end.x - prev.x);
  const angleB = Math.atan2(end.y - prePrev.y, end.x - prePrev.x);
  const spread = Math.abs(angleA - angleB);
  const arrowHeadSignal = Math.min(1, spread / 1.2);

  return Math.max(0, Math.min(1, tailToHead * arrowHeadSignal));
}

export function recognizeShape(points: Point[]): ShapeRecognitionResult {
  if (points.length < 3) {
    return { shape: "freehand", confidence: 0 };
  }

  const line = detectLine(points);
  const circle = detectCircle(points);
  const rectangle = detectRectangle(points);
  const arrow = detectArrow(points);

  const candidates: Array<ShapeRecognitionResult> = [
    { shape: "line", confidence: line },
    { shape: "circle", confidence: circle },
    { shape: "rectangle", confidence: rectangle },
    { shape: "arrow", confidence: arrow }
  ];

  const best = candidates.sort((a, b) => b.confidence - a.confidence)[0];
  if (!best || best.confidence < 0.6) {
    return { shape: "freehand", confidence: best?.confidence ?? 0 };
  }
  return best;
}
