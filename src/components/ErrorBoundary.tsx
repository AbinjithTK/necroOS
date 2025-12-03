/**
 * Error Boundary Component
 * Catches React errors and displays a fallback UI
 * Prevents entire application crashes from component errors
 */

import { Component, type ErrorInfo, type ReactNode } from 'react';
import styled from 'styled-components';
import { necroTheme } from '../theme';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

const ErrorContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: ${necroTheme.colors.voidBlack};
  border: 2px solid ${necroTheme.colors.bloodRed};
  padding: 32px;
  max-width: 600px;
  width: 90%;
  color: ${necroTheme.colors.matrixGreen};
  font-family: ${necroTheme.fonts.primary};
  box-shadow: 0 0 20px ${necroTheme.colors.bloodRed};
  z-index: 10000;
`;

const ErrorTitle = styled.h1`
  color: ${necroTheme.colors.bloodRed};
  font-size: 24px;
  margin: 0 0 16px 0;
  text-shadow: 0 0 10px ${necroTheme.colors.bloodRed};
`;

const ErrorMessage = styled.p`
  margin: 0 0 16px 0;
  font-size: 14px;
  line-height: 1.6;
`;

const ErrorDetails = styled.details`
  margin: 16px 0;
  padding: 12px;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid ${necroTheme.colors.matrixGreen};
  cursor: pointer;

  summary {
    font-weight: bold;
    margin-bottom: 8px;
    user-select: none;
  }

  pre {
    margin: 8px 0 0 0;
    font-size: 11px;
    overflow-x: auto;
    white-space: pre-wrap;
    word-wrap: break-word;
  }
`;

const ReloadButton = styled.button`
  background: ${necroTheme.colors.bloodRed};
  color: ${necroTheme.colors.voidBlack};
  border: none;
  padding: 12px 24px;
  font-family: ${necroTheme.fonts.primary};
  font-size: 14px;
  cursor: pointer;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  transition: all 0.2s;

  &:hover {
    background: ${necroTheme.colors.matrixGreen};
    box-shadow: 0 0 10px ${necroTheme.colors.matrixGreen};
  }

  &:active {
    transform: translateY(1px);
  }
`;

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to console
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Update state with error details
    this.setState({
      error,
      errorInfo,
    });

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReload = (): void => {
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <ErrorContainer>
          <ErrorTitle>⚠ SYSTEM CORRUPTION DETECTED</ErrorTitle>
          <ErrorMessage>
            The system has encountered a critical error. The corruption spreads...
          </ErrorMessage>
          <ErrorMessage>
            <strong>Error:</strong> {this.state.error?.message || 'Unknown error'}
          </ErrorMessage>
          {this.state.errorInfo && (
            <ErrorDetails>
              <summary>Technical Details (for the brave)</summary>
              <pre>{this.state.errorInfo.componentStack}</pre>
            </ErrorDetails>
          )}
          <ReloadButton onClick={this.handleReload}>
            Attempt System Resurrection
          </ReloadButton>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}
