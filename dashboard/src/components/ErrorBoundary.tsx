import React, { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[Pixel Studio HQ] Caught render error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0b0c16] text-white font-pixel flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-lg bg-[#191c32] border-4 border-arcade-red p-6 shadow-pixel-lg space-y-4">
            <div className="text-2xl">👾</div>
            <h1 className="text-arcade-red text-sm sm:text-base">GLITCH DETECTED IN SECTOR 7</h1>
            <p className="text-[10px] text-gray-300 font-retro leading-relaxed">
              {this.state.error?.message || 'A visual render error occurred.'}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.reload();
              }}
              className="px-4 py-2 bg-arcade-green text-black border-2 border-black pixel-btn text-xs font-bold hover:bg-emerald-400"
            >
              RESPAWN APPLICATION (RELOAD)
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
