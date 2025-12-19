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
}

export const WaitingForPlayback: React.FC<WaitingForPlaybackProps> = ({
  screenPlacement,
  placeholderStyle,
  containerStyle,
  isConnected,
  isConnectionStatusKnown,
  statusMessage,
  theme,
}) => {
  // Display a status message if when not connected
  if (!isConnected && isConnectionStatusKnown) {
    return (
      <div style={{ ...placeholderStyle, textAlign: 'center' }}>
        <p style={{ color: theme.colors.textSecondary, fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '30px' }}>
        Unable to connect to the jukebox server. Please check your connection.
        </p>
      </div>
    );
  }


  // No Spotify client connected - show connection instructions
  const connectionInstructions = (
    <div style={{
      background: theme.colors.surface,
      borderRadius: theme.effects.borderRadius,
      border: `2px solid ${theme.colors.border}`,
      padding: '30px',
      boxShadow: theme.effects.shadow,
      width: '100%',
      boxSizing: 'border-box',
      maxWidth: '800px',
    }}>            
      <h2 style={{
        color: theme.colors.text,
        fontFamily: theme.fonts.title,
        fontSize: '2rem',
        marginTop: 0,
        marginBottom: '20px',
        textAlign: 'center',
      }}>
        No Spotify Connect Instance Connected
      </h2>
      <p style={{
        color: theme.colors.textSecondary,
        fontSize: '1.1rem',
        lineHeight: '1.6',
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
          fontSize: '1.3rem',
          marginBottom: '8px',
          marginTop: 0,
          borderBottom: `2px solid ${theme.colors.border}`,
          paddingBottom: '5px',
        }}>
          How to Connect:
        </h3>

        <ol style={{
          color: theme.colors.text,
          fontSize: '0.9rem',
          lineHeight: '1.2',
          paddingLeft: '20px',
          margin: 0,
        }}>
          <li style={{ marginBottom: '3px', lineHeight: '1.2' }}>
            <strong>Open the Spotify app</strong> on your phone, tablet, or computer
          </li>
          <li style={{ marginBottom: '3px', lineHeight: '1.2' }}>
            <strong>Start playing any song</strong> or open a playlist/album
          </li>
          <li style={{ marginBottom: '3px', lineHeight: '1.2' }}>
            <strong>Tap the "Devices Available" button</strong> (looks like a speaker or computer icon) at the bottom of the Now Playing screen
          </li>
          <li style={{ marginBottom: '3px', lineHeight: '1.2' }}>
            <strong>Select "Jukebox"</strong> from the list of available devices
          </li>
          <li style={{ marginBottom: '0', lineHeight: '1.2' }}>
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
          paddingTop: '0',
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

