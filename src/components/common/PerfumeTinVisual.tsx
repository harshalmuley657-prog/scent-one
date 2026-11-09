import React, { useState, useId } from 'react';
import { Product } from '../../types';

interface PerfumeTinVisualProps {
  product: Product;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  interactive?: boolean;
  isOpen?: boolean;
  className?: string;
  showBadge?: boolean;
}

export const PerfumeTinVisual: React.FC<PerfumeTinVisualProps> = ({
  product,
  size = 'md',
  interactive = true,
  isOpen: controlledIsOpen,
  className = '',
  showBadge = false,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const rawId = useId();
  const instanceId = rawId.replace(/[^a-zA-Z0-9-_]/g, '');

  // Dimensions based on size
  const dimensions = {
    sm: { width: 140, height: 180, scale: 0.7 },
    md: { width: 220, height: 280, scale: 0.9 },
    lg: { width: 320, height: 400, scale: 1.1 },
    xl: { width: 400, height: 500, scale: 1.35 },
  }[size];

  const handleToggle = () => {
    if (interactive && controlledIsOpen === undefined) {
      setInternalIsOpen((prev) => !prev);
    }
  };

  const { tinColor } = product;

  // Unique SVG element IDs to prevent duplicate ID collisions across instances
  const baseGradId = `tin-base-${product.id}-${instanceId}`;
  const goldTrimId = `gold-trim-${product.id}-${instanceId}`;
  const accentSheenId = `accent-sheen-${product.id}-${instanceId}`;
  const waxCoreId = `wax-core-${product.id}-${instanceId}`;
  const embossFilterId = `emboss-${product.id}-${instanceId}`;

  return (
    <div
      className={`relative select-none flex flex-col items-center justify-center group ${className}`}
      style={{ width: dimensions.width, height: dimensions.height }}
      onClick={handleToggle}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={(e) => {
        if (interactive && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          handleToggle();
        }
      }}
      aria-label={`${product.name} solid perfume tin ${isOpen ? 'open' : 'closed'}`}
    >
      {/* Ambient Fragrance Aura Glow */}
      <div
        className="absolute inset-0 rounded-full blur-3xl transition-opacity duration-700 pointer-events-none -z-10"
        style={{
          background: `radial-gradient(circle, ${tinColor.glowColor} 0%, transparent 70%)`,
          transform: isOpen ? 'scale(1.2)' : 'scale(0.95)',
          opacity: isOpen ? 0.9 : 0.65,
        }}
      />

      {/* SVG Tin Container */}
      <svg
        viewBox="0 0 280 360"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-2xl transition-transform duration-500 ease-out group-hover:scale-105"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id={baseGradId} x1="0" y1="0" x2="280" y2="360" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={tinColor.bodyGradient[0]} />
            <stop offset="100%" stopColor={tinColor.bodyGradient[1]} />
          </linearGradient>

          <linearGradient id={goldTrimId} x1="0" y1="0" x2="280" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#8C6F2D" />
            <stop offset="25%" stopColor="#D8B66B" />
            <stop offset="50%" stopColor="#FFF1CF" />
            <stop offset="75%" stopColor="#D8B66B" />
            <stop offset="100%" stopColor="#8C6F2D" />
          </linearGradient>

          <linearGradient id={accentSheenId} x1="20" y1="20" x2="260" y2="340" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={tinColor.accentGradient[0]} stopOpacity="0.4" />
            <stop offset="50%" stopColor={tinColor.accentGradient[1]} stopOpacity="0.1" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>

          <linearGradient id={waxCoreId} x1="50" y1="80" x2="230" y2="280" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F5EFE6" />
            <stop offset="40%" stopColor="#EADECB" />
            <stop offset="100%" stopColor="#D6C6AE" />
          </linearGradient>

          <filter id={embossFilterId} x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="1" dy="1.5" stdDeviation="0.8" floodColor="#000000" floodOpacity="0.8" />
            <feDropShadow dx="-0.8" dy="-0.8" stdDeviation="0.6" floodColor="#FFFFFF" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Outer Shadow Bed */}
        <ellipse cx="140" cy="335" rx="100" ry="14" fill="#000000" fillOpacity="0.45" filter="blur(8px)" />

        {/* BOTTOM CASE (The Tray holding solid perfume wax) */}
        <g id={`bottom-tray-${instanceId}`}>
          {/* Metal casing exterior */}
          <rect
            x="38"
            y="48"
            width="204"
            height="264"
            rx="28"
            fill={`url(#${baseGradId})`}
            stroke={`url(#${goldTrimId})`}
            strokeWidth="3.5"
          />

          {/* Tray interior recess */}
          <rect
            x="48"
            y="58"
            width="184"
            height="244"
            rx="20"
            fill="#090A0F"
            stroke="#1E232E"
            strokeWidth="2"
          />

          {/* Solid Perfume Wax Core (visible when open) */}
          <g opacity={isOpen ? 1 : 0.25} className="transition-opacity duration-500">
            <rect
              x="54"
              y="64"
              width="172"
              height="232"
              rx="16"
              fill={`url(#${waxCoreId})`}
            />
            {/* Subtle natural wax swirl texture */}
            <path
              d="M 65 140 Q 140 110 215 150 Q 160 210 75 190"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="12"
              strokeLinecap="round"
              fill="none"
              filter="blur(5px)"
            />
            {/* Wax Brand Imprint */}
            <text
              x="140"
              y="170"
              textAnchor="middle"
              fontFamily="'Cormorant Garamond', serif"
              fontSize="24"
              fontWeight="600"
              letterSpacing="6"
              fill="#A28F75"
              filter={`url(#${embossFilterId})`}
            >
              SCENT ONE
            </text>
            <text
              x="140"
              y="195"
              textAnchor="middle"
              fontFamily="'Plus Jakarta Sans', sans-serif"
              fontSize="9"
              fontWeight="600"
              letterSpacing="3"
              fill="#98846C"
            >
              SOLID PERFUME · {product.weightGrams}G
            </text>
          </g>
        </g>

        {/* SLIDING LID (Slides up and slightly rotated when open) */}
        <g
          id={`sliding-lid-${instanceId}`}
          className="transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            transform: isOpen
              ? 'translate(-42px, -64px) rotate(-6deg)'
              : 'translate(0px, 0px) rotate(0deg)',
            transformOrigin: '40px 50px',
          }}
        >
          {/* Lid Shadow when opened */}
          {isOpen && (
            <rect
              x="38"
              y="48"
              width="204"
              height="264"
              rx="28"
              fill="#000000"
              fillOpacity="0.4"
              filter="blur(6px)"
            />
          )}

          {/* Lid Main Metal Body */}
          <rect
            x="36"
            y="46"
            width="208"
            height="268"
            rx="28"
            fill={`url(#${baseGradId})`}
            stroke={`url(#${goldTrimId})`}
            strokeWidth="3.5"
          />

          {/* Internal Matte Plate */}
          <rect
            x="44"
            y="54"
            width="192"
            height="252"
            rx="22"
            fill="#090A0F"
            fillOpacity="0.75"
          />

          {/* Fragrance Sheen */}
          <rect
            x="44"
            y="54"
            width="192"
            height="252"
            rx="22"
            fill={`url(#${accentSheenId})`}
          />

          {/* Metallic Inner Border */}
          <rect
            x="48"
            y="58"
            width="184"
            height="244"
            rx="18"
            stroke={`url(#${goldTrimId})`}
            strokeWidth="1.2"
            strokeDasharray="4 2"
            strokeOpacity="0.6"
            fill="none"
          />

          {/* Ergonomic Finger Slide Grip Ridges at top */}
          <g stroke={`url(#${goldTrimId})`} strokeWidth="1.5" strokeLinecap="round" opacity="0.6">
            <line x1="110" y1="72" x2="170" y2="72" />
            <line x1="116" y1="77" x2="164" y2="77" />
          </g>

          {/* S1 Brand Crest Monogram */}
          <g filter={`url(#${embossFilterId})`}>
            {/* Monogram Seal */}
            <circle
              cx="140"
              cy="142"
              r="34"
              fill="#090A0F"
              stroke={`url(#${goldTrimId})`}
              strokeWidth="2"
            />
            <text
              x="140"
              y="151"
              textAnchor="middle"
              fontFamily="'Cormorant Garamond', serif"
              fontSize="28"
              fontWeight="700"
              letterSpacing="2"
              fill="#D8B66B"
            >
              S1
            </text>
          </g>

          {/* Brand Name */}
          <text
            x="140"
            y="202"
            textAnchor="middle"
            fontFamily="'Cormorant Garamond', serif"
            fontSize="18"
            fontWeight="600"
            letterSpacing="5"
            fill="#F8F3EA"
          >
            SCENT ONE
          </text>

          {/* Product Specific Fragrance Title */}
          <text
            x="140"
            y="226"
            textAnchor="middle"
            fontFamily="'Plus Jakarta Sans', sans-serif"
            fontSize="12"
            fontWeight="700"
            letterSpacing="3"
            fill={tinColor.accentGradient[0]}
          >
            {product.name.toUpperCase()}
          </text>

          {/* Tagline / Subtitle */}
          <text
            x="140"
            y="246"
            textAnchor="middle"
            fontFamily="'Cormorant Garamond', serif"
            fontSize="11"
            fontStyle="italic"
            letterSpacing="1.5"
            fill="#C8CBD2"
            opacity="0.85"
          >
            {product.identity}
          </text>

          {/* Bottom Specifications */}
          <text
            x="140"
            y="280"
            textAnchor="middle"
            fontFamily="'Plus Jakarta Sans', sans-serif"
            fontSize="8"
            fontWeight="500"
            letterSpacing="2"
            fill="#8E929E"
          >
            SOLID PERFUME · {product.weightGrams}G · S1
          </text>
        </g>
      </svg>

      {/* Interactive Helper Cue */}
      {interactive && (
        <span className="mt-3 text-[11px] font-medium tracking-widest uppercase text-[#D8B66B] opacity-75 group-hover:opacity-100 transition-opacity flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D8B66B]" />
          {isOpen ? 'Tap to close tin' : 'Tap to slide open'}
        </span>
      )}

      {/* Category Indicator Tag */}
      {showBadge && (
        <div className="mt-2 text-xs text-neutral-400 font-serif italic">
          {product.category} Collection · {product.weightGrams}g Tin
        </div>
      )}
    </div>
  );
};
