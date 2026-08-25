import { useEffect, useRef, useState } from "react";
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Heading,
  HStack,
  IconButton,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import { MdDelete } from "react-icons/md";
import Card from "../components/card/Card";
import { deleteDocument, listDocuments, uploadDocument } from "../api/ragAPI";
import type { RagDocument } from "../types";

export default function Documents() {
  const [documents, setDocuments] = useState<RagDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  async function loadDocuments() {
    setLoading(true);
    setError("");
    try {
      const docs = await listDocuments();
      setDocuments(docs);
    } catch {
      setError("Could not load documents.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDocuments();
  }, []);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await uploadDocument(file);
      await loadDocuments();
    } catch {
      toast({ title: "Upload failed", status: "error", duration: 3000 });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteDocument(id);
      setDocuments((docs) => docs.filter((doc) => doc.id !== id));
    } catch {
      toast({ title: "Delete failed", status: "error", duration: 3000 });
    }
  }

  return (
    <Box>
      <HStack justify="space-between" mb="6">
        <Heading size="md">Documents</Heading>
        <Box>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <Button
            colorScheme="brand"
            onClick={() => fileInputRef.current?.click()}
            isLoading={uploading}
          >
            Upload
          </Button>
        </Box>
      </HStack>

      {error && (
        <Alert status="error" borderRadius="12px" mb="4">
          <AlertIcon />
          {error}
        </Alert>
      )}

      {loading ? (
        <Spinner />
      ) : documents.length === 0 ? (
        <Text color="secondaryGray.700">No documents uploaded yet.</Text>
      ) : (
        <Card p="0" overflow="hidden">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Status</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {documents.map((doc) => (
                <Tr key={doc.id}>
                  <Td>{doc.name}</Td>
                  <Td>{doc.status ?? "—"}</Td>
                  <Td textAlign="right">
                    <IconButton
                      aria-label="Delete document"
                      icon={<MdDelete />}
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(doc.id)}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Card>
      )}
    </Box>
  );
}
