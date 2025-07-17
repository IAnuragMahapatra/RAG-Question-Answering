import { Avatar } from "@/components/ui/avatar";
import { Bot } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function MessageSkeleton() {
  return (
    <div className="flex items-start gap-3">
      <Avatar className="h-8 w-8 bg-primary/10 flex-shrink-0">
        <Bot className="h-4 w-4 text-primary" />
      </Avatar>
      <div className="rounded-lg px-4 py-3 bg-muted max-w-[85%] sm:max-w-[75%] space-y-2">
        <div className="flex items-center space-x-2">
          <div className="flex flex-col space-y-1.5">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-36" />
          </div>
        </div>
      </div>
    </div>
  );
}