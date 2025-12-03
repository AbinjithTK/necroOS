/**
 * Tests for API utilities with error handling
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { callKiroAPI, generateAIMessage, generateAICompletion } from './api';

// Mock fetch
global.fetch = vi.fn();

describe('API Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (global.fetch as any).mockClear();
  });

  describe('callKiroAPI', () => {
    it('returns success response for successful API call', async () => {
      const mockData = { message: 'Success' };
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockData,
      });

      const result = await callKiroAPI('/test');
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockData);
    });

    it('handles rate limiting (429)', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 429,
      });

      const result = await callKiroAPI('/test');
      expect(result.success).toBe(false);
      expect(result.error?.type).toBe('rate-limit');
    });

    it('handles server errors (500+) with retries', async () => {
      // Mock all retry attempts to fail
      (global.fetch as any)
        .mockResolvedValueOnce({ ok: false, status: 500 })
        .mockResolvedValueOnce({ ok: false, status: 500 })
        .mockResolvedValueOnce({ ok: false, status: 500 });

      const result = await callKiroAPI('/test');
      expect(result.success).toBe(false);
      expect(result.error?.type).toBe('server-error');
      expect(global.fetch).toHaveBeenCalledTimes(3); // Initial + 2 retries
    });

    it('handles timeout errors', async () => {
      (global.fetch as any).mockRejectedValueOnce(
        Object.assign(new Error('Aborted'), { name: 'AbortError' })
      );

      const result = await callKiroAPI('/test');
      expect(result.success).toBe(false);
      expect(result.error?.type).toBe('timeout');
    });

    it('handles network errors', async () => {
      (global.fetch as any).mockRejectedValueOnce(new TypeError('Network error'));

      const result = await callKiroAPI('/test');
      expect(result.success).toBe(false);
      expect(result.error?.type).toBe('network');
    });

    it('handles unknown errors', async () => {
      (global.fetch as any).mockRejectedValueOnce(new Error('Unknown'));

      const result = await callKiroAPI('/test');
      expect(result.success).toBe(false);
      expect(result.error?.type).toBe('unknown');
    });
  });

  describe('generateAIMessage', () => {
    it('returns AI-generated message on success', async () => {
      const mockMessage = 'AI generated message';
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ message: mockMessage }),
      });

      const result = await generateAIMessage('context', ['fallback']);
      expect(result).toBe(mockMessage);
    });

    it('returns fallback message on API failure', async () => {
      (global.fetch as any).mockRejectedValueOnce(new Error('API failed'));

      const fallbacks = ['Fallback 1', 'Fallback 2'];
      const result = await generateAIMessage('context', fallbacks);
      expect(fallbacks).toContain(result);
    });
  });

  describe('generateAICompletion', () => {
    it('returns AI-generated completion on success', async () => {
      const mockCompletion = 'AI completion';
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ completion: mockCompletion }),
      });

      const result = await generateAICompletion('text', ['fallback']);
      expect(result).toBe(mockCompletion);
    });

    it('returns fallback completion on API failure', async () => {
      (global.fetch as any).mockRejectedValueOnce(new Error('API failed'));

      const fallbacks = ['Fallback 1', 'Fallback 2'];
      const result = await generateAICompletion('text', fallbacks);
      expect(fallbacks).toContain(result);
    });
  });
});
