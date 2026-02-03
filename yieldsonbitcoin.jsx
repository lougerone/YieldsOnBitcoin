"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useBtcPrice } from "@/lib/hooks/useBtcPrice";
import { useProtocols } from "@/lib/hooks/useProtocols";
import { CATEGORIES, RISK_LEVELS, SORT_OPTIONS, STRATEGIES } from "@/lib/constants/protocols";

/* ─── Sparkline ─── */
function MiniSparkline({ data, color, width = 80, height = 28 }) {
  const min = Math.min(...data), max = Math.max(...data), range = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * width},${height - ((v - min) / range) * (height - 4) - 2}`).join(" ");
  const uid = `sg${color.replace("#", "")}${width}`;
  return (
    <svg width={width} height={height} style={{ display: "block" }}>
      <defs><linearGradient id={uid} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity="0.3" /><stop offset="100%" stopColor={color} stopOpacity="0" /></linearGradient></defs>
      <polygon points={`0,${height} ${pts} ${width},${height}`} fill={`url(#${uid})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RiskBadge({ risk }) {
  const c = { Low: "#4ADE80", Medium: "#FBBF24", High: "#F87171" }[risk];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 600, background: `${c}15`, color: c, border: `1px solid ${c}30`, letterSpacing: "0.03em", textTransform: "uppercase" }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: c }} />{risk}
    </span>
  );
}

/* ─── Risk Score Grade ─── */
function RiskGrade({ risk }) {
  const grades = { Low: { grade: "AA-", label: "Stable", color: "#4ADE80" }, Medium: { grade: "BB+", label: "Moderate", color: "#FBBF24" }, High: { grade: "B-", label: "Volatile", color: "#F87171" } };
  const { grade, label, color } = grades[risk];
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
      <span style={{ fontFamily: "'Sora', sans-serif", fontSize: 28, fontWeight: 700, color: "#F7F7F8" }}>{grade}</span>
      <span style={{ fontSize: 12, color }}>{label}</span>
    </div>
  );
}

/* ─── APY Chart Component ─── */
function APYChart({ data, color, height = 180 }) {
  const min = Math.min(...data) * 0.9;
  const max = Math.max(...data) * 1.05;
  const range = max - min || 1;
  const barWidth = 100 / data.length;

  return (
    <div style={{ position: "relative", height, width: "100%" }}>
      {/* Y-axis labels */}
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 20, width: 45, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <span style={{ fontSize: 10, color: "#52525B" }}>{max.toFixed(1)}%</span>
        <span style={{ fontSize: 10, color: "#52525B" }}>{((max + min) / 2).toFixed(1)}%</span>
        <span style={{ fontSize: 10, color: "#52525B" }}>{min.toFixed(1)}%</span>
      </div>
      {/* Chart area */}
      <div style={{ position: "absolute", left: 50, right: 0, top: 0, bottom: 20, display: "flex", alignItems: "flex-end", gap: 4 }}>
        {data.map((v, i) => (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{
              width: "100%", maxWidth: 40,
              height: `${((v - min) / range) * 100}%`,
              background: `linear-gradient(180deg, ${color} 0%, ${color}60 100%)`,
              borderRadius: "4px 4px 0 0",
              minHeight: 8
            }} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Protocol Detail View ─── */
function ProtocolDetail({ protocol, btcPrice, btcAmount, setBtcAmount, onBack, onAllocate }) {
  const [chartTab, setChartTab] = useState("1W");
  const [allocateAmount, setAllocateAmount] = useState("0.00");

  // Generate audit display from protocol auditors data
  const auditIcons = ["🛡️", "🔒", "✓", "◆", "⚡"];
  const auditDates = ["Jan 2025", "Nov 2024", "Sep 2024", "Jun 2024", "Mar 2024"];
  const audits = (protocol.auditors || []).slice(0, 4).map((auditor, i) => ({
    name: `${auditor} Audit`,
    date: auditDates[i] || "2024",
    icon: auditIcons[i] || "✓"
  }));

  // Use protocol-specific mechanics from data
  const mechanics = protocol.mechanics || [
    "Protocol-specific yield generation mechanism",
    "Automated compounding of earned rewards",
    "Transparent on-chain operations"
  ];

  // Calculate estimated yield
  const estYearlyYield = parseFloat(allocateAmount || 0) * protocol.apy / 100;
  const protocolFee = 0.05; // 0.05%

  // Mock sentiment (random but deterministic based on protocol id)
  const sentiment = 60 + (protocol.id * 7) % 35;

  return (
    <div style={{ animation: "slideU 0.4s ease forwards" }}>
      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24, fontSize: 13, color: "#71717A" }}>
        <span onClick={onBack} style={{ cursor: "pointer", color: "#A1A1AA" }}>Protocols</span>
        <span>›</span>
        <span style={{ color: "#F7F7F8" }}>{protocol.name}</span>
      </div>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 16,
            background: `${protocol.color}15`, border: `1px solid ${protocol.color}30`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 32, color: protocol.color
          }}>{protocol.logo}</div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: 28, fontWeight: 700, color: "#F7F7F8", margin: 0 }}>{protocol.name}</h1>
              <span style={{ color: "#38BDF8", fontSize: 18 }}>✓</span>
            </div>
            <div style={{ fontSize: 13, color: "#71717A", marginTop: 4 }}>
              {protocol.category} • <span style={{ color: protocol.color }}>{protocol.chain}</span>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <a href={protocol.website} target="_blank" rel="noopener noreferrer" style={{
            padding: "10px 20px", borderRadius: 8, border: "1px solid #1E1F2A",
            background: "#111218", color: "#A1A1AA", fontFamily: "'Sora', sans-serif",
            fontSize: 13, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
            textDecoration: "none"
          }}>
            <span style={{ fontSize: 14 }}>↗</span> Visit Website
          </a>
          <button style={{
            padding: "10px 16px", borderRadius: 8, border: "1px solid #1E1F2A",
            background: "#111218", color: "#A1A1AA", fontSize: 14, cursor: "pointer"
          }}>⋯</button>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 28 }}>
        <div style={{ padding: "16px 20px", borderRadius: 12, background: "linear-gradient(135deg, #111218, #0D0E14)", border: "1px solid #1E1F2A" }}>
          <div style={{ fontSize: 10, color: "#71717A", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Current APY</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{ fontFamily: "'Sora', sans-serif", fontSize: 28, fontWeight: 700, color: "#4ADE80" }}>{protocol.apy}%</span>
            <span style={{ fontSize: 11, color: "#4ADE80" }}>+{((protocol.apy - protocol.apyRange[0]) / protocol.apyRange[0] * 100).toFixed(1)}%</span>
          </div>
        </div>
        <div style={{ padding: "16px 20px", borderRadius: 12, background: "linear-gradient(135deg, #111218, #0D0E14)", border: "1px solid #1E1F2A" }}>
          <div style={{ fontSize: 10, color: "#71717A", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Total TVL</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{ fontFamily: "'Sora', sans-serif", fontSize: 28, fontWeight: 700, color: "#F7F7F8" }}>{formatTVL(protocol.tvl)}</span>
            <span style={{ fontSize: 11, color: "#4ADE80" }}>+5.4%</span>
          </div>
        </div>
        <div style={{ padding: "16px 20px", borderRadius: 12, background: "linear-gradient(135deg, #111218, #0D0E14)", border: "1px solid #1E1F2A" }}>
          <div style={{ fontSize: 10, color: "#71717A", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Risk Score</div>
          <RiskGrade risk={protocol.risk} />
        </div>
        <div style={{ padding: "16px 20px", borderRadius: 12, background: "linear-gradient(135deg, #111218, #0D0E14)", border: "1px solid #1E1F2A" }}>
          <div style={{ fontSize: 10, color: "#71717A", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Lock-up</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{ fontFamily: "'Sora', sans-serif", fontSize: 28, fontWeight: 700, color: "#F7F7F8" }}>{protocol.lockup === "None" ? "None" : protocol.lockup.split(" ")[0]}</span>
            {protocol.lockup === "None" ? (
              <span style={{ fontSize: 11, color: "#4ADE80" }}>Liquid</span>
            ) : (
              <span style={{ fontSize: 11, color: "#71717A" }}>{protocol.lockup.includes("days") ? "days" : ""}</span>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24 }}>
        {/* Left Column */}
        <div>
          {/* APY Chart */}
          <div style={{ padding: 24, borderRadius: 12, background: "linear-gradient(135deg, #111218, #0D0E14)", border: "1px solid #1E1F2A", marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div style={{ display: "flex", gap: 16 }}>
                {["APY History", "TVL Growth"].map(tab => (
                  <span key={tab} style={{
                    fontSize: 13, fontWeight: 500, cursor: "pointer", paddingBottom: 8,
                    color: tab === "APY History" ? "#F7931A" : "#71717A",
                    borderBottom: tab === "APY History" ? "2px solid #F7931A" : "none"
                  }}>{tab}</span>
                ))}
              </div>
              <div style={{ display: "flex", gap: 4 }}>
                {["1D", "1W", "1M", "ALL"].map(t => (
                  <button key={t} onClick={() => setChartTab(t)} style={{
                    padding: "4px 12px", borderRadius: 4, border: "none",
                    background: chartTab === t ? "rgba(247,147,26,0.15)" : "transparent",
                    color: chartTab === t ? "#F7931A" : "#71717A",
                    fontSize: 11, fontWeight: 500, cursor: "pointer"
                  }}>{t}</button>
                ))}
              </div>
            </div>
            <APYChart data={protocol.trend} color={protocol.color} height={160} />
          </div>

          {/* Protocol Mechanics */}
          <div style={{ padding: 24, borderRadius: 12, background: "linear-gradient(135deg, #111218, #0D0E14)", border: "1px solid #1E1F2A", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <span style={{ color: "#38BDF8" }}>⚙</span>
              <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: 16, fontWeight: 600, color: "#F7F7F8", margin: 0 }}>Protocol Mechanics</h3>
            </div>
            <p style={{ fontSize: 13, color: "#A1A1AA", lineHeight: 1.7, margin: "0 0 16px 0" }}>{protocol.description}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {mechanics.map((m, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <span style={{ color: "#4ADE80", fontSize: 8, marginTop: 6 }}>●</span>
                  <span style={{ fontSize: 13, color: "#71717A", lineHeight: 1.5 }}>{m}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Risk & Security Audit */}
          <div style={{ padding: 24, borderRadius: 12, background: "linear-gradient(135deg, #111218, #0D0E14)", border: "1px solid #1E1F2A", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <span style={{ color: "#FBBF24" }}>🛡</span>
              <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: 16, fontWeight: 600, color: "#F7F7F8", margin: 0 }}>Risk & Security Audit</h3>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
              {audits.map((audit, i) => (
                <div key={i} style={{
                  padding: "14px 16px", borderRadius: 10,
                  background: "#0D0E14", border: "1px solid #1E1F2A",
                  display: "flex", alignItems: "center", justifyContent: "space-between"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 16 }}>{audit.icon}</span>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#E4E4E7" }}>{audit.name}</div>
                      <div style={{ fontSize: 10, color: "#52525B" }}>Passed {audit.date}</div>
                    </div>
                  </div>
                  <span style={{ color: "#4ADE80" }}>✓</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Allocate Panel */}
        <div>
          {/* Allocate BTC Panel */}
          <div style={{ padding: 24, borderRadius: 12, background: "linear-gradient(135deg, rgba(247,147,26,0.06), #111218)", border: "1px solid #F7931A25", position: "sticky", top: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: 16, fontWeight: 600, color: "#F7F7F8", margin: 0 }}>Allocate BTC</h3>
              <span style={{ padding: "3px 8px", borderRadius: 4, background: "rgba(74, 222, 128, 0.15)", color: "#4ADE80", fontSize: 10, fontWeight: 600 }}>ACTIVE</span>
            </div>

            {/* Input Amount */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 10, color: "#71717A", textTransform: "uppercase", letterSpacing: "0.08em" }}>Input Amount</span>
                <span style={{ fontSize: 10, color: "#F7931A" }}>BALANCE: 0.245 BTC</span>
              </div>
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "12px 16px", borderRadius: 8, background: "#08090E", border: "1px solid #1E1F2A"
              }}>
                <input
                  type="text" value={allocateAmount} onChange={e => setAllocateAmount(e.target.value)}
                  placeholder="0.00"
                  style={{
                    border: "none", background: "transparent", color: "#71717A",
                    fontSize: 18, fontFamily: "'Sora', sans-serif", fontWeight: 600,
                    outline: "none", width: 120
                  }}
                />
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <button style={{
                    padding: "4px 8px", borderRadius: 4, background: "#1E1F2A",
                    border: "none", color: "#71717A", fontSize: 10, cursor: "pointer"
                  }}>MAX</button>
                  <span style={{ display: "flex", alignItems: "center", gap: 4, color: "#F7F7F8", fontSize: 13, fontWeight: 600 }}>
                    <span style={{ color: "#F7931A" }}>₿</span> BTC
                  </span>
                </div>
              </div>
            </div>

            {/* Details */}
            <div style={{ padding: 16, borderRadius: 8, background: "#08090E", marginBottom: 20 }}>
              {[
                ["Estimated Yearly Yield", `${estYearlyYield.toFixed(4)} BTC`, "#4ADE80"],
                ["Protocol Fee", `${protocolFee}%`, "#A1A1AA"],
                ["Withdrawal Period", protocol.lockup === "None" ? "Instant" : protocol.lockup, "#A1A1AA"],
              ].map(([l, v, c], i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: i < 2 ? 12 : 0 }}>
                  <span style={{ fontSize: 12, color: "#71717A" }}>{l}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: c }}>{v}</span>
                </div>
              ))}
            </div>

            {/* You will receive */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, padding: "0 4px" }}>
              <span style={{ fontSize: 12, fontWeight: 500, color: "#A1A1AA" }}>You will receive</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#F7F7F8" }}>~{allocateAmount || "0.00"} {protocol.name.split(" ")[0]}BTC</span>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => onAllocate(protocol)}
              style={{
                width: "100%", padding: 16, borderRadius: 10, border: "none", cursor: "pointer",
                background: "linear-gradient(135deg, #38BDF8, #0EA5E9)", color: "#08090E",
                fontFamily: "'Sora', sans-serif", fontSize: 14, fontWeight: 700,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                boxShadow: "0 4px 20px rgba(56, 189, 248, 0.3)"
              }}
            >
              <span style={{ fontSize: 16 }}>₿</span> Connect Wallet to Deposit
            </button>

            <p style={{ fontSize: 10, color: "#52525B", textAlign: "center", marginTop: 12, lineHeight: 1.5 }}>
              By depositing, you agree to the protocol's <span style={{ color: "#71717A", textDecoration: "underline", cursor: "pointer" }}>Terms of Service</span> and acknowledge the inherent smart contract risks.
            </p>
          </div>

          {/* Market Sentiment */}
          <div style={{ padding: 20, borderRadius: 12, background: "linear-gradient(135deg, #111218, #0D0E14)", border: "1px solid #1E1F2A", marginTop: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <span style={{ color: "#A78BFA" }}>📈</span>
              <h4 style={{ fontFamily: "'Sora', sans-serif", fontSize: 14, fontWeight: 600, color: "#F7F7F8", margin: 0 }}>Market Sentiment</h4>
            </div>
            <div style={{ height: 8, borderRadius: 4, background: "#1E1F2A", overflow: "hidden", marginBottom: 8 }}>
              <div style={{ width: `${sentiment}%`, height: "100%", background: "linear-gradient(90deg, #EF4444, #FBBF24, #4ADE80)", borderRadius: 4 }} />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <span style={{ fontSize: 12, color: "#4ADE80", fontWeight: 500 }}>{sentiment}% Bullish</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatTVL(m) { return m >= 1000 ? `$${(m / 1000).toFixed(1)}B` : `$${m}M`; }

/* ─── Particles ─── */
function Particles() {
  const ps = useMemo(() => Array.from({ length: 25 }, (_, i) => ({ id: i, x: Math.random() * 100, y: Math.random() * 100, s: 1 + Math.random() * 2, d: 15 + Math.random() * 25, dl: Math.random() * -20, o: 0.08 + Math.random() * 0.2 })), []);
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {ps.map(p => <div key={p.id} style={{ position: "absolute", left: `${p.x}%`, top: `${p.y}%`, width: p.s, height: p.s, borderRadius: "50%", background: "#F7931A", opacity: p.o, animation: `floatP ${p.d}s ease-in-out ${p.dl}s infinite` }} />)}
    </div>
  );
}

/* ─── Data Status Indicator ─── */
function DataStatusIndicator({ priceStatus, protocolStatus, onRefresh, isValidating }) {
  const combinedStatus = priceStatus === "offline" || protocolStatus === "offline"
    ? "offline"
    : priceStatus === "cached" || protocolStatus === "cached"
      ? "cached"
      : "live";

  const statusConfig = {
    live: { color: "#4ADE80", label: "LIVE", bg: "rgba(74, 222, 128, 0.1)" },
    cached: { color: "#FBBF24", label: "CACHED", bg: "rgba(251, 191, 36, 0.1)" },
    offline: { color: "#F87171", label: "OFFLINE", bg: "rgba(248, 113, 113, 0.1)" },
  };

  const { color, label, bg } = statusConfig[combinedStatus];

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "4px 10px", borderRadius: 6,
        background: bg, border: `1px solid ${color}30`
      }}>
        <span style={{
          width: 6, height: 6, borderRadius: "50%", background: color,
          animation: combinedStatus === "live" ? "pulse 2s infinite" : "none",
          boxShadow: combinedStatus === "live" ? `0 0 8px ${color}` : "none"
        }} />
        <span style={{ fontSize: 10, fontWeight: 600, color, letterSpacing: "0.05em" }}>{label}</span>
      </div>
      {onRefresh && (
        <button
          onClick={onRefresh}
          disabled={isValidating}
          style={{
            padding: "4px 8px", borderRadius: 4, border: "1px solid #1E1F2A",
            background: "transparent", color: "#71717A", fontSize: 11,
            cursor: isValidating ? "not-allowed" : "pointer",
            opacity: isValidating ? 0.5 : 1,
            fontFamily: "inherit"
          }}
        >
          {isValidating ? "..." : "Refresh"}
        </button>
      )}
    </div>
  );
}

/* ═══════════════════════════ MAIN ═══════════════════════════ */
export default function App({ initialPage = "home", initialView = "explore", initialProtocolSlug = null }) {
  const router = useRouter();
  const [page, setPage] = useState(initialPage);
  const [view, setView] = useState(initialView === "protocol" ? "explore" : initialView);
  const [category, setCategory] = useState("All");
  const [riskFilter, setRiskFilter] = useState("All");
  const [sort, setSort] = useState("apy-desc");
  const [search, setSearch] = useState("");
  const [selectedProtocols, setSelectedProtocols] = useState([]);
  const [comparing, setComparing] = useState(false);
  const [btcAmount, setBtcAmount] = useState("1.0");
  const [selectedStrategy, setSelectedStrategy] = useState(null);
  const [customAllocations, setCustomAllocations] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [aIn, setAIn] = useState(false);
  const [hProt, setHProt] = useState(null);
  const [xProt, setXProt] = useState(null);
  const [scrollY, setScrollY] = useState(0);
  const [viewingProtocolSlug, setViewingProtocolSlug] = useState(initialProtocolSlug);

  useEffect(() => { setTimeout(() => setAIn(true), 80); }, []);
  useEffect(() => {
    if (page === "home") {
      const h = () => setScrollY(window.scrollY);
      window.addEventListener("scroll", h, { passive: true });
      return () => window.removeEventListener("scroll", h);
    }
  }, [page]);

  // Live data hooks
  const { price: btcPrice, status: priceStatus, isValidating: priceValidating, refresh: refreshPrice } = useBtcPrice();
  const { protocols: PROTOCOLS, status: protocolStatus, isValidating: protocolValidating, refresh: refreshProtocols } = useProtocols();

  const handleRefresh = () => {
    refreshPrice();
    refreshProtocols();
  };
  const isValidating = priceValidating || protocolValidating;

  const stats = useMemo(() => ({ totalTVL: PROTOCOLS.reduce((s, p) => s + p.tvl, 0), avgApy: PROTOCOLS.reduce((s, p) => s + p.apy, 0) / PROTOCOLS.length, maxApy: Math.max(...PROTOCOLS.map(p => p.apy)), count: PROTOCOLS.length }), [PROTOCOLS]);
  const filteredProtocols = useMemo(() => {
    let l = [...PROTOCOLS];
    if (category !== "All") l = l.filter(p => p.category === category);
    if (riskFilter !== "All") l = l.filter(p => p.risk === riskFilter);
    if (search) l = l.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()));
    const [f, d] = sort.split("-");
    l.sort((a, b) => { if (f === "risk") { const o = { Low: 1, Medium: 2, High: 3 }; return d === "asc" ? o[a.risk] - o[b.risk] : o[b.risk] - o[a.risk]; } if (f === "name") return d === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name); return d === "desc" ? b[f] - a[f] : a[f] - b[f]; });
    return l;
  }, [PROTOCOLS, category, riskFilter, sort, search]);

  const toggleP = (id) => setSelectedProtocols(p => p.includes(id) ? p.filter(x => x !== id) : p.length < 5 ? [...p, id] : p);
  const totalPct = Object.values(customAllocations).reduce((s, v) => s + v, 0);
  const wApy = useMemo(() => {
    if (selectedStrategy) return selectedStrategy.allocations.reduce((s, a) => s + PROTOCOLS.find(x => x.id === a.id).apy * a.pct / 100, 0);
    if (Object.keys(customAllocations).length > 0 && totalPct > 0) return Object.entries(customAllocations).reduce((s, [id, pct]) => s + PROTOCOLS.find(x => x.id === parseInt(id)).apy * pct / totalPct, 0);
    return 0;
  }, [PROTOCOLS, selectedStrategy, customAllocations, totalPct]);

  // Get viewing protocol from slug
  const viewingProtocol = useMemo(() => {
    if (!viewingProtocolSlug) return null;
    return PROTOCOLS.find(p => p.urlSlug === viewingProtocolSlug) || null;
  }, [PROTOCOLS, viewingProtocolSlug]);

  // Navigation helpers
  const enterApp = () => { router.push("/explore"); };
  const navigateTo = (path) => { router.push(path); };
  const openProtocol = (protocol) => { router.push(`/protocol/${protocol.urlSlug}`); };

  const css = `
    @keyframes floatP { 0%,100%{transform:translateY(0) translateX(0)} 25%{transform:translateY(-30px) translateX(10px)} 50%{transform:translateY(-10px) translateX(-15px)} 75%{transform:translateY(-40px) translateX(5px)} }
    @keyframes pulseG { 0%,100%{box-shadow:0 0 30px rgba(247,147,26,0.2),0 0 60px rgba(247,147,26,0.1)} 50%{box-shadow:0 0 50px rgba(247,147,26,0.4),0 0 100px rgba(247,147,26,0.15)} }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
    @keyframes slideU { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
    @keyframes slideD { from{opacity:0;transform:translateY(-20px)} to{opacity:1;transform:translateY(0)} }
    @keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
    @keyframes borderP { 0%,100%{border-color:rgba(247,147,26,0.12)} 50%{border-color:rgba(247,147,26,0.35)} }
    body{margin:0;padding:0} *{box-sizing:border-box} ::selection{background:rgba(247,147,26,0.3);color:#fff}
    input[type="range"]{-webkit-appearance:none;height:4px;border-radius:2px;background:#1E1F2A;outline:none}
    input[type="range"]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:14px;border-radius:50%;cursor:pointer;background:#F7931A}
  `;

  const fonts = <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=Sora:wght@300;400;500;600;700;800&family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />;

  /* ════════════════════════════════ HOME ════════════════════════════════ */
  if (page === "home") return (
    <div style={{ minHeight: "100vh", background: "#06070B", color: "#E4E4E7", fontFamily: "'JetBrains Mono', monospace", position: "relative", overflow: "hidden" }}>
      <style>{css}</style>{fonts}

      {/* BG */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: "-20%", left: "50%", transform: "translateX(-50%)", width: 1000, height: 1000, background: "radial-gradient(ellipse, rgba(247,147,26,0.07) 0%, rgba(247,147,26,0.02) 40%, transparent 70%)", borderRadius: "50%", filter: "blur(60px)" }} />
        <div style={{ position: "absolute", bottom: "-10%", left: "10%", width: 600, height: 600, background: "radial-gradient(circle, rgba(110,231,183,0.04) 0%, transparent 65%)", borderRadius: "50%", filter: "blur(80px)" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(247,147,26,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(247,147,26,0.025) 1px, transparent 1px)", backgroundSize: "80px 80px", transform: `translateY(${scrollY * 0.1}px)` }} />
        <Particles />
      </div>

      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, padding: "16px 40px",
        background: scrollY > 50 ? "rgba(6,7,11,0.92)" : "transparent",
        backdropFilter: scrollY > 50 ? "blur(20px)" : "none",
        borderBottom: scrollY > 50 ? "1px solid rgba(247,147,26,0.08)" : "1px solid transparent",
        transition: "all 0.3s", display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: "linear-gradient(135deg, #F7931A, #E8850F)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: "#06070B", boxShadow: "0 0 16px rgba(247,147,26,0.3)" }}>yB</div>
          <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 16, color: "#F7F7F8", letterSpacing: "-0.02em" }}>yields<span style={{ color: "#F7931A" }}>on</span>bitcoin</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {["How it Works:how", "Protocols:protocols", "Strategies:strategies"].map(l => { const [label, id] = l.split(":"); return (
            <a key={id} href={`#${id}`} style={{ color: "#71717A", fontSize: 13, fontFamily: "'DM Sans', sans-serif", textDecoration: "none", fontWeight: 500 }}
              onMouseEnter={e => e.target.style.color = "#E4E4E7"} onMouseLeave={e => e.target.style.color = "#71717A"}>{label}</a>
          ); })}
          <button onClick={enterApp} style={{
            padding: "9px 22px", borderRadius: 8, border: "1px solid #F7931A",
            background: "linear-gradient(135deg, rgba(247,147,26,0.15), rgba(247,147,26,0.05))",
            color: "#F7931A", fontFamily: "'Sora', sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer",
          }} onMouseEnter={e => { e.target.style.background = "linear-gradient(135deg, #F7931A, #E8850F)"; e.target.style.color = "#06070B"; }} onMouseLeave={e => { e.target.style.background = "linear-gradient(135deg, rgba(247,147,26,0.15), rgba(247,147,26,0.05))"; e.target.style.color = "#F7931A"; }}>Launch App</button>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section style={{ position: "relative", zIndex: 1, minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "120px 40px 80px", textAlign: "center" }}>
        {/* Orbit rings */}
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 520, height: 520, border: "1px solid rgba(247,147,26,0.05)", borderRadius: "50%", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 720, height: 720, border: "1px solid rgba(247,147,26,0.025)", borderRadius: "50%", pointerEvents: "none" }} />

        {/* Floating protocol badges */}
        {[
          { name: "Pendle", apy: "10%", color: "#F472B6", logo: "◉", pos: { top: "18%", right: "12%" }, delay: "0.8s", dur: "7s" },
          { name: "Morpho", apy: "7.3%", color: "#67E8F9", logo: "◑", pos: { top: "22%", left: "10%" }, delay: "1s", dur: "8s" },
          { name: "SolvBTC", apy: "8.5%", color: "#A78BFA", logo: "◈", pos: { bottom: "28%", left: "8%" }, delay: "1.2s", dur: "6s" },
          { name: "BounceBit", apy: "10%", color: "#FBBF24", logo: "◎", pos: { bottom: "24%", right: "10%" }, delay: "1.4s", dur: "9s" },
        ].map((p, i) => (
          <div key={i} style={{
            position: "absolute", ...p.pos,
            display: "flex", alignItems: "center", gap: 10,
            padding: "10px 16px", borderRadius: 12,
            background: "rgba(17,18,24,0.7)", border: `1px solid ${p.color}18`,
            backdropFilter: "blur(12px)", boxShadow: `0 4px 20px ${p.color}10`,
            opacity: aIn ? 0.6 : 0, animation: aIn ? `floatP ${p.dur} ease-in-out infinite, slideU 0.6s ease ${p.delay} both` : "none",
            pointerEvents: "none",
          }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: `${p.color}12`, border: `1px solid ${p.color}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: p.color, opacity: 0.85 }}>{p.logo}</div>
            <div>
              <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600, fontSize: 13, color: "#A1A1AA" }}>{p.name}</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 14, color: "#4ADE80", opacity: 0.8 }}>{p.apy} <span style={{ fontSize: 10, color: "#52525B", fontWeight: 500 }}>APY</span></div>
            </div>
          </div>
        ))}

        {/* Live badge */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px 6px 8px", borderRadius: 100, background: "rgba(247,147,26,0.08)", border: "1px solid rgba(247,147,26,0.15)", marginBottom: 36, opacity: aIn ? 1 : 0, animation: aIn ? "slideD 0.6s ease forwards" : "none" }}>
          <span style={{ padding: "2px 8px", borderRadius: 100, background: "#F7931A", color: "#06070B", fontSize: 10, fontWeight: 700, letterSpacing: "0.05em" }}>LIVE</span>
          <span style={{ fontSize: 12, color: "#F7931A", fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>{stats.count} protocols · ${(stats.totalTVL / 1000).toFixed(1)}B TVL tracked</span>
        </div>

        {/* Headline */}
        <h1 style={{
          fontFamily: "'Sora', sans-serif", fontSize: "clamp(52px, 7.5vw, 92px)", fontWeight: 800, lineHeight: 1.02, letterSpacing: "-0.045em", color: "#F7F7F8", margin: "0 0 8px 0", maxWidth: 880,
          opacity: aIn ? 1 : 0, animation: aIn ? "slideU 0.8s cubic-bezier(0.22,1,0.36,1) 0.15s both" : "none",
        }}>
          Best Yields<br />
          <span style={{ background: "linear-gradient(135deg, #F7931A 0%, #FBBF24 50%, #F7931A 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundSize: "200% auto" }}>on Bitcoin</span>
        </h1>

        {/* Sub */}
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(16px, 2vw, 20px)", color: "#71717A", maxWidth: 540, lineHeight: 1.65, margin: "24px 0 44px", fontWeight: 400,
          opacity: aIn ? 1 : 0, animation: aIn ? "slideU 0.8s cubic-bezier(0.22,1,0.36,1) 0.35s both" : "none",
        }}>
          Compare every BTC yield protocol in one place. Build a strategy. Allocate with a single click.
        </p>

        {/* CTAs */}
        <div style={{ display: "flex", gap: 14, alignItems: "center", opacity: aIn ? 1 : 0, animation: aIn ? "slideU 0.8s cubic-bezier(0.22,1,0.36,1) 0.5s both" : "none" }}>
          <button onClick={enterApp} style={{
            padding: "18px 44px", borderRadius: 12, border: "none", cursor: "pointer",
            background: "linear-gradient(135deg, #F7931A, #E8850F)", color: "#06070B",
            fontFamily: "'Sora', sans-serif", fontSize: 18, fontWeight: 700, letterSpacing: "-0.01em",
            boxShadow: "0 4px 30px rgba(247,147,26,0.35), 0 0 60px rgba(247,147,26,0.15)",
            animation: "pulseG 3s ease-in-out infinite", transition: "transform 0.2s",
          }} onMouseEnter={e => e.target.style.transform = "translateY(-2px) scale(1.02)"} onMouseLeave={e => e.target.style.transform = "none"}>
            Build Your Strategy →
          </button>
          <button onClick={() => document.getElementById("how")?.scrollIntoView({ behavior: "smooth" })} style={{
            padding: "18px 36px", borderRadius: 12, border: "1px solid #27272A",
            background: "rgba(255,255,255,0.03)", color: "#A1A1AA",
            fontFamily: "'Sora', sans-serif", fontSize: 16, fontWeight: 500, cursor: "pointer",
            backdropFilter: "blur(10px)", transition: "all 0.2s",
          }} onMouseEnter={e => { e.target.style.borderColor = "#52525B"; e.target.style.color = "#E4E4E7"; }} onMouseLeave={e => { e.target.style.borderColor = "#27272A"; e.target.style.color = "#A1A1AA"; }}>
            Learn More
          </button>
        </div>

        {/* Scroll hint */}
        <div style={{ position: "absolute", bottom: 36, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, opacity: scrollY > 100 ? 0 : 0.35, transition: "opacity 0.3s" }}>
          <div style={{ fontSize: 10, color: "#52525B", letterSpacing: "0.12em", textTransform: "uppercase" }}>Scroll</div>
          <div style={{ width: 1, height: 28, background: "linear-gradient(to bottom, #52525B, transparent)" }} />
        </div>
      </section>

      {/* ═══ TICKER ═══ */}
      <section style={{ position: "relative", zIndex: 1, padding: "18px 0", overflow: "hidden", borderTop: "1px solid rgba(247,147,26,0.06)", borderBottom: "1px solid rgba(247,147,26,0.06)", background: "rgba(8,9,14,0.5)" }}>
        <div style={{ display: "flex", whiteSpace: "nowrap", animation: "ticker 40s linear infinite" }}>
          {[...PROTOCOLS, ...PROTOCOLS].map((p, i) => (
            <div key={i} style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "0 30px", flexShrink: 0 }}>
              <span style={{ color: p.color, fontSize: 15 }}>{p.logo}</span>
              <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600, fontSize: 13, color: "#A1A1AA" }}>{p.name}</span>
              <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 13, color: "#4ADE80" }}>{p.apy}%</span>
              <span style={{ color: "#1E1F2A" }}>│</span>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section id="how" style={{ position: "relative", zIndex: 1, padding: "120px 40px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{ fontSize: 11, color: "#F7931A", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 12, fontWeight: 600 }}>How it Works</div>
          <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: 42, fontWeight: 800, color: "#F7F7F8", margin: 0, letterSpacing: "-0.03em" }}>Three steps to earning yield</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {[
            { s: "01", t: "Compare", d: "Every BTC yield protocol aggregated in real-time. Filter by APY, risk, chain, lockup. No more hopping between dashboards.", i: "⌕", dt: `${stats.count}+ protocols tracked` },
            { s: "02", t: "Strategize", d: "Choose a pre-built strategy or create your own. Drag sliders to allocate. Blended APY calculates in real-time.", i: "◈", dt: "3 preset strategies" },
            { s: "03", t: "Allocate", d: "Review your positions, estimated yields, risk assessment. Deploy across all selected protocols in a single transaction.", i: "⚡", dt: "One-click deploy" },
          ].map((item, i) => (
            <div key={i} style={{ padding: 32, borderRadius: 16, background: "linear-gradient(160deg, #0D0E14, #111218)", border: "1px solid #1A1B25", position: "relative", overflow: "hidden", transition: "all 0.3s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(247,147,26,0.2)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#1A1B25"; e.currentTarget.style.transform = "none"; }}>
              <div style={{ position: "absolute", top: -8, right: 16, fontFamily: "'Sora', sans-serif", fontSize: 80, fontWeight: 800, color: "rgba(247,147,26,0.04)", lineHeight: 1, pointerEvents: "none" }}>{item.s}</div>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(247,147,26,0.08)", border: "1px solid rgba(247,147,26,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, color: "#F7931A", marginBottom: 20 }}>{item.i}</div>
              <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: 22, fontWeight: 700, color: "#F7F7F8", margin: "0 0 12px 0", letterSpacing: "-0.02em" }}>{item.t}</h3>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#71717A", lineHeight: 1.7, margin: "0 0 20px 0" }}>{item.d}</p>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 6, background: "rgba(247,147,26,0.06)", border: "1px solid rgba(247,147,26,0.1)", fontSize: 11, color: "#F7931A", fontWeight: 600 }}>{item.dt}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ LIVE YIELDS TABLE ═══ */}
      <section id="protocols" style={{ position: "relative", zIndex: 1, padding: "80px 40px 120px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ fontSize: 11, color: "#F7931A", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 12, fontWeight: 600 }}>Live Yields</div>
          <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: 42, fontWeight: 800, color: "#F7F7F8", margin: "0 0 12px 0", letterSpacing: "-0.03em" }}>What your Bitcoin could earn</h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: "#52525B", margin: 0 }}>Real-time APY from {stats.count} protocols. Updated every 15 minutes.</p>
        </div>
        <div style={{ borderRadius: 16, overflow: "hidden", background: "linear-gradient(160deg, #0D0E14, #111218)", border: "1px solid #1A1B25" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr>{["Protocol", "Category", "APY", "30d Trend", "TVL", "Risk", "Lockup"].map(h => (
              <th key={h} style={{ textAlign: "left", padding: "16px 20px", fontSize: 10, color: "#52525B", textTransform: "uppercase", letterSpacing: "0.12em", borderBottom: "1px solid #1A1B25", fontWeight: 600 }}>{h}</th>
            ))}</tr></thead>
            <tbody>{PROTOCOLS.slice(0, 8).map((p, i) => (
              <tr key={p.id} style={{ borderBottom: i < 7 ? "1px solid rgba(26,27,37,0.6)" : "none", transition: "background 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(247,147,26,0.02)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <td style={{ padding: "16px 20px" }}><div style={{ display: "flex", alignItems: "center", gap: 10 }}><div style={{ width: 34, height: 34, borderRadius: 8, background: `${p.color}12`, border: `1px solid ${p.color}25`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: p.color }}>{p.logo}</div><span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600, fontSize: 14, color: "#F7F7F8" }}>{p.name}</span></div></td>
                <td style={{ padding: "16px 20px", fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#71717A" }}>{p.category}</td>
                <td style={{ padding: "16px 20px" }}><span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 16, color: "#4ADE80" }}>{p.apy}%</span></td>
                <td style={{ padding: "16px 20px" }}><MiniSparkline data={p.trend} color={p.color} width={72} height={24} /></td>
                <td style={{ padding: "16px 20px", fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#A1A1AA" }}>{formatTVL(p.tvl)}</td>
                <td style={{ padding: "16px 20px" }}><RiskBadge risk={p.risk} /></td>
                <td style={{ padding: "16px 20px", fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#71717A" }}>{p.lockup}</td>
              </tr>))}</tbody>
          </table>
          <div style={{ padding: "16px 20px", textAlign: "center", borderTop: "1px solid #1A1B25" }}>
            <button onClick={enterApp} style={{ background: "none", border: "none", color: "#F7931A", fontFamily: "'Sora', sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
              onMouseEnter={e => e.target.style.textDecoration = "underline"} onMouseLeave={e => e.target.style.textDecoration = "none"}>View all {stats.count} protocols →</button>
          </div>
        </div>
      </section>

      {/* ═══ STRATEGIES ═══ */}
      <section id="strategies" style={{ position: "relative", zIndex: 1, padding: "80px 40px 120px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ fontSize: 11, color: "#F7931A", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 12, fontWeight: 600 }}>Strategies</div>
          <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: 42, fontWeight: 800, color: "#F7F7F8", margin: "0 0 12px 0", letterSpacing: "-0.03em" }}>Pick your risk. Deploy in seconds.</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {STRATEGIES.map((st, i) => (
            <div key={i} style={{ padding: 28, borderRadius: 16, background: "linear-gradient(160deg, #0D0E14, #111218)", border: "1px solid #1A1B25", transition: "all 0.3s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(247,147,26,0.2)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#1A1B25"; e.currentTarget.style.transform = "none"; }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div><div style={{ fontSize: 32, marginBottom: 8 }}>{st.icon}</div><div style={{ fontFamily: "'Sora', sans-serif", fontSize: 20, fontWeight: 700, color: "#F7F7F8" }}>{st.name}</div></div>
                <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 32, fontWeight: 800, color: "#4ADE80", letterSpacing: "-0.03em" }}>{st.expectedApy}%</div>
              </div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#71717A", lineHeight: 1.6, margin: "0 0 18px 0" }}>{st.description}</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}><RiskBadge risk={st.riskLevel} /><span style={{ fontSize: 11, color: "#52525B" }}>{st.allocations.length} protocols</span></div>
              <div style={{ display: "flex", height: 6, borderRadius: 3, overflow: "hidden", gap: 2 }}>
                {st.allocations.map(a => { const pr = PROTOCOLS.find(x => x.id === a.id); return <div key={a.id} style={{ width: `${a.pct}%`, height: "100%", background: pr.color, borderRadius: 2, opacity: 0.7 }} />; })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section style={{ position: "relative", zIndex: 1, padding: "100px 40px 120px", textAlign: "center" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", padding: "64px 48px", borderRadius: 24, background: "linear-gradient(160deg, rgba(247,147,26,0.06), rgba(247,147,26,0.02), transparent)", border: "1px solid rgba(247,147,26,0.12)", animation: "borderP 4s ease-in-out infinite" }}>
          <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: 38, fontWeight: 800, color: "#F7F7F8", margin: "0 0 14px 0", letterSpacing: "-0.03em" }}>Stop leaving yield on the table</h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, color: "#71717A", margin: "0 0 36px 0", lineHeight: 1.6 }}>Your Bitcoin is sitting idle. Put it to work across the best protocols — with the risk level you choose.</p>
          <button onClick={enterApp} style={{
            padding: "18px 48px", borderRadius: 12, border: "none", cursor: "pointer",
            background: "linear-gradient(135deg, #F7931A, #E8850F)", color: "#06070B",
            fontFamily: "'Sora', sans-serif", fontSize: 18, fontWeight: 700,
            boxShadow: "0 4px 30px rgba(247,147,26,0.35)", transition: "transform 0.2s",
          }} onMouseEnter={e => e.target.style.transform = "translateY(-2px) scale(1.02)"} onMouseLeave={e => e.target.style.transform = "none"}>Build Your Strategy →</button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ position: "relative", zIndex: 1, padding: "28px 40px", borderTop: "1px solid rgba(247,147,26,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 22, height: 22, borderRadius: 5, background: "linear-gradient(135deg, #F7931A, #E8850F)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, color: "#06070B" }}>yB</div>
          <span style={{ fontSize: 11, color: "#3F3F46" }}>© 2026 yieldsonbitcoin.com</span>
        </div>
        <div style={{ display: "flex", gap: 24, fontSize: 12 }}>
          {["Docs", "API", "Twitter", "Discord"].map(l => <span key={l} style={{ color: "#52525B", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }} onMouseEnter={e => e.target.style.color = "#A1A1AA"} onMouseLeave={e => e.target.style.color = "#52525B"}>{l}</span>)}
        </div>
      </footer>
    </div>
  );

  /* ════════════════════════════════ APP DASHBOARD ════════════════════════════════ */
  return (
    <div style={{ minHeight: "100vh", background: "#08090E", color: "#E4E4E7", fontFamily: "'JetBrains Mono', monospace", position: "relative", overflow: "hidden" }}>
      <style>{css}</style>{fonts}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: -200, right: -200, width: 600, height: 600, background: "radial-gradient(circle, rgba(247,147,26,0.06) 0%, transparent 70%)", borderRadius: "50%", filter: "blur(80px)" }} />
        <div style={{ position: "absolute", bottom: -200, left: -100, width: 500, height: 500, background: "radial-gradient(circle, rgba(110,231,183,0.04) 0%, transparent 70%)", borderRadius: "50%", filter: "blur(80px)" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(247,147,26,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(247,147,26,0.03) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1320, margin: "0 auto", padding: "0 24px" }}>
        {/* Header */}
        <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 0", borderBottom: "1px solid rgba(247,147,26,0.12)", opacity: aIn ? 1 : 0, transform: aIn ? "translateY(0)" : "translateY(-10px)", transition: "all 0.6s cubic-bezier(0.22,1,0.36,1)" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 14, cursor: "pointer", textDecoration: "none" }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: "linear-gradient(135deg, #F7931A, #E8850F)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, color: "#08090E", boxShadow: "0 0 20px rgba(247,147,26,0.3)" }}>yB</div>
            <div><div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 17, color: "#F7F7F8", letterSpacing: "-0.02em" }}>yields<span style={{ color: "#F7931A" }}>on</span>bitcoin</div><div style={{ fontSize: 10, color: "#71717A", letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 1 }}>Every BTC yield. One dashboard.</div></div>
          </Link>
          <nav style={{ display: "flex", gap: 2, background: "#111218", borderRadius: 8, padding: 3, border: "1px solid #1E1F2A" }}>
            {[["explore", "Explore"], ["strategy", "Strategy"], ["allocate", "Allocate"]].map(([k, l]) => (
              <Link key={k} href={`/${k}`} style={{ padding: "8px 20px", borderRadius: 6, border: "none", cursor: "pointer", fontFamily: "'Sora', sans-serif", fontSize: 13, fontWeight: 500, background: view === k ? "rgba(247,147,26,0.12)" : "transparent", color: view === k ? "#F7931A" : "#71717A", transition: "all 0.2s", textDecoration: "none" }}>{l}</Link>
            ))}
          </nav>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <DataStatusIndicator priceStatus={priceStatus} protocolStatus={protocolStatus} onRefresh={handleRefresh} isValidating={isValidating} />
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 6, background: "#111218", border: "1px solid #1E1F2A", fontSize: 12, color: "#A1A1AA" }}><span style={{ color: "#F7931A", fontSize: 14 }}>₿</span><span style={{ color: "#F7F7F8", fontWeight: 600 }}>${btcPrice.toLocaleString()}</span></div>
            <button style={{ padding: "8px 20px", borderRadius: 8, border: "1px solid #F7931A", background: "linear-gradient(135deg, rgba(247,147,26,0.15), rgba(247,147,26,0.05))", color: "#F7931A", fontFamily: "'Sora', sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Connect Wallet</button>
          </div>
        </header>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, padding: "24px 0", opacity: aIn ? 1 : 0, transition: "all 0.6s cubic-bezier(0.22,1,0.36,1) 0.1s" }}>
          {[
            { l: "Total Value Locked", v: formatTVL(stats.totalTVL), s: "across all protocols" },
            { l: "Average APY", v: `${stats.avgApy.toFixed(1)}%`, s: "weighted by TVL" },
            { l: "Highest Yield", v: `${stats.maxApy.toFixed(1)}%`, s: "Ethena sBTC", a: true },
            { l: "Protocols Tracked", v: stats.count.toString(), s: "and growing" },
          ].map((st, i) => (
            <div key={i} style={{ padding: "18px 20px", borderRadius: 10, background: "linear-gradient(135deg, #111218, #0D0E14)", border: "1px solid #1E1F2A" }}>
              <div style={{ fontSize: 10, color: "#71717A", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>{st.l}</div>
              <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 26, fontWeight: 700, color: st.a ? "#F7931A" : "#F7F7F8", letterSpacing: "-0.02em" }}>{st.v}</div>
              <div style={{ fontSize: 11, color: "#52525B", marginTop: 2 }}>{st.s}</div>
            </div>
          ))}
        </div>

        {/* ═══ EXPLORE ═══ */}
        {view === "explore" && (
          <div>
            {viewingProtocol ? (
              <ProtocolDetail
                protocol={viewingProtocol}
                btcPrice={btcPrice}
                btcAmount={btcAmount}
                setBtcAmount={setBtcAmount}
                onBack={() => router.push("/explore")}
                onAllocate={(p) => { setCustomAllocations(pr => ({ ...pr, [p.id]: pr[p.id] || 25 })); router.push("/allocate"); }}
              />
            ) : (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
                  <div style={{ position: "relative", flex: "1 1 240px", maxWidth: 320 }}>
                    <input type="text" placeholder="Search protocols..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: "100%", padding: "10px 14px 10px 36px", borderRadius: 8, border: "1px solid #1E1F2A", background: "#111218", color: "#E4E4E7", fontSize: 13, fontFamily: "inherit", outline: "none" }} onFocus={e => e.target.style.borderColor = "#F7931A40"} onBlur={e => e.target.style.borderColor = "#1E1F2A"} />
                    <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#52525B", fontSize: 14 }}>⌕</span>
                  </div>
                  {[[category, setCategory, CATEGORIES, "All Categories", 140], [riskFilter, setRiskFilter, RISK_LEVELS, "All Risk", 110]].map(([v, sv, opts, all, w], i) => (
                    <select key={i} value={v} onChange={e => sv(e.target.value)} style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #1E1F2A", background: "#111218", color: "#A1A1AA", fontSize: 12, fontFamily: "inherit", cursor: "pointer", outline: "none", minWidth: w }}>
                      {opts.map(o => <option key={o} value={o}>{o === "All" ? all : o === "Low" || o === "Medium" || o === "High" ? `${o} Risk` : o}</option>)}
                    </select>
                  ))}
                  <select value={sort} onChange={e => setSort(e.target.value)} style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #1E1F2A", background: "#111218", color: "#A1A1AA", fontSize: 12, fontFamily: "inherit", cursor: "pointer", outline: "none", minWidth: 140 }}>
                    {SORT_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                  {selectedProtocols.length >= 2 && <button onClick={() => setComparing(!comparing)} style={{ padding: "10px 18px", borderRadius: 8, border: comparing ? "1px solid #F7931A" : "1px solid #F7931A50", background: comparing ? "rgba(247,147,26,0.12)" : "transparent", color: "#F7931A", fontSize: 12, fontWeight: 600, fontFamily: "'Sora', sans-serif", cursor: "pointer" }}>{comparing ? "✕ Close" : `Compare (${selectedProtocols.length})`}</button>}
                  <div style={{ flex: 1 }} />
                  <Link href="/strategy" style={{ padding: "10px 20px", borderRadius: 8, border: "none", background: "linear-gradient(135deg, #F7931A, #E8850F)", color: "#08090E", fontSize: 12, fontWeight: 700, fontFamily: "'Sora', sans-serif", cursor: "pointer", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, boxShadow: "0 2px 12px rgba(247,147,26,0.25)" }}>Build your Strategy →</Link>
                </div>

                {comparing && selectedProtocols.length >= 2 && (
                  <div style={{ marginBottom: 24, padding: 24, borderRadius: 12, background: "linear-gradient(135deg, #111218, #0D0E14)", border: "1px solid #F7931A20" }}>
                    <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: 16, fontWeight: 600, color: "#F7F7F8", marginBottom: 16, marginTop: 0 }}>Protocol Comparison</h3>
                    <div style={{ overflowX: "auto" }}><table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                      <thead><tr>{["Protocol", "Category", "APY", "Range", "TVL", "Risk", "Chain", "Lock", "Audits"].map(h => <th key={h} style={{ textAlign: "left", padding: "10px 14px", color: "#71717A", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", borderBottom: "1px solid #1E1F2A", whiteSpace: "nowrap" }}>{h}</th>)}</tr></thead>
                      <tbody>{selectedProtocols.map(id => { const p = PROTOCOLS.find(x => x.id === id); return (<tr key={id}><td style={{ padding: "12px 14px", fontWeight: 600, color: "#F7F7F8" }}><span style={{ color: p.color, marginRight: 8 }}>{p.logo}</span>{p.name}</td><td style={{ padding: "12px 14px", color: "#A1A1AA" }}>{p.category}</td><td style={{ padding: "12px 14px", color: "#4ADE80", fontWeight: 700, fontFamily: "'Sora'" }}>{p.apy}%</td><td style={{ padding: "12px 14px", color: "#71717A" }}>{p.apyRange[0]}–{p.apyRange[1]}%</td><td style={{ padding: "12px 14px", color: "#A1A1AA" }}>{formatTVL(p.tvl)}</td><td style={{ padding: "12px 14px" }}><RiskBadge risk={p.risk} /></td><td style={{ padding: "12px 14px", color: "#A1A1AA" }}>{p.chain}</td><td style={{ padding: "12px 14px", color: "#A1A1AA" }}>{p.lockup}</td><td style={{ padding: "12px 14px", color: "#A1A1AA" }}>{p.audits}</td></tr>); })}</tbody>
                    </table></div>
                  </div>
                )}

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: 14 }}>
                  {filteredProtocols.map(p => (
                    <div key={p.id} onMouseEnter={() => setHProt(p.id)} onMouseLeave={() => setHProt(null)} onClick={() => setXProt(xProt === p.id ? null : p.id)}
                      style={{ padding: 20, borderRadius: 12, cursor: "pointer", background: selectedProtocols.includes(p.id) ? "linear-gradient(135deg, rgba(247,147,26,0.08), #111218)" : hProt === p.id ? "linear-gradient(135deg, #151620, #111218)" : "linear-gradient(135deg, #111218, #0D0E14)", border: selectedProtocols.includes(p.id) ? "1px solid #F7931A40" : "1px solid #1E1F2A", transition: "all 0.25s", transform: hProt === p.id ? "translateY(-2px)" : "none", boxShadow: hProt === p.id ? `0 8px 32px ${p.color}10` : "none" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{ width: 40, height: 40, borderRadius: 10, background: `${p.color}15`, border: `1px solid ${p.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: p.color }}>{p.logo}</div>
                          <div><div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600, fontSize: 15, color: "#F7F7F8" }}>{p.name}</div><div style={{ fontSize: 11, color: "#71717A", marginTop: 2 }}>{p.category} · {p.chain}</div></div>
                        </div>
                        <div style={{ textAlign: "right" }}><div style={{ fontFamily: "'Sora', sans-serif", fontSize: 24, fontWeight: 700, color: "#4ADE80", letterSpacing: "-0.02em", lineHeight: 1 }}>{p.apy}%</div><div style={{ fontSize: 10, color: "#52525B", marginTop: 2 }}>APY</div></div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                        <div style={{ display: "flex", gap: 16 }}>
                          {[["TVL", formatTVL(p.tvl)], ["Lock", p.lockup]].map(([l, v]) => <div key={l}><div style={{ fontSize: 10, color: "#52525B", textTransform: "uppercase", letterSpacing: "0.08em" }}>{l}</div><div style={{ fontSize: 13, color: "#A1A1AA", fontWeight: 500, marginTop: 2 }}>{v}</div></div>)}
                          <div><div style={{ fontSize: 10, color: "#52525B", textTransform: "uppercase", letterSpacing: "0.08em" }}>Risk</div><div style={{ marginTop: 2 }}><RiskBadge risk={p.risk} /></div></div>
                        </div>
                        <MiniSparkline data={p.trend} color={p.color} />
                      </div>
                      {xProt === p.id && (
                        <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${p.color}20` }}>
                          <p style={{ fontSize: 12, color: "#A1A1AA", lineHeight: 1.6, margin: "0 0 14px 0" }}>{p.description}</p>
                          <div style={{ display: "flex", gap: 8, alignItems: "center", justifyContent: "space-between" }}>
                            <div style={{ fontSize: 11, color: "#52525B" }}>Range: {p.apyRange[0]}–{p.apyRange[1]}% · {p.audits} audits · Min: {p.minDeposit} BTC</div>
                            <div style={{ display: "flex", gap: 8 }}>
                              <button onClick={e => { e.stopPropagation(); toggleP(p.id); }} style={{ padding: "6px 14px", borderRadius: 6, fontSize: 11, fontWeight: 600, fontFamily: "'Sora'", cursor: "pointer", border: "none", background: selectedProtocols.includes(p.id) ? "#F7931A20" : "#1E1F2A", color: selectedProtocols.includes(p.id) ? "#F7931A" : "#A1A1AA" }}>{selectedProtocols.includes(p.id) ? "✓ Selected" : "+ Compare"}</button>
                              <button onClick={e => { e.stopPropagation(); openProtocol(p); }} style={{ padding: "6px 14px", borderRadius: 6, fontSize: 11, fontWeight: 600, fontFamily: "'Sora'", cursor: "pointer", border: "1px solid #38BDF850", background: "rgba(56,189,248,0.08)", color: "#38BDF8" }}>View Details</button>
                              <button onClick={e => { e.stopPropagation(); setCustomAllocations(pr => ({ ...pr, [p.id]: pr[p.id] || 25 })); router.push("/allocate"); }} style={{ padding: "6px 14px", borderRadius: 6, fontSize: 11, fontWeight: 600, fontFamily: "'Sora'", cursor: "pointer", border: "1px solid #F7931A50", background: "rgba(247,147,26,0.08)", color: "#F7931A" }}>Allocate →</button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {filteredProtocols.length === 0 && <div style={{ textAlign: "center", padding: "60px 20px", color: "#52525B" }}><div style={{ fontSize: 32, marginBottom: 12 }}>∅</div><div style={{ fontFamily: "'Sora'", fontSize: 16, fontWeight: 500 }}>No protocols match</div></div>}
              </>
            )}
          </div>
        )}

        {/* ═══ STRATEGY ═══ */}
        {view === "strategy" && (
          <div>
            <div style={{ marginBottom: 28 }}><h2 style={{ fontFamily: "'Sora'", fontSize: 22, fontWeight: 700, color: "#F7F7F8", margin: "0 0 6px 0" }}>Strategy Builder</h2><p style={{ fontSize: 13, color: "#71717A", margin: 0 }}>Pre-built strategies or build your own.</p></div>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28, padding: 20, borderRadius: 12, background: "#111218", border: "1px solid #1E1F2A" }}>
              <div style={{ fontSize: 11, color: "#71717A", textTransform: "uppercase", letterSpacing: "0.08em" }}>Your BTC</div>
              <input type="text" value={btcAmount} onChange={e => setBtcAmount(e.target.value)} style={{ flex: 1, padding: "10px 14px", borderRadius: 8, border: "1px solid #1E1F2A", background: "#08090E", color: "#F7F7F8", fontSize: 22, fontFamily: "'Sora'", fontWeight: 700, outline: "none" }} />
              <div style={{ fontSize: 13, color: "#52525B" }}>≈ ${(parseFloat(btcAmount || 0) * btcPrice).toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
              {STRATEGIES.map((st, i) => { const sel = selectedStrategy?.name === st.name; const ay = parseFloat(btcAmount || 0) * st.expectedApy / 100; return (
                <div key={i} onClick={() => { setSelectedStrategy(sel ? null : st); setCustomAllocations({}); }} style={{ padding: 24, borderRadius: 12, cursor: "pointer", background: sel ? "linear-gradient(135deg, rgba(247,147,26,0.08), #111218)" : "linear-gradient(135deg, #111218, #0D0E14)", border: sel ? "1px solid #F7931A50" : "1px solid #1E1F2A", transition: "all 0.25s" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                    <div><div style={{ fontSize: 28, marginBottom: 8 }}>{st.icon}</div><div style={{ fontFamily: "'Sora'", fontSize: 18, fontWeight: 700, color: "#F7F7F8" }}>{st.name}</div></div>
                    <div style={{ fontFamily: "'Sora'", fontSize: 28, fontWeight: 700, color: "#4ADE80" }}>{st.expectedApy}%</div>
                  </div>
                  <p style={{ fontSize: 12, color: "#71717A", lineHeight: 1.5, margin: "0 0 16px 0" }}>{st.description}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}><RiskBadge risk={st.riskLevel} /><div style={{ fontSize: 11, color: "#52525B" }}>Est: <span style={{ color: "#4ADE80", fontWeight: 600 }}>{ay.toFixed(4)} BTC/yr</span></div></div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>{st.allocations.map(a => { const pr = PROTOCOLS.find(x => x.id === a.id); return (<div key={a.id} style={{ display: "flex", alignItems: "center", gap: 8 }}><div onClick={e => { e.stopPropagation(); openProtocol(pr); }} style={{ width: 90, fontSize: 11, color: "#A1A1AA", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", cursor: "pointer" }} onMouseEnter={e => e.target.style.color = "#F7F7F8"} onMouseLeave={e => e.target.style.color = "#A1A1AA"}><span style={{ color: pr.color }}>{pr.logo}</span> {pr.name}</div><div style={{ flex: 1, height: 6, borderRadius: 3, background: "#1E1F2A", overflow: "hidden" }}><div style={{ width: `${a.pct}%`, height: "100%", borderRadius: 3, background: `linear-gradient(90deg, ${pr.color}80, ${pr.color})` }} /></div><div style={{ width: 36, fontSize: 11, color: "#71717A", textAlign: "right" }}>{a.pct}%</div></div>); })}</div>
                  {sel && <button onClick={e => { e.stopPropagation(); router.push("/allocate"); }} style={{ width: "100%", marginTop: 16, padding: 12, borderRadius: 8, border: "none", cursor: "pointer", background: "linear-gradient(135deg, #F7931A, #E8850F)", color: "#08090E", fontFamily: "'Sora'", fontSize: 14, fontWeight: 700, boxShadow: "0 4px 20px rgba(247,147,26,0.3)" }}>Deploy Strategy →</button>}
                </div>); })}
            </div>
            {/* Custom */}
            <div style={{ padding: 24, borderRadius: 12, background: "linear-gradient(135deg, #111218, #0D0E14)", border: "1px solid #1E1F2A" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div><h3 style={{ fontFamily: "'Sora'", fontSize: 16, fontWeight: 600, color: "#F7F7F8", margin: "0 0 4px 0" }}>Custom Strategy</h3><p style={{ fontSize: 12, color: "#71717A", margin: 0 }}>Mix and match. Drag sliders to allocate.</p></div>
                {Object.keys(customAllocations).length > 0 && <div style={{ textAlign: "right" }}><div style={{ fontSize: 10, color: "#52525B", textTransform: "uppercase", letterSpacing: "0.08em" }}>Blended APY</div><div style={{ fontFamily: "'Sora'", fontSize: 24, fontWeight: 700, color: "#4ADE80" }}>{wApy.toFixed(1)}%</div></div>}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 10 }}>
                {PROTOCOLS.map(p => { const added = customAllocations[p.id] !== undefined; return (
                  <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 8, background: added ? `${p.color}08` : "#08090E", border: added ? `1px solid ${p.color}25` : "1px solid #1E1F2A" }}>
                    <span style={{ color: p.color, fontSize: 16 }}>{p.logo}</span>
                    <div onClick={() => openProtocol(p)} style={{ flex: 1, minWidth: 0, cursor: "pointer" }}><div style={{ fontSize: 12, fontWeight: 600, color: "#E4E4E7", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div><div style={{ fontSize: 10, color: "#52525B" }}>{p.apy}% APY</div></div>
                    {added ? <div style={{ display: "flex", alignItems: "center", gap: 8 }}><input type="range" min={5} max={100} step={5} value={customAllocations[p.id]} onClick={e => e.stopPropagation()} onChange={e => { setSelectedStrategy(null); setCustomAllocations(pr => ({ ...pr, [p.id]: parseInt(e.target.value) })); }} style={{ width: 60, accentColor: p.color }} /><span style={{ fontSize: 11, color: p.color, fontWeight: 600, width: 32, textAlign: "right" }}>{customAllocations[p.id]}%</span><button onClick={() => setCustomAllocations(pr => { const n = { ...pr }; delete n[p.id]; return n; })} style={{ background: "none", border: "none", color: "#52525B", cursor: "pointer", fontSize: 14, padding: "0 4px" }}>×</button></div>
                      : <button onClick={() => { setSelectedStrategy(null); setCustomAllocations(pr => ({ ...pr, [p.id]: 25 })); }} style={{ padding: "4px 10px", borderRadius: 4, border: "1px solid #1E1F2A", background: "transparent", color: "#71717A", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>+ Add</button>}
                  </div>); })}
              </div>
              {Object.keys(customAllocations).length > 0 && <div style={{ marginTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}><div style={{ fontSize: 12, color: totalPct === 100 ? "#4ADE80" : "#FBBF24" }}>Total: {totalPct}% {totalPct !== 100 && "(normalized)"}</div><button onClick={() => router.push("/allocate")} style={{ padding: "12px 28px", borderRadius: 8, border: "none", cursor: "pointer", background: "linear-gradient(135deg, #F7931A, #E8850F)", color: "#08090E", fontFamily: "'Sora'", fontSize: 14, fontWeight: 700, boxShadow: "0 4px 20px rgba(247,147,26,0.3)" }}>Deploy Custom →</button></div>}
            </div>
          </div>
        )}

        {/* ═══ ALLOCATE ═══ */}
        {view === "allocate" && (
          <div>
            <div style={{ marginBottom: 28 }}><h2 style={{ fontFamily: "'Sora'", fontSize: 22, fontWeight: 700, color: "#F7F7F8", margin: "0 0 6px 0" }}>Allocate Your Bitcoin</h2><p style={{ fontSize: 13, color: "#71717A", margin: 0 }}>Review and deploy with a single transaction.</p></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 24 }}>
              <div>
                <div style={{ padding: 24, borderRadius: 12, marginBottom: 16, background: "linear-gradient(135deg, #111218, #0D0E14)", border: "1px solid #1E1F2A" }}>
                  <div style={{ fontSize: 10, color: "#71717A", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Amount</div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}><input type="text" value={btcAmount} onChange={e => setBtcAmount(e.target.value)} style={{ padding: "8px 0", border: "none", background: "transparent", color: "#F7F7F8", fontSize: 36, fontFamily: "'Sora'", fontWeight: 700, outline: "none", width: 180 }} /><span style={{ fontSize: 18, color: "#F7931A", fontWeight: 600 }}>BTC</span><span style={{ fontSize: 14, color: "#52525B" }}>≈ ${(parseFloat(btcAmount || 0) * btcPrice).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span></div>
                </div>
                <div style={{ padding: 24, borderRadius: 12, background: "linear-gradient(135deg, #111218, #0D0E14)", border: "1px solid #1E1F2A" }}>
                  <div style={{ fontSize: 10, color: "#71717A", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>Breakdown</div>
                  {(() => { const al = selectedStrategy ? selectedStrategy.allocations.map(a => ({ ...a, protocol: PROTOCOLS.find(x => x.id === a.id) })) : Object.entries(customAllocations).map(([id, pct]) => ({ id: parseInt(id), pct: totalPct > 0 ? Math.round(pct / totalPct * 100) : 0, protocol: PROTOCOLS.find(x => x.id === parseInt(id)) }));
                    if (!al.length) return <div style={{ textAlign: "center", padding: "40px 20px", color: "#52525B" }}><div style={{ fontSize: 24, marginBottom: 8 }}>◇</div><div style={{ fontSize: 13 }}>No allocations. Build one in Strategy tab.</div></div>;
                    return al.map((a, i) => { const b = parseFloat(btcAmount || 0) * a.pct / 100; return (
                      <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 0", borderBottom: i < al.length - 1 ? "1px solid #1E1F2A" : "none" }}>
                        <div style={{ width: 42, height: 42, borderRadius: 10, background: `${a.protocol.color}12`, border: `1px solid ${a.protocol.color}25`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: a.protocol.color, flexShrink: 0 }}>{a.protocol.logo}</div>
                        <div style={{ flex: 1 }}><div style={{ fontFamily: "'Sora'", fontWeight: 600, fontSize: 14, color: "#F7F7F8" }}>{a.protocol.name}</div><div style={{ fontSize: 11, color: "#52525B", marginTop: 2 }}>{a.protocol.category} · {a.protocol.apy}% · {a.protocol.lockup}</div></div>
                        <div style={{ textAlign: "right" }}><div style={{ fontFamily: "'Sora'", fontWeight: 700, fontSize: 15, color: "#F7F7F8" }}>{b.toFixed(4)} BTC</div><div style={{ fontSize: 11, color: "#52525B", marginTop: 1 }}>{a.pct}% · +{(b * a.protocol.apy / 100).toFixed(5)}/yr</div></div>
                      </div>); }); })()}
                </div>
              </div>
              <div>
                <div style={{ padding: 24, borderRadius: 12, background: "linear-gradient(135deg, rgba(247,147,26,0.06), #111218)", border: "1px solid #F7931A25", position: "sticky", top: 24 }}>
                  <div style={{ fontSize: 10, color: "#F7931A", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 20 }}>Summary</div>
                  <div style={{ marginBottom: 24 }}><div style={{ fontSize: 10, color: "#52525B", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Blended APY</div><div style={{ fontFamily: "'Sora'", fontSize: 42, fontWeight: 700, color: "#4ADE80", letterSpacing: "-0.03em", lineHeight: 1 }}>{wApy.toFixed(1)}%</div></div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 24 }}>
                    {[["Yearly", (parseFloat(btcAmount || 0) * wApy / 100), 4], ["Monthly", (parseFloat(btcAmount || 0) * wApy / 100 / 12), 5]].map(([l, v, d]) => (
                      <div key={l} style={{ padding: "12px 14px", borderRadius: 8, background: "#08090E" }}>
                        <div style={{ fontSize: 10, color: "#52525B", textTransform: "uppercase", letterSpacing: "0.08em" }}>{l}</div>
                        <div style={{ fontFamily: "'Sora'", fontWeight: 700, fontSize: 16, color: "#F7F7F8", marginTop: 4 }}>{v.toFixed(d)} BTC</div>
                        <div style={{ fontSize: 10, color: "#52525B", marginTop: 2 }}>≈ ${(v * btcPrice).toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                      </div>))}
                  </div>
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 10, color: "#52525B", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Allocation</div>
                    <div style={{ display: "flex", height: 8, borderRadius: 4, overflow: "hidden", gap: 2 }}>
                      {(selectedStrategy ? selectedStrategy.allocations : Object.entries(customAllocations).map(([id, pct]) => ({ id: parseInt(id), pct: totalPct > 0 ? Math.round(pct / totalPct * 100) : 0 }))).map(a => { const pr = PROTOCOLS.find(x => x.id === a.id); return <div key={a.id} style={{ width: `${a.pct}%`, height: "100%", background: `linear-gradient(90deg, ${pr.color}90, ${pr.color})`, borderRadius: 2 }} />; })}
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
                      {(selectedStrategy ? selectedStrategy.allocations : Object.entries(customAllocations).map(([id, pct]) => ({ id: parseInt(id), pct: totalPct > 0 ? Math.round(pct / totalPct * 100) : 0 }))).map(a => { const pr = PROTOCOLS.find(x => x.id === a.id); return <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: "#A1A1AA" }}><div style={{ width: 6, height: 6, borderRadius: 2, background: pr.color }} />{pr.name} {a.pct}%</div>; })}
                    </div>
                  </div>
                  <button onClick={() => setShowModal(true)} disabled={wApy === 0} style={{
                    width: "100%", padding: 16, borderRadius: 10, border: "none", cursor: wApy > 0 ? "pointer" : "not-allowed",
                    background: wApy > 0 ? "linear-gradient(135deg, #F7931A, #E8850F)" : "#1E1F2A",
                    color: wApy > 0 ? "#08090E" : "#52525B", fontFamily: "'Sora'", fontSize: 16, fontWeight: 700,
                    boxShadow: wApy > 0 ? "0 4px 24px rgba(247,147,26,0.35)" : "none",
                  }}>{wApy > 0 ? "Deploy with One Click ⚡" : "Build a Strategy First"}</button>
                  <div style={{ fontSize: 10, color: "#52525B", textAlign: "center", marginTop: 10, lineHeight: 1.5 }}>Batched atomic transactions. Review before confirming.</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(8,9,14,0.85)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => setShowModal(false)}>
            <div onClick={e => e.stopPropagation()} style={{ width: 440, padding: 32, borderRadius: 16, background: "linear-gradient(135deg, #151620, #111218)", border: "1px solid #F7931A30", boxShadow: "0 24px 80px rgba(0,0,0,0.6)" }}>
              <div style={{ textAlign: "center", marginBottom: 28 }}>
                <div style={{ width: 64, height: 64, borderRadius: 16, margin: "0 auto 16px", background: "linear-gradient(135deg, rgba(247,147,26,0.2), rgba(247,147,26,0.05))", border: "1px solid #F7931A40", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>⚡</div>
                <h3 style={{ fontFamily: "'Sora'", fontSize: 20, fontWeight: 700, color: "#F7F7F8", margin: "0 0 6px 0" }}>Confirm Allocation</h3>
                <p style={{ fontSize: 13, color: "#71717A", margin: 0 }}>Deploying {btcAmount} BTC across {selectedStrategy ? selectedStrategy.allocations.length : Object.keys(customAllocations).length} protocols</p>
              </div>
              <div style={{ padding: 16, borderRadius: 10, background: "#08090E", border: "1px solid #1E1F2A", marginBottom: 24 }}>
                {[["Total", `${btcAmount} BTC`, "#F7F7F8"], ["Blended APY", `${wApy.toFixed(1)}%`, "#4ADE80"], ["Annual Yield", `${(parseFloat(btcAmount || 0) * wApy / 100).toFixed(4)} BTC`, "#4ADE80"], ["Gas Est.", "~0.00012 BTC", "#A1A1AA"]].map(([l, v, c], i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: i < 3 ? 10 : 0 }}><span style={{ fontSize: 12, color: "#71717A" }}>{l}</span><span style={{ fontSize: 13, fontWeight: 600, color: c }}>{v}</span></div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: 14, borderRadius: 8, border: "1px solid #1E1F2A", background: "transparent", color: "#A1A1AA", fontFamily: "'Sora'", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
                <button onClick={() => { setShowModal(false); alert("🎉 Demo! In production this triggers a wallet transaction."); }} style={{ flex: 2, padding: 14, borderRadius: 8, border: "none", cursor: "pointer", background: "linear-gradient(135deg, #F7931A, #E8850F)", color: "#08090E", fontFamily: "'Sora'", fontSize: 14, fontWeight: 700, boxShadow: "0 4px 20px rgba(247,147,26,0.35)" }}>Confirm & Deploy ⚡</button>
              </div>
            </div>
          </div>
        )}

        <footer style={{ padding: "32px 0 24px", marginTop: 48, borderTop: "1px solid rgba(247,147,26,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 11, color: "#3F3F46" }}>© 2026 yieldsonbitcoin.com</div>
          <div style={{ display: "flex", gap: 20, fontSize: 11, color: "#52525B" }}>{["Docs", "API", "Twitter", "Discord"].map(l => <span key={l} style={{ cursor: "pointer" }}>{l}</span>)}</div>
        </footer>
      </div>
    </div>
  );
}
