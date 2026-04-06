"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Hash, LayoutGrid, BarChart2, Circle, AlignJustify, Minus, Copy, Check } from "lucide-react";

const COLORS = [
  { name: "Blue",       hex: "5B8DDE" },
  { name: "Green",      hex: "5BAA6E" },
  { name: "Rose",       hex: "CF6679" },
  { name: "Gold",       hex: "C59243" },
  { name: "Purple",     hex: "8B6DB0" },
  { name: "Terracotta", hex: "D47A54" },
  { name: "Teal",       hex: "4A9BA5" },
  { name: "Red",        hex: "DE5B5B" },
];

const STYLES = [
  { id: "default", Icon: Hash,        label: "Big Number" },
  { id: "compact", Icon: LayoutGrid,  label: "Compact"    },
  { id: "bar",     Icon: BarChart2,   label: "Progress"   },
];

const PATTERNS = [
  { id: "dots",    Icon: Circle,        label: "Dots"    },
  { id: "stripes", Icon: AlignJustify,  label: "Stripes" },
  { id: "none",    Icon: Minus,         label: "None"    },
];

function defaultDate() {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toISOString().split("T")[0];
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground mb-2">
      {children}
    </p>
  );
}

export default function Home() {
  const [label,       setLabel]       = useState("Vacation");
  const [date,        setDate]        = useState(defaultDate);
  const [color,       setColor]       = useState("5B8DDE");
  const [customColor, setCustomColor] = useState("#5B8DDE");
  const [useCustom,   setUseCustom]   = useState(false);
  const [style,       setStyle]       = useState("default");
  const [pattern,     setPattern]     = useState("dots");
  const [showDate,    setShowDate]    = useState(true);
  const [copied,      setCopied]      = useState(false);

  const activeColor = useCustom ? customColor.replace("#", "") : color;

  const [embedUrl, setEmbedUrl] = useState("");

  useEffect(() => {
    const base = window.location.origin + "/widget";
    const p = new URLSearchParams();
    p.set("date", date);
    p.set("label", label || "Event");
    p.set("color", activeColor);
    p.set("pattern", pattern);
    p.set("style", style);
    if (!showDate) p.set("showdate", "false");
    setEmbedUrl(`${base}?${p.toString()}`);
  }, [date, label, activeColor, pattern, style, showDate]);

  const copy = async () => {
    await navigator.clipboard.writeText(embedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* Two-column layout */}
      <div className="mx-auto grid max-w-[1100px] gap-10 px-6 py-10 md:grid-cols-2">

        {/* ── LEFT: Configure ── */}
        <div className="space-y-8">
          <div>
            <SectionLabel>Configure</SectionLabel>

            {/* Event Name */}
            <div className="space-y-1.5 mb-4">
              <Label htmlFor="event-name" className="text-sm text-muted-foreground font-normal">
                Event Name
              </Label>
              <Input
                id="event-name"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g. Vacation, Birthday, Launch Day"
              />
            </div>

            {/* Target Date */}
            <div className="space-y-1.5">
              <Label htmlFor="target-date" className="text-sm text-muted-foreground font-normal">
                Target Date
              </Label>
              <Input
                id="target-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          {/* Style */}
          <div>
            <SectionLabel>Style</SectionLabel>
            <div className="grid grid-cols-3 gap-2">
              {STYLES.map(({ id, Icon, label: lbl }) => (
                <button
                  key={id}
                  onClick={() => setStyle(id)}
                  className={cn(
                    "flex flex-col cursor-pointer items-center justify-center gap-2 rounded-md border py-4 text-center transition-all duration-100",
                    style === id
                      ? "border-foreground/40 bg-foreground/[0.04]"
                      : "border-border bg-background hover:bg-muted/50"
                  )}
                >
                  <Icon className={cn("size-4", style === id ? "text-foreground" : "text-muted-foreground")} strokeWidth={1.5} />
                  <span className={cn("text-[11px] font-medium uppercase tracking-wide", style === id ? "text-foreground" : "text-muted-foreground")}>
                    {lbl}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Pattern */}
          <div>
            <SectionLabel>Pattern</SectionLabel>
            <div className="grid grid-cols-3 gap-2">
              {PATTERNS.map(({ id, Icon, label: lbl }) => (
                <button
                  key={id}
                  onClick={() => setPattern(id)}
                  className={cn(
                    "flex flex-col cursor-pointer items-center justify-center gap-2 rounded-md border py-4 text-center transition-all duration-100",
                    pattern === id
                      ? "border-foreground/40 bg-foreground/[0.04]"
                      : "border-border bg-background hover:bg-muted/50"
                  )}
                >
                  <Icon className={cn("size-4", pattern === id ? "text-foreground" : "text-muted-foreground")} strokeWidth={1.5} />
                  <span className={cn("text-[11px] font-medium uppercase tracking-wide", pattern === id ? "text-foreground" : "text-muted-foreground")}>
                    {lbl}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div>
            <SectionLabel>Color</SectionLabel>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((c) => (
                <button
                  key={c.hex}
                  title={c.name}
                  onClick={() => { setColor(c.hex); setUseCustom(false); }}
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
                  onChange={(e) => { setCustomColor(e.target.value); setUseCustom(true); }}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                />
              </div>
            </div>
          </div>

          {/* Show date toggle */}
          <div className="flex items-center gap-2.5">
            <Checkbox
              id="showDate"
              checked={showDate}
              onCheckedChange={(checked) => setShowDate(checked)}
            />
            <Label htmlFor="showDate" className="text-sm font-normal text-muted-foreground cursor-pointer select-none">
              Show target date on widget
            </Label>
          </div>

          {/* Embed URL */}
          <div>
            <SectionLabel>Embed URL</SectionLabel>
            <div className="flex gap-2">
              <Input
                readOnly
                value={embedUrl}
                className="flex-1 font-mono text-xs text-muted-foreground"
              />
              <Button onClick={copy} className="shrink-0 gap-1.5">
                {copied
                  ? <><Check className="size-3.5" /> Copied</>
                  : <><Copy className="size-3.5" /> Copy</>
                }
              </Button>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Preview + Instructions ── */}
        <div className="space-y-6">
          <div>
            <SectionLabel>Preview</SectionLabel>
            <div className="flex min-h-[260px] items-center justify-center rounded-xl border border-border bg-muted/30 p-8">
              <iframe
                key={embedUrl}
                src={embedUrl}
                className="h-[200px] w-[280px] overflow-hidden rounded-xl border-0"
              />
            </div>
          </div>

          {/* Instructions */}
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
        </div>
      </div>
    </div>
  );
}
