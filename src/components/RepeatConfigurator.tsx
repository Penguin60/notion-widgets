"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Copy, Check } from "lucide-react";
import {
  STYLES,
  PATTERNS,
  SectionLabel,
  OptionGrid,
  ColorPicker,
  EmbedInstructions,
} from "@/components/widget-config-ui";
import { frequencyLabel, type Unit } from "@/lib/recurrence";

const UNITS: { id: Unit; label: string }[] = [
  { id: "days",   label: "Days"   },
  { id: "weeks",  label: "Weeks"  },
  { id: "months", label: "Months" },
];

function today() {
  return new Date().toISOString().split("T")[0];
}

export default function RepeatConfigurator() {
  const [label,       setLabel]       = useState("Water plants");
  const [start,       setStart]       = useState(today);
  const [interval,    setInterval]    = useState(1);
  const [unit,        setUnit]        = useState<Unit>("weeks");
  const [color,       setColor]       = useState("5BAA6E");
  const [customColor, setCustomColor] = useState("#5BAA6E");
  const [useCustom,   setUseCustom]   = useState(false);
  const [style,       setStyle]       = useState("default");
  const [pattern,     setPattern]     = useState("dots");
  const [showDate,    setShowDate]    = useState(true);
  const [showFreq,    setShowFreq]    = useState(true);
  const [copied,      setCopied]      = useState(false);

  const activeColor = useCustom ? customColor.replace("#", "") : color;
  const safeInterval = Math.max(1, Math.floor(interval) || 1);

  const [embedUrl, setEmbedUrl] = useState("");

  useEffect(() => {
    const base = window.location.origin + "/repeat";
    const p = new URLSearchParams();
    p.set("start", start);
    p.set("interval", String(safeInterval));
    p.set("unit", unit);
    p.set("label", label || "Task");
    p.set("color", activeColor);
    p.set("pattern", pattern);
    p.set("style", style);
    if (!showDate) p.set("showdate", "false");
    if (!showFreq) p.set("showfreq", "false");
    setEmbedUrl(`${base}?${p.toString()}`);
  }, [start, safeInterval, unit, label, activeColor, pattern, style, showDate, showFreq]);

  const copy = async () => {
    await navigator.clipboard.writeText(embedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid gap-10 md:grid-cols-2">
      {/* ── LEFT: Configure ── */}
      <div className="space-y-8">
        <div>
          <SectionLabel>Configure</SectionLabel>

          {/* Task Name */}
          <div className="space-y-1.5 mb-4">
            <Label htmlFor="task-name" className="text-sm text-muted-foreground font-normal">
              Task Name
            </Label>
            <Input
              id="task-name"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Water plants, Pay rent, Standup"
            />
          </div>

          {/* Start Date */}
          <div className="space-y-1.5 mb-4">
            <Label htmlFor="start-date" className="text-sm text-muted-foreground font-normal">
              Start Date
            </Label>
            <Input
              id="start-date"
              type="date"
              value={start}
              onChange={(e) => setStart(e.target.value)}
            />
          </div>

          {/* Repeats every N units */}
          <div className="space-y-1.5">
            <Label className="text-sm text-muted-foreground font-normal">Repeats every</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                min={1}
                value={interval}
                onChange={(e) => setInterval(parseInt(e.target.value, 10))}
                className="w-20 shrink-0"
                aria-label="Interval"
              />
              <div className="grid flex-1 grid-cols-3 gap-2">
                {UNITS.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => setUnit(u.id)}
                    className={cn(
                      "cursor-pointer rounded-md border py-2 text-center text-[13px] font-medium transition-all duration-100",
                      unit === u.id
                        ? "border-foreground/40 bg-foreground/[0.04] text-foreground"
                        : "border-border bg-background text-muted-foreground hover:bg-muted/50"
                    )}
                  >
                    {u.label}
                  </button>
                ))}
              </div>
            </div>
            <p className="pt-1 text-[12px] text-muted-foreground">
              Repeats <span className="text-foreground">{frequencyLabel(safeInterval, unit)}</span> from the start date.
            </p>
          </div>
        </div>

        {/* Style */}
        <div>
          <SectionLabel>Style</SectionLabel>
          <OptionGrid options={STYLES} value={style} onChange={setStyle} />
        </div>

        {/* Pattern */}
        <div>
          <SectionLabel>Pattern</SectionLabel>
          <OptionGrid options={PATTERNS} value={pattern} onChange={setPattern} />
        </div>

        {/* Color */}
        <div>
          <SectionLabel>Color</SectionLabel>
          <ColorPicker
            color={color}
            useCustom={useCustom}
            customColor={customColor}
            onPreset={(hex) => { setColor(hex); setUseCustom(false); }}
            onCustom={(hex) => { setCustomColor(hex); setUseCustom(true); }}
          />
        </div>

        {/* Toggles */}
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <Checkbox
              id="rp-showFreq"
              checked={showFreq}
              onCheckedChange={(checked) => setShowFreq(!!checked)}
            />
            <Label htmlFor="rp-showFreq" className="text-sm font-normal text-muted-foreground cursor-pointer select-none">
              Show frequency on widget
            </Label>
          </div>
          <div className="flex items-center gap-2.5">
            <Checkbox
              id="rp-showDate"
              checked={showDate}
              onCheckedChange={(checked) => setShowDate(!!checked)}
            />
            <Label htmlFor="rp-showDate" className="text-sm font-normal text-muted-foreground cursor-pointer select-none">
              Show next date on widget
            </Label>
          </div>
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

        <EmbedInstructions />
      </div>
    </div>
  );
}
