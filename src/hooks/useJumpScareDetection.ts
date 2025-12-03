import { useEffect, useRef, useCallback } from 'react';

interface JumpScareDetectionOptions {
  onRageClick?: () => void;
  onMouseShake?: () => void;
  rageClickThreshold?: number; // Number of clicks
  rageClickWindow?: number; // Time window in ms
  mouseShakeThreshold?: number; // Distance threshold
  mouseShakeWindow?: number; // Time window in ms
}

interface ClickEvent {
  timestamp: number;
}

interface MousePosition {
  x: number;
  y: number;
  timestamp: number;
}

/**
 * Custom hook to detect rage clicking and mouse shaking behaviors
 * 
 * Rage Click: 5+ clicks within 1 second
 * Mouse Shake: Rapid large movements (distance > threshold in short time)
 * 
 * Validates Requirements 10.1, 10.2
 */
export function useJumpScareDetection(options: JumpScareDetectionOptions = {}) {
  const {
    onRageClick,
    onMouseShake,
    rageClickThreshold = 5,
    rageClickWindow = 1000,
    mouseShakeThreshold = 300,
    mouseShakeWindow = 500,
  } = options;

  const clicksRef = useRef<ClickEvent[]>([]);
  const mousePositionsRef = useRef<MousePosition[]>([]);
  const lastRageClickRef = useRef<number>(0);
  const lastMouseShakeRef = useRef<number>(0);

  // Detect rage clicking
  const handleClick = useCallback(() => {
    const now = Date.now();
    
    // Add current click
    clicksRef.current.push({ timestamp: now });
    
    // Remove clicks outside the time window
    clicksRef.current = clicksRef.current.filter(
      (click) => now - click.timestamp < rageClickWindow
    );
    
    // Check if we have enough clicks for rage click
    if (clicksRef.current.length >= rageClickThreshold) {
      // Prevent multiple triggers - 60 second cooldown
      if (now - lastRageClickRef.current > 60000) {
        lastRageClickRef.current = now;
        clicksRef.current = []; // Reset after trigger
        if (onRageClick) {
          onRageClick();
        }
      }
    }
  }, [onRageClick, rageClickThreshold, rageClickWindow]);

  // Detect mouse shaking
  const handleMouseMove = useCallback((event: MouseEvent) => {
    const now = Date.now();
    const position: MousePosition = {
      x: event.clientX,
      y: event.clientY,
      timestamp: now,
    };
    
    mousePositionsRef.current.push(position);
    
    // Remove positions outside the time window
    mousePositionsRef.current = mousePositionsRef.current.filter(
      (pos) => now - pos.timestamp < mouseShakeWindow
    );
    
    // Calculate total distance traveled
    if (mousePositionsRef.current.length >= 2) {
      let totalDistance = 0;
      for (let i = 1; i < mousePositionsRef.current.length; i++) {
        const prev = mousePositionsRef.current[i - 1];
        const curr = mousePositionsRef.current[i];
        const dx = curr.x - prev.x;
        const dy = curr.y - prev.y;
        totalDistance += Math.sqrt(dx * dx + dy * dy);
      }
      
      // Check if distance exceeds threshold
      if (totalDistance > mouseShakeThreshold) {
        // Prevent multiple triggers - 60 second cooldown
        if (now - lastMouseShakeRef.current > 60000) {
          lastMouseShakeRef.current = now;
          mousePositionsRef.current = []; // Reset after trigger
          if (onMouseShake) {
            onMouseShake();
          }
        }
      }
    }
  }, [onMouseShake, mouseShakeThreshold, mouseShakeWindow]);

  useEffect(() => {
    // Add event listeners
    document.addEventListener('click', handleClick);
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      // Clean up event listeners
      document.removeEventListener('click', handleClick);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleClick, handleMouseMove]);

  return {
    // Expose methods to manually reset detection if needed
    resetRageClick: () => {
      clicksRef.current = [];
    },
    resetMouseShake: () => {
      mousePositionsRef.current = [];
    },
  };
}
