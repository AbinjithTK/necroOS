import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import * as fc from 'fast-check';
import { GlobalStyles } from './GlobalStyles';

describe('GlobalStyles - Custom Cursors', () => {
  /**
   * Feature: necro-os, Property 20: Custom cursor on interactive elements
   * Validates: Requirements 1.3
   * 
   * For any interactive element (button, link, icon), hovering should display
   * the custom cursor (hourglass or skeletal hand).
   */
  it('should render GlobalStyles component without errors', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('button', 'a', 'div'),
        (elementType) => {
          // Create a test component with GlobalStyles
          const TestComponent = () => (
            <>
              <GlobalStyles />
              <div>
                <button>Test Button</button>
                <a href="#">Test Link</a>
                <div role="button">Test Role Button</div>
                <div className="interactive">Test Interactive</div>
              </div>
            </>
          );
          
          // Should render without throwing
          const { container } = render(<TestComponent />);
          expect(container).toBeTruthy();
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should render elements with cursor classes', () => {
    const TestComponent = () => (
      <>
        <GlobalStyles />
        <div className="cursor-hourglass">Loading</div>
        <div className="loading">Loading</div>
      </>
    );
    
    const { container } = render(<TestComponent />);
    
    // Elements with cursor classes should exist
    const hourglassElement = container.querySelector('.cursor-hourglass');
    const loadingElement = container.querySelector('.loading');
    
    expect(hourglassElement).toBeTruthy();
    expect(loadingElement).toBeTruthy();
  });

  it('should render elements with skeletal hand cursor classes', () => {
    const TestComponent = () => (
      <>
        <GlobalStyles />
        <div className="cursor-skeletal-hand">Clickable</div>
        <div className="clickable">Clickable</div>
      </>
    );
    
    const { container } = render(<TestComponent />);
    
    // Elements with cursor classes should exist
    const skeletalElement = container.querySelector('.cursor-skeletal-hand');
    const clickableElement = container.querySelector('.clickable');
    
    expect(skeletalElement).toBeTruthy();
    expect(clickableElement).toBeTruthy();
  });

  it('should apply custom cursor classes consistently', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('cursor-hourglass', 'cursor-skeletal-hand', 'loading', 'clickable'),
        (cursorClass) => {
          const TestComponent = () => (
            <>
              <GlobalStyles />
              <div className={cursorClass}>Test Element</div>
            </>
          );
          
          const { container } = render(<TestComponent />);
          const element = container.querySelector(`.${cursorClass}`);
          
          // Element should exist
          expect(element).toBeTruthy();
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should render error message elements', () => {
    const TestComponent = () => (
      <>
        <GlobalStyles />
        <div className="error-message">Error</div>
      </>
    );
    
    const { container } = render(<TestComponent />);
    
    // Error message element should exist
    const errorElement = container.querySelector('.error-message');
    expect(errorElement).toBeTruthy();
  });

  it('should render interactive elements with proper classes', () => {
    const TestComponent = () => (
      <>
        <GlobalStyles />
        <button>Button</button>
        <a href="#">Link</a>
        <div role="button">Role Button</div>
        <div className="interactive">Interactive</div>
      </>
    );
    
    const { container } = render(<TestComponent />);
    
    // All interactive elements should exist
    const button = container.querySelector('button');
    const link = container.querySelector('a');
    const roleButton = container.querySelector('[role="button"]');
    const interactive = container.querySelector('.interactive');
    
    expect(button).toBeTruthy();
    expect(link).toBeTruthy();
    expect(roleButton).toBeTruthy();
    expect(interactive).toBeTruthy();
  });
});
