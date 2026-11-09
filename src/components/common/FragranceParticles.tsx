import React, { useMemo } from 'react';
import { FragranceMood } from '../../types';

interface FragranceParticlesProps {
  mood: FragranceMood;
  className?: string;
}

export const FragranceParticles: React.FC<FragranceParticlesProps> = ({ mood, className = '' }) => {
  // Generate stable deterministic particle properties
  const particles = useMemo(() => {
    return Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: (i * 19) % 96 + 2,
      y: (i * 23) % 92 + 4,
      size: (i % 4) * 3 + 4,
      duration: 6 + (i % 7) * 2,
      delay: (i % 5) * 0.8,
      rotation: (i * 47) % 360,
    }));
  }, []);

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none select-none ${className}`}
      aria-hidden="true"
    >
      {/* Dynamic Ambient Background Glows */}
      {mood === 'midnight' && (
        <>
          <div className="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] rounded-full bg-violet-900/20 blur-[130px] animate-pulse" />
          <div className="absolute -bottom-1/4 -left-1/4 w-[500px] h-[500px] rounded-full bg-indigo-950/30 blur-[120px]" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-purple-600/10 blur-[100px]" />
        </>
      )}

      {mood === 'ocean' && (
        <>
          <div className="absolute -top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-cyan-900/25 blur-[120px]" />
          <div className="absolute -bottom-1/4 -right-1/4 w-[550px] h-[550px] rounded-full bg-teal-900/20 blur-[130px]" />
          <div className="absolute top-1/4 right-1/4 w-[350px] h-[350px] rounded-full bg-amber-400/10 blur-[90px]" />
        </>
      )}

      {mood === 'sky' && (
        <>
          <div className="absolute -top-1/4 left-1/3 w-[650px] h-[650px] rounded-full bg-sky-900/25 blur-[120px]" />
          <div className="absolute -bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-amber-600/15 blur-[130px]" />
          <div className="absolute top-1/2 left-10 w-[350px] h-[350px] rounded-full bg-indigo-800/15 blur-[100px]" />
        </>
      )}

      {mood === 'romantic' && (
        <>
          <div className="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] rounded-full bg-rose-950/35 blur-[120px]" />
          <div className="absolute -bottom-1/4 -left-1/4 w-[550px] h-[550px] rounded-full bg-pink-900/20 blur-[130px]" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[450px] h-[450px] rounded-full bg-amber-500/10 blur-[110px]" />
        </>
      )}

      {/* Floating Thematic Motifs */}
      {particles.map((p) => {
        return (
          <div
            key={p.id}
            className="absolute transition-transform duration-1000 ease-out"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              animation: `float-particle ${p.duration}s ease-in-out infinite alternate`,
              animationDelay: `${p.delay}s`,
            }}
          >
            {/* Midnight Aura: Lavender Florets and Violet Stardust */}
            {mood === 'midnight' && (
              p.id % 2 === 0 ? (
                <svg
                  width={p.size * 2}
                  height={p.size * 2.5}
                  viewBox="0 0 24 30"
                  fill="none"
                  style={{ transform: `rotate(${p.rotation}deg)` }}
                  className="opacity-45"
                >
                  <path
                    d="M12 2C10 8 7 12 7 18C7 22 9.5 25 12 25C14.5 25 17 22 17 18C17 12 14 8 12 2Z"
                    fill="#C084FC"
                  />
                  <circle cx="12" cy="7" r="2" fill="#E9D5FF" />
                  <circle cx="9" cy="14" r="2.5" fill="#A855F7" />
                  <circle cx="15" cy="15" r="2.5" fill="#A855F7" />
                  <circle cx="12" cy="21" r="3" fill="#9333EA" />
                </svg>
              ) : (
                <div
                  className="rounded-full bg-purple-300 shadow-[0_0_8px_#C084FC] opacity-60"
                  style={{ width: p.size, height: p.size }}
                />
              )
            )}

            {/* Fresh Drift: Ocean Droplets and Citrus Zest Sparks */}
            {mood === 'ocean' && (
              p.id % 2 === 0 ? (
                <svg
                  width={p.size * 1.8}
                  height={p.size * 1.8}
                  viewBox="0 0 24 24"
                  fill="none"
                  className="opacity-55"
                  style={{ transform: `rotate(${p.rotation}deg)` }}
                >
                  <path
                    d="M12 2C8 9 5 13 5 17C5 21 8.5 23 12 23C15.5 23 19 21 19 17C19 13 16 9 12 2Z"
                    fill="#38BDF8"
                    fillOpacity="0.75"
                  />
                  <ellipse cx="10" cy="15" rx="2" ry="4" fill="#FFFFFF" fillOpacity="0.4" />
                </svg>
              ) : (
                <svg
                  width={p.size * 1.6}
                  height={p.size * 1.6}
                  viewBox="0 0 20 20"
                  fill="none"
                  className="opacity-50"
                  style={{ transform: `rotate(${p.rotation}deg)` }}
                >
                  {/* Citrus crescent segment */}
                  <path
                    d="M4 16C4 8 10 4 16 4C14 12 10 16 4 16Z"
                    fill="#FACC15"
                  />
                </svg>
              )
            )}

            {/* Aero Flex: Wispy Clouds & Sunlit Altitude Shimmer */}
            {mood === 'sky' && (
              p.id % 2 === 0 ? (
                <svg
                  width={p.size * 3}
                  height={p.size * 1.6}
                  viewBox="0 0 40 22"
                  fill="none"
                  className="opacity-35"
                >
                  <path
                    d="M8 18C4 18 1 15 1 11C1 7.5 4 4.5 7.5 4.5C9 2 12.5 0 16.5 0C21.5 0 25.5 3 26.5 7C28 6 30 5.5 32 5.5C36 5.5 39 8.5 39 12.5C39 15.5 37 18 34 18H8Z"
                    fill="#E0F2FE"
                  />
                </svg>
              ) : (
                <div
                  className="rounded-full bg-amber-300 shadow-[0_0_10px_#F59E0B] opacity-50"
                  style={{ width: p.size * 0.9, height: p.size * 0.9 }}
                />
              )
            )}

            {/* Love Vibe: Floating Rose Petals & Champagne Shimmer */}
            {mood === 'romantic' && (
              p.id % 2 === 0 ? (
                <svg
                  width={p.size * 2.2}
                  height={p.size * 2.2}
                  viewBox="0 0 28 28"
                  fill="none"
                  className="opacity-60"
                  style={{ transform: `rotate(${p.rotation}deg)` }}
                >
                  <path
                    d="M14 2C9 6 3 13 4 19C5 24 10 26 14 26C18 26 23 24 24 19C25 13 19 6 14 2Z"
                    fill="#F43F5E"
                    fillOpacity="0.75"
                  />
                  <path
                    d="M14 6C11 9 7 14 8 18C9 22 12 23 14 23"
                    stroke="#FDA4AF"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
              ) : (
                <div
                  className="rounded-full bg-amber-200 shadow-[0_0_8px_#D8B66B] opacity-55"
                  style={{ width: p.size, height: p.size }}
                />
              )
            )}

            {/* Festive Diwali Golden Starlight & Diya Sparkle Accents */}
            {p.id % 3 === 0 && (
              <svg
                width={p.size * 1.9}
                height={p.size * 1.9}
                viewBox="0 0 24 24"
                fill="none"
                className="opacity-65 mt-1"
              >
                <path
                  d="M12 1L14.2 9.8L23 12L14.2 14.2L12 23L9.8 14.2L1 12L9.8 9.8L12 1Z"
                  fill="#D8B66B"
                />
                <circle cx="12" cy="12" r="2" fill="#FFF7D6" />
              </svg>
            )}
          </div>
        );
      })}

      <style>{`
        @keyframes float-particle {
          0% {
            transform: translateY(0px) rotate(0deg);
          }
          100% {
            transform: translateY(-24px) rotate(15deg);
          }
        }
      `}</style>
    </div>
  );
};
