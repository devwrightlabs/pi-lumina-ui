import { Component, type ErrorInfo, type ReactNode } from 'react';
import type { PiBlankScreenKillerProps } from '../types/lumina';

interface PiBlankScreenKillerState {
  readonly hasError: boolean;
  readonly errorMessage: string;
  readonly stack: string;
}

/**
 * Error boundary that prevents unrecoverable blank screens in Pi webviews.
 */
export class PiBlankScreenKiller extends Component<
  PiBlankScreenKillerProps,
  PiBlankScreenKillerState
> {
  public constructor(props: PiBlankScreenKillerProps) {
    super(props);
    this.state = {
      hasError: false,
      errorMessage: '',
      stack: ''
    };
  }

  public static getDerivedStateFromError(error: Error): PiBlankScreenKillerState {
    return {
      hasError: true,
      errorMessage: error.message,
      stack: error.stack ?? 'No stack trace available'
    };
  }

  public componentDidCatch(error: Error, info: ErrorInfo): void {
    // eslint-disable-next-line no-console
    console.error('[PiBlankScreenKiller] Fatal render error captured.', error, info.componentStack);
  }

  private readonly reset = (): void => {
    this.setState({ hasError: false, errorMessage: '', stack: '' });
    this.props.onRecover?.();
  };

  public override render(): ReactNode {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <section
        role="alert"
        style={{
          minHeight: '100dvh',
          background: '#0A0A0F',
          color: '#F5F5F7',
          padding: 16,
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace'
        }}
      >
        <h1 style={{ color: '#F0C040', marginBottom: 8 }}>{this.props.title ?? 'Render Recovery Mode'}</h1>
        <p style={{ marginTop: 0 }}>A fatal UI error was captured before a blank screen could take over.</p>
        <pre
          style={{
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            background: 'rgba(255,255,255,0.06)',
            borderRadius: 12,
            padding: 12,
            maxHeight: '50dvh',
            overflow: 'auto'
          }}
        >
          {this.state.errorMessage}
          {'\n\n'}
          {this.state.stack}
        </pre>
        <button
          type="button"
          onClick={this.reset}
          style={{
            marginTop: 12,
            border: 0,
            borderRadius: 10,
            padding: '10px 14px',
            background: '#F0C040',
            color: '#111',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          Attempt Recovery
        </button>
      </section>
    );
  }
}
