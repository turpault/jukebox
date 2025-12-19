import React, { useEffect, useRef, useState } from 'react';
import type { Theme } from './types';

interface VolumeIndicatorProps {
  volume: number;
  volumeMax: number;
  theme: Theme;
  isMobile: boolean;
  children?: React.ReactNode;
}

export const VolumeIndicator: React.FC<VolumeIndicatorProps> = ({
  volume,
  volumeMax,
  theme,
  isMobile,
  children,
}) => {
  const [showIndicator, setShowIndicator] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const previousVolumeRef = useRef<number | null>(null);

  // Show indicator when volume changes
  useEffect(() => {
    // Skip on initial mount
    if (previousVolumeRef.current === null) {
      previousVolumeRef.current = volume;
      return;
    }

    // Only show indicator if volume actually changed
    if (previousVolumeRef.current !== volume) {
      setShowIndicator(true);
      previousVolumeRef.current = volume;

      // Clear existing timeout
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }

      // Hide indicator after 2 seconds
      timeoutRef.current = window.setTimeout(() => {
        setShowIndicator(false);
        timeoutRef.current = null;
      }, 2000);
    }

    // Cleanup timeout on unmount
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [volume]);

  const styles = {
    volumeIndicator: {
      width: isMobile ? '250px' : '300px',
      height: isMobile ? '250px' : '300px',
      maxWidth: '100%',
      borderRadius: theme.effects.borderRadius,
      boxShadow: theme.effects.shadow,
      border: `3px solid ${theme.colors.border}`,
      background: theme.colors.surface,
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      gap: '20px',
      padding: '30px',
      boxSizing: 'border-box' as const,
    },
    volumeIndicatorIcon: {
      position: 'relative' as const,
      width: '60px',
      height: '48px',
    },
    volumeIndicatorIconBody: {
      position: 'absolute' as const,
      left: 0,
      top: '50%',
      transform: 'translateY(-50%)',
      width: '30px',
      height: '30px',
      border: `3px solid ${theme.colors.primary}`,
      borderRight: 'none',
      borderRadius: '4px 0 0 4px',
      boxShadow: theme.name === 'Matrix'
        ? `0 0 10px ${theme.colors.primary}`
        : `0 0 10px rgba(212, 175, 55, 0.5)`,
    },
    volumeIndicatorIconWaves: {
      position: 'absolute' as const,
      right: 0,
      top: '50%',
      transform: 'translateY(-50%)',
      width: 0,
      height: 0,
      borderTop: `9px solid transparent`,
      borderBottom: `9px solid transparent`,
      borderLeft: `18px solid ${theme.colors.primary}`,
      filter: theme.name === 'Matrix'
        ? `drop-shadow(0 0 5px ${theme.colors.primary})`
        : `drop-shadow(0 0 5px rgba(212, 175, 55, 0.5))`,
    },
    volumeIndicatorBars: {
      display: 'flex',
      alignItems: 'flex-end' as const,
      justifyContent: 'center',
      gap: '4px',
      width: '100%',
      height: '120px',
      padding: '10px',
    },
    volumeIndicatorBar: {
      flex: 1,
      minWidth: '6px',
      background: theme.colors.progressTrack,
      borderRadius: '2px',
      transition: 'all 0.2s ease',
      border: `1px solid ${theme.colors.border}`,
    },
    volumeIndicatorBarActive: {
      background: `linear-gradient(to top, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`,
      boxShadow: theme.name === 'Matrix'
        ? `0 0 8px ${theme.colors.primary}, inset 0 0 4px ${theme.colors.primary}`
        : `0 0 8px rgba(212, 175, 55, 0.6), inset 0 0 4px rgba(212, 175, 55, 0.4)`,
      border: `1px solid ${theme.colors.primary}`,
    },
    volumeIndicatorLabel: {
      fontSize: isMobile ? '2rem' : '2.5rem',
      fontFamily: theme.fonts.title,
      color: theme.colors.primary,
      fontWeight: 'bold' as const,
      textShadow: theme.name === 'Matrix'
        ? `0 0 10px ${theme.colors.primary}, 0 0 20px ${theme.colors.primary}`
        : `0 0 15px rgba(212, 175, 55, 0.6), 0 2px 10px rgba(212, 175, 55, 0.4)`,
      letterSpacing: theme.name === 'Matrix' ? '0.1em' : '0.05em',
    },
  };

  const volumePercent = (volume / (volumeMax || 100)) * 100;

  if (!showIndicator) {
    return <>{children}</>;
  }

  return (
    <div style={styles.volumeIndicator}>
      <div style={styles.volumeIndicatorIcon}>
        <div style={styles.volumeIndicatorIconBody}></div>
        <div style={styles.volumeIndicatorIconWaves}></div>
      </div>
      <div style={styles.volumeIndicatorBars}>
        {Array.from({ length: 20 }, (_, i) => {
          const barThreshold = (i + 1) * 5; // Each bar represents 5% volume (5%, 10%, 15%, etc.)
          const isActive = barThreshold <= volumePercent;
          // Calculate bar height: each bar gets progressively taller
          const baseHeight = 15 + (i * 3); // Bars range from 15% to 72% height
          return (
            <div
              key={i}
              style={{
                ...styles.volumeIndicatorBar,
                ...(isActive ? styles.volumeIndicatorBarActive : {}),
                height: `${baseHeight}%`,
                transitionDelay: `${i * 15}ms`,
              }}
            />
          );
        })}
      </div>
      <div style={styles.volumeIndicatorLabel}>
        {Math.round(volumePercent)}%
      </div>
    </div>
  );
};

