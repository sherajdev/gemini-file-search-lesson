/**
 * Gemini API Client - Singleton Instance
 *
 * This module provides a singleton instance of the GoogleGenAI client
 * for use throughout the application. The API key is loaded from environment
 * variables and validated on initialization.
 *
 * Pattern from: legacy/examples/test-file-search.js:17
 */

import { GoogleGenAI } from '@google/genai';
import { GeminiApiError } from '@/lib/types';

let geminiClient: GoogleGenAI | null = null;

/**
 * Get the singleton Gemini AI client instance
 *
 * @throws {GeminiApiError} If API key is not configured
 * @returns {GoogleGenAI} The initialized Gemini client
 */
export function getGeminiClient(): GoogleGenAI {
  if (geminiClient) {
    return geminiClient;
  }

  // Validate API key exists
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new GeminiApiError(
      'GEMINI_API_KEY is not configured. Please add it to your .env.local file.',
      500
    );
  }

  // Initialize the client
  geminiClient = new GoogleGenAI({ apiKey });

  return geminiClient;
}

/**
 * Reset the singleton instance (useful for testing)
 */
export function resetGeminiClient(): void {
  geminiClient = null;
}

/**
 * Check if the API key is configured
 *
 * @returns {boolean} True if API key exists
 */
export function isApiKeyConfigured(): boolean {
  return !!process.env.GEMINI_API_KEY;
}
