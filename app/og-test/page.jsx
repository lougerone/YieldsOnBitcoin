"use client";

export default function OGTestPage() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#06070B",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 40,
      fontFamily: "'Sora', sans-serif"
    }}>
      {/* OG Image Container - 1200x630 */}
      <div style={{
        width: 1200,
        height: 630,
        background: "linear-gradient(135deg, #08090E 0%, #0D0E14 50%, #111218 100%)",
        borderRadius: 0,
        position: "relative",
        overflow: "hidden",
        border: "1px solid #1E1F2A",
      }}>
        {/* Background grid pattern */}
        <div style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(247,147,26,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(247,147,26,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          opacity: 0.5,
        }} />

        {/* Glowing orb top right */}
        <div style={{
          position: "absolute",
          top: -150,
          right: -100,
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(247,147,26,0.15) 0%, transparent 70%)",
          filter: "blur(60px)",
        }} />

        {/* Glowing orb bottom left */}
        <div style={{
          position: "absolute",
          bottom: -200,
          left: -150,
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(247,147,26,0.1) 0%, transparent 70%)",
          filter: "blur(80px)",
        }} />

        {/* Content */}
        <div style={{
          position: "relative",
          zIndex: 1,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "40px 70px",
          boxSizing: "border-box",
        }}>
          {/* Top bar - Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 10,
              background: "linear-gradient(135deg, #F7931A, #E8850F)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              fontWeight: 700,
              color: "#08090E",
              boxShadow: "0 0 30px rgba(247,147,26,0.4)",
            }}>yB</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 22, color: "#F7F7F8", letterSpacing: "-0.02em" }}>
                yields<span style={{ color: "#F7931A" }}>on</span>bitcoin
              </div>
            </div>
          </div>

          {/* Main content - centered */}
          <div style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            marginTop: -20,
          }}>
            {/* Tagline */}
            <div style={{
              fontSize: 14,
              color: "#F7931A",
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              fontWeight: 600,
              marginBottom: 20,
            }}>
              Bitcoin Yield Aggregator
            </div>

            {/* Main headline */}
            <h1 style={{
              fontSize: 64,
              fontWeight: 800,
              color: "#F7F7F8",
              margin: "0 0 14px 0",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
            }}>
              Every BTC Yield.
              <br />
              <span style={{
                background: "linear-gradient(135deg, #F7931A, #FBBF24)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>One Dashboard.</span>
            </h1>

            {/* Subheadline */}
            <p style={{
              fontSize: 22,
              color: "#71717A",
              margin: "0 0 30px 0",
              maxWidth: 700,
              lineHeight: 1.5,
            }}>
              Compare 20+ protocols. Real-time APYs. Deploy in seconds.
            </p>

            {/* CTA Button */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}>
              <div style={{
                padding: "18px 40px",
                borderRadius: 12,
                background: "linear-gradient(135deg, #F7931A, #E8850F)",
                color: "#08090E",
                fontSize: 18,
                fontWeight: 700,
                boxShadow: "0 4px 30px rgba(247,147,26,0.4)",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}>
                Start Earning Yield →
              </div>
            </div>
          </div>

          {/* Bottom stats bar */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: 60,
            paddingTop: 20,
            borderTop: "1px solid rgba(247,147,26,0.1)",
          }}>
            {[
              { label: "Total TVL", value: "$6.5B+" },
              { label: "Protocols", value: "20+" },
              { label: "Max APY", value: "15%" },
            ].map((stat, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: "#F7F7F8",
                  letterSpacing: "-0.02em",
                }}>{stat.value}</div>
                <div style={{
                  fontSize: 11,
                  color: "#52525B",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginTop: 2,
                }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Decorative protocol icons floating */}
        <div style={{
          position: "absolute",
          top: 100,
          right: 80,
          width: 50,
          height: 50,
          borderRadius: 12,
          background: "rgba(247,147,26,0.1)",
          border: "1px solid rgba(247,147,26,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 24,
          opacity: 0.6,
        }}>₿</div>

        <div style={{
          position: "absolute",
          top: 180,
          right: 160,
          width: 40,
          height: 40,
          borderRadius: 10,
          background: "rgba(139,92,246,0.1)",
          border: "1px solid rgba(139,92,246,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
          opacity: 0.5,
        }}>◈</div>

        <div style={{
          position: "absolute",
          bottom: 140,
          left: 80,
          width: 45,
          height: 45,
          borderRadius: 10,
          background: "rgba(74,222,128,0.1)",
          border: "1px solid rgba(74,222,128,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
          opacity: 0.5,
        }}>⚡</div>

        <div style={{
          position: "absolute",
          bottom: 200,
          left: 150,
          width: 35,
          height: 35,
          borderRadius: 8,
          background: "rgba(56,189,248,0.1)",
          border: "1px solid rgba(56,189,248,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 16,
          opacity: 0.4,
        }}>◎</div>
      </div>

      {/* Instructions below */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');
        body { margin: 0; }
      `}</style>
    </div>
  );
}
