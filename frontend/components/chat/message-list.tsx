import React from "react";
import ReactMarkdown from "react-markdown";
import { Message } from "@/lib/types";

export function MessageList({
  messages,
  isQuerying,
}: {
  messages: Message[];
  isQuerying: boolean;
}) {
  return (
    <div className="flex flex-col gap-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex items-end ${
            message.role === "user" ? "justify-end" : "justify-start"
          }`}
        >
          {message.role === "assistant" && (
            <div className="flex-shrink-0 mr-2">
              <div className="w-8 h-8 rounded-full bg-neutral-500 flex items-center justify-center text-white font-bold">
                AI
              </div>
            </div>
          )}
          <div
            className={`rounded-2xl px-4 py-2 max-w-[80vw] sm:max-w-[60%] break-words shadow ${
              message.role === "user"
                ? "bg-primary text-primary-foreground self-end rounded-br-none"
                : "bg-muted text-foreground self-start rounded-bl-none"
            }`}
          >
            {message.role === "assistant" ? (
              <div className="flex items-center">
                <ReactMarkdown className="prose prose-sm dark:prose-invert">
                  {message.content}
                </ReactMarkdown>
                <button
                  onClick={() => navigator.clipboard.writeText(message.content)}
                  className="ml-2 text-xs text-muted-foreground hover:text-primary"
                  title="Copy to clipboard"
                >
                  Copy
                </button>
              </div>
            ) : (
              <span>{message.content}</span>
            )}
          </div>
          {message.role === "user" && (
            <div className="flex-shrink-0 ml-2">
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold">
                U
              </div>
            </div>
          )}
        </div>
      ))}
      {isQuerying && (
        <div className="flex items-end justify-start">
          <div className="w-8 h-8 rounded-full bg-neutral-500 flex items-center justify-center text-white font-bold mr-2">
            AI
          </div>
          <div className="rounded-2xl px-4 py-2 bg-muted text-foreground opacity-70 max-w-[80vw] sm:max-w-[60%]">
            Bot is thinking...
          </div>
        </div>
      )}
    </div>
  );
}