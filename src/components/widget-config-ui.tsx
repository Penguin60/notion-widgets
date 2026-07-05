"use client";

import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { Hash, LayoutGrid, BarChart2, Circle, AlignJustify, Minus } from "lucide-react";

// ---------- Shared config constants ----------

export const COLORS = [
  { name: "Blue",       hex: "5B8DDE" },
  { name: "Green",      hex: "5BAA6E" },
  { name: "Rose",       hex: "CF6679" },
  { name: "Gold",       hex: "C59243" },
  { name: "Purple",     hex: "8B6DB0" },
  { name: "Terracotta", hex: "D47A54" },
  { name: "Teal",       hex: "4A9BA5" },
  { name: "Red",        hex: "DE5B5B" },
];

export const STYLES = [
  { id: "default", Icon: Hash,        label: "Big Number" },
  { id: "compact", Icon: LayoutGrid,  label: "Compact"    },
  { id: "bar",     Icon: BarChart2,   label: "Progress"   },
];

export const PATTERNS = [
  { id: "dots",    Icon: Circle,        label: "Dots"    },
  { id: "stripes", Icon: AlignJustify,  label: "Stripes" },
  { id: "none",    Icon: Minus,         label: "None"    },
];

// ---------- Shared presentational pieces ----------

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground mb-2">
      {children}
    </p>
  );
}

type Option = { id: string; Icon: LucideIcon; label: string };

export function OptionGrid({
  options,
  value,
  onChange,
}: {
  options: Option[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {options.map(({ id, Icon, label }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={cn(
            "flex flex-col cursor-pointer items-center justify-center gap-2 rounded-md border py-4 text-center transition-all duration-100",
            value === id
              ? "border-foreground/40 bg-foreground/[0.04]"
              : "border-border bg-background hover:bg-muted/50"
          )}
        >
          <Icon className={cn("size-4", value === id ? "text-foreground" : "text-muted-foreground")} strokeWidth={1.5} />
          <span className={cn("text-[11px] font-medium uppercase tracking-wide", value === id ? "text-foreground" : "text-muted-foreground")}>
            {label}
          </span>
        </button>
      ))}
    </div>
  );
}

export function ColorPicker({
  color,
  useCustom,
  customColor,
  onPreset,
  onCustom,
}: {
  color: string;
  useCustom: boolean;
  customColor: string;
  onPreset: (hex: string) => void;
  onCustom: (hex: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {COLORS.map((c) => (
        <button
          key={c.hex}
          title={c.name}
          onClick={() => onPreset(c.hex)}
          className={cn(
            "h-7 w-7 cursor-pointer rounded-md border-2 transition-all hover:scale-110 focus:outline-none",
            !useCustom && color === c.hex
              ? "border-foreground shadow-sm"
              : "border-transparent"
          )}
          style={{ background: `#${c.hex}` }}
        />
      ))}
      {/* Custom color picker */}
      <div className="relative h-7 w-7">
        <div
          className={cn(
            "pointer-events-none grid h-full w-full place-items-center rounded-md border-2 border-dashed text-xs font-medium text-muted-foreground",
            useCustom ? "border-foreground" : "border-border"
          )}
        >
          +
        </div>
        <input
          type="color"
          value={customColor}
          onChange={(e) => onCustom(e.target.value)}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
      </div>
    </div>
  );
}

// ---------- Shared embed instructions ----------

export function EmbedInstructions() {
  return (
    <div className="rounded-xl border border-border bg-background p-5">
      <p className="mb-4 text-sm font-semibold">How to embed in Notion</p>
      <ol className="space-y-3">
        {[
          "Configure your widget using the options on the left.",
          <>Click <strong className="font-semibold text-foreground">Copy</strong> to copy the embed URL.</>,
          <>In Notion, type <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px]">/embed</code> and press Enter.</>,
          <>Paste the URL and click <strong className="font-semibold text-foreground">Embed link</strong>.</>,
          "Resize the block to fit your layout.",
        ].map((step, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-border text-[11px] font-medium text-muted-foreground/60">
              {i + 1}
            </span>
            <span className="leading-relaxed">{step}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
