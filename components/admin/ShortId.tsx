"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

interface ShortIdProps {
  id?: string | null;
  length?: number;
}

export function ShortId({ id, length = 7 }: ShortIdProps) {
  const [copied, setCopied] = useState(false);

  if (!id) return <span className="text-muted-foreground">-</span>;

  const shortText = `${id.slice(0, length)}…`;

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(id);
      setCopied(true);
      toast.success("ID berhasil disalin ke clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Gagal menyalin ID");
    }
  };

  return (
    <div className="inline-flex items-center gap-1.5 font-mono text-xs">
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="bg-muted/60 text-foreground cursor-help rounded px-1.5 py-0.5 font-medium">
            {shortText}
          </span>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p className="font-mono text-xs">{id}</p>
        </TooltipContent>
      </Tooltip>
      <Button
        variant="ghost"
        size="icon"
        className="text-muted-foreground hover:text-foreground size-6"
        onClick={handleCopy}
        title="Salin ID"
      >
        {copied ? (
          <Check className="size-3.5 text-emerald-600" />
        ) : (
          <Copy className="size-3.5" />
        )}
        <span className="sr-only">Salin ID</span>
      </Button>
    </div>
  );
}
