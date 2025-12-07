/**
 * Gemini Model Configuration
 *
 * Centralized configuration for supported Gemini models with File Search capability.
 * Models listed here are officially supported for File Search queries.
 *
 * Reference: legacy/docs/gemini-file-search.md:432-435
 *
 * To add a new model:
 * 1. Verify it supports File Search in the official Gemini API docs
 * 2. Add entry to GEMINI_MODELS array
 * 3. Set appropriate tier (stable vs experimental)
 * 4. Add clear description for users
 *
 * The UI automatically picks up changes - no component updates needed.
 */

export interface GeminiModel {
  value: string;           // API model identifier
  label: string;           // Display name
  description: string;     // Short description for users
  tier: 'stable' | 'experimental';  // Categorization
  pricingTier: 'free' | 'paid' | 'experimental';  // API pricing tier
  isDefault?: boolean;     // Mark default model
}

export const GEMINI_MODELS: GeminiModel[] = [
  {
    value: 'gemini-2.5-flash',
    label: 'Gemini 2.5 Flash',
    description: 'Fast, balanced quality',
    tier: 'stable',
    pricingTier: 'free',
    isDefault: true
  },
  {
    value: 'gemini-2.5-pro',
    label: 'Gemini 2.5 Pro',
    description: 'High quality, production-ready',
    tier: 'stable',
    pricingTier: 'free'
  },
  {
    value: 'gemini-2.5-flash-lite',
    label: 'Gemini 2.5 Flash Lite',
    description: 'Fastest, lightweight',
    tier: 'stable',
    pricingTier: 'free'
  },
  {
    value: 'gemini-3-pro-preview',
    label: 'Gemini 3 Pro Preview',
    description: 'Most capable (requires paid API)',
    tier: 'experimental',
    pricingTier: 'paid'
  },
  {
    value: 'gemini-2.0-flash-exp',
    label: 'Gemini 2.0 Flash Experimental',
    description: 'Experimental',
    tier: 'experimental',
    pricingTier: 'experimental'
  }
];

/**
 * Default model used when no model is explicitly specified
 */
export const DEFAULT_MODEL = GEMINI_MODELS.find(m => m.isDefault)?.value || 'gemini-2.5-flash';
