import React from 'react';

/**
 * Refined Minimalist Luxury Diya Lamp Icon with Warm Flickering Flame
 */
export const DiwaliDiyaIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Outer Flame Halo */}
    <path
      d="M14 2C14 2 9.5 7.2 9.5 10.5C9.5 13 11.5 15 14 15C16.5 15 18.5 13 18.5 10.5C18.5 7.2 14 2 14 2Z"
      fill="url(#diyaFlameOuter)"
      className="origin-bottom animate-pulse"
    />
    {/* Inner Core Flame */}
    <path
      d="M14 5.5C14 5.5 11.8 8.6 11.8 10.6C11.8 11.9 12.8 13 14 13C15.2 13 16.2 11.9 16.2 10.6C16.2 8.6 14 5.5 14 5.5Z"
      fill="#FFF7D6"
    />
    {/* Ornate Brass Diya Bowl */}
    <path
      d="M3 16.5C3 16.5 7.5 18 14 18C20.5 18 25 16.5 25 16.5C23.8 21.8 19.5 24.5 14 24.5C8.5 24.5 4.2 21.8 3 16.5Z"
      fill="url(#diyaBowlGrad)"
      stroke="#F5D78E"
      strokeWidth="0.9"
    />
    {/* Decorative Rim & Base */}
    <path
      d="M2.5 16.5C7 18.2 21 18.2 25.5 16.5"
      stroke="#FFF1CF"
      strokeWidth="1.1"
      strokeLinecap="round"
    />
    <path
      d="M9.5 25.5H18.5"
      stroke="#D8B66B"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <defs>
      <linearGradient id="diyaFlameOuter" x1="14" y1="2" x2="14" y2="15" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FDE047" />
        <stop offset="60%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#EA580C" />
      </linearGradient>
      <linearGradient id="diyaBowlGrad" x1="3" y1="16.5" x2="25" y2="24.5" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#D8B66B" />
        <stop offset="50%" stopColor="#B68D40" />
        <stop offset="100%" stopColor="#785A28" />
      </linearGradient>
    </defs>
  </svg>
);

/**
 * Intricate Royal Lotus & Rangoli Mandala SVG Backdrop
 * Renders a delicate concentric geometric pattern for hero pedestals and luxury sections
 */
export const DiwaliMandalaBackdrop: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div
    className={`pointer-events-none select-none overflow-hidden flex items-center justify-center ${className}`}
    aria-hidden="true"
  >
    <svg
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full text-[#D8B66B] animate-[spin_90s_linear_infinite]"
    >
      <g stroke="currentColor" strokeOpacity="0.22">
        {/* Concentric Geometric Rings */}
        <circle cx="200" cy="200" r="188" strokeWidth="0.75" strokeDasharray="3 5" />
        <circle cx="200" cy="200" r="176" strokeWidth="1" />
        <circle cx="200" cy="200" r="148" strokeWidth="0.75" strokeDasharray="2 4" />
        <circle cx="200" cy="200" r="122" strokeWidth="0.9" />
        <circle cx="200" cy="200" r="92" strokeWidth="0.75" />
        <circle cx="200" cy="200" r="62" strokeWidth="0.9" strokeDasharray="4 4" />
        <circle cx="200" cy="200" r="32" strokeWidth="0.8" />

        {/* 16-Pointed Lotus & Star Rangoli Petals */}
        {Array.from({ length: 16 }).map((_, idx) => {
          const angle = idx * 22.5;
          return (
            <g key={idx} transform={`rotate(${angle} 200 200)`}>
              {/* Outer Lotus Petal */}
              <path
                d="M200 24 C214 52, 218 76, 200 108 C182 76, 186 52, 200 24 Z"
                strokeWidth="0.85"
                fill="currentColor"
                fillOpacity="0.025"
              />
              {/* Inner Sacred Arch */}
              <path
                d="M200 78 C210 98, 210 118, 200 138 C190 118, 190 98, 200 78 Z"
                strokeWidth="0.7"
              />
              {/* Radial Filigree Spoke */}
              <line x1="200" y1="12" x2="200" y2="388" strokeWidth="0.4" strokeOpacity="0.3" />
              {/* Outer Bindu Dot */}
              <circle cx="200" cy="18" r="2" fill="currentColor" fillOpacity="0.4" />
            </g>
          );
        })}
      </g>
    </svg>
  </div>
);

/**
 * Symmetrical Ornamental Diwali Divider with Center Diya & Lotus Filigree
 */
export const DiwaliDivider: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div
    className={`flex items-center justify-center gap-3 py-2 select-none pointer-events-none ${className}`}
    aria-hidden="true"
  >
    <div className="h-[1px] w-16 sm:w-28 bg-gradient-to-r from-transparent via-[#D8B66B]/45 to-[#D8B66B]" />
    <span className="text-[#D8B66B]/70 text-[10px]">❖</span>
    <DiwaliDiyaIcon className="w-5 h-5" />
    <span className="text-[#D8B66B]/70 text-[10px]">❖</span>
    <div className="h-[1px] w-16 sm:w-28 bg-gradient-to-l from-transparent via-[#D8B66B]/45 to-[#D8B66B]" />
  </div>
);

/**
 * Delicate Corner Filigree Accent for Product Cards and Featured Containers
 */
export const DiwaliCornerFiligree: React.FC<{
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
}> = ({ position, className = '' }) => {
  const rotationClass =
    position === 'top-left'
      ? 'top-2 left-2 rotate-0'
      : position === 'top-right'
      ? 'top-2 right-2 rotate-90'
      : position === 'bottom-right'
      ? 'bottom-2 right-2 rotate-180'
      : 'bottom-2 left-2 -rotate-90';

  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-6 h-6 absolute pointer-events-none select-none text-[#D8B66B]/35 group-hover:text-[#D8B66B]/75 transition-colors duration-300 ${rotationClass} ${className}`}
      aria-hidden="true"
    >
      <path
        d="M2 24V6C2 3.79086 3.79086 2 6 2H24"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M6 14V8C6 6.89543 6.89543 6 8 6H14"
        stroke="currentColor"
        strokeWidth="0.9"
        strokeLinecap="round"
      />
      <circle cx="5.5" cy="5.5" r="1.5" fill="currentColor" />
      <circle cx="18" cy="2" r="1" fill="currentColor" />
      <circle cx="2" cy="18" r="1" fill="currentColor" />
    </svg>
  );
};

/**
 * Subtle Global Festive Toran & Jaali Lattice Texture Overlay
 */
export const DiwaliJaaliOverlay: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div
    className={`absolute inset-0 pointer-events-none select-none opacity-[0.045] dark:opacity-[0.055] diwali-jaali-pattern ${className}`}
    aria-hidden="true"
  />
);
