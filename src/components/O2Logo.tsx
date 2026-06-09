import React from "react";

export function O2Logo({ size = 120, className = "" }: { size?: number; className?: string }) {
  return (
    <div className={`relative flex justify-center items-center ${className}`} id="o2-cabs-custom-logo">
      <svg width={size} height={size} viewBox="0 0 320 320" className="drop-shadow-lg select-none">
        {/* Outer Black Border */}
        <circle cx="160" cy="160" r="150" fill="#ffffff" stroke="#111111" strokeWidth="10" />
        {/* Inner Yellow Ring */}
        <circle cx="160" cy="160" r="138" fill="none" stroke="#FFC107" strokeWidth="4" />
        
        {/* Big stylized O and 2 */}
        <g transform="translate(0, -6)">
          {/* Big Yellow O */}
          <text x="58" y="146" fill="#FFC107" fontSize="120" fontWeight="900" fontFamily='"Inter", sans-serif' letterSpacing="-0.04em">O</text>
          {/* Big Charcoal 2 */}
          <text x="150" y="146" fill="#111111" fontSize="120" fontWeight="900" fontFamily='"Inter", sans-serif' letterSpacing="-0.04em">2</text>
          
          {/* Speedmeter needle or arc above 2 */}
          <path d="M 160 52 A 65 65 0 0 1 245 95" fill="none" stroke="#111111" strokeWidth="7" strokeLinecap="round" />
          <path d="M 172 62 A 50 50 0 0 1 235 95" fill="none" stroke="#FFC107" strokeWidth="4" strokeDasharray="3,3" />
        </g>

        {/* CABS Wordmark (Thick, Italicized, Modern) */}
        <text x="160" y="200" textAnchor="middle" fill="#111111" fontSize="44" fontWeight="950" fontFamily='"Inter", "Arial Black", sans-serif' fontStyle="italic" letterSpacing="0.02em">
          CABS
        </text>

        {/* Side wings */}
        {/* Left Wing */}
        <g stroke="#FFC107" strokeWidth="3" strokeLinecap="round">
          <line x1="45" y1="184" x2="72" y2="184" strokeWidth="4" />
          <line x1="50" y1="192" x2="68" y2="192" strokeWidth="3" />
          <line x1="56" y1="200" x2="64" y2="200" strokeWidth="2" />
        </g>
        {/* Right Wing */}
        <g stroke="#FFC107" strokeWidth="3" strokeLinecap="round">
          <line x1="248" y1="184" x2="275" y2="184" strokeWidth="4" />
          <line x1="252" y1="192" x2="270" y2="192" strokeWidth="3" />
          <line x1="256" y1="200" x2="264" y2="200" strokeWidth="2" />
        </g>

        {/* YOUR DAILY RIDE PARTNER subtitle */}
        <g transform="translate(0, 5)">
          <text x="160" y="218" textAnchor="middle" fill="#111111" fontSize="10.5" fontWeight="900" fontFamily='"Inter", sans-serif' letterSpacing="0.05em">
            YOUR DAILY <tspan fill="#FFC107">RIDE</tspan> PARTNER
          </text>
          <line x1="48" y1="214" x2="76" y2="214" stroke="#111111" strokeWidth="1.2" opacity="0.4" />
          <line x1="244" y1="214" x2="272" y2="214" stroke="#111111" strokeWidth="1.2" opacity="0.4" />
        </g>

        {/* Curved Asphalt track at the bottom */}
        {/* Draw black road curve and yellow dotted divider */}
        <path d="M 50 252 Q 160 292 270 252" fill="none" stroke="#111111" strokeWidth="36" strokeLinecap="round" />
        <path d="M 58 253 Q 160 294 262 253" fill="none" stroke="#FFC107" strokeWidth="3" strokeDasharray="10,8" />

        {/* stylized car on road */}
        <g transform="translate(160, 240) scale(0.65)">
          <path d="M -30 2 C -30 -6 -20 -14 -4 -16 C 5 -27 16 -29 28 -29 C 40 -29 49 -27 58 -16 C 74 -14 84 -6 84 2 L 84 10 C 84 13 80 14 62 14 L -8 14 C -26 14 -30 13 -30 10 Z" fill="#ffffff" stroke="#111111" strokeWidth="3" />
          <path d="M -5 -16 C 5 -25 15 -27 28 -27 C 38 -27 45 -25 55 -16 Z" fill="#111111" />
          {/* headlights */}
          <circle cx="-18" cy="4" r="4" fill="#FFC107" />
          <circle cx="72" cy="4" r="4" fill="#FFC107" />
        </g>

        {/* Curved Text JAYNAGAR • MADHUBANI • BIHAR */}
        <path id="badge-curve-path" d="M 52 282 Q 160 324 268 282" fill="none" stroke="none" />
        <text fontSize="10.5" fontWeight="900" fill="#ffffff" letterSpacing="0.08em" fontFamily='"Inter", sans-serif'>
          <textPath href="#badge-curve-path" startOffset="50%" textAnchor="middle">
            JAYNAGAR  •  MADHUBANI  •  BIHAR
          </textPath>
        </text>
      </svg>
    </div>
  );
}

export default O2Logo;
