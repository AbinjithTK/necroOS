import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LoginPrompt } from './LoginPrompt';
import * as fc from 'fast-check';

describe('LoginPrompt', () => {
  describe('Property 14: Login acceptance', () => {
    // Feature: necro-os, Property 14: Login acceptance
    // Validates: Requirements 12.4
    it('should accept any password for username "Guest" (case-insensitive)', () => {
      fc.assert(
        fc.property(
          fc.string(), // Any password string
          (password) => {
            const onLoginSuccess = vi.fn();
            const { unmount } = render(<LoginPrompt onLoginSuccess={onLoginSuccess} />);

            // Get the password input and submit button
            const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement;
            const submitButton = screen.getByRole('button', { name: /enter/i });

            // The username should default to "Guest"
            const usernameInput = screen.getByLabelText(/username/i) as HTMLInputElement;
            expect(usernameInput.value).toBe('Guest');

            // Enter the password
            fireEvent.change(passwordInput, { target: { value: password } });

            // Submit the form
            fireEvent.click(submitButton);

            // Login should succeed for any password with "Guest" username
            expect(onLoginSuccess).toHaveBeenCalledTimes(1);

            unmount();
          }
        ),
        { numRuns: 100 }
      );
    }, 15000); // Increase timeout for property test with many renders

    it('should accept "Guest" username with different casing', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('guest', 'Guest', 'GUEST', 'gUeSt', 'GUest'),
          fc.string(),
          (username, password) => {
            const onLoginSuccess = vi.fn();
            const { unmount } = render(<LoginPrompt onLoginSuccess={onLoginSuccess} />);

            const usernameInput = screen.getByLabelText(/username/i) as HTMLInputElement;
            const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement;
            const submitButton = screen.getByRole('button', { name: /enter/i });

            // Change username to test case-insensitivity
            fireEvent.change(usernameInput, { target: { value: username } });
            fireEvent.change(passwordInput, { target: { value: password } });
            fireEvent.click(submitButton);

            // Should succeed for any casing of "Guest"
            expect(onLoginSuccess).toHaveBeenCalledTimes(1);

            unmount();
          }
        ),
        { numRuns: 100 }
      );
    }, 15000); // Increase timeout for property test with many renders

    it('should render login form with all required elements', () => {
      const onLoginSuccess = vi.fn();
      render(<LoginPrompt onLoginSuccess={onLoginSuccess} />);

      // Check that all form elements are present
      expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /enter/i })).toBeInTheDocument();
      expect(screen.getByText(/welcome to necroos/i)).toBeInTheDocument();
    });
  });
});
