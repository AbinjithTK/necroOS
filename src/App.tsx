import { useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { BootScreen } from './components/BootScreen';
import { LoginPrompt } from './components/LoginPrompt';
import { DesktopEnvironment } from './components/DesktopEnvironment';
import { GlobalStyles } from './styles/GlobalStyles';
import { necroTheme } from './theme';
import { ErrorBoundary } from './components/ErrorBoundary';

type BootStage = 'boot' | 'login' | 'desktop';

/**
 * Main App component implementing the boot sequence state machine
 * Boot sequence: boot → login → desktop
 * Validates Requirements 12.1, 12.2, 12.3, 12.4, 12.5
 * 
 * Wraps application with ThemeProvider for consistent typography and theming
 * Validates Requirements 1.4, 14.1, 14.2, 14.4, 14.5
 * 
 * Includes ErrorBoundary for comprehensive error handling
 */
function App() {
  const [bootStage, setBootStage] = useState<BootStage>('boot');

  const handleBootComplete = () => {
    setBootStage('login');
  };

  const handleLoginSuccess = () => {
    setBootStage('desktop');
  };

  const handleError = (error: Error) => {
    console.error('Application error caught by boundary:', error);
    // Could send to error tracking service here
  };

  return (
    <ErrorBoundary onError={handleError}>
      <ThemeProvider theme={necroTheme}>
        <GlobalStyles />
        
        {bootStage === 'boot' && (
          <BootScreen onBootComplete={handleBootComplete} />
        )}
        
        {bootStage === 'login' && (
          <LoginPrompt onLoginSuccess={handleLoginSuccess} />
        )}
        
        {bootStage === 'desktop' && (
          <DesktopEnvironment />
        )}
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
