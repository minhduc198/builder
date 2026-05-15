import { BuilderElement, ElementType } from "@/types";

// ─── Typography Options ───────────────────────────────────────────

export const HEADING_TAGS = [
  { value: "h1", label: "Heading 1", defaultSize: "32", defaultWeight: "bold" },
  { value: "h2", label: "Heading 2", defaultSize: "24", defaultWeight: "bold" },
  { value: "h3", label: "Heading 3", defaultSize: "20", defaultWeight: "bold" },
  { value: "h4", label: "Heading 4", defaultSize: "16", defaultWeight: "bold" },
  { value: "h5", label: "Heading 5", defaultSize: "14", defaultWeight: "bold" },
  { value: "h6", label: "Heading 6", defaultSize: "12", defaultWeight: "bold" },
];

export const FONT_WEIGHTS = [
  { value: "normal", label: "Normal" },
  { value: "medium", label: "Medium" },
  { value: "600", label: "Semi Bold" },
  { value: "bold", label: "Bold" },
  { value: "800", label: "Extra Bold" },
];

export const FONT_FAMILIES = [
  { value: "sans-serif", label: "Sans Serif" },
  { value: "serif", label: "Serif" },
  { value: "monospace", label: "Mono" },
];

export const FONT_STYLES = [
  { value: "normal", label: "Normal" },
  { value: "italic", label: "Italic" },
];

export const TEXT_DECORATIONS = [
  { value: "none", label: "None" },
  { value: "underline", label: "Underline" },
  { value: "line-through", label: "Strikethrough" },
];

export const DEFAULT_SIZE: Record<
  ElementType,
  { width: number | string; height: number | string }
> = {
  text: { width: 150, height: "auto" },
  heading: { width: 200, height: "auto" },
  button: { width: 150, height: 50 },
  image: { width: 200, height: 150 },
  icon: { width: 50, height: 50 },
};

export const DEFAULT_CONTENT: Record<ElementType, BuilderElement["content"]> = {
  text: { text: "New Text" },
  heading: { text: "Heading", tag: "h1" },
  button: { text: "Click Me" },
  image: {
    src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60",
  },
  icon: { icon: "MousePointer2" },
};

export const DEFAULT_STYLE: Record<ElementType, BuilderElement["style"]> = {
  text: {
    color: "#ffffff",
    fontSize: "16px",
    textAlign: "left",
  },
  heading: {
    color: "#ffffff",
    fontSize: "32px",
    fontWeight: "bold",
    textAlign: "left",
  },
  button: {
    color: "#ffffff",
    backgroundColor: "#6366f1",
    fontSize: "16px",
    borderRadius: "8px",
    textAlign: "center",
  },
  image: {
    borderRadius: "8px",
  },
  icon: {
    color: "#ffffff",
  },
};
