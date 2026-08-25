export interface RagDocument {
  id: string;
  name: string;
  status?: string;
  createdAt?: string;
}

export interface SourceCitation {
  documentId: string;
  documentName?: string;
  snippet?: string;
}
