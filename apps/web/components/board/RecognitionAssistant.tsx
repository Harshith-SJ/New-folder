"use client";

import { useMemo, useRef, useState } from "react";
import { analyzeHandwriting } from "@/lib/recognition/handwriting";
import { recognizeShape, type Point } from "@/lib/recognition/shapeRecognizer";

function formatConfidence(value: number) {
  return `${Math.round(value * 100)}%`;
}

export default function RecognitionAssistant() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [points, setPoints] = useState<Point[]>([]);
  const [drawing, setDrawing] = useState(false);

  const shape = useMemo(() => recognizeShape(points), [points]);
  const handwriting = useMemo(() => analyzeHandwriting(points), [points]);

  const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const point = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    setPoints([point]);
    setDrawing(true);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const point = { x: event.clientX - rect.left, y: event.clientY - rect.top };

    setPoints((previous) => {
      const next = [...previous, point];
      const canvas = canvasRef.current;
      const context = canvas?.getContext("2d");
      if (context && next.length >= 2) {
        const prev = next[next.length - 2];
        context.lineWidth = 2;
        context.strokeStyle = "#0f172a";
        context.lineCap = "round";
        context.beginPath();
        context.moveTo(prev.x, prev.y);
        context.lineTo(point.x, point.y);
        context.stroke();
      }
      return next;
    });
  };

  const handlePointerUp = () => {
    setDrawing(false);
  };

  const clearCanvas = () => {
    setPoints([]);
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (canvas && context) {
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
      <div className="flex items-center justify-between">
        <h3 className="m-0 text-xs font-semibold text-slate-700">Recognition Assistant</h3>
        <button
          type="button"
          onClick={clearCanvas}
          className="rounded bg-white px-2 py-1 text-xs text-slate-700"
        >
          Clear
        </button>
      </div>

      <canvas
        ref={canvasRef}
        width={380}
        height={130}
        className="w-full rounded-md border border-slate-200 bg-white"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      />

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-md bg-white p-2">
          <div className="font-medium text-slate-600">Shape</div>
          <div className="text-slate-900">{shape.shape}</div>
          <div className="text-slate-500">{formatConfidence(shape.confidence)}</div>
        </div>
        <div className="rounded-md bg-white p-2">
          <div className="font-medium text-slate-600">Handwriting</div>
          <div className="text-slate-900">{handwriting.mode}</div>
          <div className="text-slate-500">{formatConfidence(handwriting.confidence)}</div>
        </div>
      </div>

      <p className="m-0 rounded-md bg-white p-2 text-xs text-slate-600">{handwriting.suggestion}</p>
    </div>
  );
}
