"use client";

import React from "react";
import {
  Type,
  Heading,
  Square,
  Image as ImageIcon,
  MousePointer2,
  Layers,
} from "lucide-react";
import { ElementType } from "@/types";

interface SidebarProps {
  onSidebarDragStart: (type: ElementType, e: React.MouseEvent) => void;
  onAddElement: (type: ElementType) => void;
}

export const Sidebar = ({ onSidebarDragStart, onAddElement }: SidebarProps) => {
  const elements: { type: ElementType; icon: any; label: string }[] = [
    { type: "text", icon: Type, label: "Text" },
    { type: "heading", icon: Heading, label: "Heading" },
    { type: "button", icon: Square, label: "Button" },
    { type: "image", icon: ImageIcon, label: "Image" },
    { type: "icon", icon: MousePointer2, label: "Icon" },
  ];

  return (
    <div className="w-64 bg-slate-900/50 backdrop-blur-xl border-r border-slate-800 p-4 flex flex-col gap-4 shrink-0 overflow-y-auto">
      <div className="flex items-center gap-2 mb-4">
        <Layers className="w-5 h-5 text-violet-400" />
        <h2 className="text-lg font-semibold text-slate-100">Elements</h2>
      </div>
      <div className="flex flex-col gap-3">
        {elements.map((el) => (
          <button
            key={el.type}
            onClick={() => onAddElement(el.type)}
            onMouseDown={(e) => {
              e.preventDefault();
              onSidebarDragStart(el.type, e);
            }}
            className="flex gap-3 items-center p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-violet-500/50 hover:bg-violet-500/10 transition-all group cursor-grab active:cursor-grabbing select-none"
          >
            <div className="p-2 rounded-lg bg-slate-800 group-hover:bg-violet-500/20 transition-colors">
              <el.icon className="w-4 h-4 text-slate-400 group-hover:text-violet-400 transition-colors" />
            </div>
            <span className="text-sm font-medium text-slate-400 group-hover:text-slate-200">
              {el.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
