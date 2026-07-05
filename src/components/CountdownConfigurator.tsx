"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Copy, Check } from "lucide-react";
import {
  STYLES,
  PATTERNS,
  SectionLabel,
  OptionGrid,
  ColorPicker,
  EmbedInstructions,
} from "@/components/widget-config-ui";

function defaultDate() {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toISOString().split("T")[0];
}

export default function CountdownConfigurator() {
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
    <div className="grid gap-10 md:grid-cols-2">
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

        {/* Show date toggle */}
        <div className="flex items-center gap-2.5">
          <Checkbox
            id="cd-showDate"
            checked={showDate}
            onCheckedChange={(checked) => setShowDate(!!checked)}
          />
          <Label htmlFor="cd-showDate" className="text-sm font-normal text-muted-foreground cursor-pointer select-none">
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

        <EmbedInstructions />
      </div>
    </div>
  );
}
