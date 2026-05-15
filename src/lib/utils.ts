import { DEFAULT_CONTENT, DEFAULT_SIZE, DEFAULT_STYLE } from "@/constants";
import { BuilderElement, ElementType } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function createBuilderElement(
  type: ElementType,
  x = 100,
  y = 100,
): BuilderElement {
  return {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    type,
    position: { x, y },
    size: { ...DEFAULT_SIZE[type] },
    content: { ...DEFAULT_CONTENT[type] },
    style: { ...DEFAULT_STYLE[type] },
  };
}
