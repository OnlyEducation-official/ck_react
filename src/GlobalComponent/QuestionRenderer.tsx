import React, { useEffect, useRef } from "react";
import DOMPurify from "dompurify";
import { MathJax, MathJaxContext } from "better-react-mathjax";

type Props = {
  html: string;
};

export default function HtmlWithMathRenderer({ html }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Sanitize full HTML string
  const cleanedHTML = DOMPurify.sanitize(html, {
    ADD_TAGS: ["math", "mrow", "mi", "mo", "mn", "msqrt", "mfrac",],
    ADD_ATTR: ["xmlns"],
  });

  useEffect(() => {
    if (!containerRef.current) return;
  }, [html]);

  return (
    <MathJaxContext
      version={3}
      config={{
        loader: { load: ["input/mml", "output/chtml"] },
      }}
    >
      <div
        ref={containerRef}
        style={{ fontWeight: 700 }}
        dangerouslySetInnerHTML={{ __html: cleanedHTML }}
      />

      {/* Run MathJax over all inserted content */}
      <MathJax dynamic />
    </MathJaxContext>
  );
}
