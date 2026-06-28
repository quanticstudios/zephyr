import { useState } from "react";
import { ArrowUp, MoreHorizontal, RotateCcw } from "lucide-react";
import { Button, Input } from "@heroui/react";
import type { Project } from "@/lib/types";
import { SparkleBadge, Pill } from "@/components/primitives";
import { suggestionChips } from "@/lib/project";
import { DiffCard } from "./DiffCard";

/** Docked AI assistant: header, chat transcript + diff, and a composer. */
export function Inspector({ project }: { project: Project }) {
  const [draft, setDraft] = useState("");

  return (
    <div className="w-[328px] shrink-0 bg-panel border-l border-border flex flex-col">
      {/* header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
        <span className="flex h-[22px] w-[22px] items-center justify-center rounded-md bg-gradient-to-br from-accent to-[#0a64d6] shadow-[0_0_12px_rgba(41,151,255,0.4)]">
          <SparkleBadge size={12} className="text-white" />
        </span>
        <span className="flex-1 text-sm font-semibold text-ink">Assistant</span>
        <Button isIconOnly variant="ghost" size="sm" aria-label="Refresh">
          <RotateCcw size={15} />
        </Button>
        <Button isIconOnly variant="ghost" size="sm" aria-label="More options">
          <MoreHorizontal size={15} />
        </Button>
      </div>

      {/* chat */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
        {project.chat.map((message) =>
          message.role === "user" ? (
            <div
              key={message.id}
              className="ml-auto max-w-[80%] rounded-2xl bg-accent px-3 py-2 text-[13px] leading-relaxed text-white"
            >
              {message.text}
            </div>
          ) : (
            <div
              key={message.id}
              className="text-[13px] leading-relaxed text-ink-secondary"
            >
              {message.text}
            </div>
          ),
        )}
        <DiffCard diff={project.diff} />
      </div>

      {/* composer */}
      <div className="border-t border-border p-3 space-y-2">
        <div className="flex flex-wrap gap-1.5">
          {suggestionChips.map((chip) => (
            <Pill
              key={chip}
              className="cursor-pointer hover:bg-white/10 hover:text-ink-secondary"
            >
              {chip}
            </Pill>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Input
            variant="secondary"
            className="flex-1"
            placeholder="Describe an edit…"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
          />
          <button
            type="button"
            aria-label="Send"
            onClick={() => setDraft("")}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-white shadow-[0_1px_5px_rgba(10,132,255,0.4)]"
          >
            <ArrowUp size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
