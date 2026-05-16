"use client";

import React from "react";
import { Plus } from "lucide-react";
import { BuilderElement } from "@/types";
import { CanvasElement } from "./CanvasElement";

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

  return (
    <div
      ref={canvasRef}
      onClick={() => {
        if (isEditMode) {
          onSelect(null);
          onBlur();
        }
      }}
      className="flex-1 relative overflow-auto bg-slate-950"
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

        {elements.length === 0 && isEditMode && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600 pointer-events-none">
            <Plus className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-lg font-medium opacity-40">
              Drag elements here to build your page
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
