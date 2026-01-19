import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getAssetUrl = (path: string | null | undefined): string => {
  if (!path) return "/images/no-image-available-icon.png";

  const backendUrl = process.env.NEXT_PUBLIC_ASSET_URL || "http://localhost:8000";

  // If path already includes http/https, return as is
  if (path.startsWith("http")) return path;

  // Otherwise, prepend backend URL + /storage/
  return `${backendUrl}/${path}`;
};
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};
