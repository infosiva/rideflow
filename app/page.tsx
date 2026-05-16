"use client";
import { useState, useEffect } from "react";
import { MapPin, Clock, Car, Shield, Star, ChevronRight, Zap, Users, Phone } from "lucide-react";

// ── Currency / region detection ───────────────────────────────────────────────
const REGION_CONFIG: Record<string, { currency: string; symbol: string; baseRate: number; unit: string; flag: string }> = {
  IN: { currency: "INR", symbol: "₹", baseRate: 12, unit: "km", flag: "🇮🇳" },
  GB: { currency: "GBP", symbol: "£", baseRate: 3.5, unit: "mile", flag: "🇬🇧" },
  AE: { currency: "AED", symbol: "د.إ", baseRate: 4.5, unit: "km", flag: "🇦🇪" },
  SG: { currency: "SGD", symbol: "S$", baseRate: 3.2, unit: "km", flag: "🇸🇬" },
  US: { currency: "USD", symbol: "$", baseRate: 2.8, unit: "mile", flag: "🇺🇸" },
  AU: { currency: "AUD", symbol: "A$", baseRate: 3.0, unit: "km", flag: "🇦🇺" },
};
const DEFAULT_REGION = REGION_CONFIG.IN;

// ── Ride types ────────────────────────────────────────────────────────────────
const RIDE_TYPES = [
  { id: "economy", label: "Economy", icon: "🚗", desc: "Affordable everyday rides", multiplier: 1, seats: 4, eta: "3-5 min" },
  { id: "comfort", label: "Comfort", icon: "🚙", desc: "Extra space & AC guaranteed", multiplier: 1.4, seats: 4, eta: "5-8 min" },
  { id: "xl",      label: "XL",      icon: "🚐", desc: "Groups up to 7 passengers", multiplier: 1.8, seats: 7, eta: "6-10 min" },
  { id: "bike",    label: "Bike",    icon: "🏍️", desc: "Beat traffic, single rider", multiplier: 0.6, seats: 1, eta: "2-4 min" },
];

const SERVICES = [
  { icon: "✈️", label: "Airport Transfer", desc: "Fixed price, flight tracking" },
  { icon: "🏙️", label: "City Rides",        desc: "Quick local trips, lowest fare" },
  { icon: "🛣️", label: "Outstation",        desc: "One-way & round trips" },
  { icon: "📅", label: "Scheduled Pickup",  desc: "Book up to 7 days ahead" },
  { icon: "🏢", label: "Corporate",         desc: "Monthly billing, GST invoice" },
  { icon: "👰", label: "Special Events",    desc: "Weddings, parties, nights out" },
];

const TESTIMONIALS = [
  { name: "Arjun M.", city: "Bangalore", text: "Booked airport pickup at midnight. Driver arrived early, car was clean. Best taxi experience I've had.", stars: 5, avatar: "AM" },
  { name: "Priya S.", city: "Mumbai", text: "Outstation trip to Pune — upfront price, no surge. Will never use another app again.", stars: 5, avatar: "PS" },
  { name: "Raj K.", city: "Delhi", text: "Corporate account set up in 10 mins. GST invoices, monthly billing — exactly what we needed.", stars: 5, avatar: "RK" },
];

function estimatePrice(distance: number, rideType: typeof RIDE_TYPES[0], region: typeof DEFAULT_REGION): string {
  const base = 50 * (region.symbol === "₹" ? 1 : 0.08);
  const per = region.baseRate;
  const total = (base + distance * per) * rideType.multiplier;
  return `${region.symbol}${Math.round(total)}–${region.symbol}${Math.round(total * 1.15)}`;
}

// ── Booking form ──────────────────────────────────────────────────────────────
function BookingForm({ region }: { region: typeof DEFAULT_REGION }) {
  const [pickup, setPickup]     = useState("");
  const [drop, setDrop]         = useState("");
  const [date, setDate]         = useState("");
  const [time, setTime]         = useState("");
  const [rideType, setRideType] = useState("economy");
  const [distance]              = useState(12);
  const [step, setStep]         = useState<"form" | "confirm" | "booked">("form");
  const [loading, setLoading]   = useState(false);

  const selected = RIDE_TYPES.find(r => r.id === rideType)!;
  const price    = estimatePrice(distance, selected, region);

  const handleBook = async () => {
    if (!pickup || !drop) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setStep("confirm");
  };

  const handleConfirm = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setStep("booked");
  };

  if (step === "booked") {
    return (
      <div style={{ textAlign: "center", padding: "32px 0" }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: "#f1f5f9", marginBottom: 8, fontFamily: "var(--font-display)" }}>Ride Confirmed!</div>
        <div style={{ color: "rgba(148,163,184,0.85)", fontSize: 14, marginBottom: 24 }}>Your {selected.label} is on its way · ETA {selected.eta}</div>
        <div style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)", borderRadius: 12, padding: "16px 20px", marginBottom: 20 }}>
          <div style={{ color: "#22c55e", fontWeight: 700, fontSize: 15 }}>Driver assigned · Tracking link sent to your phone</div>
        </div>
        <button onClick={() => setStep("form")} style={{ background: "transparent", border: "1px solid rgba(37,99,235,0.3)", color: "#3b82f6", borderRadius: 10, padding: "10px 24px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          Book another ride
        </button>
      </div>
    );
  }

  if (step === "confirm") {
    return (
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(148,163,184,0.6)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>Confirm your ride</div>
        {[
          { label: "Pickup", value: pickup, icon: "📍" },
          { label: "Drop", value: drop, icon: "🏁" },
          { label: "Ride type", value: `${selected.icon} ${selected.label}`, icon: "" },
          { label: "Est. fare", value: price, icon: "💰" },
          { label: "ETA", value: selected.eta, icon: "⏱️" },
        ].map(({ label, value }) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(37,99,235,0.1)" }}>
            <span style={{ color: "rgba(148,163,184,0.7)", fontSize: 13 }}>{label}</span>
            <span style={{ color: "#f1f5f9", fontSize: 13, fontWeight: 600 }}>{value}</span>
          </div>
        ))}
        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <button onClick={() => setStep("form")} style={{ flex: 1, background: "transparent", border: "1px solid rgba(100,116,139,0.3)", color: "rgba(148,163,184,0.8)", borderRadius: 10, padding: "12px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
            Edit
          </button>
          <button onClick={handleConfirm} disabled={loading} style={{ flex: 2, background: "#2563eb", color: "#fff", border: "none", borderRadius: 10, padding: "12px", fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}>
            {loading ? "Confirming…" : "Confirm & Book →"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Pickup */}
      <div style={{ position: "relative" }}>
        <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#22c55e", pointerEvents: "none" }}>
          <MapPin size={16} />
        </div>
        <input value={pickup} onChange={e => setPickup(e.target.value)} placeholder="Pickup location" style={{ width: "100%", background: "rgba(15,27,45,0.8)", border: "1px solid rgba(37,99,235,0.2)", borderRadius: 10, padding: "12px 12px 12px 38px", color: "#f1f5f9", fontSize: 14 }} />
      </div>
      {/* Drop */}
      <div style={{ position: "relative" }}>
        <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#ef4444", pointerEvents: "none" }}>
          <MapPin size={16} />
        </div>
        <input value={drop} onChange={e => setDrop(e.target.value)} placeholder="Where to?" style={{ width: "100%", background: "rgba(15,27,45,0.8)", border: "1px solid rgba(37,99,235,0.2)", borderRadius: 10, padding: "12px 12px 12px 38px", color: "#f1f5f9", fontSize: 14 }} />
      </div>
      {/* Date + Time */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ background: "rgba(15,27,45,0.8)", border: "1px solid rgba(37,99,235,0.2)", borderRadius: 10, padding: "12px", color: "#f1f5f9", fontSize: 13 }} />
        <input type="time" value={time} onChange={e => setTime(e.target.value)} style={{ background: "rgba(15,27,45,0.8)", border: "1px solid rgba(37,99,235,0.2)", borderRadius: 10, padding: "12px", color: "#f1f5f9", fontSize: 13 }} />
      </div>
      {/* Ride type selector */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {RIDE_TYPES.map(rt => (
          <button key={rt.id} onClick={() => setRideType(rt.id)}
            style={{ background: rideType === rt.id ? "rgba(37,99,235,0.15)" : "rgba(15,27,45,0.6)", border: `1px solid ${rideType === rt.id ? "rgba(37,99,235,0.5)" : "rgba(37,99,235,0.15)"}`, borderRadius: 10, padding: "10px 12px", cursor: "pointer", textAlign: "left", transition: "all 150ms" }}>
            <div style={{ fontSize: 18, marginBottom: 2 }}>{rt.icon}</div>
            <div style={{ color: rideType === rt.id ? "#3b82f6" : "#f1f5f9", fontWeight: 700, fontSize: 13 }}>{rt.label}</div>
            <div style={{ color: "rgba(148,163,184,0.6)", fontSize: 11 }}>{rt.seats} seats · {rt.eta}</div>
          </button>
        ))}
      </div>
      {/* Price estimate */}
      {pickup && drop && (
        <div style={{ background: "rgba(37,99,235,0.08)", border: "1px solid rgba(37,99,235,0.2)", borderRadius: 10, padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "rgba(148,163,184,0.8)", fontSize: 13 }}>Estimated fare</span>
          <span style={{ color: "#3b82f6", fontWeight: 800, fontSize: 16 }}>{price}</span>
        </div>
      )}
      <button onClick={handleBook} disabled={!pickup || !drop || loading}
        style={{ background: !pickup || !drop ? "rgba(37,99,235,0.3)" : "#2563eb", color: "#fff", border: "none", borderRadius: 12, padding: "14px", fontSize: 15, fontWeight: 700, cursor: !pickup || !drop ? "not-allowed" : "pointer", transition: "all 150ms", boxShadow: pickup && drop ? "0 4px 24px rgba(37,99,235,0.4)" : "none" }}>
        {loading ? "Finding rides…" : "Find a Ride →"}
      </button>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function Home() {
  const [region, setRegion] = useState(DEFAULT_REGION);
  const [detectedFlag, setDetectedFlag] = useState("🌍");

  useEffect(() => {
    // Detect country from timezone as proxy (no API key needed)
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz.startsWith("Asia/Kolkata") || tz.startsWith("Asia/Calcutta")) { setRegion(REGION_CONFIG.IN); setDetectedFlag("🇮🇳"); }
    else if (tz.startsWith("Europe/London")) { setRegion(REGION_CONFIG.GB); setDetectedFlag("🇬🇧"); }
    else if (tz.startsWith("Asia/Dubai")) { setRegion(REGION_CONFIG.AE); setDetectedFlag("🇦🇪"); }
    else if (tz.startsWith("Asia/Singapore")) { setRegion(REGION_CONFIG.SG); setDetectedFlag("🇸🇬"); }
    else if (tz.startsWith("America/")) { setRegion(REGION_CONFIG.US); setDetectedFlag("🇺🇸"); }
    else if (tz.startsWith("Australia/")) { setRegion(REGION_CONFIG.AU); setDetectedFlag("🇦🇺"); }
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#080f1a" }}>

      {/* Nav */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(8,15,26,0.95)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(37,99,235,0.1)", padding: "0 20px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 20 }}>🚖</span>
          <span style={{ fontWeight: 800, fontSize: 17, color: "#f1f5f9", letterSpacing: "-0.02em", fontFamily: "var(--font-display)" }}>Ride<span style={{ color: "#2563eb" }}>Flow</span></span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 16 }} title="Location detected">{detectedFlag}</span>
          <span style={{ fontSize: 12, color: "rgba(148,163,184,0.6)", background: "rgba(37,99,235,0.1)", padding: "3px 8px", borderRadius: 99, border: "1px solid rgba(37,99,235,0.2)" }}>{region.symbol} {region.currency}</span>
          <a href="tel:+1800000000" style={{ display: "flex", alignItems: "center", gap: 5, background: "#2563eb", color: "#fff", padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 700, textDecoration: "none" }}>
            <Phone size={12} /> Book Now
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 20px 40px", display: "grid", gridTemplateColumns: "1fr 420px", gap: 48, alignItems: "center" }}
        className="fade-up">
        {/* Left */}
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 99, padding: "4px 12px", fontSize: 11, color: "#22c55e", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 20 }}>
            <span className="live-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
            Drivers available now
          </div>
          <h1 style={{ fontSize: "clamp(32px,4.5vw,54px)", fontWeight: 900, color: "#f1f5f9", letterSpacing: "-0.04em", lineHeight: 1.1, margin: "0 0 16px", fontFamily: "var(--font-display)" }}>
            Your ride,<br />
            <span style={{ background: "linear-gradient(135deg,#2563eb,#60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>anywhere.</span>
          </h1>
          <p style={{ color: "rgba(148,163,184,0.85)", fontSize: 17, lineHeight: 1.65, maxWidth: 480, margin: "0 0 32px" }}>
            Fast, safe rides at fair prices. No surge surprises — just upfront fares in your local currency.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
            {[
              { icon: <Zap size={15} />, text: "Instant booking" },
              { icon: <Shield size={15} />, text: "Verified drivers" },
              { icon: <Star size={15} />, text: "4.9★ rated" },
            ].map(({ icon, text }) => (
              <div key={text} style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(148,163,184,0.75)", fontSize: 13 }}>
                <span style={{ color: "#2563eb" }}>{icon}</span>
                {text}
              </div>
            ))}
          </div>
        </div>

        {/* Booking card */}
        <div style={{ background: "rgba(15,27,45,0.9)", border: "1px solid rgba(37,99,235,0.2)", borderRadius: 20, padding: "28px 24px", backdropFilter: "blur(16px)", boxShadow: "0 24px 64px rgba(0,0,0,0.5)" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", marginBottom: 16, fontFamily: "var(--font-display)" }}>Where are you going?</div>
          <BookingForm region={region} />
        </div>
      </section>

      {/* Responsive fix: stack on mobile */}
      <style>{`
        @media (max-width: 768px) {
          section[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      {/* Ride types */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 20px" }}>
        <h2 style={{ fontSize: 26, fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.03em", marginBottom: 8, fontFamily: "var(--font-display)" }}>Choose your ride</h2>
        <p style={{ color: "rgba(148,163,184,0.7)", fontSize: 14, marginBottom: 28 }}>All rides include: upfront pricing · verified driver · real-time tracking</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 14 }}>
          {RIDE_TYPES.map(rt => (
            <div key={rt.id} className="ride-card" style={{ background: "rgba(15,27,45,0.7)", border: "1px solid rgba(37,99,235,0.12)", borderRadius: 16, padding: "20px" }}>
              <span style={{ fontSize: 32, display: "block", marginBottom: 12 }}>{rt.icon}</span>
              <div style={{ fontWeight: 800, fontSize: 16, color: "#f1f5f9", marginBottom: 4, fontFamily: "var(--font-display)" }}>{rt.label}</div>
              <div style={{ color: "rgba(148,163,184,0.7)", fontSize: 13, marginBottom: 12 }}>{rt.desc}</div>
              <div style={{ display: "flex", gap: 8 }}>
                <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 99, background: "rgba(37,99,235,0.1)", color: "#60a5fa", fontWeight: 600 }}>
                  <Users size={10} style={{ display: "inline", marginRight: 3 }} />{rt.seats} seats
                </span>
                <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 99, background: "rgba(34,197,94,0.1)", color: "#22c55e", fontWeight: 600 }}>
                  <Clock size={10} style={{ display: "inline", marginRight: 3 }} />{rt.eta}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px 60px" }}>
        <h2 style={{ fontSize: 26, fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.03em", marginBottom: 28, fontFamily: "var(--font-display)" }}>Every journey, covered</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 12 }}>
          {SERVICES.map(s => (
            <div key={s.label} className="ride-card" style={{ background: "rgba(15,27,45,0.7)", border: "1px solid rgba(37,99,235,0.12)", borderRadius: 14, padding: "18px" }}>
              <span style={{ fontSize: 28, display: "block", marginBottom: 10 }}>{s.icon}</span>
              <div style={{ fontWeight: 700, fontSize: 14, color: "#f1f5f9", marginBottom: 4 }}>{s.label}</div>
              <div style={{ color: "rgba(148,163,184,0.6)", fontSize: 12 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats bar */}
      <section style={{ background: "rgba(37,99,235,0.06)", borderTop: "1px solid rgba(37,99,235,0.12)", borderBottom: "1px solid rgba(37,99,235,0.12)", padding: "32px 20px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 24, textAlign: "center" }}>
          {[
            { value: "2M+", label: "Rides completed" },
            { value: "50K+", label: "Verified drivers" },
            { value: "4.9★", label: "Average rating" },
            { value: "120+", label: "Cities covered" },
          ].map(({ value, label }) => (
            <div key={label}>
              <div style={{ fontSize: 30, fontWeight: 900, color: "#2563eb", letterSpacing: "-0.04em", fontFamily: "var(--font-display)" }}>{value}</div>
              <div style={{ color: "rgba(148,163,184,0.65)", fontSize: 13, marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 20px" }}>
        <h2 style={{ fontSize: 26, fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.03em", marginBottom: 28, fontFamily: "var(--font-display)" }}>Loved by riders</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 16 }}>
          {TESTIMONIALS.map(t => (
            <div key={t.name} style={{ background: "rgba(15,27,45,0.7)", border: "1px solid rgba(37,99,235,0.12)", borderRadius: 16, padding: "22px" }}>
              <div style={{ display: "flex", gap: 2, marginBottom: 12 }}>
                {Array.from({ length: t.stars }).map((_, i) => (
                  <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />
                ))}
              </div>
              <p style={{ color: "rgba(241,245,249,0.85)", fontSize: 14, lineHeight: 1.6, margin: "0 0 16px" }}>&ldquo;{t.text}&rdquo;</p>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#2563eb,#1d4ed8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{t.avatar}</div>
                <div>
                  <div style={{ color: "#f1f5f9", fontWeight: 600, fontSize: 13 }}>{t.name}</div>
                  <div style={{ color: "rgba(148,163,184,0.55)", fontSize: 11 }}>{t.city}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px 60px" }}>
        <div style={{ background: "linear-gradient(135deg,rgba(37,99,235,0.15),rgba(59,130,246,0.08))", border: "1px solid rgba(37,99,235,0.25)", borderRadius: 20, padding: "48px 32px", textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🚖</div>
          <h2 style={{ fontSize: 28, fontWeight: 900, color: "#f1f5f9", letterSpacing: "-0.03em", marginBottom: 10, fontFamily: "var(--font-display)" }}>Ready to ride?</h2>
          <p style={{ color: "rgba(148,163,184,0.75)", fontSize: 15, marginBottom: 28 }}>Book your first ride in under 60 seconds. No app, no signup required.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="#booking" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#2563eb", color: "#fff", padding: "13px 28px", borderRadius: 12, fontSize: 15, fontWeight: 700, textDecoration: "none", boxShadow: "0 4px 24px rgba(37,99,235,0.4)" }}>
              Book a Ride <ChevronRight size={16} />
            </a>
            <a href="tel:+1800000000" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", color: "#f1f5f9", border: "1px solid rgba(37,99,235,0.35)", padding: "13px 28px", borderRadius: 12, fontSize: 15, fontWeight: 700, textDecoration: "none" }}>
              <Phone size={15} /> Call to Book
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid rgba(37,99,235,0.1)", padding: "28px 20px", background: "rgba(15,27,45,0.4)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span>🚖</span>
            <span style={{ fontWeight: 800, color: "#f1f5f9", fontFamily: "var(--font-display)" }}>RideFlow</span>
          </div>
          <div style={{ display: "flex", gap: 20, color: "rgba(148,163,184,0.5)", fontSize: 12 }}>
            {["About", "Safety", "Drivers", "Privacy", "Terms"].map(l => (
              <a key={l} href={`/${l.toLowerCase()}`} style={{ color: "inherit", textDecoration: "none" }}>{l}</a>
            ))}
          </div>
          <div style={{ color: "rgba(100,116,139,0.6)", fontSize: 12 }}>&copy; 2026 RideFlow</div>
        </div>
      </footer>

      {/* How it works - float CTA on mobile */}
      <div style={{ display: "none" }} id="booking" />
    </div>
  );
}
