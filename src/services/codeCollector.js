/**
 * Extract bonus codes from text
 * Supports various code formats:
 * - UPPERCASE: ABC123, STAKE2024, etc.
 * - Codes with symbols: BONUS-2024, CODE_123, etc.
 * @param {string} text - Text to search for codes
 * @returns {string[]} - Array of found codes
 */
function extractCodesFromText(text) {
  if (!text) return [];

  // Regex patterns for different code formats
  const patterns = [
    /\b[A-Z0-9]{6,20}\b/g,           // 6-20 uppercase alphanumeric
    /\b[A-Z0-9]{4,}[-_][A-Z0-9]+\b/g,  // With dash or underscore
    /bonus[\s-]*code[:\s]+([A-Z0-9]+)/gi,  // "bonus code: CODE"
    /promo[\s-]*code[:\s]+([A-Z0-9]+)/gi,  // "promo code: CODE"
    /code[:\s]+([A-Z0-9]{4,})/gi           // "code: CODE"
  ];

  const codes = new Set();

  patterns.forEach(pattern => {
    let matches;
    // Reset regex lastIndex for global patterns
    if (pattern.global) pattern.lastIndex = 0;
    
    while ((matches = pattern.exec(text)) !== null) {
      // Extract code from groups if it's a captured group, otherwise use the full match
      const code = matches[1] || matches[0];
      if (code && code.length >= 4 && code.length <= 20) {
        codes.add(code.toUpperCase());
      }
    }
  });

  return Array.from(codes);
}

/**
 * Detect if text contains potential bonus code indicators
 * @param {string} text - Text to analyze
 * @returns {boolean} - True if potential code detected
 */
function hasBonusCodeIndicators(text) {
  if (!text) return false;

  const indicators = [
    /bonus\s*code/gi,
    /promo\s*code/gi,
    /claim\s*code/gi,
    /reward\s*code/gi,
    /discount\s*code/gi,
    /free\s*code/gi,
    /code[:\s]+([A-Z0-9]{4,})/gi
  ];

  return indicators.some(indicator => indicator.test(text));
}

/**
 * Check if a code looks valid (basic validation)
 * @param {string} code - Code to validate
 * @returns {boolean} - True if code format seems valid
 */
function isValidCodeFormat(code) {
  if (!code || typeof code !== 'string') return false;

  // Code should be 4-20 characters, alphanumeric with optional dashes/underscores
  const codeRegex = /^[A-Z0-9_-]{4,20}$/i;
  return codeRegex.test(code);
}

module.exports = {
  extractCodesFromText,
  hasBonusCodeIndicators,
  isValidCodeFormat
};
