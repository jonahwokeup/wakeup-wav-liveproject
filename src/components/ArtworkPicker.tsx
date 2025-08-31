"use client";

import { useCallback, useMemo, useState } from "react";

type Props = {
  label?: string;
  file: File | null;
  previewUrl: string | null;
  onFile: (file: File | null) => void;
  onClear?: () => void;
};

export function useArtworkUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const setArtwork = useCallback((f: File | null) => {
    setFile(f);
    if (f) {
      const url = URL.createObjectURL(f);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  }, []);

  const reset = useCallback(() => setArtwork(null), [setArtwork]);

  return { file, previewUrl, setArtwork, reset };
}

export default function ArtworkPicker({ label = "Artwork", file, previewUrl, onFile, onClear }: Props) {
  const onInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    if (f) onFile(f);
  }, [onFile]);

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const f = e.dataTransfer.files?.[0] || null;
    if (f) onFile(f);
  }, [onFile]);

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const helper = useMemo(
    () => (file ? `${(file.size / 1024 / 1024).toFixed(2)} MB • ${file.type}` : "PNG / JPG / WEBP • up to ~10MB"),
    [file]
  );

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-zinc-300">{label}</label>

      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        className="flex gap-4 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4"
      >
        <div className="h-28 w-28 shrink-0 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950">
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={previewUrl} alt="Artwork preview" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-zinc-500">
              No image
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col justify-between">
          <div className="text-sm text-zinc-400">{helper}</div>
          <div className="flex items-center gap-3">
            <label className="cursor-pointer rounded-md bg-zinc-800 px-3 py-2 text-sm text-zinc-100 hover:bg-zinc-700 transition">
              Choose file
              <input
                type="file"
                accept="image/*"
                onChange={onInput}
                className="hidden"
              />
            </label>
            <button
              type="button"
              onClick={() => {
                onFile(null);
                onClear?.();
              }}
              className="rounded-md px-3 py-2 text-sm text-zinc-400 hover:text-zinc-200"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
