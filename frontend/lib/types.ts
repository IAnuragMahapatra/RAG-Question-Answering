export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

export interface APIResponse {
  question: string;
  answer: string;
}

export interface UploadResponse {
  message: string;
  collection_name: string;
}

export interface ErrorResponse {
  detail: string;
}