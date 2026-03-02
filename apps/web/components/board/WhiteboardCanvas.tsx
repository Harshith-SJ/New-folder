"use client";

import "tldraw/tldraw.css";
import { useEffect, useRef } from "react";
import { Tldraw, createShapeId } from "tldraw";
import { recognizeShape, type Point } from "@/lib/recognition/shapeRecognizer";

const MIN_AUTO_SNAP_CONFIDENCE = 0.58;
const SNAP_MODIFIER_KEY = "Shift";

type DrawShapeLike = {
  id: string;
  type?: string;
  x?: number;
  y?: number;
  props?: {
    isComplete?: boolean;
    segments?: Array<{
      points?: Array<{ x?: number; y?: number }>;
    }>;
  };
};

type ShapeBoundsLike = { x: number; y: number; w: number; h: number };

function extractStrokePointsFromDrawShape(drawShape: DrawShapeLike): Point[] {
  const segments = drawShape?.props?.segments;
  if (!Array.isArray(segments)) {
    return [];
  }

  const strokePoints: Point[] = [];
  for (const segment of segments) {
    if (!segment || !Array.isArray(segment.points)) {
      continue;
    }

    for (const point of segment.points) {
      if (!point || typeof point.x !== "number" || typeof point.y !== "number") {
        continue;
      }

      strokePoints.push({
        x: (drawShape?.x ?? 0) + point.x,
        y: (drawShape?.y ?? 0) + point.y
      });
    }
  }

  return strokePoints;
}

function buildSnappedShape(
  recognizedShape: ReturnType<typeof recognizeShape>,
  bounds: ShapeBoundsLike
) {
  if (recognizedShape.shape === "rectangle") {
    return {
      id: createShapeId(),
      type: "geo",
      x: bounds.x,
      y: bounds.y,
      props: {
        geo: "rectangle",
        w: Math.max(bounds.w, 8),
        h: Math.max(bounds.h, 8),
        fill: "none",
        dash: "draw"
      }
    };
  }

  if (recognizedShape.shape === "circle") {
    return {
      id: createShapeId(),
      type: "geo",
      x: bounds.x,
      y: bounds.y,
      props: {
        geo: "ellipse",
        w: Math.max(bounds.w, 8),
        h: Math.max(bounds.h, 8),
        fill: "none",
        dash: "draw"
      }
    };
  }

  if (recognizedShape.shape === "arrow") {
    return {
      id: createShapeId(),
      type: "arrow",
      x: bounds.x,
      y: bounds.y,
      props: {
        text: "",
        bend: 0,
        kind: "arc",
        start: { x: 0, y: Math.max(bounds.h, 8) / 2 },
        end: { x: Math.max(bounds.w, 8), y: Math.max(bounds.h, 8) / 2 },
        arrowheadStart: "none",
        arrowheadEnd: "arrow"
      }
    };
  }

  return null;
}

export default function WhiteboardCanvas() {
  const cleanupRef = useRef<(() => void) | null>(null);
  const isSnapModifierPressedRef = useRef(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === SNAP_MODIFIER_KEY) {
        isSnapModifierPressedRef.current = true;
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      if (event.key === SNAP_MODIFIER_KEY) {
        isSnapModifierPressedRef.current = false;
      }
    };

    const onWindowBlur = () => {
      isSnapModifierPressedRef.current = false;
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onWindowBlur);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onWindowBlur);
    };
  }, []);

  const handleMount = (editor: any) => {
    cleanupRef.current?.();

    const disposable = editor.sideEffects.registerAfterChangeHandler(
      "shape",
      (previousShape: DrawShapeLike, nextShape: DrawShapeLike, source: string) => {
        // Only react to user-generated draw strokes.
      if (source !== "user") {
        return;
      }

      if (!previousShape || !nextShape || nextShape.type !== "draw") {
        return;
      }

      // Snap only once: exactly when stroke transitions from in-progress to complete.
      const wasComplete = Boolean(previousShape?.props?.isComplete);
      const isComplete = Boolean(nextShape?.props?.isComplete);
      if (wasComplete || !isComplete) {
        return;
      }

      // Intentional mode: user must hold Shift while drawing.
      if (!isSnapModifierPressedRef.current) {
        return;
      }

      const strokePoints = extractStrokePointsFromDrawShape(nextShape);
      if (strokePoints.length < 6) {
        return;
      }

      const recognizedShape = recognizeShape(strokePoints);
      if (recognizedShape.confidence < MIN_AUTO_SNAP_CONFIDENCE || recognizedShape.shape === "freehand") {
        return;
      }

      const bounds = editor.getShapePageBounds(nextShape);
      if (!bounds) {
        return;
      }

      const snappedShape = buildSnappedShape(recognizedShape, bounds);
      if (!snappedShape) {
        return;
      }

      editor.run(() => {
        editor.deleteShapes([nextShape.id]);
        editor.createShape(snappedShape);
      });
    }
    );

    if (typeof disposable === "function") {
      cleanupRef.current = disposable;
      return;
    }

    cleanupRef.current = () => {
      disposable?.dispose?.();
    };
  };

  return (
    <div className="h-full w-full">
      <Tldraw
        persistenceKey="free-drawing-whiteboard"
        inferDarkMode={false}
        autoFocus
        onMount={handleMount}
      />
    </div>
  );
}
