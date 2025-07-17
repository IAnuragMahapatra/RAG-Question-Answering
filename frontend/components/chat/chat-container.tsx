"use client";

import { useState, useRef, useEffect } from "react";
import { MessageList } from "./message-list";
import { MessageInput } from "./message-input";
import { PDFUploader } from "../pdf/pdf-uploader";
import { uploadPDF, queryPDF } from "@/lib/api";
import { Message } from "@/lib/types";
import { toast } from "sonner";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCw } from "lucide-react";

function StatusBar({
  pdfReady,
  currentPdf,
  isUploading,
}: {
  pdfReady: boolean;
  currentPdf: string | null;
  isUploading: boolean;
}) {
  if (isUploading)
    return (
      <div className="flex items-center gap-2">
        <RotateCw className="h-5 w-5 animate-spin text-muted-foreground" />
        <span className="text-base lg:text-lg text-muted-foreground">
          Uploading and indexing PDF...
        </span>
      </div>
    );
  if (pdfReady && currentPdf)
    return (
      <span className="text-base lg:text-lg text-muted-foreground">
        Currently using:{" "}
        <span className="font-semibold text-foreground">{currentPdf}</span>
      </span>
    );
  return (
    <span className="text-base lg:text-lg text-muted-foreground font-semibold">
      No PDF uploaded yet
    </span>
  );
}

export default function ChatContainer() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isQuerying, setIsQuerying] = useState(false);
  const [pdfReady, setPdfReady] = useState(false);
  const [currentPdf, setCurrentPdf] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setPdfReady(false);
    setMessages([]);
    try {
      const data = await uploadPDF(file);
      setPdfReady(true);
      setCurrentPdf(file.name);
      toast.success(data.message || "PDF uploaded and indexed successfully!");
    } catch (error) {
      toast.error(
        `Upload failed: ${
          error instanceof Error ? error.message : "Unknown error occurred"
        }`
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || !pdfReady || isQuerying) return;
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsQuerying(true);
    try {
      const response = await queryPDF(content);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          content: response.answer,
          role: "assistant",
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      toast.error(`Query failed: ${errorMessage}`);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          content: `I encountered an error while processing your request: ${errorMessage}`,
          role: "assistant",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsQuerying(false);
    }
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex-1">
            <StatusBar
              pdfReady={pdfReady}
              currentPdf={currentPdf}
              isUploading={isUploading}
            />
          </div>
          <div className="flex gap-2">
            {pdfReady && (
              <PDFUploader
                onUpload={handleFileUpload}
                isUploading={isUploading}
                className="text-lg lg:text-2xl px-6 py-3"
              />
            )}
            {messages.length > 0 && (
              <Button
                variant="outline"
                size="lg"
                onClick={() => setMessages([])}
                disabled={isQuerying || isUploading}
                className="text-lg"
              >
                Clear Chat
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 && !isUploading ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center max-w-md">
              <h3 className="text-lg lg:text-2xl font-bold mb-3">
                Welcome to PDF Chat Assistant
              </h3>
              <p className="text-sm lg:text-base text-muted-foreground mb-4">
                Upload a PDF document to ask questions about its content.
                <br />
                Our AI will analyze the document and provide answers based on the information within.
              </p>
              {!pdfReady && (
                <PDFUploader
                  onUpload={handleFileUpload}
                  isUploading={isUploading}
                  variant="secondary"
                  className="text-lg lg:text-2xl px-6 py-3"
                />
              )}
            </div>
          </div>
        ) : (
          <MessageList messages={messages} isQuerying={isQuerying} />
        )}
        <div ref={messagesEndRef} />
      </CardContent>
      <CardFooter className="p-4 pt-2">
        <MessageInput
          onSendMessage={handleSendMessage}
          disabled={!pdfReady || isQuerying || isUploading}
          placeholder={
            pdfReady
              ? "Ask a question about the PDF..."
              : "Upload a PDF first"
          }
          isQuerying={isQuerying}
        />
      </CardFooter>
    </Card>
  );
}