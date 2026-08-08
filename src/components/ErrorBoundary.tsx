import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
  key?: React.Key;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-cream dark:bg-slate-950 text-navy dark:text-slate-100 text-center select-none" id="error-boundary-screen">
          <div className="w-16 h-16 rounded-2xl bg-terracotta/10 dark:bg-terracotta/20 border border-terracotta/30 flex items-center justify-center text-terracotta mb-4 shadow-sm">
            <AlertTriangle className="w-8 h-8 stroke-[1.5]" />
          </div>
          
          <h2 className="font-serif text-2xl font-bold text-burgundy dark:text-rose-400">
            {this.props.fallbackTitle || 'Something went wrong'}
          </h2>
          
          <p className="text-xs text-navy/70 dark:text-slate-400 mt-2 max-w-xs leading-relaxed">
            The screen encountered an unexpected glitch. Don't worry, your progress is safe!
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-3 w-full max-w-xs">
            <button
              onClick={this.handleReset}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-terracotta hover:bg-terracotta-dark text-white text-xs font-semibold py-3 px-4 rounded-xl shadow-md transition-all cursor-pointer active:scale-95"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.hash = '';
              }}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-navy/10 hover:bg-navy/15 dark:bg-slate-800 dark:hover:bg-slate-700 text-navy dark:text-slate-200 text-xs font-semibold py-3 px-4 rounded-xl transition-all cursor-pointer active:scale-95"
            >
              <Home className="w-4 h-4" />
              Reset View
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
