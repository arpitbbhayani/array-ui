import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export { clsx, type ClassValue } from "clsx";
export { twMerge } from "tailwind-merge";
export default cn;
