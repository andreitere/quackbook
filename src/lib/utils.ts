import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const bytesToGB = (bytes: number) => (bytes / Math.pow(1024, 3)).toFixed(2);
