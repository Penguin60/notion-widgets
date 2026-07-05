"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { CalendarClock, Repeat } from "lucide-react";
import CountdownConfigurator from "@/components/CountdownConfigurator";
import RepeatConfigurator from "@/components/RepeatConfigurator";

const TABS = [
  { id: "countdown", Icon: CalendarClock, label: "Countdown" },
  { id: "repeat",    Icon: Repeat,        label: "Repeating Task" },
];

export default function Home() {
  const [tab, setTab] = useState("countdown");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-[1100px] px-6 py-10">
        {/* Header + tabs */}
        <div className="mb-10">
          <h1 className="text-lg font-semibold tracking-tight">Notion Widgets</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Configure an embeddable widget and paste it into Notion.
          </p>

          <div className="mt-6 inline-flex gap-1 rounded-lg border border-border bg-muted/30 p-1">
            {TABS.map(({ id, Icon, label }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={cn(
                  "flex cursor-pointer items-center gap-2 rounded-md px-3.5 py-2 text-sm font-medium transition-all duration-100",
                  tab === id
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="size-4" strokeWidth={1.5} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {tab === "countdown" ? <CountdownConfigurator /> : <RepeatConfigurator />}
      </div>
    </div>
  );
}
