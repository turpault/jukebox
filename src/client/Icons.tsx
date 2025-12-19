import React from 'react';

interface IconProps {
  color?: string;
  size?: number;
}

export const PlayIcon: React.FC<IconProps> = ({ color = 'currentColor', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 4L16 10L6 16V4Z" fill={color} />
  </svg>
);

export const PauseIcon: React.FC<IconProps> = ({ color = 'currentColor', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="2" width="4" height="16" fill={color} />
    <rect x="11" y="2" width="4" height="16" fill={color} />
  </svg>
);

export const PreviousIcon: React.FC<IconProps> = ({ color = 'currentColor', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 4L4 10L12 16V4Z" fill={color} />
    <path d="M16 4L8 10L16 16V4Z" fill={color} />
  </svg>
);

export const NextIcon: React.FC<IconProps> = ({ color = 'currentColor', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 4L16 10L8 16V4Z" fill={color} />
    <path d="M4 4L12 10L4 16V4Z" fill={color} />
  </svg>
);

export const ShuffleIcon: React.FC<IconProps> = ({ color = 'currentColor', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 10H6L8 8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <path d="M18 10H14L12 12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <line x1="10" y1="6" x2="10" y2="14" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const RepeatIcon: React.FC<IconProps> = ({ color = 'currentColor', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="9" cy="9" r="7" stroke={color} strokeWidth="2" fill="none" />
    <path d="M9 5C9 5 9 7 9 9C9 11 12 9 12 9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <path d="M12 9L10 11L12 13" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

export const RepeatOneIcon: React.FC<IconProps> = ({ color = 'currentColor', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="9" cy="9" r="7" stroke={color} strokeWidth="2" fill="none" />
    <path d="M9 5C9 5 9 7 9 9C9 11 12 9 12 9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <path d="M12 9L10 11L12 13" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <text x="9" y="13" textAnchor="middle" fontSize="8" fontWeight="bold" fill={color}>1</text>
  </svg>
);

export const VolumeIcon: React.FC<IconProps> = ({ color = 'currentColor', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M2 6L8 2V14L2 10H0V6H2Z"
      fill={color}
    />
    <path
      d="M10 4L12 6L14 4"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

export const MuteIcon: React.FC<IconProps> = ({ color = 'currentColor', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M2 6L8 2V14L2 10H0V6H2Z"
      fill={color}
    />
    <path
      d="M12 4L16 8L12 12M16 4L12 8L16 12"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

export const DisconnectedIcon: React.FC<IconProps> = ({ color = 'currentColor', size = 64 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Speaker/Device icon */}
    <rect x="8" y="16" width="24" height="32" rx="4" stroke={color} strokeWidth="3" fill="none"/>
    <rect x="12" y="20" width="16" height="24" rx="2" fill={color} opacity="0.3"/>
    <circle cx="20" cy="32" r="4" fill={color} opacity="0.5"/>
    {/* Slash line indicating disconnected */}
    <line x1="36" y1="20" x2="52" y2="44" stroke={color} strokeWidth="3" strokeLinecap="round"/>
    {/* Signal waves (faded) */}
    <path d="M36 28L40 24M36 32L44 24M36 36L48 24" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.4"/>
  </svg>
);

