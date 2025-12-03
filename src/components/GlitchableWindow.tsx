import React, { useEffect, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { necroTheme } from '../theme';
import type { GlitchEffect } from '../store/types';
import { zalgoTransform } from '../utils/zalgo';

// Window shift glitch - random position offsets
const windowShift = keyframes`
  0% { transform: translate(0, 0); }
  10% { transform: translate(-5px, 2px); }
  20% { transform: translate(3px, -4px); }
  30% { transform: translate(-2px, 3px); }
  40% { transform: translate(4px, -1px); }
  50% { transform: translate(-3px, -2px); }
  60% { transform: translate(2px, 4px); }
  70% { transform: translate(-4px, -3px); }
  80% { transform: translate(5px, 1px); }
  90% { transform: translate(-1px, -5px); }
  100% { transform: translate(0, 0); }
`;

// Color shift glitch - change to blood red
const colorShiftRed = keyframes`
  0% { filter: hue-rotate(0deg) saturate(1); }
  25% { filter: hue-rotate(0deg) saturate(2) brightness(1.2) sepia(0.5) hue-rotate(-50deg); }
  50% { filter: hue-rotate(0deg) saturate(3) brightness(1.5) sepia(0.8) hue-rotate(-50deg); }
  75% { filter: hue-rotate(0deg) saturate(2) brightness(1.2) sepia(0.5) hue-rotate(-50deg); }
  100% { filter: hue-rotate(0deg) saturate(1); }
`;

// Color shift glitch - change to matrix green
const colorShiftGreen = keyframes`
  0% { filter: hue-rotate(0deg) saturate(1); }
  25% { filter: hue-rotate(90deg) saturate(2) brightness(1.2); }
  50% { filter: hue-rotate(90deg) saturate(3) brightness(1.5); }
  75% { filter: hue-rotate(90deg) saturate(2) brightness(1.2); }
  100% { filter: hue-rotate(0deg) saturate(1); }
`;

// Text corruption glitch - distort text
const textCorruption = keyframes`
  0% { 
    text-shadow: 0 0 0 transparent;
    transform: skew(0deg);
  }
  20% { 
    text-shadow: 
      -2px 0 ${necroTheme.colors.bloodRed},
      2px 0 ${necroTheme.colors.matrixGreen};
    transform: skew(-2deg);
  }
  40% { 
    text-shadow: 
      2px 0 ${necroTheme.colors.bloodRed},
      -2px 0 ${necroTheme.colors.matrixGreen};
    transform: skew(2deg);
  }
  60% { 
    text-shadow: 
      -1px 0 ${necroTheme.colors.bloodRed},
      1px 0 ${necroTheme.colors.matrixGreen};
    transform: skew(-1deg);
  }
  80% { 
    text-shadow: 
      1px 0 ${necroTheme.colors.bloodRed},
      -1px 0 ${necroTheme.colors.matrixGreen};
    transform: skew(1deg);
  }
  100% { 
    text-shadow: 0 0 0 transparent;
    transform: skew(0deg);
  }
`;

interface GlitchWrapperProps {
  $hasWindowShift: boolean;
  $hasColorShift: boolean;
  $colorShiftType?: 'red' | 'green';
  $hasTextCorruption: boolean;
  $hasTransparency: boolean;
  $hasInvertColors: boolean;
}

const GlitchWrapper = styled.div<GlitchWrapperProps>`
  ${({ $hasWindowShift }) =>
    $hasWindowShift &&
    css`
      animation: ${windowShift} 0.3s ease-in-out;
    `}

  ${({ $hasColorShift, $colorShiftType }) =>
    $hasColorShift &&
    css`
      animation: ${$colorShiftType === 'red' ? colorShiftRed : colorShiftGreen} 0.5s ease-in-out;
    `}

  ${({ $hasTextCorruption }) =>
    $hasTextCorruption &&
    css`
      * {
        animation: ${textCorruption} 0.4s ease-in-out;
      }
    `}

  ${({ $hasTransparency }) =>
    $hasTransparency &&
    css`
      opacity: 0.7;
      transition: opacity 0.3s ease-in-out;
    `}

  ${({ $hasInvertColors }) =>
    $hasInvertColors &&
    css`
      filter: invert(1);
      transition: filter 0.2s ease-in-out;
    `}
`;

interface GlitchableWindowProps {
  windowId: string;
  activeGlitches: GlitchEffect[];
  children: React.ReactNode;
}

/**
 * GlitchableWindow component that wraps window content with glitch effects
 * Applies visual distortions based on active glitch effects
 * Supports: window-shift, color-shift, text-corruption, transparency, invert-colors, zalgo-text
 */
export function GlitchableWindow({ windowId, activeGlitches, children }: GlitchableWindowProps) {
  const [zalgoActive, setZalgoActive] = useState(false);
  
  // Filter glitches that target this window or all windows
  const windowGlitches = activeGlitches.filter(
    (g) => !g.targetId || g.targetId === windowId
  );

  // Determine which glitch effects are active
  const hasWindowShift = windowGlitches.some((g) => g.type === 'window-shift');
  const colorShiftGlitch = windowGlitches.find((g) => g.type === 'color-shift');
  const hasColorShift = !!colorShiftGlitch;
  const colorShiftType = hasColorShift ? (Math.random() > 0.5 ? 'red' : 'green') : undefined;
  const hasTextCorruption = windowGlitches.some((g) => g.type === 'text-corruption');
  const hasTransparency = windowGlitches.some((g) => g.type === 'transparency');
  const hasInvertColors = windowGlitches.some((g) => g.type === 'invert-colors');
  const hasZalgoText = windowGlitches.some((g) => g.type === 'zalgo-text');

  // Handle zalgo text effect
  useEffect(() => {
    if (hasZalgoText && !zalgoActive) {
      setZalgoActive(true);
      
      // Apply zalgo text to all text nodes in the window
      const applyZalgoToElement = (element: HTMLElement) => {
        const walker = document.createTreeWalker(
          element,
          NodeFilter.SHOW_TEXT,
          null
        );

        const textNodes: Text[] = [];
        let node;
        while ((node = walker.nextNode())) {
          textNodes.push(node as Text);
        }

        textNodes.forEach((textNode) => {
          if (textNode.textContent && textNode.textContent.trim()) {
            const originalText = textNode.textContent;
            textNode.textContent = zalgoTransform(originalText);
            
            // Store original text to restore later
            (textNode as any)._originalText = originalText;
          }
        });
      };

      // Find the window element and apply zalgo
      const windowElement = document.querySelector(`[data-window-id="${windowId}"]`);
      if (windowElement) {
        applyZalgoToElement(windowElement as HTMLElement);
      }

      // Restore text after glitch duration
      const zalgoGlitch = windowGlitches.find((g) => g.type === 'zalgo-text');
      if (zalgoGlitch) {
        setTimeout(() => {
          const windowElement = document.querySelector(`[data-window-id="${windowId}"]`);
          if (windowElement) {
            const walker = document.createTreeWalker(
              windowElement,
              NodeFilter.SHOW_TEXT,
              null
            );

            let node;
            while ((node = walker.nextNode())) {
              const textNode = node as Text;
              if ((textNode as any)._originalText) {
                textNode.textContent = (textNode as any)._originalText;
                delete (textNode as any)._originalText;
              }
            }
          }
          setZalgoActive(false);
        }, zalgoGlitch.duration);
      }
    }
  }, [hasZalgoText, windowId, zalgoActive, windowGlitches]);

  return (
    <GlitchWrapper
      data-window-id={windowId}
      $hasWindowShift={hasWindowShift}
      $hasColorShift={hasColorShift}
      $colorShiftType={colorShiftType}
      $hasTextCorruption={hasTextCorruption}
      $hasTransparency={hasTransparency}
      $hasInvertColors={hasInvertColors}
    >
      {children}
    </GlitchWrapper>
  );
}
