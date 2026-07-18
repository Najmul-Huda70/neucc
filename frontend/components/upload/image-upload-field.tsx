"use client";

import { useState } from "react";
import Image from "next/image";
import { Upload, Loader2, Link2 } from "lucide-react";
import toast from "react-hot-toast";
import { apiFetch } from "@/lib/api";

export function ImageUploadField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);

  function handleFile(file: File) {
    setUploading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const dataUrl = reader.result as string;
        const { url } = await apiFetch<{ url: string }>("/api/upload", {
          method: "POST",
          body: { image: dataUrl },
        });
        onChange(url);
        toast.success("Image uploaded.");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Upload failed.");
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  }

  return (
    <div>
      <label className="text-sm font-medium text-[var(--color-primary)]">{label}</label>
      <div className="mt-1 flex items-center gap-2">
        <div className="relative flex-1">
          <Link2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-neutral-text)]" />
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://… (or upload a file)"
            className="w-full rounded-lg border border-[var(--color-secondary)]/25 py-2.5 pl-10 pr-4 text-sm focus:border-[var(--color-secondary)] focus:outline-none"
          />
        </div>
        <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-[var(--color-secondary)]/25 px-3 py-2.5 text-sm text-[var(--color-primary)] hover:bg-[var(--color-secondary)]/5">
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          Upload
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
        </label>
      </div>
      {value && (
        <div className="relative mt-2 h-24 w-36 overflow-hidden rounded-lg border border-[var(--color-secondary)]/15">
          <Image src={value} alt="Preview" fill className="object-cover" unoptimized />
        </div>
      )}
    </div>
  );
}
