"use client";

import React from "react";
import { Settings2, AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import { BuilderElement } from "@/types";
import { cn } from "@/lib/utils";
import {
  HEADING_TAGS,
  FONT_WEIGHTS,
  FONT_FAMILIES,
  FONT_STYLES,
  TEXT_DECORATIONS,
  AVAILABLE_ICONS,
  SELECT_CLASS,
  SELECT_STYLE,
} from "@/constants";

interface PropertyPanelProps {
  selectedElement: BuilderElement | null;
  updateElement: (id: string, updates: Partial<BuilderElement>) => void;
}

export const PropertyPanel = ({
  selectedElement,
  updateElement,
}: PropertyPanelProps) => {
  if (!selectedElement) {
    return (
      <div className="w-72 bg-slate-900/50 backdrop-blur-xl border-l border-slate-800 p-6 flex flex-col items-center justify-center text-slate-500 shrink-0">
        <Settings2 className="w-8 h-8 mb-4 opacity-20" />
        <p className="text-sm text-center">
          Select an element to edit its properties
        </p>
      </div>
    );
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    updateElement(selectedElement.id, {
      style: { ...selectedElement.style, [name]: value },
    });
  };

  const handleStyleChange = (property: string, value: string) => {
    updateElement(selectedElement.id, {
      style: { ...selectedElement.style, [property]: value },
    });
  };

  return (
    <div className="w-72 bg-slate-900/50 backdrop-blur-xl border-l border-slate-800 p-3 flex flex-col gap-6 overflow-y-auto shrink-0">
      <div className="flex items-center gap-2">
        <Settings2 className="w-5 h-5 text-violet-400" />
        <h2 className="text-lg font-semibold text-slate-100">Properties</h2>
      </div>

      <div className="space-y-4">
        {["text", "heading"].includes(selectedElement.type) && (
          <div className="space-y-4 border-b border-slate-800 pb-4">
            {selectedElement.type === "heading" && (
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-400 tracking-wider">
                  HTML Tag
                </label>
                <select
                  value={selectedElement.content?.tag || "h1"}
                  onChange={(e) => {
                    const newTag = e.target.value;
                    const tagConfig = HEADING_TAGS.find(
                      (t) => t.value === newTag,
                    );

                    updateElement(selectedElement.id, {
                      content: { ...selectedElement.content, tag: newTag },
                      style: tagConfig
                        ? {
                            ...selectedElement.style,
                            fontSize: `${tagConfig.defaultSize}px`,
                          }
                        : selectedElement.style,
                    });
                  }}
                  className={SELECT_CLASS}
                  style={SELECT_STYLE}
                >
                  {HEADING_TAGS.map((tag) => (
                    <option key={tag.value} value={tag.value}>
                      {tag.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-400 tracking-wider">
                  Weight
                </label>
                <select
                  value={selectedElement.style.fontWeight || "normal"}
                  onChange={(e) =>
                    handleStyleChange("fontWeight", e.target.value)
                  }
                  className={SELECT_CLASS}
                  style={SELECT_STYLE}
                >
                  {FONT_WEIGHTS.map((weight) => (
                    <option key={weight.value} value={weight.value}>
                      {weight.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-400 tracking-wider">
                  Family
                </label>
                <select
                  value={selectedElement.style.fontFamily || "sans-serif"}
                  onChange={(e) =>
                    handleStyleChange("fontFamily", e.target.value)
                  }
                  className={SELECT_CLASS}
                  style={SELECT_STYLE}
                >
                  {FONT_FAMILIES.map((family) => (
                    <option key={family.value} value={family.value}>
                      {family.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-400 tracking-wider">
                  Style
                </label>
                <select
                  value={selectedElement.style.fontStyle || "normal"}
                  onChange={(e) =>
                    handleStyleChange("fontStyle", e.target.value)
                  }
                  className={SELECT_CLASS}
                  style={SELECT_STYLE}
                >
                  {FONT_STYLES.map((style) => (
                    <option key={style.value} value={style.value}>
                      {style.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-400 tracking-wider">
                  Decoration
                </label>
                <select
                  value={selectedElement.style.textDecoration || "none"}
                  onChange={(e) =>
                    handleStyleChange("textDecoration", e.target.value)
                  }
                  className={SELECT_CLASS}
                  style={SELECT_STYLE}
                >
                  {TEXT_DECORATIONS.map((dec) => (
                    <option key={dec.value} value={dec.value}>
                      {dec.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-400 tracking-wider">
                  Tracking
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={
                    Number.isNaN(
                      parseFloat(selectedElement.style.letterSpacing || ""),
                    )
                      ? ""
                      : parseFloat(selectedElement.style.letterSpacing || "")
                  }
                  onChange={(e) =>
                    handleStyleChange(
                      "letterSpacing",
                      e.target.value ? `${e.target.value}px` : "",
                    )
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-400 tracking-wider">
                  Line Height
                </label>
                <input
                  type="text"
                  placeholder="normal"
                  value={selectedElement.style.lineHeight || ""}
                  onChange={(e) =>
                    handleStyleChange("lineHeight", e.target.value)
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>
            </div>
          </div>
        )}

        {["text", "heading"].includes(selectedElement.type) && (
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-400 tracking-wider">
              Alignment
            </label>
            <div className="flex bg-slate-800 rounded-lg p-1 gap-1">
              {[
                { id: "left", icon: AlignLeft },
                { id: "center", icon: AlignCenter },
                { id: "right", icon: AlignRight },
              ].map((align) => (
                <button
                  key={align.id}
                  onClick={() =>
                    updateElement(selectedElement.id, {
                      style: {
                        ...selectedElement.style,
                        textAlign: align.id as any,
                      },
                    })
                  }
                  className={cn(
                    "flex-1 flex items-center justify-center py-1.5 rounded-md transition-colors",
                    selectedElement.style.textAlign === align.id
                      ? "bg-violet-500 text-white"
                      : "text-slate-400 hover:bg-slate-700 hover:text-slate-200",
                  )}
                >
                  <align.icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedElement.type !== "icon" ? (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-400 tracking-wider">
                Width
              </label>
              <input
                type="text"
                name="width"
                value={
                  typeof selectedElement.size.width === "number"
                    ? Math.round(selectedElement.size.width).toString()
                    : selectedElement.size.width?.toString() || ""
                }
                onChange={(e) => {
                  const raw = e.target.value;
                  let val: string | number = raw;
                  if (/^\d+$/.test(raw)) val = parseInt(raw);
                  updateElement(selectedElement.id, {
                    size: {
                      ...selectedElement.size,
                      width: val,
                    },
                  });
                }}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-400 tracking-wider">
                Height
              </label>
              <input
                type="text"
                name="height"
                value={
                  typeof selectedElement.size.height === "number"
                    ? Math.round(selectedElement.size.height).toString()
                    : selectedElement.size.height?.toString() || ""
                }
                onChange={(e) => {
                  const raw = e.target.value;
                  let val: string | number = raw;
                  if (/^\d+$/.test(raw)) val = parseInt(raw);
                  updateElement(selectedElement.id, {
                    size: {
                      ...selectedElement.size,
                      height: val,
                    },
                  });
                }}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-400 tracking-wider">
              Size
            </label>
            <input
              type="number"
              name="size"
              value={
                typeof selectedElement.size.width === "number"
                  ? selectedElement.size.width
                  : ""
              }
              onChange={(e) => {
                let val = parseInt(e.target.value);
                if (isNaN(val)) val = 0;
                val = Math.max(0, val);
                updateElement(selectedElement.id, {
                  size: {
                    ...selectedElement.size,
                    width: val,
                    height: val,
                  },
                });
              }}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500 transition-colors"
            />
          </div>
        )}
        {selectedElement.type === "image" && (
          <div>
            <label className="text-xs font-medium text-slate-400 tracking-wider">
              Content
            </label>
            <input
              type="string"
              placeholder="Enter your url image"
              value={selectedElement.content?.src || ""}
              onChange={(e) =>
                updateElement(selectedElement.id, {
                  content: {
                    ...selectedElement.content,
                    src: e.target.value || "",
                  },
                })
              }
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500 transition-colors"
            />
          </div>
        )}

        {selectedElement.type === "icon" && (
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-400 tracking-wider">
              Icon
            </label>
            <div className="grid grid-cols-5 gap-2">
              {Object.keys(AVAILABLE_ICONS).map((iconName) => {
                const IconComp = AVAILABLE_ICONS[iconName];
                return (
                  <button
                    key={iconName}
                    onClick={() =>
                      updateElement(selectedElement.id, {
                        content: {
                          ...selectedElement.content,
                          icon: iconName,
                        },
                      })
                    }
                    className={cn(
                      "flex justify-center items-center p-2 rounded-lg transition-colors border",
                      selectedElement.content?.icon === iconName ||
                        (!selectedElement.content?.icon &&
                          iconName === "MousePointer2")
                        ? "bg-violet-500/20 border-violet-500 text-violet-400"
                        : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200",
                    )}
                    title={iconName}
                  >
                    <IconComp className="w-5 h-5" />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {selectedElement.type !== "icon" && (
          <div
            className={cn("grid grid-cols-2 gap-4", {
              "grid-cols-1": selectedElement.type === "image",
            })}
          >
            {selectedElement.type !== "image" && (
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-400 tracking-wider">
                  Font Size
                </label>
                <input
                  type="number"
                  value={
                    Number.isNaN(
                      parseInt(selectedElement.style.fontSize || "16"),
                    )
                      ? ""
                      : parseInt(selectedElement.style.fontSize || "16")
                  }
                  onChange={(e) =>
                    handleStyleChange("fontSize", `${e.target.value}px`)
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-400 tracking-wider">
                Radius
              </label>
              <input
                type="number"
                value={
                  Number.isNaN(
                    parseInt(selectedElement.style.borderRadius || "0"),
                  )
                    ? ""
                    : parseInt(selectedElement.style.borderRadius || "0")
                }
                onChange={(e) =>
                  updateElement(selectedElement.id, {
                    style: {
                      ...selectedElement.style,
                      borderRadius: `${e.target.value}px`,
                    },
                  })
                }
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>
          </div>
        )}

        {selectedElement.type === "button" && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-400 tracking-wider">
                Border Width
              </label>
              <input
                type="number"
                value={
                  selectedElement.style.borderWidth !== undefined
                    ? parseInt(selectedElement.style.borderWidth) || 0
                    : ""
                }
                onChange={(e) => {
                  const rawValue = e.target.value;

                  if (rawValue === "") {
                    updateElement(selectedElement.id, {
                      style: {
                        ...selectedElement.style,
                        borderWidth: undefined,
                      },
                    });
                    return;
                  }

                  const parsed = parseInt(rawValue);
                  const val = Math.max(
                    0,
                    Math.min(100, isNaN(parsed) ? 0 : parsed),
                  );

                  updateElement(selectedElement.id, {
                    style: {
                      ...selectedElement.style,
                      borderWidth: `${val}px`,
                      borderStyle:
                        val > 0
                          ? selectedElement.style.borderStyle || "solid"
                          : selectedElement.style.borderStyle,
                    },
                  });
                }}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-400 tracking-wider">
                Border Style
              </label>
              <select
                value={selectedElement.style.borderStyle || "none"}
                onChange={(e) =>
                  handleStyleChange("borderStyle", e.target.value)
                }
                className={SELECT_CLASS}
                style={SELECT_STYLE}
              >
                <option value="none">None</option>
                <option value="solid">Solid</option>
                <option value="dashed">Dashed</option>
                <option value="dotted">Dotted</option>
                <option value="double">Double</option>
              </select>
            </div>
          </div>
        )}

        {selectedElement.type === "button" && (
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-400 tracking-wider">
              Border Color
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={selectedElement.style.borderColor || "#ffffff"}
                onChange={(e) =>
                  handleStyleChange("borderColor", e.target.value)
                }
                className="w-10 h-10 bg-slate-800 border border-slate-700 rounded-lg p-1 cursor-pointer"
              />
              <input
                type="text"
                value={selectedElement.style.borderColor || "#ffffff"}
                onChange={(e) =>
                  handleStyleChange("borderColor", e.target.value)
                }
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>
          </div>
        )}

        {selectedElement.type !== "image" && (
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-400 tracking-wider">
              Color
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                name="color"
                value={selectedElement.style.color || "#ffffff"}
                onChange={handleChange}
                className="w-10 h-10 bg-slate-800 border border-slate-700 rounded-lg p-1 cursor-pointer shrink-0"
              />
              <input
                type="text"
                value={selectedElement.style.color || "#ffffff"}
                onChange={(e) => handleStyleChange("color", e.target.value)}
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>
          </div>
        )}

        {selectedElement.type !== "image" && (
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-400 tracking-wider">
              Background
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                name="backgroundColor"
                value={selectedElement.style.backgroundColor || "transparent"}
                onChange={handleChange}
                className="w-10 h-10 bg-slate-800 border border-slate-700 rounded-lg p-1 cursor-pointer shrink-0"
              />
              <input
                type="text"
                value={selectedElement.style.backgroundColor || "transparent"}
                onChange={(e) =>
                  updateElement(selectedElement.id, {
                    style: {
                      ...selectedElement.style,
                      backgroundColor: e.target.value,
                    },
                  })
                }
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
