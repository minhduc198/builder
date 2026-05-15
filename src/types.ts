export type ElementType = "text" | "heading" | "button" | "image" | "icon";

export interface BuilderElement {
  id: string;
  type: ElementType;

  position: {
    x: number;
    y: number;
  };

  size: {
    width: number | string;
    height: number | string;
    minWidth?: number;
    minHeight?: number;
    maxWidth?: number;
    maxHeight?: number;
  };

  content?: {
    text?: string;
    src?: string;
    icon?: string;
    tag?: string;
  };

  style: {
    color?: string;
    backgroundColor?: string;
    fontSize?: string;
    fontWeight?: string;
    fontFamily?: string;
    fontStyle?: string;
    textDecoration?: string;
    letterSpacing?: string;
    lineHeight?: string;
    borderRadius?: string;
    padding?: string;
    borderWidth?: string;
    borderColor?: string;
    borderStyle?: string;
    opacity?: number;
    textAlign?: "left" | "center" | "right";
  };

  children?: BuilderElement[];
}
