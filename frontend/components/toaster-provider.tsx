"use client";

import { Toaster } from "react-hot-toast";

export function ToasterProvider() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 4000,
        style: {
          background: "#0D3B3B",
          color: "#FAF9F6",
          fontFamily: "var(--font-body)",
          borderRadius: "12px",
        },
        success: { iconTheme: { primary: "#14B8A6", secondary: "#FAF9F6" } },
        error: { iconTheme: { primary: "#F4A340", secondary: "#FAF9F6" } },
      }}
    />
  );
}
