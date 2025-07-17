const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

type UploadPDFResponse = {
  message: string;
  collection_name?: string;
  [key: string]: any;
};

type QueryPDFResponse = {
  question: string;
  answer: string;
  [key: string]: any;
};

export async function uploadPDF(file: File): Promise<UploadPDFResponse> {
  const formData = new FormData();
  formData.append("pdf_file", file);

  try {
    const response = await fetch(`${API_BASE_URL}/upload_pdf/`, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || data.message || "Upload failed");
    return data;
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? `Upload failed: ${error.message}`
        : "Upload failed: Unknown error"
    );
  }
}

export async function queryPDF(question: string): Promise<QueryPDFResponse> {
  const formData = new FormData();
  formData.append("question", question);

  try {
    const response = await fetch(`${API_BASE_URL}/query/`, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || data.message || "Query failed");
    return data;
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? `Query failed: ${error.message}`
        : "Query failed: Unknown error"
    );
  }
}