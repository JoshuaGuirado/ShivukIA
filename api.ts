/**
 * API Configuration
 * The Google AI API Key is injected at runtime via process.env.API_KEY.
 * Do not hardcode keys. The system handles injection automatically.
 */
export const GOOGLE_API_KEY = process.env.API_KEY || '';
