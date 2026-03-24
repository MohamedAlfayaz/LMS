import React, { useState, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import workerSrc from "pdfjs-dist/build/pdf.worker?url";

pdfjs.GlobalWorkerOptions.workerSrc =workerSrc

const PDFHighlight = ({ url, onSaveHighlight, highlights = [] }) => {
  const [numPages, setNumPages] = useState(null);
  const containerRef = useRef();

  const handleMouseUp = () => {
    const selection = window.getSelection();
    const text = selection.toString().trim();

    if (!text) return;

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const containerRect =
      containerRef.current.getBoundingClientRect();

    // 🔥 relative position
    const highlight = {
      text,
      rect: {
        x: (rect.left - containerRect.left) / containerRect.width,
        y: (rect.top - containerRect.top) / containerRect.height,
        width: rect.width / containerRect.width,
        height: rect.height / containerRect.height,
      },
    };

    onSaveHighlight(highlight);

    selection.removeAllRanges();
  };

  return (
    <div
      ref={containerRef}
      onMouseUp={handleMouseUp}
      className="relative"
    >
      {/* PDF */}
      <Document
        file={url}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
      >
        {Array.from(new Array(numPages), (_, index) => (
          <Page
            key={index}
            pageNumber={index + 1}
            width={800}
          />
        ))}
      </Document>

      {/* 🔥 Highlight Overlay */}
      {highlights.map((h, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${h.rect.x * 100}%`,
            top: `${h.rect.y * 100}%`,
            width: `${h.rect.width * 100}%`,
            height: `${h.rect.height * 100}%`,
            backgroundColor: "yellow",
            opacity: 0.4,
            pointerEvents: "none",
          }}
        />
      ))}
    </div>
  );
};

export default PDFHighlight;