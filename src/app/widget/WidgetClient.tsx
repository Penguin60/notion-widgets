"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function Widget() {
  const params = useSearchParams();

  const targetDate = params.get("date") || "";
  const eventLabel = params.get("label") || "Event";
  const bgColor = "#" + (params.get("color") || "5B8DDE");
  const pattern = params.get("pattern") || "dots";
  const style = params.get("style") || "default";
  const showDate = params.get("showdate") !== "false";

  if (!targetDate) {
    return (
      <div style={{ ...baseStyle, background: bgColor }} className={patternClass(pattern)}>
        <span style={{ fontSize: 14, fontWeight: 600, opacity: 0.9, letterSpacing: 1 }}>
          No date set
        </span>
      </div>
    );
  }

  const target = new Date(targetDate + "T00:00:00");
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const diffDays = Math.ceil((target.getTime() - now.getTime()) / 86_400_000);

  const formatDate = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  // -------- Bar style --------
  if (style === "bar") {
    const totalDays = 100;
    const elapsed = totalDays - Math.max(0, diffDays);
    const pct = Math.min(100, Math.max(0, Math.round((elapsed / totalDays) * 100)));

    return (
      <div
        style={{ ...baseStyle, background: bgColor, alignItems: "stretch", padding: "20px 28px" }}
        className={patternClass(pattern)}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10, position: "relative", zIndex: 1 }}>
          <span style={{ fontSize: 16, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>
            {eventLabel}
          </span>
          <span style={{ fontSize: 28, fontWeight: 900 }}>
            {Math.max(0, diffDays)}{" "}
            <span style={{ fontSize: 13, fontWeight: 600, opacity: 0.7 }}>days left</span>
          </span>
        </div>
        <div style={{ width: "100%", height: 10, background: "rgba(255,255,255,0.25)", borderRadius: 5, overflow: "hidden", position: "relative", zIndex: 1 }}>
          <div style={{ height: "100%", width: `${pct}%`, background: "#fff", borderRadius: 5, transition: "width 0.6s ease" }} />
        </div>
        {showDate && (
          <div style={{ ...targetDateStyle, position: "relative", zIndex: 1 }}>{formatDate(target)}</div>
        )}
      </div>
    );
  }

  // -------- Compact style --------
  if (style === "compact") {
    return (
      <div style={{ ...baseStyle, background: bgColor, gap: 2 }} className={patternClass(pattern)}>
        <div style={{ ...labelStyle, position: "relative", zIndex: 1 }}>{eventLabel}</div>
        {diffDays < 0 ? (
          <>
            <div style={{ ...numberStyle, fontSize: 56, position: "relative", zIndex: 1 }}>{Math.abs(diffDays)}</div>
            <div style={{ ...wordStyle, position: "relative", zIndex: 1 }}>days ago</div>
          </>
        ) : diffDays === 0 ? (
          <div style={{ ...numberStyle, fontSize: 32, position: "relative", zIndex: 1 }}>🎉 Today!</div>
        ) : (
          <>
            <div style={{ ...numberStyle, fontSize: 56, position: "relative", zIndex: 1 }}>{diffDays}</div>
            <div style={{ ...wordStyle, position: "relative", zIndex: 1 }}>days</div>
          </>
        )}
      </div>
    );
  }

  // -------- Default large style --------
  return (
    <div style={{ ...baseStyle, background: bgColor }} className={patternClass(pattern)}>
      <div style={{ ...labelStyle, position: "relative", zIndex: 1 }}>{eventLabel}</div>
      {diffDays < 0 ? (
        <>
          <div style={{ ...numberStyle, fontSize: 36, position: "relative", zIndex: 1 }}>{Math.abs(diffDays)}</div>
          <div style={{ ...wordStyle, position: "relative", zIndex: 1 }}>days ago</div>
        </>
      ) : diffDays === 0 ? (
        <div style={{ ...numberStyle, fontSize: 40, position: "relative", zIndex: 1 }}>🎉 Today!</div>
      ) : (
        <>
          <div style={{ ...numberStyle, position: "relative", zIndex: 1 }}>{diffDays}</div>
          <div style={{ ...wordStyle, position: "relative", zIndex: 1 }}>days until</div>
        </>
      )}
      {showDate && (
        <div style={{ ...targetDateStyle, position: "relative", zIndex: 1 }}>{formatDate(target)}</div>
      )}
    </div>
  );
}

// ---------- Shared inline styles ----------

const baseStyle: React.CSSProperties = {
  width: "100%",
  height: "100vh",
  minHeight: 120,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 0,
  padding: "24px 20px",
  color: "#fff",
  fontFamily: "'Inter', system-ui, sans-serif",
  position: "relative",
  overflow: "hidden",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 600,
  letterSpacing: 1,
  textTransform: "uppercase",
  opacity: 0.9,
  marginBottom: 6,
};

const numberStyle: React.CSSProperties = {
  fontSize: 72,
  fontWeight: 900,
  lineHeight: 1,
  letterSpacing: -2,
};

const wordStyle: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: 2,
  opacity: 0.85,
  marginTop: 4,
};

const targetDateStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 400,
  opacity: 0.6,
  marginTop: 8,
};

function patternClass(pattern: string) {
  if (pattern === "dots") return "widget-dots";
  if (pattern === "stripes") return "widget-stripes";
  return undefined;
}

// ---------- Export with Suspense boundary for useSearchParams ----------

export default function WidgetClient() {
  return (
    <>
      {/* Pattern styles injected via <style> to keep widget self-contained */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { width: 100%; height: 100%; overflow: hidden; background: transparent; }
        .widget-dots::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(255,255,255,0.18) 1.5px, transparent 1.5px);
          background-size: 12px 12px;
          pointer-events: none;
          z-index: 0;
        }
        .widget-stripes::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: repeating-linear-gradient(
            90deg,
            rgba(255,255,255,0.10) 0px,
            rgba(255,255,255,0.10) 2px,
            transparent 2px,
            transparent 8px
          );
          pointer-events: none;
          z-index: 0;
        }
      `}</style>
      <Suspense
        fallback={
          <div style={{ ...baseStyle, background: "#5B8DDE" }}>
            <span style={{ opacity: 0.7, fontSize: 14 }}>Loading…</span>
          </div>
        }
      >
        <Widget />
      </Suspense>
    </>
  );
}
