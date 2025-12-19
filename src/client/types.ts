// Client-only types

export interface Theme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    active: string;
    progress: string;
    progressTrack: string;
  };
  fonts: {
    primary: string;
    title: string;
  };
  effects: {
    shadow: string;
    borderRadius: string;
  };
}

export const steampunkTheme: Theme = {
  name: 'Steampunk 1930s',
  colors: {
    primary: '#D4AF37',      // Brass/Gold
    secondary: '#B8860B',    // Darker gold
    accent: '#CD853F',       // Peru/bronze
    background: 'linear-gradient(135deg, #2C1810 0%, #1A0F08 50%, #0D0603 100%)', // Dark wood gradient
    surface: 'rgba(61, 40, 23, 0.8)', // Dark brown with transparency
    text: '#F4E4BC',         // Warm cream
    textSecondary: '#D4AF37', // Brass
    border: '#8B6914',       // Aged brass
    active: '#D4AF37',       // Brass for active states
    progress: '#D4AF37',     // Brass progress
    progressTrack: '#3D2817', // Dark brown track
  },
  fonts: {
    primary: '"Cinzel", "Playfair Display", "Times New Roman", serif',
    title: '"Cinzel", "Playfair Display", "Times New Roman", serif',
  },
  effects: {
    shadow: '0 8px 32px rgba(0, 0, 0, 0.8), 0 0 20px rgba(212, 175, 55, 0.3)',
    borderRadius: '8px',
  },
};

export const matrixTheme: Theme = {
  name: 'Matrix',
  colors: {
    primary: '#00FF41',      // Matrix green
    secondary: '#00CC33',    // Darker green
    accent: '#00FF88',       // Bright green
    background: '#000000',   // Pure black
    surface: 'rgba(0, 0, 0, 0.9)', // Black with slight transparency
    text: '#00FF41',         // Matrix green
    textSecondary: '#00CC33', // Darker green
    border: '#003311',       // Dark green border
    active: '#00FF41',       // Matrix green for active states
    progress: '#00FF41',     // Matrix green progress
    progressTrack: '#001100', // Very dark green track
  },
  fonts: {
    primary: '"Courier New", "Monaco", "Consolas", monospace',
    title: '"Courier New", "Monaco", "Consolas", monospace',
  },
  effects: {
    shadow: '0 0 20px rgba(0, 255, 65, 0.5), 0 0 40px rgba(0, 255, 65, 0.3)',
    borderRadius: '0px',
  },
};

// Theme registry
export const themes: Record<string, Theme> = {
  steampunk: steampunkTheme,
  matrix: matrixTheme,
};

