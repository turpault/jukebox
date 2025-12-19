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
  <svg width={size} height={size} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M418.976,324.763c-2.839-2.106-6.667-2.358-9.748-0.638c-3.081,1.733-4.861,5.103-4.573,8.628l2.454,28.148
		c-11.937-1.733-22.768-4.429-32.732-7.954c-13.334-4.742-25.199-10.951-36.246-18.448c-16.535-11.24-31.24-25.524-45.056-42.059
		c-5.295-6.318-10.446-12.972-15.524-19.868c-2.792,4.152-5.512,8.244-8.063,12.155c-9.723,14.74-20.145,30.169-31.625,45.32
		c10.373,12.816,21.661,25.295,34.345,36.884c19.784,18.087,43.058,34.008,70.567,45.177c19.616,7.99,41.301,13.429,65.032,15.908
		l-3.153,36.054c-0.288,3.513,1.492,6.894,4.573,8.616c3.081,1.733,6.908,1.48,9.748-0.626l89.388-66.44
		c2.287-1.697,3.635-4.368,3.635-7.209c0-2.839-1.348-5.523-3.635-7.22L418.976,324.763z" fill={color} />
    <path d="M77.186,159.054c13.31,4.742,25.199,10.951,36.222,18.448c16.559,11.24,31.264,25.524,45.08,42.047
		c5.295,6.33,10.445,12.985,15.524,19.88c2.792-4.164,5.488-8.244,8.063-12.155c9.7-14.74,20.121-30.156,31.626-45.32
		c-10.373-12.816-21.661-25.295-34.345-36.885c-19.784-18.086-43.058-34.02-70.568-45.175
		c-27.51-11.204-59.039-17.497-94.612-17.473H0v66.547h14.176C38.966,148.993,59.4,152.748,77.186,159.054z" fill={color} />
    <path d="M288.504,225.133c9.074-11.324,18.532-21.734,28.592-30.916c15.115-13.79,31.481-24.838,50.735-32.672
		c11.746-4.754,24.67-8.365,39.279-10.47l-2.454,28.172c-0.288,3.526,1.492,6.896,4.573,8.628c3.081,1.72,6.908,1.468,9.748-0.638
		l89.388-66.428c2.287-1.697,3.635-4.381,3.635-7.22c0-2.84-1.348-5.512-3.635-7.209l-89.388-66.44
		c-2.839-2.106-6.667-2.359-9.748-0.626c-3.081,1.722-4.861,5.103-4.573,8.616l3.153,36.042
		c-20.024,2.106-38.63,6.282-55.718,12.371c-18.942,6.727-36.03,15.681-51.385,26.127c-23.033,15.667-42.119,34.561-58.702,54.393
		c-16.583,19.844-30.759,40.687-44.02,60.856c-11.408,17.328-22.816,34.044-34.923,49.147
		c-9.074,11.324-18.532,21.722-28.593,30.916c-15.115,13.79-31.481,24.826-50.735,32.672c-19.279,7.81-41.662,12.552-69.558,12.575
		H0v66.548h14.176c31.626,0.024,60.05-4.934,85.298-13.922c18.917-6.727,36.03-15.681,51.361-26.127
		c23.057-15.668,42.119-34.562,58.702-54.393c16.607-19.844,30.783-40.687,44.045-60.856
		C264.965,256.939,276.398,240.235,288.504,225.133z" fill={color} />
  </svg>
);

export const RepeatIcon: React.FC<IconProps> = ({ color = 'currentColor', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 1L21 5L17 9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <path d="M3 11V9C3 7.89543 3.89543 7 5 7H21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <path d="M7 23L3 19L7 15" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <path d="M21 13V15C21 16.1046 20.1046 17 19 17H3" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

export const RepeatOneIcon: React.FC<IconProps> = ({ color = 'currentColor', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 1L21 5L17 9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <path d="M3 11V9C3 7.89543 3.89543 7 5 7H21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <path d="M7 23L3 19L7 15" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <path d="M21 13V15C21 16.1046 20.1046 17 19 17H3" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <text x="12" y="16" textAnchor="middle" fontSize="10" fontWeight="bold" fill={color}>1</text>
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

