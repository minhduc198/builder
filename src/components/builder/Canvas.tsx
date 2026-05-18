"use client";

import React, { useEffect, useState } from "react";
import { BuilderElement } from "@/types";
import { CanvasElement } from "./CanvasElement";
import { cn } from "@/lib/utils";

interface CanvasProps {
  elements: BuilderElement[];
  mode: "edit" | "preview";
  selectedId: string | null;
  editingId: string | null;
  canvasRef: React.RefObject<HTMLDivElement | null>;
  onSelect: (id: string | null) => void;
  onDoubleClick: (id: string) => void;
  onMouseDown: (e: React.MouseEvent, el: BuilderElement) => void;
  onResizeStart: (
    e: React.MouseEvent,
    id: string,
    direction: "both" | "horizontal",
  ) => void;
  updateContent: (id: string, content: string) => void;
  onBlur: () => void;
}

export const Canvas = ({
  elements,
  mode,
  selectedId,
  editingId,
  canvasRef,
  onSelect,
  onDoubleClick,
  onMouseDown,
  onResizeStart,
  updateContent,
  onBlur,
}: CanvasProps) => {
  const isEditMode = mode === "edit";
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const parent = canvas.parentElement;
    if (!parent) return;

    const updateScale = () => {
      const parentWidth = parent.clientWidth;
      const parentHeight = parent.clientHeight;
      const padding = isEditMode ? 48 : 0;
      const scaleX = (parentWidth - padding) / 1200;
      const scaleY = (parentHeight - padding) / 800;
      const newScale = Math.min(1, scaleX, scaleY);
      setScale(newScale);
    };

    const resizeObserver = new ResizeObserver(updateScale);
    resizeObserver.observe(parent);

    updateScale();

    return () => resizeObserver.disconnect();
  }, [isEditMode, canvasRef]);

  return (
    <div
      onClick={() => {
        if (isEditMode) {
          onSelect(null);
          onBlur();
        }
      }}
      className="flex-1 relative overflow-hidden bg-slate-950 flex justify-center items-center p-6 select-none"
    >
      <div
        ref={canvasRef}
        className={cn(
          "w-[1200px] min-h-[800px] relative transition-all duration-300 shrink-0 origin-center bg-[#020617] rounded-xl overflow-hidden",
          isEditMode
            ? "outline outline-1 outline-slate-800 shadow-[0_24px_50px_-12px_rgba(0,0,0,0.7)]"
            : "shadow-none",
        )}
        style={{
          transform: `scale(${scale})`,
        }}
      >
        {isEditMode && (
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        )}

        <div className="min-h-full min-w-full relative">
          {elements.map((el) => (
            <CanvasElement
              key={el.id}
              el={el}
              mode={mode}
              selectedId={selectedId}
              editingId={editingId}
              onSelect={onSelect}
              onDoubleClick={onDoubleClick}
              onMouseDown={onMouseDown}
              onResizeStart={onResizeStart}
              updateContent={updateContent}
              onBlur={onBlur}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
