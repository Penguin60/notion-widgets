"use client";

import { useState, useMemo } from "react";

const COLORS = [
  { name: "Blue", hex: "5B8DDE" },
  { name: "Green", hex: "5BAA6E" },
  { name: "Rose", hex: "CF6679" },
  { name: "Gold", hex: "C59243" },
  { name: "Purple", hex: "8B6DB0" },
  { name: "Terracotta", hex: "D47A54" },
  { name: "Teal", hex: "4A9BA5" },
  { name: "Red", hex: "DE5B5B" },
];

const STYLES = [
  { id: "default", icon: "🔢", label: "Big Number" },
  { id: "compact", icon: "🧊", label: "Compact" },
  { id: "bar", icon: "📊", label: "Progress" },
];

const PATTERNS = [
  { id: "dots", icon: "· · ·", label: "Dots" },
  { id: "stripes", icon: "|||", label: "Stripes" },
  { id: "none", icon: "—", label: "None" },
];

function defaultDate() {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toISOString().split("T")[0];
}

export default function Home() {
  const [label, setLabel] = useState("Vacation");
  const [date, setDate] = useState(defaultDate);
  const [color, setColor] = useState("5B8DDE");
  const [customColor, setCustomColor] = useState("#5B8DDE");
  const [useCustom, setUseCustom] = useState(false);
  const [style, setStyle] = useState("default");
  const [pattern, setPattern] = useState("dots");
  const [showDate, setShowDate] = useState(true);
  const [copied, setCopied] = useState(false);

  const activeColor = useCustom ? customColor.replace("#", "") : color;

  const embedUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    const base = window.location.origin + "/widget";
    const p = new URLSearchParams();
    p.set("date", date);
    p.set("label", label || "Event");
    p.set("color", activeColor);
    p.set("pattern", pattern);
    p.set("style", style);
    if (!showDate) p.set("showdate", "false");
    return `${base}?${p.toString()}`;
  }, [date, label, activeColor, pattern, style, showDate]);

  const copy = async () => {
    await navigator.clipboard.writeText(embedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="flex items-center gap-3.5 border-b border-[var(--color-border)] px-8 py-5">
        <div className="grid h-9 w-9 place-items-center rounded-[10px] bg-[var(--color-accent)] text-lg font-black text-white">
          D
        </div>
        <h1 className="text-lg font-bold">Dean Widgets</h1>
        <span className="ml-auto text-sm text-[var(--color-text2)]">
          Days Until Counter for Notion
        </span>
      </header>

      {/* Main grid */}
      <div className="mx-auto grid max-w-[1100px] gap-12 px-8 py-10 md:grid-cols-2">
        {/* LEFT – Config */}
        <div>
          <h2 className="mb-5 text-xs font-bold uppercase tracking-widest text-[var(--color-text2)]">
            Configure Your Widget
          </h2>

          {/* Event name */}
          <div className="mb-5">
            <label className="mb-1.5 block text-[13px] font-semibold text-[var(--color-text2)]">
              Event Name
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Vacation, Birthday, Launch Day"
              className="w-full rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface2)] px-3.5 py-2.5 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-accent)]"
            />
          </div>

          {/* Date */}
          <div className="mb-5">
            <label className="mb-1.5 block text-[13px] font-semibold text-[var(--color-text2)]">
              Target Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface2)] px-3.5 py-2.5 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-accent)]"
            />
          </div>

          {/* Style */}
          <div className="mb-5">
            <label className="mb-1.5 block text-[13px] font-semibold text-[var(--color-text2)]">
              Style
            </label>
            <div className="flex gap-2.5 flex-wrap">
              {STYLES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStyle(s.id)}
                  className={`flex-1 min-w-[90px] rounded-[10px] border-2 px-2.5 py-3 text-center transition-colors ${
                    style === s.id
                      ? "border-[var(--color-accent)]"
                      : "border-[var(--color-border)] hover:border-[var(--color-text2)]"
                  } bg-[var(--color-surface2)]`}
                >
                  <div className="text-2xl">{s.icon}</div>
                  <div className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-[var(--color-text2)]">
                    {s.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Pattern */}
          <div className="mb-5">
            <label className="mb-1.5 block text-[13px] font-semibold text-[var(--color-text2)]">
              Pattern
            </label>
            <div className="flex gap-2.5 flex-wrap">
              {PATTERNS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPattern(p.id)}
                  className={`flex-1 min-w-[90px] rounded-[10px] border-2 px-2.5 py-3 text-center transition-colors ${
                    pattern === p.id
                      ? "border-[var(--color-accent)]"
                      : "border-[var(--color-border)] hover:border-[var(--color-text2)]"
                  } bg-[var(--color-surface2)]`}
                >
                  <div className="text-2xl leading-none">{p.icon}</div>
                  <div className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-[var(--color-text2)]">
                    {p.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div className="mb-5">
            <label className="mb-1.5 block text-[13px] font-semibold text-[var(--color-text2)]">
              Color
            </label>
            <div className="flex flex-wrap gap-2.5">
              {COLORS.map((c) => (
                <button
                  key={c.hex}
                  title={c.name}
                  onClick={() => {
                    setColor(c.hex);
                    setUseCustom(false);
                  }}
                  className={`h-9 w-9 rounded-[10px] border-[3px] transition-transform hover:scale-110 ${
                    !useCustom && color === c.hex
                      ? "border-white"
                      : "border-transparent"
                  }`}
                  style={{ background: `#${c.hex}` }}
                />
              ))}
              <div className="relative h-9 w-9">
                <div className="pointer-events-none grid h-full w-full place-items-center rounded-[10px] border-2 border-dashed border-[var(--color-border)] text-base">
                  🎨
                </div>
                <input
                  type="color"
                  value={customColor}
                  onChange={(e) => {
                    setCustomColor(e.target.value);
                    setUseCustom(true);
                  }}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                />
              </div>
            </div>
          </div>

          {/* Show date checkbox */}
          <div className="mb-5 flex items-center gap-2">
            <input
              type="checkbox"
              id="showDate"
              checked={showDate}
              onChange={(e) => setShowDate(e.target.checked)}
              className="h-4 w-4 accent-[var(--color-accent)]"
            />
            <label
              htmlFor="showDate"
              className="cursor-pointer text-[13px] text-[var(--color-text2)]"
            >
              Show target date on widget
            </label>
          </div>

          {/* Embed URL */}
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-[var(--color-text2)]">
              Embed URL (paste in Notion)
            </label>
            <div className="flex gap-2">
              <input
                readOnly
                value={embedUrl}
                className="flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface2)] px-3.5 py-2.5 font-mono text-xs text-[var(--color-text)] outline-none"
              />
              <button
                onClick={copy}
                className={`whitespace-nowrap rounded-lg px-5 py-2.5 text-[13px] font-semibold text-white transition-colors ${
                  copied ? "bg-green-600" : "bg-[var(--color-accent)] hover:opacity-85"
                }`}
              >
                {copied ? "✓ Copied!" : "Copy"}
              </button>
            </div>
          </div>

          {/* Hosting note */}
          <div className="mt-4 rounded-[10px] border border-[rgba(91,141,222,0.2)] bg-[rgba(91,141,222,0.08)] p-3.5 text-xs leading-relaxed text-[var(--color-text2)]">
            <strong className="text-[var(--color-accent)]">💡 How to use:</strong>{" "}
            Deploy this site to Vercel, then paste the embed URL into a Notion{" "}
            <code className="rounded bg-[var(--color-surface2)] px-1.5 py-0.5 text-[11px]">
              /embed
            </code>{" "}
            block. The widget auto-updates every page load.
          </div>
        </div>

        {/* RIGHT – Preview */}
        <div>
          <h2 className="mb-5 text-xs font-bold uppercase tracking-widest text-[var(--color-text2)]">
            Live Preview
          </h2>

          <div className="mb-6 flex min-h-[260px] items-center justify-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8">
            <iframe
              key={embedUrl}
              src={embedUrl}
              className="h-[200px] w-[280px] overflow-hidden rounded-2xl border-0"
            />
          </div>

          {/* Instructions */}
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <h3 className="mb-2.5 text-[13px] font-bold">
              How to Embed in Notion
            </h3>
            <ol className="list-decimal space-y-1 pl-5 text-[13px] leading-relaxed text-[var(--color-text2)]">
              <li>Configure your widget using the options on the left.</li>
              <li>
                Click <strong className="text-[var(--color-text)]">Copy</strong>{" "}
                to copy the embed URL.
              </li>
              <li>
                In Notion, type{" "}
                <code className="rounded bg-[var(--color-surface2)] px-1.5 py-0.5 text-xs">
                  /embed
                </code>{" "}
                and press Enter.
              </li>
              <li>
                Paste the URL and click{" "}
                <strong className="text-[var(--color-text)]">Embed link</strong>.
              </li>
              <li>Resize the block to fit your layout.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
