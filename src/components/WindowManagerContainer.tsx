import { WindowManager } from './WindowManager';
import { useNecroStore } from '../store';

/**
 * Container component that connects WindowManager to the Zustand store
 */
export function WindowManagerContainer() {
  const windows = useNecroStore((state) => state.windows);
  const activeGlitches = useNecroStore((state) => state.activeGlitches);
  const closeWindow = useNecroStore((state) => state.closeWindow);
  const focusWindow = useNecroStore((state) => state.focusWindow);
  const minimizeWindow = useNecroStore((state) => state.minimizeWindow);

  const handleWindowMove = (id: string, position: { x: number; y: number }) => {
    // Update window position in store
    useNecroStore.setState((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, position } : w
      ),
    }));
  };

  return (
    <WindowManager
      windows={windows}
      activeGlitches={activeGlitches}
      onWindowClose={closeWindow}
      onWindowFocus={focusWindow}
      onWindowMove={handleWindowMove}
      onWindowMinimize={minimizeWindow}
    />
  );
}
