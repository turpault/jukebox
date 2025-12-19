import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useJukeboxState } from './JukeboxStateProvider';
import { useConfigState } from './ConfigStateProvider';
import { SpotifyIdsList } from './SpotifyIdsList';
import { VolumeIndicator } from './VolumeIndicator';
import { WaitingForPlayback } from './WaitingForPlayback';
import type { HotkeyConfig } from '../types';
import { Theme, themes, steampunkTheme } from './types';
import { getCachedImageUrl } from './utils';
import {
  PlayIcon,
  PauseIcon,
  PreviousIcon,
  NextIcon,
  ShuffleIcon,
  RepeatIcon,
  RepeatOneIcon,
  VolumeIcon,
} from './Icons';

// Client-side tracing utilities (matching server-side trace format)
function generateTraceId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

const traceContexts = new Map<string, { startTime: number; method: string; endpoint: string }>();

// Logging utilities with trace format
const logREST = (method: string, endpoint: string, data?: any, response?: any, error?: any) => {
  const timestamp = new Date().toISOString();
  const traceId = generateTraceId();

  if (error) {
    const duration = traceContexts.get(traceId) ? Date.now() - traceContexts.get(traceId)!.startTime : undefined;
    console.error(`[TRACE] [${timestamp}] [${traceId}] ERROR: API request failed`, {
      timestamp,
      traceId,
      level: 'error',
      message: 'API request failed',
      method,
      path: endpoint,
      direction: 'outbound',
      type: 'api',
      ...(duration !== undefined && { durationMs: duration }),
      error: error instanceof Error ? error.message : String(error),
    });
    traceContexts.delete(traceId);
  } else {
    const startTime = Date.now();
    traceContexts.set(traceId, { startTime, method, endpoint });

    if (response !== undefined) {
      const duration = Date.now() - startTime;
      traceContexts.delete(traceId);
      console.log(`[TRACE] [${timestamp}] [${traceId}] INFO: API request completed`, {
        timestamp,
        traceId,
        level: 'info',
        message: 'API request completed',
        method,
        path: endpoint,
        direction: 'outbound',
        type: 'api',
        durationMs: duration,
        requestBody: data ? (typeof data === 'string' ? data : JSON.stringify(data)) : undefined,
        responseBody: response ? (typeof response === 'string' ? response : JSON.stringify(response)) : undefined,
      });
    } else {
      console.log(`[TRACE] [${timestamp}] [${traceId}] INFO: Outgoing API request`, {
        timestamp,
        traceId,
        level: 'info',
        message: 'Outgoing API request',
        method,
        path: endpoint,
        direction: 'outbound',
        type: 'api',
        requestBody: data ? (typeof data === 'string' ? data : JSON.stringify(data)) : undefined,
      });
    }
  }
};


export default function App() {
  // Get state from provider
  const {
    playerState,
    statusMessage,
    isConnected,
    themeName,
    viewName,
    screenPlacement,
    isKioskMode,
    hotkeys,
    isThemeLoaded,
    isConnectionStatusKnown,
    isConfigLoaded,
    loadingSpotifyId,
    togglePlay,
    nextTrack,
    previousTrack,
    setVolume,
    seek,
    toggleRepeat,
    toggleShuffle,
    addToQueue,
    fetchTracksFromSpotifyId,
    setLoadingSpotifyId,
    setStatusMessage,
    setThemeName,
  } = useJukeboxState();

  // Get config state
  const { configuredSpotifyIds, recentArtists } = useConfigState();

  // Local UI state
  const [theme, setTheme] = useState<Theme>(steampunkTheme);
  const gamepadPollIntervalRef = useRef<number | null>(null);
  const lastGamepadStateRef = useRef<boolean[]>([]);

  // UI-specific API call helper (for functions that need to update statusMessage)
  const apiCall = useCallback(async (endpoint: string, method: string = 'GET', body?: any) => {
    const url = endpoint;
    logREST(method, endpoint, body);

    try {
      const startTime = Date.now();
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      const duration = Date.now() - startTime;
      const responseData = await response.json().catch(() => null);

      if (!response.ok) {
        const error = new Error(`API call failed: ${response.status} ${response.statusText}`);
        logREST(method, endpoint, body, null, { status: response.status, statusText: response.statusText, duration: `${duration}ms` });
        throw error;
      }

      logREST(method, endpoint, body, responseData, null);
      console.log(`[REST API] Response time: ${duration}ms`);
      return responseData;
    } catch (error) {
      logREST(method, endpoint, body, null, error);
      return null;
    }
  }, []);


  // Update theme when query parameter changes
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const themeParam = urlParams.get('theme') || 'steampunk';
    if (themes[themeParam]) {
      setTheme(themes[themeParam]);
    }
  }, [themeName]);

  // Update theme when themeName changes
  useEffect(() => {
    if (themes[themeName]) {
      setTheme(themes[themeName]);
    }
  }, [themeName]);


  // Handle kiosk mode fullscreen
  useEffect(() => {
    if (isKioskMode) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {
          // Ignore fullscreen errors (user may have denied permission)
        });
      }
    }
  }, [isKioskMode]);

  // Update document body background when theme changes
  useEffect(() => {
    // Extract solid color from theme background (handle gradients)
    const bgColor = theme.colors.background.includes('gradient')
      ? '#000000' // Default to black for gradients
      : theme.colors.background;

    document.body.style.background = bgColor;
    document.body.style.color = theme.colors.text;

    return () => {
      // Reset on unmount
      document.body.style.background = '';
      document.body.style.color = '';
    };
  }, [theme]);

  // Kiosk mode: disable text selection and right-click
  useEffect(() => {
    if (isKioskMode) {
      // Disable text selection
      document.body.style.userSelect = 'none';
      document.body.style.webkitUserSelect = 'none';
      (document.body.style as any).mozUserSelect = 'none';
      (document.body.style as any).msUserSelect = 'none';

      // Disable right-click context menu
      const handleContextMenu = (e: MouseEvent) => {
        e.preventDefault();
        return false;
      };

      // Disable common keyboard shortcuts that could exit kiosk mode
      const handleKeyDown = (e: KeyboardEvent) => {
        // Allow F11 for fullscreen toggle, but block F12 (dev tools) and Ctrl+Shift+I
        if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
          e.preventDefault();
          return false;
        }
      };

      document.addEventListener('contextmenu', handleContextMenu);
      document.addEventListener('keydown', handleKeyDown);

      return () => {
        document.body.style.userSelect = '';
        document.body.style.webkitUserSelect = '';
        (document.body.style as any).mozUserSelect = '';
        (document.body.style as any).msUserSelect = '';
        document.removeEventListener('contextmenu', handleContextMenu);
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isKioskMode]);


  const adjustVolume = async (delta: number) => {
    const newVolume = Math.max(0, Math.min(playerState.volumeMax, playerState.volume + delta));
    await setVolume(newVolume);
  };

  const adjustSeek = async (delta: number) => {
    const duration = playerState.currentTrack?.duration || 0;
    const newPosition = Math.max(0, Math.min(duration, playerState.position + delta));
    await seek(newPosition);
  };

  // Keyboard hotkey handler
  useEffect(() => {
    if (!hotkeys) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger hotkeys when typing in inputs
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const key = e.code || e.key;
      const kb = hotkeys.keyboard;

      if (kb.playPause && (key === kb.playPause || (kb.playPause === "Space" && key === " "))) {
        e.preventDefault();
        togglePlay();
      } else if (kb.next && key === kb.next) {
        e.preventDefault();
        nextTrack();
      } else if (kb.previous && key === kb.previous) {
        e.preventDefault();
        previousTrack();
      } else if (kb.volumeUp && key === kb.volumeUp) {
        e.preventDefault();
        adjustVolume(hotkeys.volumeStep || 5);
      } else if (kb.volumeDown && key === kb.volumeDown) {
        e.preventDefault();
        adjustVolume(-(hotkeys.volumeStep || 5));
      } else if (kb.seekForward && key === kb.seekForward) {
        e.preventDefault();
        adjustSeek(hotkeys.seekStep || 10000);
      } else if (kb.seekBackward && key === kb.seekBackward) {
        e.preventDefault();
        adjustSeek(-(hotkeys.seekStep || 10000));
      } else if (kb.shuffle && key === kb.shuffle) {
        e.preventDefault();
        toggleShuffle();
      } else if (kb.repeat && key === kb.repeat) {
        e.preventDefault();
        toggleRepeat();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [hotkeys, playerState.volume, playerState.volumeMax, playerState.position, playerState.currentTrack?.duration]);

  // Gamepad hotkey handler
  useEffect(() => {
    if (!hotkeys) return;

    // Check if gamepad API is available (not available in iOS 9)
    if (typeof navigator.getGamepads !== 'function') {
      return;
    }

    const pollGamepads = () => {
      const gamepads = navigator.getGamepads();
      if (!gamepads || gamepads.length === 0) return;

      const gamepad = gamepads[0]; // Use first connected gamepad
      if (!gamepad) return;

      // Initialize last state array if needed
      if (lastGamepadStateRef.current.length !== gamepad.buttons.length) {
        lastGamepadStateRef.current = new Array(gamepad.buttons.length).fill(false);
      }

      const gp = hotkeys.gamepad;
      const buttons = gamepad.buttons;

      // Check each configured button
      const checkButton = (buttonIndex: number | undefined, action: () => void) => {
        if (buttonIndex !== undefined && buttonIndex < buttons.length) {
          const pressed = buttons[buttonIndex].pressed;
          const wasPressed = lastGamepadStateRef.current[buttonIndex];

          if (pressed && !wasPressed) {
            action();
          }
          lastGamepadStateRef.current[buttonIndex] = pressed;
        }
      };

      checkButton(gp.playPause, togglePlay);
      checkButton(gp.next, nextTrack);
      checkButton(gp.previous, previousTrack);
      checkButton(gp.volumeUp, () => adjustVolume(hotkeys.volumeStep || 5));
      checkButton(gp.volumeDown, () => adjustVolume(-(hotkeys.volumeStep || 5)));
      checkButton(gp.shuffle, toggleShuffle);
      checkButton(gp.repeat, toggleRepeat);
    };

    // Poll gamepads every 50ms
    gamepadPollIntervalRef.current = window.setInterval(pollGamepads, 50);

    return () => {
      if (gamepadPollIntervalRef.current) {
        clearInterval(gamepadPollIntervalRef.current);
        gamepadPollIntervalRef.current = null;
      }
    };
  }, [hotkeys, playerState.volume, playerState.volumeMax]);

  // iOS 9 compatible padStart replacement
  const padStart = (str: string, targetLength: number, padString: string): string => {
    const strValue = String(str);
    if (strValue.length >= targetLength) {
      return strValue;
    }
    const pad = padString || ' ';
    const padLength = targetLength - strValue.length;
    let padded = '';
    for (let i = 0; i < padLength; i++) {
      padded += pad;
    }
    return padded + strValue;
  };

  const formatTime = (ms: number): string => {
    if (!ms || isNaN(ms)) return '0:00';
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return minutes + ':' + padStart(String(seconds), 2, '0');
  };


  const styles = useMemo(() => createStyles(theme), [theme]);

  // Add spinner animation if not already in document
  useEffect(() => {
    if (!document.getElementById('spinner-keyframes')) {
      const style = document.createElement('style');
      style.id = 'spinner-keyframes';
      style.textContent = `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  // Show loading spinner until all config is loaded
  if (!isConfigLoaded) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000000',
        zIndex: 10000,
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          border: '4px solid #333333',
          borderTop: '4px solid #ffffff',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }} />
      </div>
    );
  }


  const containerStyle = screenPlacement === 'halfTop' 
    ? { ...styles.container, justifyContent: 'flex-start', height: '50vh', minHeight: '50vh', position: 'absolute' as const, top: 0, left: 0, right: 0 }
    : styles.container;
  
  const contentStyle = screenPlacement === 'halfTop'
    ? { ...styles.content, maxWidth: '100%', marginLeft: '0', marginRight: '0', padding: '0', height: '100%', overflow: 'hidden' }
    : styles.content;

  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        {playerState.isActive && playerState.currentTrack ? (
          <>
            {/* Default/Dash View Layout */}
              <div style={styles.player}>
                <div style={styles.albumArtContainer}>
                  <VolumeIndicator
                    volume={playerState.volume}
                    volumeMax={playerState.volumeMax}
                    theme={theme}
                  >
                    {playerState.currentTrack?.album_cover_url && (
                      <img
                        src={getCachedImageUrl(playerState.currentTrack.album_cover_url)}
                        alt={playerState.currentTrack.name || 'Album cover'}
                        style={styles.albumArt}
                      />
                    )}
                  </VolumeIndicator>
                </div>
                <div style={styles.trackInfo}>
                  <h2 style={{
                    color: theme.colors.text,
                    fontFamily: theme.fonts.title,
                    margin: '10px 0',
                    fontSize: '1.8rem',
                    textShadow: theme.name === 'Matrix'
                      ? `0 0 10px ${theme.colors.primary}, 0 0 20px ${theme.colors.primary}`
                      : `0 2px 10px rgba(212, 175, 55, 0.3)`
                  }}>{playerState.currentTrack.name || 'Unknown Track'}</h2>
                  <h3 style={{
                    color: theme.colors.textSecondary,
                    fontFamily: theme.fonts.primary,
                    margin: '5px 0',
                    fontSize: '1.2rem',
                    fontWeight: 'normal'
                  }}>{playerState.currentTrack.artist_names?.join(', ') || 'Unknown Artist'}</h3>
                  {playerState.currentTrack.album_name && (
                    <p style={{
                      fontSize: '0.9em',
                      color: theme.colors.textSecondary,
                      opacity: 0.8,
                      fontFamily: theme.fonts.primary,
                      margin: '5px 0'
                    }}>{playerState.currentTrack.album_name}</p>
                  )}
                </div>
                {/* Progress bar / Seek control */}
                <div style={styles.progressContainer}>
                  <span style={styles.timeLabel}>{formatTime(playerState.position)}</span>
                  <input
                    type="range"
                    min={0}
                    max={playerState.currentTrack?.duration || 0}
                    value={playerState.position}
                    onChange={(e) => {
                      // Position will be updated when seek completes
                    }}
                    onMouseUp={(e) => {
                      const target = e.target as HTMLInputElement;
                      seek(parseInt(target.value));
                    }}
                    onTouchEnd={(e) => {
                      const target = e.target as HTMLInputElement;
                      seek(parseInt(target.value));
                    }}
                    style={styles.progressBar}
                  />
                  <span style={styles.timeLabel}>{formatTime(playerState.currentTrack?.duration || 0)}</span>
                </div>

                {/* Main playback controls - hidden in dash view */}
                {viewName !== 'dash' && (
                <div style={styles.controls}>
                  <button
                    style={{ ...styles.button, ...(playerState.shuffleContext ? styles.buttonActive : {}) }}
                    onClick={toggleShuffle}
                    title="Shuffle"
                    onMouseEnter={(e) => {
                      if (!playerState.shuffleContext) {
                        Object.assign(e.currentTarget.style, styles.buttonHover);
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!playerState.shuffleContext) {
                        Object.assign(e.currentTarget.style, styles.button);
                      }
                    }}
                  >
                    <ShuffleIcon color={theme.colors.text} size={20} />
                  </button>
                  <button
                    style={styles.button}
                    onClick={previousTrack}
                    title="Previous"
                    onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.buttonHover)}
                    onMouseLeave={(e) => Object.assign(e.currentTarget.style, styles.button)}
                  >
                    <PreviousIcon color={theme.colors.text} size={20} />
                  </button>
                  <button
                    style={styles.button}
                    onClick={togglePlay}
                    title={playerState.isPaused ? "Play" : "Pause"}
                    onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.buttonHover)}
                    onMouseLeave={(e) => Object.assign(e.currentTarget.style, styles.button)}
                  >
                    {playerState.isPaused ? (
                      <PlayIcon color={theme.colors.text} size={20} />
                    ) : (
                      <PauseIcon color={theme.colors.text} size={20} />
                    )}
                  </button>
                  <button
                    style={styles.button}
                    onClick={nextTrack}
                    title="Next"
                    onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.buttonHover)}
                    onMouseLeave={(e) => Object.assign(e.currentTarget.style, styles.button)}
                  >
                    <NextIcon color={theme.colors.text} size={20} />
                  </button>
                  <button
                    style={{ ...styles.button, ...(playerState.repeatTrack || playerState.repeatContext ? styles.buttonActive : {}) }}
                    onClick={toggleRepeat}
                    title={playerState.repeatTrack ? "Repeat Track" : playerState.repeatContext ? "Repeat Context" : "Repeat Off"}
                    onMouseEnter={(e) => {
                      if (!playerState.repeatTrack && !playerState.repeatContext) {
                        Object.assign(e.currentTarget.style, styles.buttonHover);
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!playerState.repeatTrack && !playerState.repeatContext) {
                        Object.assign(e.currentTarget.style, styles.button);
                      }
                    }}
                  >
                    {playerState.repeatTrack ? (
                      <RepeatOneIcon color={theme.colors.text} size={20} />
                    ) : (
                      <RepeatIcon color={theme.colors.text} size={20} />
                    )}
                  </button>
                </div>
              )}

              {/* Volume control - hidden in dash view */}
              {viewName !== 'dash' && (
                <div style={styles.volumeContainer}>
                  <div style={styles.iconVolumeContainer}>
                    <VolumeIcon color={theme.colors.textSecondary} size={20} />
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={playerState.volumeMax || 100}
                    value={playerState.volume}
                    onChange={(e) => {
                      const newVolume = parseInt(e.target.value);
                      // Volume will be updated when setVolume completes
                    }}
                    onMouseUp={(e) => {
                      const target = e.target as HTMLInputElement;
                      setVolume(parseInt(target.value));
                    }}
                    onTouchEnd={(e) => {
                      const target = e.target as HTMLInputElement;
                      setVolume(parseInt(target.value));
                    }}
                    style={styles.volumeSlider}
                  />
                  <span style={styles.volumeLabel}>{Math.round((playerState.volume / (playerState.volumeMax || 100)) * 100)}%</span>
                </div>
              )}
              </div>
          </>
        ) : (
          <WaitingForPlayback
            screenPlacement={screenPlacement}
            placeholderStyle={styles.placeholder}
            containerStyle={screenPlacement === 'halfTop' ? containerStyle : undefined}
            isConnected={isConnected}
            isConnectionStatusKnown={isConnectionStatusKnown}
            statusMessage={statusMessage}
            theme={theme}
          />
        )}

        {/* Spotify ID Lists - Side by side on desktop, stacked on mobile - hidden in dash and controls views */}
        {viewName !== 'dash' && viewName !== 'controls' && (
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            gap: '0',
            marginTop: '0',
          }}>
            {/* Configured IDs - Left Side */}
            <SpotifyIdsList
              items={configuredSpotifyIds}
              title="Configured"
              sidebarStyle="left"
              theme={theme}
              styles={styles}
            />

            {/* Recent Artists - Right Side */}
            {viewName !== 'dash' && (
              <SpotifyIdsList
                items={recentArtists}
                title="Recent Artists"
                sidebarStyle="right"
                theme={theme}
                styles={styles}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Create styles function that uses theme and mobile detection
const createStyles = (theme: Theme): Record<string, React.CSSProperties> => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: '100%',
    minHeight: '100vh',
    fontFamily: theme.fonts.primary,
    background: theme.colors.background,
    color: theme.colors.text,
    position: 'relative',
    overflow: 'hidden',
    // Safe area padding - iOS 9 doesn't support env(), but also doesn't have notches
    // So we can safely use 0 for iOS 9 devices
    // For iOS 11+, the CSS @supports rule in index.html will add the env() padding
    paddingTop: '0',
    paddingBottom: '0',
    paddingLeft: '0',
    paddingRight: '0',
    width: '100%',
  },
  loadingContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: '30px',
    paddingTop: '20px',
  },
  title: {
    fontSize: '4rem',
    margin: 0,
    fontWeight: 'bold',
    fontFamily: theme.fonts.title,
    background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    textShadow: theme.name === 'Matrix'
      ? `0 0 20px ${theme.colors.primary}, 0 0 40px ${theme.colors.primary}`
      : `0 0 30px rgba(212, 175, 55, 0.5)`,
    letterSpacing: theme.name === 'Matrix' ? '0.2em' : '0.1em',
  },
  spinnerContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    width: '60px',
    height: '60px',
    border: `4px solid ${theme.colors.border}`,
    borderTop: `4px solid ${theme.colors.primary}`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    boxShadow: theme.name === 'Matrix'
      ? `0 0 20px ${theme.colors.primary}`
      : `0 0 20px rgba(212, 175, 55, 0.4)`,
  },
  statusMessage: {
    color: theme.colors.textSecondary,
    fontSize: '1.2rem',
    margin: 0,
    fontFamily: theme.fonts.primary,
  },
  content: {
    textAlign: 'center',
    maxWidth: '800px',
    width: '100%',
    padding: '20px',
    marginLeft: '180px',
    marginRight: '180px',
    background: theme.colors.surface,
    borderRadius: theme.effects.borderRadius,
    border: `2px solid ${theme.colors.border}`,
    boxShadow: theme.effects.shadow,
    boxSizing: 'border-box',
  },
  status: {
    color: theme.colors.textSecondary,
    marginBottom: '20px',
    fontFamily: theme.fonts.primary,
  },
  player: {
    position: 'relative',
    width: '100%',
    height: '100%',
    display: 'block',
    overflow: 'visible',
    // Artwork bottom position for reference: top (20/30) + height (250/300) = 270/330
  },
  albumArtContainer: {
    position: 'absolute',
    top: '30px',
    left: '30px',
    zIndex: 1,
  },
  albumArt: {
    width: '300px',
    height: '300px',
    maxWidth: '100%',
    borderRadius: theme.effects.borderRadius,
    boxShadow: theme.effects.shadow,
    border: `3px solid ${theme.colors.border}`,
    display: 'block',
  },
  trackInfo: {
    position: 'absolute',
    top: '30px',
    left: '360px',
    right: '30px',
    textAlign: 'left',
    zIndex: 1,
  },
  controls: {
    position: 'absolute',
    bottom: '60px',
    left: '30px',
    right: '30px',
    display: 'flex',
    gap: '20px',
    alignItems: 'center',
    flexWrap: 'nowrap',
    justifyContent: 'center',
    zIndex: 10,
  },
  button: {
    background: `linear-gradient(135deg, ${theme.colors.surface} 0%, ${theme.colors.border} 100%)`,
    border: `2px solid ${theme.colors.border}`,
    color: theme.colors.text,
    fontSize: '2rem',
    cursor: 'pointer',
    padding: '12px',
    borderRadius: '50%',
    transition: 'all 0.3s ease',
    boxShadow: `0 4px 15px rgba(0, 0, 0, 0.5)`,
    minWidth: '60px',
    minHeight: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    touchAction: 'manipulation',
    WebkitTapHighlightColor: 'transparent',
  },
  buttonHover: {
    background: `linear-gradient(135deg, ${theme.colors.border} 0%, ${theme.colors.primary} 100%)`,
    boxShadow: theme.name === 'Matrix'
      ? `0 0 20px ${theme.colors.primary}, 0 4px 15px rgba(0, 0, 0, 0.5)`
      : `0 0 20px rgba(212, 175, 55, 0.5), 0 4px 15px rgba(0, 0, 0, 0.5)`,
    transform: 'scale(1.05)',
  },
  buttonActive: {
    background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`,
    boxShadow: theme.name === 'Matrix'
      ? `0 0 25px ${theme.colors.primary}, 0 4px 15px rgba(0, 0, 0, 0.5)`
      : `0 0 25px rgba(212, 175, 55, 0.6), 0 4px 15px rgba(0, 0, 0, 0.5)`,
    border: `2px solid ${theme.colors.primary}`,
  },
  progressContainer: {
    position: 'absolute',
    // Align bottom with artwork bottom
    // Artwork bottom: top (30) + height (300) = 330 from top
    // Position so container bottom aligns - estimate container height ~25px
    top: '305px',
    left: '360px',
    right: '30px',
    display: 'flex',
    alignItems: 'flex-end',
    gap: '10px',
    padding: '0',
    zIndex: 1,
  },
  progressBar: {
    flex: 1,
    height: '8px',
    borderRadius: '4px',
    background: theme.colors.progressTrack,
    outline: 'none',
    cursor: 'pointer',
    border: `1px solid ${theme.colors.border}`,
    touchAction: 'pan-y',
    WebkitTapHighlightColor: 'transparent',
  },
  timeLabel: {
    fontSize: '0.9em',
    color: theme.colors.textSecondary,
    width: '45px',
    textAlign: 'center',
    fontFamily: theme.fonts.primary,
    fontVariantNumeric: 'tabular-nums',
    flexShrink: 0,
  },
  volumeContainer: {
    position: 'absolute',
    // Position above progress bar - progress bar top is 305px, place volume ~30px above
    top: '275px',
    left: '360px',
    right: '30px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '0',
    zIndex: 1,
  },
  iconVolumeContainer: {
    width: '45px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  spotifyIdsSidebarLeft: {
    position: 'fixed',
    left: 0,
    top: 0,
    bottom: 0,
    width: '160px',
    maxHeight: 'none',
    padding: '15px 10px',
    background: theme.colors.surface,
    borderRight: `2px solid ${theme.colors.border}`,
    borderBottom: 'none',
    boxShadow: `4px 0 20px rgba(0, 0, 0, 0.5)`,
    zIndex: 100,
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '0',
  },
  spotifyIdsSidebarRight: {
    position: 'fixed',
    right: 0,
    top: 0,
    bottom: 0,
    width: '160px',
    maxHeight: 'none',
    padding: '15px 10px',
    background: theme.colors.surface,
    borderLeft: `2px solid ${theme.colors.border}`,
    borderTop: 'none',
    boxShadow: `-4px 0 20px rgba(0, 0, 0, 0.5)`,
    zIndex: 100,
    display: 'flex',
    flexDirection: 'column',
    marginTop: '0',
  },
  spotifyIdsSidebarTitle: {
    color: theme.colors.primary,
    fontSize: '0.9rem',
    fontWeight: 'bold',
    fontFamily: theme.fonts.title,
    marginBottom: '15px',
    textAlign: 'center',
    paddingBottom: '10px',
    borderBottom: `1px solid ${theme.colors.border}`,
  },
  spotifyIdsSidebarScroll: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    overflowY: 'auto',
    overflowX: 'hidden',
    scrollbarWidth: 'thin',
    scrollbarColor: `${theme.colors.border} ${theme.colors.surface}`,
    flex: 1,
    WebkitOverflowScrolling: 'touch',
  },
  spotifyIdButton: {
    position: 'relative',
    flexShrink: 0,
    width: '100%',
    aspectRatio: '1',
    padding: 0,
    border: `2px solid ${theme.colors.border}`,
    borderRadius: theme.effects.borderRadius,
    background: theme.colors.surface,
    cursor: 'pointer',
    overflow: 'hidden',
    transition: 'transform 0.2s, box-shadow 0.2s',
    outline: 'none',
  },
  spotifyIdImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
    transition: 'opacity 0.3s, filter 0.3s',
  },
  spotifyIdOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    background: `linear-gradient(to top, ${theme.colors.surface} 0%, transparent 100%)`,
    padding: '10px',
    opacity: 0,
    transition: 'opacity 0.2s',
  },
  spotifyIdName: {
    color: theme.colors.text,
    fontSize: '0.9rem',
    fontFamily: theme.fonts.primary,
    fontWeight: 'bold',
    textAlign: 'center',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  spotifyIdLoadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    pointerEvents: 'none',
  },
  spotifyIdSpinner: {
    width: '50px',
    height: '50px',
    border: `5px solid ${theme.colors.border}`,
    borderTop: `5px solid ${theme.colors.primary}`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    boxShadow: theme.name === 'Matrix'
      ? `0 0 20px ${theme.colors.primary}`
      : `0 0 15px rgba(212, 175, 55, 0.6)`,
  },
  volumeSlider: {
    flex: 1,
    height: '6px',
    borderRadius: '3px',
    background: theme.colors.progressTrack,
    outline: 'none',
    cursor: 'pointer',
    border: `1px solid ${theme.colors.border}`,
    touchAction: 'pan-y',
    WebkitTapHighlightColor: 'transparent',
  },
  volumeLabel: {
    fontSize: '0.9em',
    color: theme.colors.textSecondary,
    width: '45px',
    textAlign: 'center',
    fontFamily: theme.fonts.primary,
    fontVariantNumeric: 'tabular-nums',
    flexShrink: 0,
  },
  placeholder: {
    color: theme.colors.textSecondary,
    fontFamily: theme.fonts.primary,
  }
});