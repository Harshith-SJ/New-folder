export type Point = { x: number; y: number };

export type ShapeKind = "rectangle" | "circle" | "arrow" | "freehand";

export type ShapeRecognitionResult = {
  shape: ShapeKind;
  confidence: number;
};

const MIN_POINTS_FOR_RECOGNITION = 3;
const MIN_POINTS_FOR_ARROW = 6;
const MIN_SHAPE_WIDTH = 8;
const MIN_SHAPE_HEIGHT = 8;
const MIN_RECTANGLE_SIZE = 10;
const MIN_ACCEPTED_CONFIDENCE = 0.6;

type Bounds = {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  width: number;
  height: number;
};

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

function euclideanDistance(firstPoint: Point, secondPoint: Point) {
  return Math.hypot(firstPoint.x - secondPoint.x, firstPoint.y - secondPoint.y);
}

function calculateBounds(points: Point[]): Bounds {
  const xValues = points.map((point) => point.x);
  const yValues = points.map((point) => point.y);
  const minX = Math.min(...xValues);
  const maxX = Math.max(...xValues);
  const minY = Math.min(...yValues);
  const maxY = Math.max(...yValues);

  return {
    minX,
    maxX,
    minY,
    maxY,
    width: maxX - minX,
    height: maxY - minY
  };
}

function average(values: number[]) {
  if (!values.length) {
    return 0;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function calculateStrokeLength(points: Point[]) {
  return points.slice(1).reduce((sum, point, index) => {
    return sum + euclideanDistance(points[index], point);
  }, 0);
}

function scoreLineLikeStroke(points: Point[]) {
  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];
  const directDistance = euclideanDistance(firstPoint, lastPoint);
  const strokeLength = calculateStrokeLength(points);

  if (!strokeLength) {
    return 0;
  }

  return clamp01(directDistance / strokeLength);
}

function scoreCircle(points: Point[]) {
  const bounds = calculateBounds(points);
  if (bounds.width < MIN_SHAPE_WIDTH || bounds.height < MIN_SHAPE_HEIGHT) {
    return 0;
  }

  const center = {
    x: bounds.minX + bounds.width / 2,
    y: bounds.minY + bounds.height / 2
  };

  const radii = points.map((point) => euclideanDistance(point, center));
  const averageRadius = average(radii);
  if (!averageRadius) {
    return 0;
  }

  const averageRadiusDeviation = average(
    radii.map((radius) => Math.abs(radius - averageRadius) / averageRadius)
  );
  const aspectRatio = Math.min(bounds.width, bounds.height) / Math.max(bounds.width, bounds.height);
  const closure = 1 - clamp01(euclideanDistance(points[0], points[points.length - 1]) / Math.max(bounds.width, bounds.height));

  return clamp01((1 - averageRadiusDeviation) * aspectRatio * closure);
}

function scoreRectangle(points: Point[]) {
  const bounds = calculateBounds(points);
  if (bounds.width < MIN_RECTANGLE_SIZE || bounds.height < MIN_RECTANGLE_SIZE) {
    return 0;
  }

  const expectedPerimeter = 2 * (bounds.width + bounds.height);
  const strokeLength = calculateStrokeLength(points);
  if (!strokeLength) {
    return 0;
  }

  const closure = 1 - clamp01(euclideanDistance(points[0], points[points.length - 1]) / Math.max(bounds.width, bounds.height));
  const perimeterMatch = 1 - clamp01(Math.abs(strokeLength - expectedPerimeter) / expectedPerimeter);

  return clamp01(closure * perimeterMatch);
}

function scoreArrow(points: Point[]) {
  if (points.length < MIN_POINTS_FOR_ARROW) {
    return 0;
  }

  // First 70% should look roughly like a straight tail.
  const tailLineScore = scoreLineLikeStroke(points.slice(0, Math.floor(points.length * 0.7)));

  // Final section should create an angle spread (arrow head signal).
  const lastPoint = points[points.length - 1];
  const nearLastPoint = points[Math.floor(points.length * 0.85)];
  const beforeNearLastPoint = points[Math.floor(points.length * 0.75)];

  const angleToNearLast = Math.atan2(lastPoint.y - nearLastPoint.y, lastPoint.x - nearLastPoint.x);
  const angleToBeforeNearLast = Math.atan2(lastPoint.y - beforeNearLastPoint.y, lastPoint.x - beforeNearLastPoint.x);
  const angleSpread = Math.abs(angleToNearLast - angleToBeforeNearLast);
  const arrowHeadSignal = clamp01(angleSpread / 1.2);

  return clamp01(tailLineScore * arrowHeadSignal);
}

export function recognizeShape(strokePoints: Point[]): ShapeRecognitionResult {
  if (strokePoints.length < MIN_POINTS_FOR_RECOGNITION) {
    return { shape: "freehand", confidence: 0 };
  }

  const circleScore = scoreCircle(strokePoints);
  const rectangleScore = scoreRectangle(strokePoints);
  const arrowScore = scoreArrow(strokePoints);

  const candidates: Array<ShapeRecognitionResult> = [
    { shape: "circle", confidence: circleScore },
    { shape: "rectangle", confidence: rectangleScore },
    { shape: "arrow", confidence: arrowScore }
  ];

  const best = candidates.sort((a, b) => b.confidence - a.confidence)[0];
  if (!best || best.confidence < MIN_ACCEPTED_CONFIDENCE) {
    return { shape: "freehand", confidence: best?.confidence ?? 0 };
  }

  return best;
}
