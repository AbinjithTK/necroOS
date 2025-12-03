import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import * as fc from 'fast-check';
import { PortfolioManager, type ProjectData } from './PortfolioManager';
import { useNecroStore } from '../store';

/**
 * Property-Based Tests for PortfolioManager Component
 * 
 * Feature: necro-os, Property 34: Portfolio project display
 * Validates: Requirements 6.3
 * 
 * Property: For any project in the portfolio data, the project should be 
 * displayed in the "Cold Cases" list with horror theming.
 */

describe('PortfolioManager Property Tests', () => {
  it('Property 34: all projects are displayed in Cold Cases list', () => {
    fc.assert(
      fc.property(
        // Generate random project data
        fc.array(
          fc.record({
            caseNumber: fc.string({ minLength: 5, maxLength: 15 }),
            title: fc.string({ minLength: 5, maxLength: 50 }),
            description: fc.string({ minLength: 10, maxLength: 200 }),
            techStack: fc.array(fc.string({ minLength: 2, maxLength: 20 }), { minLength: 1, maxLength: 10 }),
          }),
          { minLength: 1, maxLength: 10 }
        ),
        (projects) => {
          // Reset store
          useNecroStore.setState({
            hauntLevel: 0,
            windows: [],
            activeGlitches: [],
            lastJumpScareTime: 0,
            clippyVisible: false,
            clippyMessage: '',
          });

          // Render PortfolioManager with generated projects
          const { unmount } = render(
            <PortfolioManager windowId="test-window" projects={projects} />
          );

          // Verify that all projects are displayed
          for (let i = 0; i < projects.length; i++) {
            const project = projects[i];
            
            // Each project should have a case item
            const caseItem = screen.queryByTestId(`project-${i}`);
            expect(caseItem).toBeTruthy();
            
            if (caseItem) {
              // Case item should contain the case number
              expect(caseItem.textContent).toContain(project.caseNumber);
              
              // Case item should contain the title
              expect(caseItem.textContent).toContain(project.title);
              
              // Case item should contain the description
              expect(caseItem.textContent).toContain(project.description);
            }
          }

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 34: Cold Cases section is always present', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            caseNumber: fc.string({ minLength: 5, maxLength: 15 }),
            title: fc.string({ minLength: 5, maxLength: 50 }),
            description: fc.string({ minLength: 10, maxLength: 200 }),
            techStack: fc.array(fc.string({ minLength: 2, maxLength: 20 }), { minLength: 1, maxLength: 10 }),
          }),
          { minLength: 0, maxLength: 10 }
        ),
        (projects) => {
          // Reset store
          useNecroStore.setState({
            hauntLevel: 0,
            windows: [],
            activeGlitches: [],
            lastJumpScareTime: 0,
            clippyVisible: false,
            clippyMessage: '',
          });

          // Render PortfolioManager
          const { unmount } = render(
            <PortfolioManager windowId="test-window" projects={projects} />
          );

          // Cold Cases section should always be present
          const coldCasesSection = screen.getByText(/Cold Cases \(Past Projects\)/i);
          expect(coldCasesSection).toBeTruthy();

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 34: Obituary section is always present', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            caseNumber: fc.string({ minLength: 5, maxLength: 15 }),
            title: fc.string({ minLength: 5, maxLength: 50 }),
            description: fc.string({ minLength: 10, maxLength: 200 }),
            techStack: fc.array(fc.string({ minLength: 2, maxLength: 20 }), { minLength: 1, maxLength: 10 }),
          }),
          { minLength: 0, maxLength: 10 }
        ),
        (projects) => {
          // Reset store
          useNecroStore.setState({
            hauntLevel: 0,
            windows: [],
            activeGlitches: [],
            lastJumpScareTime: 0,
            clippyVisible: false,
            clippyMessage: '',
          });

          // Render PortfolioManager
          const { unmount } = render(
            <PortfolioManager windowId="test-window" projects={projects} />
          );

          // Obituary section should always be present
          const obituarySection = screen.getByText(/Obituary/i);
          expect(obituarySection).toBeTruthy();

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 34: project count matches input', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            caseNumber: fc.string({ minLength: 5, maxLength: 15 }),
            title: fc.string({ minLength: 5, maxLength: 50 }),
            description: fc.string({ minLength: 10, maxLength: 200 }),
            techStack: fc.array(fc.string({ minLength: 2, maxLength: 20 }), { minLength: 1, maxLength: 10 }),
          }),
          { minLength: 1, maxLength: 10 }
        ),
        (projects) => {
          // Reset store
          useNecroStore.setState({
            hauntLevel: 0,
            windows: [],
            activeGlitches: [],
            lastJumpScareTime: 0,
            clippyVisible: false,
            clippyMessage: '',
          });

          // Render PortfolioManager
          const { container, unmount } = render(
            <PortfolioManager windowId="test-window" projects={projects} />
          );

          // Count the number of project items displayed
          const projectItems = container.querySelectorAll('[data-testid^="project-"]');
          
          // Number of displayed projects should match input
          expect(projectItems.length).toBe(projects.length);

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 34: horror theming elements are present', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            caseNumber: fc.string({ minLength: 5, maxLength: 15 }),
            title: fc.string({ minLength: 5, maxLength: 50 }),
            description: fc.string({ minLength: 10, maxLength: 200 }),
            techStack: fc.array(fc.string({ minLength: 2, maxLength: 20 }), { minLength: 1, maxLength: 10 }),
          }),
          { minLength: 1, maxLength: 5 }
        ),
        (projects) => {
          // Reset store
          useNecroStore.setState({
            hauntLevel: 0,
            windows: [],
            activeGlitches: [],
            lastJumpScareTime: 0,
            clippyVisible: false,
            clippyMessage: '',
          });

          // Render PortfolioManager
          const { unmount, container } = render(
            <PortfolioManager windowId="test-window" projects={projects} />
          );

          // Check for horror-themed emojis/symbols
          const content = container.textContent || '';
          
          // Should contain horror-themed elements (emojis)
          const hasHorrorElements = 
            content.includes('📜') || // Obituary
            content.includes('🗂️') || // Cold Cases
            content.includes('⚰️');   // Final Words
          
          expect(hasHorrorElements).toBe(true);

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
