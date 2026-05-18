import { BuilderElement, ElementType } from "@/types";
import {
  MousePointer2,
  Heart,
  Star,
  Circle,
  Triangle,
  Smile,
  Zap,
  Check,
  X,
  ArrowRight,
  User,
  Settings
} from "lucide-react";

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
  text: { width: 300, height: "auto" },
  heading: { width: 200, height: "auto" },
  button: { width: 150, height: 50 },
  image: { width: 200, height: 150 },
  icon: { width: 50, height: 50 },
};

export const DEFAULT_CONTENT: Record<ElementType, BuilderElement["content"]> = {
  text: {
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quasi.",
  },
  heading: { text: "Heading", tag: "h1" },
  button: { text: "Click" },
  image: {
    src: "data:image/jpeg;base64,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",
  },
  icon: { icon: "" },
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

export const AVAILABLE_ICONS: Record<string, any> = {
  MousePointer2,
  Heart,
  Star,
  Circle,
  Triangle,
  Smile,
  Zap,
  Check,
  X,
  ArrowRight,
  User,
  Settings
};
