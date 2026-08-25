import { useState } from "react";
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Divider,
  Heading,
  List,
  ListItem,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import Card from "../components/card/Card";
import { sendQuery, QueryResponse } from "../api/ragAPI";

export default function Chat() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState<QueryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleAsk() {
    if (!question.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const response = await sendQuery(question.trim());
      setResult(response);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <VStack align="stretch" spacing="6" maxW="720px">
      <Box>
        <Heading size="md" mb="3">
          Ask a question
        </Heading>
        <Textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask something about your documents..."
          bg="white"
          rows={4}
        />
        <Button
          mt="3"
          colorScheme="brand"
          onClick={handleAsk}
          isLoading={loading}
          isDisabled={!question.trim()}
        >
          Ask
        </Button>
      </Box>

      {error && (
        <Alert status="error" borderRadius="12px">
          <AlertIcon />
          {error}
        </Alert>
      )}

      {result && (
        <Card>
          <Text whiteSpace="pre-wrap">{result.answer}</Text>
          {result.sources && result.sources.length > 0 && (
            <>
              <Divider my="4" />
              <Text fontWeight="600" mb="2" color="secondaryGray.700">
                Sources
              </Text>
              <List spacing="2">
                {result.sources.map((source, index) => (
                  <ListItem key={index} fontSize="sm" color="secondaryGray.700">
                    {source.documentName ?? source.documentId}
                    {source.snippet ? ` — ${source.snippet}` : ""}
                  </ListItem>
                ))}
              </List>
            </>
          )}
        </Card>
      )}
    </VStack>
  );
}
