"use client";

import React from "react";
import { Play, Edit3, Save, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  mode: "edit" | "preview";
  setMode: (mode: "edit" | "preview") => void;
  onSave?: () => void;
  onPublish?: () => void;
}

export const Header = ({ mode, setMode, onSave, onPublish }: HeaderProps) => {
  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 shrink-0 z-20">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
            <span className="font-bold text-white text-lg">Đ</span>
          </div>
          <h1 className="text-lg font-bold text-slate-100 hidden md:block">
            My Builder
          </h1>
        </div>
        <div className="h-6 w-[1px] bg-slate-800" />
        <div className="flex bg-slate-800 p-1 rounded-lg">
          <button
            onClick={() => setMode("edit")}
            className={cn(
              "flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all",
              mode === "edit"
                ? "bg-slate-700 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200",
            )}
          >
            <Edit3 className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={() => setMode("preview")}
            className={cn(
              "flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all",
              mode === "preview"
                ? "bg-slate-700 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200",
            )}
          >
            <Eye className="w-4 h-4" />
            Preview
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onSave}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm font-medium transition-colors border border-slate-700"
        >
          <Save className="w-4 h-4" />
          Save
        </button>
        <button
          onClick={onPublish}
          className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-sm font-medium transition-all shadow-lg shadow-violet-500/20 active:scale-95"
        >
          <Play className="w-4 h-4" />
          Publish
        </button>
      </div>
    </header>
  );
};
