"use client";

import { useState, useCallback, useRef } from "react";

export type UploadStatus = "idle" | "loading" | "success" | "error";

interface UseCleanImageResult {
  status: UploadStatus;
  message: string;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  upload: (file: File | null) => Promise<void>;
  reset: () => void;
  cleanedUrl: string | null;
  cleanedFilename: string | null;
}

const buildCleanedFilename = (original: string): string => {
  const dotIndex = original.lastIndexOf(".");
  if (dotIndex < 1) return `cleaned-${original}`;
  return `cleaned-${original.slice(0, dotIndex)}${original.slice(dotIndex)}`;
};

const readError = async (res: Response): Promise<string> => {
  const text = await res.text();
  try {
    const json = JSON.parse(text);
    return json.error ?? text;
  } catch {
    return text || "Upload failed.";
  }
};

export function useCleanImage(): UseCleanImageResult {
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [message, setMessage] = useState<string>("");
  const [cleanedUrl, setCleanedUrl] = useState<string | null>(null);
  const [currentCleanedFilename, setCleanedFilename] = useState<string | null>(
    null,
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const reset = useCallback(() => {
    setStatus("idle");
    setMessage("");
    if (cleanedUrl) URL.revokeObjectURL(cleanedUrl);
    setCleanedUrl(null);
    setCleanedFilename(null);
  }, [cleanedUrl]);

  const upload = useCallback(
    async (file: File | null) => {
      if (!file) return;

      setStatus("loading");
      setMessage("");

      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/clean", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const errorMessage = await readError(res);
          setStatus("error");
          setMessage(errorMessage || "Upload failed.");
          return;
        }

        const blob = await res.blob();
        const filename = buildCleanedFilename(file.name);
        const url = URL.createObjectURL(blob);
        setCleanedUrl(url);
        setCleanedFilename(filename);

        setStatus("success");
        setMessage(`Metadata stripped. Your image is ready to download.`);
      } catch (err) {
        setStatus("error");
        setMessage(err instanceof Error ? err.message : "Unknown error");
      }
    },
    [],
  );

  return {
    status,
    message,
    fileInputRef,
    upload,
    reset,
    cleanedUrl,
    cleanedFilename: currentCleanedFilename,
  };
}
