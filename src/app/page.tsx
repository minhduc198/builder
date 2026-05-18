"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { Plus } from "lucide-react";
import { BuilderElement, ElementType } from "@/types";
import { Sidebar } from "../components/builder/Sidebar";
import { PropertyPanel } from "../components/builder/PropertyPanel";
import { Header } from "../components/builder/Header";
import { Canvas } from "../components/builder/Canvas";
import { createBuilderElement } from "@/lib/utils";
import { generateHTML } from "@/lib/htmlGenerator";

export default function BuilderPage() {
  const [elements, setElements] = useState<BuilderElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [resizingState, setResizingState] = useState<{
    id: string;
    direction: "both" | "horizontal";
  } | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [mode, setMode] = useState<"edit" | "preview">("edit");
  const [sidebarDragInfo, setSidebarDragInfo] = useState<{
    type: ElementType;
    iconName?: string;
    mouseX: number;
    mouseY: number;
  } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("builder-elements");
    if (saved) {
      try {
        setElements(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load elements from localStorage", e);
      }
    }
  }, []);

  const handleSave = useCallback(() => {
    localStorage.setItem("builder-elements", JSON.stringify(elements));

    // Also download JSON database backup
    const jsonString = JSON.stringify(elements, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", url);
    downloadAnchor.setAttribute("download", "builder-layout.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    URL.revokeObjectURL(url);

    alert(
      "Đã lưu trạng thái thiết kế và tự động tải tệp JSON về máy thành công!",
    );
  }, [elements]);

  const handlePublish = useCallback(() => {
    const htmlContent = generateHTML(elements);

    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", url);
    downloadAnchor.setAttribute("download", "index.html");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    URL.revokeObjectURL(url);
  }, [elements]);

  const elementsRef = useRef(elements);
  elementsRef.current = elements;

  const canvasRef = useRef<HTMLDivElement>(null);
  const justFinishedInteraction = useRef(false);
  const resizeStartRef = useRef<{
    width: number;
    height: number;
    fontSize: number;
  } | null>(null);

  const addElement = useCallback(
    (type: ElementType, x = 100, y = 100, iconName?: string) => {
      const newElement = createBuilderElement(type, x, y);
      if (iconName && newElement.content) {
        newElement.content.icon = iconName;
      }
      setElements((prev) => [...prev, newElement]);
      setSelectedId(newElement.id);
      setEditingId(null);
    },
    [],
  );

  const updateElement = useCallback(
    (id: string, updates: Partial<BuilderElement>) => {
      setElements((prev) =>
        prev.map((el) => (el.id === id ? { ...el, ...updates } : el)),
      );
    },
    [],
  );

  const deleteElement = useCallback((id: string) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
    setSelectedId(null);
  }, []);

  const handleSidebarDragStart = useCallback(
    (type: ElementType, e: React.MouseEvent, iconName?: string) => {
      setSidebarDragInfo({
        type,
        iconName,
        mouseX: e.clientX,
        mouseY: e.clientY,
      });
    },
    [],
  );

  useEffect(() => {
    if (!sidebarDragInfo) return;
    const handleMove = (e: MouseEvent) =>
      setSidebarDragInfo((prev) =>
        prev ? { ...prev, mouseX: e.clientX, mouseY: e.clientY } : null,
      );
    const handleUp = (e: MouseEvent) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect && sidebarDragInfo) {
        const scale = rect.width / 1200;
        const x = (e.clientX - rect.left) / scale;
        const y = (e.clientY - rect.top) / scale;
        if (x >= 0 && y >= 0 && x <= 1200 && y <= rect.height / scale) {
          const defaultSize =
            sidebarDragInfo.type === "image"
              ? { w: 200, h: 150 }
              : { w: 150, h: 50 };
          addElement(
            sidebarDragInfo.type,
            x - defaultSize.w / 2,
            y - defaultSize.h / 2,
            sidebarDragInfo.iconName,
          );
        }
      }
      setSidebarDragInfo(null);
    };
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
  }, [sidebarDragInfo, addElement]);

  useEffect(() => {
    if (!draggingId && !resizingState) return;

    const handleMove = (e: MouseEvent) => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const scale = rect.width / 1200;
      const x = (e.clientX - rect.left) / scale;
      const y = (e.clientY - rect.top) / scale;

      if (draggingId) {
        updateElement(draggingId, {
          position: {
            x: Math.round(x - dragOffset.x),
            y: Math.round(y - dragOffset.y),
          },
        });
      } else if (resizingState) {
        const { id, direction } = resizingState;
        const el = elementsRef.current.find((el) => el.id === id);
        if (!el) return;

        const MIN_WIDTH = el.size.minWidth ?? (el.type === "icon" ? 10 : 50);
        const MIN_HEIGHT = el.size.minHeight ?? (el.type === "icon" ? 10 : 30);
        const MAX_WIDTH = el.size.maxWidth ?? 1200;
        const MAX_HEIGHT = el.size.maxHeight ?? 1200;

        let newWidth = typeof el.size.width === "number" ? el.size.width : 150;
        let newHeight =
          typeof el.size.height === "number" ? el.size.height : 50;

        if (direction === "both" || direction === "horizontal") {
          newWidth = Math.max(
            MIN_WIDTH,
            Math.min(MAX_WIDTH, x - el.position.x),
          );
        }

        if (direction === "both") {
          newHeight = Math.max(
            MIN_HEIGHT,
            Math.min(MAX_HEIGHT, y - el.position.y),
          );
        }

        if (el.type === "icon") {
          if (direction === "both") {
            const size = Math.max(newWidth, newHeight);
            newWidth = size;
            newHeight = size;
          } else if (direction === "horizontal") {
            newHeight = newWidth;
          }
        }

        newWidth = Math.round(newWidth);
        newHeight = Math.round(newHeight);

        const isTextType = ["text", "heading", "button"].includes(el.type);

        if (isTextType && resizeStartRef.current && direction === "both") {
          const scale = newWidth / resizeStartRef.current.width;
          const newFontSize = Math.round(
            Math.max(10, resizeStartRef.current.fontSize * scale),
          );

          updateElement(id, {
            size: { ...el.size, width: newWidth, height: newHeight },
            style: { ...el.style, fontSize: `${newFontSize}px` },
          });
        } else {
          updateElement(id, {
            size: { ...el.size, width: newWidth, height: newHeight },
          });
        }
      }
    };

    const handleUp = () => {
      if (draggingId || resizingState) {
        justFinishedInteraction.current = true;
        setTimeout(() => {
          justFinishedInteraction.current = false;
        }, 0);
      }
      setDraggingId(null);
      setResizingState(null);
      resizeStartRef.current = null;
    };

    document.body.style.userSelect = "none";

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    return () => {
      document.body.style.userSelect = "";
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
  }, [draggingId, resizingState, dragOffset, updateElement]);

  // Keyboard delete
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (editingId) return;
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      )
        return;
      if ((e.key === "Delete" || e.key === "Backspace") && selectedId)
        deleteElement(selectedId);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedId, editingId, deleteElement]);

  const selectedElement = elements.find((el) => el.id === selectedId) || null;

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0c] text-slate-200 overflow-hidden font-sans selection:bg-violet-500/30">
      <Header
        mode={mode}
        setMode={(newMode) => {
          if (newMode === "preview") {
            setSelectedId(null);
            setEditingId(null);
          }
          setMode(newMode);
        }}
        onSave={handleSave}
        onPublish={handlePublish}
      />

      <div className="flex flex-1 overflow-hidden relative">
        {mode === "edit" && (
          <Sidebar
            onSidebarDragStart={handleSidebarDragStart}
            onAddElement={(type, iconName) =>
              addElement(type, 100, 100, iconName)
            }
          />
        )}

        <Canvas
          elements={elements}
          mode={mode}
          selectedId={selectedId}
          editingId={editingId}
          canvasRef={canvasRef}
          onSelect={(id) => {
            if (id === null && justFinishedInteraction.current) return;
            setSelectedId(id);
            if (id !== editingId) setEditingId(null);
          }}
          onDoubleClick={setEditingId}
          onMouseDown={(e, el) => {
            if (selectedId === el.id && editingId !== el.id) {
              const rect = canvasRef.current?.getBoundingClientRect();
              if (rect) {
                const scale = rect.width / 1200;
                setDraggingId(el.id);
                setDragOffset({
                  x: (e.clientX - rect.left) / scale - el.position.x,
                  y: (e.clientY - rect.top) / scale - el.position.y,
                });
              }
            }
          }}
          onResizeStart={(e, id, direction) => {
            const el = elements.find((el) => el.id === id);
            if (el) {
              const currentWidth =
                typeof el.size.width === "number"
                  ? el.size.width
                  : parseInt(String(el.size.width)) || 150;
              const currentHeight =
                typeof el.size.height === "number"
                  ? el.size.height
                  : parseInt(String(el.size.height)) || 50;
              const currentFontSize = parseInt(el.style.fontSize || "16") || 16;

              resizeStartRef.current = {
                width: currentWidth,
                height: currentHeight,
                fontSize: currentFontSize,
              };
            }
            setResizingState({ id, direction });
          }}
          updateContent={(id, content) => {
            const el = elements.find((e) => e.id === id);
            if (el)
              updateElement(id, { content: { ...el.content, text: content } });
          }}
          onBlur={() => setEditingId(null)}
        />

        {mode === "edit" && (
          <PropertyPanel
            selectedElement={selectedElement}
            updateElement={updateElement}
          />
        )}
      </div>

      {sidebarDragInfo && (
        <div
          className="fixed border-2 border-dashed border-violet-500 bg-violet-500/10 rounded-lg pointer-events-none z-[9999] flex items-center justify-center gap-2 backdrop-blur-sm"
          style={{
            left: sidebarDragInfo.mouseX,
            top: sidebarDragInfo.mouseY,
            width: sidebarDragInfo.type === "image" ? 200 : 150,
            height: sidebarDragInfo.type === "image" ? 150 : 50,
            transform: "translate(-50%, -50%)",
          }}
        >
          <Plus className="w-4 h-4 text-violet-400" />
          <span className="text-xs font-medium text-violet-300 uppercase">
            {sidebarDragInfo.type}
          </span>
        </div>
      )}
    </div>
  );
}
