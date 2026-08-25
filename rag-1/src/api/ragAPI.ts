import client from "./client";
import type { RagDocument, SourceCitation } from "../types";

export interface QueryResponse {
  answer: string;
  sources: SourceCitation[];
}

export async function listDocuments(): Promise<RagDocument[]> {
  const { data } = await client.get<RagDocument[]>("/api/documents");
  return data;
}

export async function uploadDocument(
  file: File,
  onProgress?: (percent: number) => void
): Promise<RagDocument> {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await client.post<RagDocument>("/api/documents", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (event) => {
      if (onProgress && event.total) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    },
  });
  return data;
}

export async function deleteDocument(id: string): Promise<void> {
  await client.delete(`/api/documents/${id}`);
}

export async function sendQuery(
  question: string,
  documentIds?: string[]
): Promise<QueryResponse> {
  const { data } = await client.post<QueryResponse>("/api/query", {
    question,
    document_ids: documentIds,
  });
  return data;
}
