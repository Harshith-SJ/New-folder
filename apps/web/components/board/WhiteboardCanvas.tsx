"use client";

import "tldraw/tldraw.css";
import { Tldraw } from "tldraw";

export default function WhiteboardCanvas() {
  return (
    <div className="h-full w-full">
      <Tldraw
        persistenceKey="java-teaching-whiteboard"
        inferDarkMode={false}
        autoFocus
      />
    </div>
  );
}
