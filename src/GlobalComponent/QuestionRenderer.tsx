import React, { useMemo } from "react";
import DOMPurify from "dompurify";
import { MathJax, MathJaxContext } from "better-react-mathjax";

type Props = {
  html: string;
  wordLimit?: number;
};

export default function HtmlWithMathRenderer({ html, wordLimit = 20 }: Props) {
  const processedHTML = useMemo(() => {
    // 1️⃣ Sanitize and REMOVE images
    const sanitized = DOMPurify.sanitize(html, {
      ADD_TAGS: ["math", "mrow", "mi", "mo", "mn", "msqrt", "mfrac"],
      ADD_ATTR: ["xmlns"],
      FORBID_TAGS: ["img"], // 🚫 Remove images completely
    });

    // 2️⃣ Convert HTML → plain text for word counting
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = sanitized;
    const textContent = tempDiv.textContent || "";

    const words = textContent.trim().split(/\s+/);

    // 3️⃣ If within limit → return sanitized HTML
    if (words.length <= wordLimit) {
      return sanitized;
    }

    // 4️⃣ If exceeds → truncate text and append ...
    const truncatedText = words.slice(0, wordLimit).join(" ") + "...";

    // Return plain truncated text (safe)
    return DOMPurify.sanitize(truncatedText);
  }, [html, wordLimit]);

  return (
    <MathJaxContext
      version={3}
      config={{
        loader: { load: ["input/mml", "output/chtml"] },
      }}
    >
      <div
        style={{ fontWeight: 700 }}
        dangerouslySetInnerHTML={{ __html: processedHTML }}
      />
      <MathJax dynamic />
    </MathJaxContext>
  );
}
