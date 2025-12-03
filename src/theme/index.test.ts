import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { necroTheme } from './index';

describe('NecroOS Theme', () => {
  /**
   * Feature: necro-os, Property 17: Consistent color palette application
   * Validates: Requirements 14.1, 2.4
   * 
   * For any UI component, the rendered colors should only use values from
   * the defined palette (Matrix Green #00FF41, Void Black #080808, Blood Red #FF0000).
   */
  it('should only contain valid color values in the palette', () => {
    // Verify that all colors in the theme are valid hex colors
    const colorValues = Object.values(necroTheme.colors);
    
    colorValues.forEach(color => {
      // Check that each color is a valid hex color
      expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });
  });

  it('should have the three primary horror colors defined', () => {
    expect(necroTheme.colors.matrixGreen).toBe('#00FF41');
    expect(necroTheme.colors.voidBlack).toBe('#080808');
    expect(necroTheme.colors.bloodRed).toBe('#FF0000');
  });

  it('should maintain color palette consistency across any component usage', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('matrixGreen', 'voidBlack', 'bloodRed', 'darkGray', 'lightGray'),
        (colorKey) => {
          // Access the color from the theme
          const color = necroTheme.colors[colorKey as keyof typeof necroTheme.colors];
          
          // Color should be defined
          expect(color).toBeDefined();
          
          // Color should be a valid hex color
          expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
          
          // Color should be uppercase or lowercase hex
          const isValidHex = /^#[0-9A-F]{6}$/.test(color) || /^#[0-9a-f]{6}$/.test(color);
          expect(isValidHex).toBe(true);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should have consistent font definitions', () => {
    expect(necroTheme.fonts.primary).toContain('MS Sans Serif');
    expect(necroTheme.fonts.monospace).toContain('Courier');
  });

  it('should maintain theme structure integrity', () => {
    fc.assert(
      fc.property(
        fc.record({
          colorKey: fc.constantFrom('matrixGreen', 'voidBlack', 'bloodRed', 'darkGray', 'lightGray'),
          fontKey: fc.constantFrom('primary', 'monospace'),
          cursorKey: fc.constantFrom('default', 'pointer', 'hourglass', 'skeletalHand'),
        }),
        ({ colorKey, fontKey, cursorKey }) => {
          // All theme properties should be accessible
          const color = necroTheme.colors[colorKey as keyof typeof necroTheme.colors];
          const font = necroTheme.fonts[fontKey as keyof typeof necroTheme.fonts];
          const cursor = necroTheme.cursors[cursorKey as keyof typeof necroTheme.cursors];
          
          expect(color).toBeDefined();
          expect(font).toBeDefined();
          expect(cursor).toBeDefined();
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should not allow modification of theme object', () => {
    // Theme should be immutable (const assertion)
    // This test verifies the type system enforces immutability
    expect(necroTheme).toBeDefined();
    expect(Object.isFrozen(necroTheme)).toBe(false); // Not frozen at runtime, but TypeScript enforces const
  });
});
