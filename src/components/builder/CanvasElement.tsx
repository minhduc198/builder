"use client";

import React, { useRef, useEffect, useCallback, CSSProperties } from "react";
import { Move } from "lucide-react";
import { BuilderElement } from "@/types";
import { cn } from "@/lib/utils";
import { AVAILABLE_ICONS } from "@/constants";

interface CanvasElementProps {
  el: BuilderElement;
  mode: "edit" | "preview";
  selectedId: string | null;
  editingId: string | null;
  onSelect: (id: string) => void;
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

function getElementStyle(
  el: BuilderElement,
  isEditMode: boolean,
  isSelected: boolean,
  isEditing: boolean,
): CSSProperties {
  const isTextType = ["text", "heading", "button"].includes(el.type);

  return {
    position: "absolute",
    left: el.position.x,
    top: el.position.y,
    width: el.size.width,
    height: isTextType ? "auto" : el.size.height,
    ...(isTextType && typeof el.size.height === "number"
      ? { minHeight: el.size.height }
      : {}),
    display: "flex",
    alignItems: isTextType && el.type !== "button" ? "start" : "center",
    justifyContent: "center",
    ...el.style,
    cursor: !isEditMode
      ? el.type === "button"
        ? "pointer"
        : "default"
      : isEditing
        ? "text"
        : isSelected
          ? "move"
          : "pointer",
    zIndex: isSelected ? 10 : 1,
  };
}

export const CanvasElement = ({
  el,
  mode,
  selectedId,
  editingId,
  onSelect,
  onDoubleClick,
  onMouseDown,
  onResizeStart,
  updateContent,
  onBlur,
}: CanvasElementProps) => {
  const isSelected = selectedId === el.id;
  const isEditing = editingId === el.id;
  const isEditMode = mode === "edit";

  const contentRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isEditing) return;

    if ((el.type === "text" || el.type === "heading" || el.type === "button") && contentRef.current) {
      const node = contentRef.current;
      node.innerHTML = el.content?.text || "";
      node.focus();
      const range = document.createRange();
      range.selectNodeContents(node);
      range.collapse(false);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  }, [isEditing, el.type]);

  const handleContentBlur = useCallback(
    (e: React.FocusEvent<HTMLElement>) => {
      updateContent(el.id, e.currentTarget.innerHTML || "");
      onBlur();
    },
    [el.id, updateContent, onBlur],
  );

  const isTextType = el.type === "text" || el.type === "heading" || el.type === "button";

  const renderTextContent = () => {
    const Tag = (el.content?.tag || "p") as keyof React.JSX.IntrinsicElements;
    const commonStyle: CSSProperties = {
      textAlign: el.style.textAlign,
      letterSpacing: "inherit",
      lineHeight: "inherit",
      fontStyle: "inherit",
      textDecoration: "inherit",
      whiteSpace: "pre-wrap",
      wordBreak: "break-word",
      minHeight: "1em",
    };

    if (isEditing) {
      return React.createElement(Tag, {
        key: `editing-${el.id}`,
        id: `input-${el.id}`,
        ref: contentRef,
        className: cn(
          "w-full text-inherit break-words outline-none",
          el.type === "button" ? "px-4 py-2" : "p-1"
        ),
        style: commonStyle,
        contentEditable: true,
        suppressContentEditableWarning: true,
        onBlur: handleContentBlur,
        onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => {
          e.stopPropagation();
        },
      });
    }

    return React.createElement(Tag, {
      key: `view-${el.id}`,
      id: `input-${el.id}`,
      className: cn(
        "w-full text-inherit break-words outline-none pointer-events-none",
        el.type === "button" ? "px-4 py-2" : "p-1"
      ),
      style: commonStyle,
      dangerouslySetInnerHTML: { __html: el.content?.text || "" },
    });
  };

  return (
    <div
      key={el.id}
      onClick={(e) => {
        if (!isEditMode) return;
        e.stopPropagation();
        onSelect(el.id);
      }}
      onDoubleClick={(e) => {
        if (!isEditMode) return;
        e.stopPropagation();
        onDoubleClick(el.id);
      }}
      onMouseDown={(e) => isEditMode && onMouseDown(e, el)}
      style={getElementStyle(el, isEditMode, isSelected, isEditing)}
      className={cn(
        "group transition-shadow duration-200",
        isEditMode &&
          isSelected &&
          "ring-2 ring-offset-2 ring-offset-slate-950 ring-violet-500 shadow-[0_0_20px_rgba(139,92,246,0.3)]",
        isEditMode &&
          !isSelected &&
          "hover:ring-1 hover:ring-offset-2 hover:ring-offset-slate-950 hover:ring-slate-700",
      )}
    >
      <div className="w-full h-full overflow-hidden flex items-center justify-center relative rounded-[inherit]">
        {isTextType && renderTextContent()}
        {el.type === "image" && (
          <img
            src={el.content?.src || ""}
            alt="builder"
            className="w-full h-full object-cover pointer-events-none"
            style={{ borderRadius: el.style.borderRadius }}
          />
        )}
        {el.type === "icon" && (() => {
          const IconComponent = AVAILABLE_ICONS[el.content?.icon || "MousePointer2"] || AVAILABLE_ICONS["MousePointer2"];
          const iconSize = typeof el.size.width === "number" ? el.size.width : parseInt(String(el.size.width)) || 32;
          return (
            <IconComponent
              size={iconSize}
              style={{ color: el.style.color }}
            />
          );
        })()}
      </div>

      {isEditMode && isSelected && (
        <>
          <div className="absolute -top-3 -left-3 bg-violet-500 p-1 rounded-full shadow-lg z-20">
            <Move className="w-3 h-3 text-white" />
          </div>

          <div
            className="absolute top-1/2 -right-1 w-2 h-full -translate-y-1/2  cursor-ew-resize  z-20"
            onMouseDown={(e) => {
              e.stopPropagation();
              onResizeStart(e, el.id, "horizontal");
            }}
          />

          <div
            className="absolute -bottom-1 -right-1 w-4 h-4 bg-violet-500 rounded-sm cursor-nwse-resize shadow-lg flex items-center justify-center z-20"
            onMouseDown={(e) => {
              e.stopPropagation();
              onResizeStart(e, el.id, "both");
            }}
          >
            <div className="w-1.5 h-1.5 border-r border-b border-white opacity-50" />
          </div>
        </>
      )}
    </div>
  );
};
