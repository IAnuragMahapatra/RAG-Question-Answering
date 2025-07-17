"use client";

import { useState } from "react";
import { Message } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Copy, Check, Bot, User } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

interface MessageItemProps {
  message: Message;
}

export function MessageItem({ message }: MessageItemProps) {
  const [copied, setCopied] = useState(false);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    toast.success("Copied to clipboard");
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div
      className={cn(
        "flex items-start gap-3 group",
        message.role === "user" ? "justify-end" : "justify-start"
      )}
    >
      {message.role === "assistant" && (
        <Avatar className="h-8 w-8 bg-primary/10 flex-shrink-0">
          <Bot className="h-4 w-4 text-primary" />
        </Avatar>
      )}
      
      <div
        className={cn(
          "rounded-lg px-4 py-3 max-w-[85%] sm:max-w-[75%]",
          message.role === "user" 
            ? "bg-primary text-primary-foreground" 
            : "bg-muted"
        )}
      >
        {message.role === "assistant" ? (
          <div className="prose dark:prose-invert prose-sm max-w-none">
            <ReactMarkdown>
              {message.content}
            </ReactMarkdown>
          </div>
        ) : (
          <p>{message.content}</p>
        )}
      </div>

      {message.role === "user" && (
        <Avatar className="h-8 w-8 bg-primary flex-shrink-0">
          <User className="h-4 w-4 text-primary-foreground" />
        </Avatar>
      )}
      
      {message.role === "assistant" && (
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity relative"
          onClick={copyToClipboard}
        >
          {copied ? (
            <Check className="h-4 w-4 transition-transform duration-200 transform scale-110" />
          ) : (
            <Copy className="h-4 w-4 transition-transform duration-200 transform scale-100" />
          )}
          <span className="sr-only" aria-live="polite">
            {copied ? "Message copied to clipboard" : "Copy message"}
          </span>
          <div className="absolute bottom-full mb-1 hidden group-hover:block bg-gray-700 text-white text-xs rounded px-2 py-1">
            {copied ? "Copied!" : "Copy"}
          </div>
        </Button>
      )}
    </div>
  );
}