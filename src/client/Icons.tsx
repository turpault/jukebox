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

