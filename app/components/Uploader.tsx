"use client";

import { useCallback } from "react";
import { useCleanImage } from "../hooks/useCleanImage";

export function Uploader() {
  const { status, message, fileInputRef, upload, reset, cleanedUrl, cleanedFilename } = useCleanImage();

  const handleDownload = useCallback(() => {
    if (!cleanedUrl || !cleanedFilename) return;
    const a = document.createElement("a");
    a.href = cleanedUrl;
    a.download = cleanedFilename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }, [cleanedUrl, cleanedFilename]);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    upload(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0] ?? null;
    upload(file);
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      className="w-full border-3 border-neo-black bg-neo-white neo-shadow-lg cursor-pointer select-none transition-[box-shadow] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[5px_5px_0px_var(--color-neo-black)] active:shadow-[inset_2px_2px_0px_var(--color-neo-black)]"
      onDrop={onDrop}
      onDragOver={onDragOver}
      onClick={() => fileInputRef.current?.click()}
      role="button"
      tabIndex={0}
      aria-label="Upload image file"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          fileInputRef.current?.click();
          e.preventDefault();
        }
      }}
    >
      <input
        ref={fileInputRef}
        onChange={onInputChange}
        accept="image/jpeg,image/png,image/webp"
        type="file"
        className="hidden"
      />

      <div className="p-6 sm:p-8 lg:p-10 flex flex-col items-center text-center gap-4 sm:gap-5">
        {status === "idle" && (
          <>
            <div className="flex items-center gap-2">
              <span
                aria-hidden
                className="inline-block w-5 h-5 bg-neo-red border-2 border-neo-black"
              />
              <span
                aria-hidden
                className="inline-block w-5 h-5 bg-neo-yellow border-2 border-neo-black rounded-full"
              />
              <span
                aria-hidden
                className="inline-block w-5 h-5 bg-neo-blue border-2 border-neo-black"
              />
            </div>
            <p className="font-display font-600 text-lg sm:text-xl tracking-tight">
              Drop an image here, or click to select
            </p>
            <p className="font-mono text-xs text-neo-black/60 uppercase tracking-wider">
              JPEG · PNG · WebP — up to 10 MB
            </p>
          </>
        )}

        {status === "loading" && (
          <>
            <div className="w-10 h-10 border-3 border-neo-black border-t-neo-blue rounded-full animate-spin" />
            <p className="font-display font-600 text-lg sm:text-xl tracking-tight">
              Processing...
            </p>
            <p className="font-mono text-xs text-neo-black/60 uppercase tracking-wider">
              Stripping metadata
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <span className="inline-block bg-neo-green border-3 border-neo-black p-3 neo-shadow-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6 text-neo-white"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
            <p className="font-display font-600 text-base sm:text-lg lg:text-xl tracking-tight break-words text-center">
              {message}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <button
                onClick={(ev) => {
                  ev.stopPropagation();
                  handleDownload();
                }}
                className="bg-neo-blue text-neo-white border-3 border-neo-black px-5 py-2 font-display font-600 text-sm uppercase tracking-wider neo-shadow-sm transition-[box-shadow,translate] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[4px_4px_0px_var(--color-neo-black)] active:shadow-[inset_2px_2px_0px_var(--color-neo-black)] disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!cleanedUrl || !cleanedFilename}
              >
                Download image
              </button>
              <button
                onClick={(ev) => {
                  ev.stopPropagation();
                  reset();
                }}
                className="bg-neo-yellow border-3 border-neo-black px-5 py-2 font-display font-600 text-sm uppercase tracking-wider neo-shadow-sm transition-[box-shadow,translate] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[4px_4px_0px_var(--color-neo-black)] active:shadow-[inset_2px_2px_0px_var(--color-neo-black)]"
              >
                Clean another
              </button>
            </div>
          </>
        )}

        {status === "error" && (
          <>
            <span className="inline-block bg-neo-red border-3 border-neo-black p-3 neo-shadow-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6 text-neo-white"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </span>
            <p className="font-display font-600 text-base sm:text-lg lg:text-xl tracking-tight text-neo-red break-words text-center">
              {message}
            </p>
            <button
              onClick={(ev) => {
                ev.stopPropagation();
                reset();
              }}
              className="mt-2 bg-neo-white border-3 border-neo-black px-5 py-2 font-display font-600 text-sm uppercase tracking-wider neo-shadow-sm transition-[box-shadow,translate] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[4px_4px_0px_var(--color-neo-black)] active:shadow-[inset_2px_2px_0px_var(--color-neo-black)]"
            >
              Try again
            </button>
          </>
        )}
      </div>
    </div>
  );
}
