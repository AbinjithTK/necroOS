/**
 * Visual Effects Demo Component
 * 
 * This component demonstrates how to use the NecroOS visual effects system.
 * It's not part of the main application, but serves as a reference for developers.
 */

import { useState } from 'react';
import { CRTFilter } from '../components/CRTFilter';
import { GlitchableElement } from '../components/GlitchEffects';
import { GlobalStyles } from '../styles/GlobalStyles';
import { zalgoTransform } from '../utils/zalgo';
import { necroTheme } from '../theme';

export function VisualEffectsDemo() {
  const [intensity, setIntensity] = useState(0.5);
  const [glitchType, setGlitchType] = useState<'none' | 'window-shift' | 'color-shift-red' | 'text-corruption'>('none');
  const [zalgoText, setZalgoText] = useState('Hello, NecroOS!');

  return (
    <>
      <GlobalStyles />
      <CRTFilter intensity={intensity} />
      
      <div style={{ 
        padding: '20px', 
        fontFamily: necroTheme.fonts.primary,
        color: necroTheme.colors.matrixGreen,
        backgroundColor: necroTheme.colors.voidBlack,
        minHeight: '100vh'
      }}>
        <h1>NecroOS Visual Effects Demo</h1>
        
        {/* CRT Filter Controls */}
        <section style={{ marginBottom: '30px' }}>
          <h2>CRT Filter Intensity</h2>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.1" 
            value={intensity}
            onChange={(e) => setIntensity(parseFloat(e.target.value))}
          />
          <span> {intensity.toFixed(1)}</span>
        </section>

        {/* Glitch Effects Demo */}
        <section style={{ marginBottom: '30px' }}>
          <h2>Glitch Effects</h2>
          <select 
            value={glitchType} 
            onChange={(e) => setGlitchType(e.target.value as any)}
          >
            <option value="none">None</option>
            <option value="window-shift">Window Shift</option>
            <option value="color-shift-red">Color Shift (Red)</option>
            <option value="text-corruption">Text Corruption</option>
          </select>
          
          <GlitchableElement 
            $glitchType={glitchType}
            style={{ 
              marginTop: '20px',
              padding: '20px',
              border: `2px solid ${necroTheme.colors.matrixGreen}`,
              backgroundColor: necroTheme.colors.darkGray
            }}
          >
            This element demonstrates the {glitchType} effect
          </GlitchableElement>
        </section>

        {/* Zalgo Text Demo */}
        <section style={{ marginBottom: '30px' }}>
          <h2>Zalgo Text Transformation</h2>
          <input 
            type="text" 
            value={zalgoText}
            onChange={(e) => setZalgoText(e.target.value)}
            style={{ width: '300px', marginRight: '10px' }}
          />
          <div style={{ marginTop: '10px', fontSize: '24px' }}>
            Original: {zalgoText}
          </div>
          <div style={{ marginTop: '10px', fontSize: '24px' }}>
            Zalgo (0.3): {zalgoTransform(zalgoText, 0.3)}
          </div>
          <div style={{ marginTop: '10px', fontSize: '24px' }}>
            Zalgo (0.7): {zalgoTransform(zalgoText, 0.7)}
          </div>
        </section>

        {/* Cursor Styles Demo */}
        <section style={{ marginBottom: '30px' }}>
          <h2>Custom Cursors</h2>
          <button className="interactive" style={{ marginRight: '10px' }}>
            Interactive Button
          </button>
          <span className="cursor-hourglass" style={{ marginRight: '10px', padding: '5px' }}>
            Hourglass Cursor
          </span>
          <span className="cursor-skeletal-hand" style={{ padding: '5px' }}>
            Skeletal Hand Cursor
          </span>
        </section>

        {/* Color Palette Demo */}
        <section>
          <h2>Color Palette</h2>
          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ 
              width: '100px', 
              height: '100px', 
              backgroundColor: necroTheme.colors.matrixGreen,
              border: '2px solid white'
            }}>
              <div style={{ padding: '5px', color: 'black' }}>Matrix Green</div>
            </div>
            <div style={{ 
              width: '100px', 
              height: '100px', 
              backgroundColor: necroTheme.colors.voidBlack,
              border: '2px solid white'
            }}>
              <div style={{ padding: '5px', color: 'white' }}>Void Black</div>
            </div>
            <div style={{ 
              width: '100px', 
              height: '100px', 
              backgroundColor: necroTheme.colors.bloodRed,
              border: '2px solid white'
            }}>
              <div style={{ padding: '5px', color: 'white' }}>Blood Red</div>
            </div>
          </div>
        </section>

        {/* Error Message Demo */}
        <section style={{ marginTop: '30px' }}>
          <h2>Error Styling</h2>
          <div className="error-message">
            This is an error message styled with Blood Red
          </div>
        </section>
      </div>
    </>
  );
}
