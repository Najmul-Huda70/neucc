"use client";

import { useState } from "react";
import Image from "next/image";

export function ImageGallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);
  if (images.length === 0) return null;

  return (
    <div>
      <div className="relative h-72 w-full overflow-hidden rounded-[12px] border border-[var(--color-secondary)]/15 sm:h-96">
        <Image src={images[active] ?? images[0]!} alt={title} fill priority className="object-cover" />
      </div>
      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {images.map((src, i) => (
            <button
              key={src + i}
              onClick={() => setActive(i)}
              className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                i === active ? "border-[var(--color-secondary)]" : "border-transparent opacity-70 hover:opacity-100"
              }`}
              aria-label={`Show image ${i + 1}`}
            >
              <Image src={src} alt="" fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
