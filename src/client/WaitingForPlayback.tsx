import React from 'react';
import type { Theme } from './types';

interface WaitingForPlaybackProps {
  screenPlacement: 'fullscreen' | 'halfTop';
  placeholderStyle: React.CSSProperties;
  containerStyle?: React.CSSProperties;
  isConnected: boolean;
  isConnectionStatusKnown: boolean;
  statusMessage: string;
  theme: Theme;
  isMobile: boolean;
}

export const WaitingForPlayback: React.FC<WaitingForPlaybackProps> = ({
  screenPlacement,
  placeholderStyle,
  containerStyle,
  isConnected,
  isConnectionStatusKnown,
  statusMessage,
  theme,
  isMobile,
}) => {
  // WebSocket connection error state
  if (!isConnected && isConnectionStatusKnown) {
    const errorContent = (
      <div style={{
        background: theme.colors.surface,
        borderRadius: theme.effects.borderRadius,
        border: `2px solid ${theme.colors.border}`,
        padding: isMobile ? '20px' : '30px',
        boxShadow: theme.effects.shadow,
        width: '100%',
        boxSizing: 'border-box',
        maxWidth: screenPlacement === 'halfTop' ? '100%' : (isMobile ? '95%' : '800px'),
      }}>
        <h2 style={{
          color: theme.colors.text,
          fontFamily: theme.fonts.title,
          fontSize: isMobile ? '1.5rem' : '2rem',
          marginTop: 0,
          marginBottom: '20px',
          textAlign: 'center',
        }}>
          Connection Error
        </h2>
        <p style={{
          color: theme.colors.textSecondary,
          fontSize: isMobile ? '0.9rem' : '1.1rem',
          lineHeight: '1.6',
          marginBottom: '20px',
          textAlign: 'center',
        }}>
          {statusMessage || 'Unable to connect to the jukebox server. Please check your connection.'}
        </p>
      </div>
    );

    if (screenPlacement === 'halfTop') {
      return (
        <div style={{ ...containerStyle, height: '100%' }}>
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '50px',
          }}>
            {errorContent}
          </div>
        </div>
      );
    }

    return (
      <div style={placeholderStyle}>
        {errorContent}
      </div>
    );
  }

  // No Spotify client connected - show connection instructions
  const connectionInstructions = (
    <div style={{
      background: theme.colors.surface,
      borderRadius: theme.effects.borderRadius,
      border: `2px solid ${theme.colors.border}`,
      padding: isMobile ? '20px' : '30px',
      boxShadow: theme.effects.shadow,
      width: '100%',
      boxSizing: 'border-box',
      maxWidth: screenPlacement === 'halfTop' ? '100%' : (isMobile ? '95%' : '800px'),
    }}>
      <h2 style={{
        color: theme.colors.text,
        fontFamily: theme.fonts.title,
        fontSize: isMobile ? '1.5rem' : '2rem',
        marginTop: 0,
        marginBottom: '20px',
        textAlign: 'center',
      }}>
        No Spotify Connect Instance Connected
      </h2>
      <p style={{
        color: theme.colors.textSecondary,
        fontSize: isMobile ? '0.9rem' : '1.1rem',
        lineHeight: '1.6',
        marginBottom: '30px',
        textAlign: 'center',
      }}>
        To use this jukebox, you need to connect a Spotify Connect device from the Spotify app.
      </p>

      <div style={{
        marginTop: '10px',
      }}>
        <h3 style={{
          color: theme.colors.primary,
          fontFamily: theme.fonts.title,
          fontSize: isMobile ? '1.1rem' : '1.3rem',
          marginBottom: '8px',
          marginTop: 0,
          borderBottom: `2px solid ${theme.colors.border}`,
          paddingBottom: '5px',
        }}>
          How to Connect:
        </h3>

        <ol style={{
          color: theme.colors.text,
          fontSize: isMobile ? '0.85rem' : '0.9rem',
          lineHeight: '1.4',
          paddingLeft: '20px',
          margin: 0,
        }}>
          <li style={{ marginBottom: '6px' }}>
            <strong>Open the Spotify app</strong> on your phone, tablet, or computer
          </li>
          <li style={{ marginBottom: '6px' }}>
            <strong>Start playing any song</strong> or open a playlist/album
          </li>
          <li style={{ marginBottom: '6px' }}>
            <strong>Tap the "Devices Available" button</strong> (looks like a speaker or computer icon) at the bottom of the Now Playing screen
          </li>
          <li style={{ marginBottom: '6px' }}>
            <strong>Select "Jukebox"</strong> from the list of available devices
          </li>
          <li style={{ marginBottom: '0' }}>
            <strong>Your music will start playing</strong> through the jukebox, and you'll see it appear here!
          </li>
        </ol>
      </div>
    </div>
  );

  if (screenPlacement === 'halfTop') {
    return (
      <div style={{ ...containerStyle, height: '100%' }}>
        <div style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          margin: '50px',
          paddingTop: '20px',
        }}>
          {connectionInstructions}
        </div>
      </div>
    );
  }

  return (
    <div style={placeholderStyle}>
      {connectionInstructions}
    </div>
  );
};

