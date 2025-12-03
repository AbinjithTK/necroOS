/**
 * API Utilities with Error Handling
 * Handles Kiro API calls with fallbacks for failures, timeouts, and rate limiting
 */

export interface APIError {
  type: 'timeout' | 'network' | 'rate-limit' | 'server-error' | 'unknown';
  message: string;
  originalError?: Error;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: APIError;
}

const API_TIMEOUT = 5000; // 5 seconds
const MAX_RETRIES = 2;

/**
 * Make an API request with timeout and error handling
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeout: number = API_TIMEOUT
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

/**
 * Call Kiro API with error handling and fallbacks
 */
export async function callKiroAPI<T>(
  endpoint: string,
  options: RequestInit = {},
  retries: number = 0
): Promise<APIResponse<T>> {
  try {
    const response = await fetchWithTimeout(endpoint, options);

    // Handle rate limiting
    if (response.status === 429) {
      return {
        success: false,
        error: {
          type: 'rate-limit',
          message: 'API rate limit exceeded. Please try again later.',
        },
      };
    }

    // Handle server errors with retry
    if (response.status >= 500 && retries < MAX_RETRIES) {
      // Wait before retrying (exponential backoff)
      await new Promise((resolve) => setTimeout(resolve, 1000 * (retries + 1)));
      return callKiroAPI<T>(endpoint, options, retries + 1);
    }

    // Handle other error responses
    if (!response.ok) {
      return {
        success: false,
        error: {
          type: 'server-error',
          message: `API request failed with status ${response.status}`,
        },
      };
    }

    // Parse response
    const data = await response.json();
    return {
      success: true,
      data,
    };
  } catch (error) {
    // Handle timeout
    if (error instanceof Error && error.name === 'AbortError') {
      return {
        success: false,
        error: {
          type: 'timeout',
          message: 'API request timed out',
          originalError: error,
        },
      };
    }

    // Handle network errors
    if (error instanceof TypeError) {
      return {
        success: false,
        error: {
          type: 'network',
          message: 'Network error - check your connection',
          originalError: error,
        },
      };
    }

    // Handle unknown errors
    return {
      success: false,
      error: {
        type: 'unknown',
        message: 'An unexpected error occurred',
        originalError: error as Error,
      },
    };
  }
}

/**
 * Generate AI message with fallback
 */
export async function generateAIMessage(
  context: string,
  fallbackMessages: string[]
): Promise<string> {
  // In a real implementation, this would call the Kiro API
  // For now, we'll simulate an API call and use fallback
  const response = await callKiroAPI<{ message: string }>(
    '/api/generate-message',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ context }),
    }
  );

  if (response.success && response.data) {
    return response.data.message;
  }

  // Use fallback message on error
  console.warn('AI API failed, using fallback:', response.error);
  return fallbackMessages[Math.floor(Math.random() * fallbackMessages.length)];
}

/**
 * Generate AI completion with fallback
 */
export async function generateAICompletion(
  text: string,
  fallbackCompletions: string[]
): Promise<string> {
  // In a real implementation, this would call the Kiro API
  const response = await callKiroAPI<{ completion: string }>(
    '/api/complete-text',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    }
  );

  if (response.success && response.data) {
    return response.data.completion;
  }

  // Use fallback completion on error
  console.warn('AI API failed, using fallback:', response.error);
  return fallbackCompletions[Math.floor(Math.random() * fallbackCompletions.length)];
}
