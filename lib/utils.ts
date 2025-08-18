import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string) {
  const parsedDate = new Date(date);
  
  // Check if date is valid
  if (isNaN(parsedDate.getTime())) {
    return date; // Return original string if invalid
  }
  
  return parsedDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric", 
    year: "numeric"
  });
}


export function parseServerActionResponse<T>(response:T){
  return JSON.parse(JSON.stringify(response));
}