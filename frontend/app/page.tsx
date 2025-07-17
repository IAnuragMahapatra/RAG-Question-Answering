import ChatContainer from "@/components/chat/chat-container";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background px-4 sm:px-8 lg:px-20 py-2 lg:py-8">
      <div className="w-full max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-5xl xl:max-w-6xl flex flex-col h-[70vh] lg:h-[80vh]">
        <header className="mb-6 lg:mb-10">
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-primary">
            PDF Chat Assistant
          </h1>
          <p className="text-muted-foreground text-lg sm:text-xl lg:text-3xl mt-4">
            Upload a PDF and ask questions about its content
          </p>
        </header>
        <ChatContainer />
      </div>
    </div>
  );
}