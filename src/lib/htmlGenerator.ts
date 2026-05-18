import { BuilderElement } from "@/types";

// Helper to convert React camelCase style keys to kebab-case CSS
const styleToCss = (styleObj: Record<string, any>) => {
  return Object.entries(styleObj || {})
    .map(([key, val]) => {
      if (val === undefined || val === null) return "";
      const cssKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();

      let cssVal = val;
      if (
        typeof val === "number" &&
        !["zIndex", "opacity", "fontWeight"].includes(key)
      ) {
        cssVal = `${val}px`;
      }
      return `${cssKey}: ${cssVal}`;
    })
    .filter(Boolean)
    .join("; ");
};

export const generateHTML = (elements: BuilderElement[]): string => {
  const elementsHtml = elements
    .map((el) => {
      const isTextType = ["text", "heading", "button"].includes(el.type);

      const outerStyle: Record<string, any> = {
        position: "absolute",
        left: `${el.position.x}px`,
        top: `${el.position.y}px`,
        width:
          typeof el.size.width === "number"
            ? `${el.size.width}px`
            : el.size.width,
        height: isTextType
          ? "auto"
          : typeof el.size.height === "number"
            ? `${el.size.height}px`
            : el.size.height,
        display: "flex",
        alignItems:
          isTextType && el.type !== "button" ? "flex-start" : "center",
        justifyContent: "center",
        cursor: el.type === "button" ? "pointer" : "default",
        zIndex: 1,
        ...el.style,
      };

      if (isTextType && typeof el.size.height === "number") {
        outerStyle.minHeight = `${el.size.height}px`;
      }

      const outerStyleString = styleToCss(outerStyle);

      let innerHtml = "";

      if (isTextType) {
        const Tag = el.content?.tag || "p";
        const commonStyle = {
          textAlign: el.style.textAlign,
          letterSpacing: "inherit",
          lineHeight: "inherit",
          fontStyle: "inherit",
          textDecoration: "inherit",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          minHeight: "1em",
          width: "100%",
        };
        const innerStyleString = styleToCss(commonStyle);
        const extraClass = el.type === "button" ? "px-4 py-2" : "p-1";

        innerHtml = `<${Tag} class="${extraClass} w-full text-inherit break-words outline-none" style="${innerStyleString}">${el.content?.text || ""}</${Tag}>`;
      } else if (el.type === "image") {
        const imgStyle = styleToCss({ borderRadius: el.style.borderRadius });
        innerHtml = `<img src="${el.content?.src || ""}" alt="builder" class="w-full h-full object-cover" style="${imgStyle}" />`;
      } else if (el.type === "icon") {
        const iconName = el.content?.icon || "MousePointer2";
        const kebabIconName = iconName
          .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
          .toLowerCase();

        const iconSize =
          typeof el.size.width === "number"
            ? el.size.width
            : parseInt(String(el.size.width)) || 32;
        const iconStyle = styleToCss({ color: el.style.color });

        innerHtml = `<i data-lucide="${kebabIconName}" style="width: ${iconSize}px; height: ${iconSize}px; ${iconStyle}"></i>`;
      }

      return `      <div style="${outerStyleString}">
        <div class="w-full h-full overflow-hidden flex items-center justify-center relative rounded-[inherit]" style="cursor: inherit;">
          ${innerHtml}
        </div>
      </div>`;
    })
    .join("\n");

  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Published Builder Page</title>
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Lucide Icons CDN -->
  <script src="https://unpkg.com/lucide@latest"></script>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #020617; /* Matches slate-950 background */
      min-height: 100vh;
      overflow-x: hidden;
      font-family: ui-sans-serif, system-ui, sans-serif;
    }
    .canvas-container {
      position: relative;
      width: 1200px;
      margin: 0 auto;
      min-height: 100vh;
    }
    @media (max-width: 1200px) {
      .canvas-container {
        transform: scale(calc(100vw / 1200));
        transform-origin: top center;
      }
    }
  </style>
</head>
<body>
  <div class="canvas-container">
${elementsHtml}
  </div>

  <script>
    // Initialize Lucide Icons
    lucide.createIcons();
  </script>
</body>
</html>`;
};
