import React from "react";

export default function AiIcon({ size = 28 }) {
  return (
    <div className="ai-icon" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Glow background */}
        <circle
          cx="16" cy="16" r="14"
          fill="var(--accent, #e5ff00)"
          opacity="0.08"
          className="ai-icon-glow"
        />

        {/* Brain outline */}
        <g className="ai-icon-pulse">
          {/* Left hemisphere */}
          <path
            d="M16 6C12.5 6 10 8 9 10C7.5 11 7 13 7 15C7 17.5 8 19.5 9.5 21C10.5 22.5 12 24 14 25C14.8 25.5 15.5 26 16 26"
            stroke="var(--accent, #e5ff00)"
            strokeWidth="1.6"
            strokeLinecap="round"
            fill="none"
          />
          {/* Right hemisphere */}
          <path
            d="M16 6C19.5 6 22 8 23 10C24.5 11 25 13 25 15C25 17.5 24 19.5 22.5 21C21.5 22.5 20 24 18 25C17.2 25.5 16.5 26 16 26"
            stroke="var(--accent, #e5ff00)"
            strokeWidth="1.6"
            strokeLinecap="round"
            fill="none"
          />
          {/* Center fold */}
          <line
            x1="16" y1="6" x2="16" y2="26"
            stroke="var(--accent, #e5ff00)"
            strokeWidth="1"
            opacity="0.5"
          />
          {/* Brain folds left */}
          <path
            d="M10 12C12 13 14 12.5 16 13"
            stroke="var(--accent, #e5ff00)"
            strokeWidth="1"
            strokeLinecap="round"
            fill="none"
            opacity="0.7"
          />
          <path
            d="M8.5 16C11 17 13 16 16 16.5"
            stroke="var(--accent, #e5ff00)"
            strokeWidth="1"
            strokeLinecap="round"
            fill="none"
            opacity="0.7"
          />
          <path
            d="M10 20C12 20.5 14 19.5 16 20"
            stroke="var(--accent, #e5ff00)"
            strokeWidth="1"
            strokeLinecap="round"
            fill="none"
            opacity="0.7"
          />
          {/* Brain folds right */}
          <path
            d="M22 12C20 13 18 12.5 16 13"
            stroke="var(--accent, #e5ff00)"
            strokeWidth="1"
            strokeLinecap="round"
            fill="none"
            opacity="0.7"
          />
          <path
            d="M23.5 16C21 17 19 16 16 16.5"
            stroke="var(--accent, #e5ff00)"
            strokeWidth="1"
            strokeLinecap="round"
            fill="none"
            opacity="0.7"
          />
          <path
            d="M22 20C20 20.5 18 19.5 16 20"
            stroke="var(--accent, #e5ff00)"
            strokeWidth="1"
            strokeLinecap="round"
            fill="none"
            opacity="0.7"
          />
        </g>

        {/* Circuit lines */}
        <path
          d="M7 15L4 15L4 12"
          stroke="var(--accent, #e5ff00)"
          strokeWidth="1"
          fill="none"
          opacity="0.6"
          className="ai-icon-circuit"
        />
        <path
          d="M25 15L28 15L28 18"
          stroke="var(--accent, #e5ff00)"
          strokeWidth="1"
          fill="none"
          opacity="0.6"
          className="ai-icon-circuit"
        />
        <path
          d="M16 26L16 29"
          stroke="var(--accent, #e5ff00)"
          strokeWidth="1"
          fill="none"
          opacity="0.6"
          className="ai-icon-circuit"
        />

        {/* Spark dots */}
        <circle cx="4" cy="12" r="1.5" fill="var(--accent, #e5ff00)" className="ai-icon-spark" />
        <circle cx="28" cy="18" r="1.5" fill="var(--accent, #e5ff00)" className="ai-icon-spark" />
        <circle cx="16" cy="29" r="1.5" fill="var(--accent, #e5ff00)" className="ai-icon-spark" />
      </svg>
    </div>
  );
}
