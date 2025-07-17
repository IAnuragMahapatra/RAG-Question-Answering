"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileUp, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface PDFUploaderProps {
  onUpload: (file: File) => void | Promise<void>;
  isUploading: boolean;
  variant?: "default" | "secondary" | "outline";
  className?: string;
}

export function PDFUploader({ 
  onUpload, 
  isUploading,
  variant = "default",
  className
}: PDFUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (isUploading) return;
    
    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file");
      return;
    }
    
    onUpload(file);
    
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <>
      <div className="relative">
        <Input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          onChange={handleChange}
          className="hidden"
        />
        <Button
          onClick={handleClick}
          onDragEnter={handleDrag}
          variant={variant}
          size={variant === "secondary" ? "lg" : "sm"}
          disabled={isUploading}
          className={cn(
            "relative transition-all",
            dragActive && "border-primary bg-secondary",
            className
          )}
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <FileUp className="mr-2 h-4 w-4" />
              Upload PDF
            </>
          )}
        </Button>
        {/* Drop area overlay - only visible during drag */}
        {dragActive && (
          <div
            className="absolute inset-0 z-10 h-full w-full rounded-md"
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          ></div>
        )}
      </div>
    </>
  );
}