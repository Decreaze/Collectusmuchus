const axios = require('axios');

const STAKE_API_URL = process.env.STAKE_API_URL || 'https://api.stake.com';
const STAKE_API_KEY = process.env.STAKE_API_KEY;

/**
 * Initialize Stake.com API client
 */
const stakeClient = axios.create({
  baseURL: STAKE_API_URL,
  headers: {
    'Authorization': `Bearer ${STAKE_API_KEY}`,
    'Content-Type': 'application/json'
  }
});

/**
 * Apply a bonus code to a stake.com account
 * @param {string} code - The bonus code
 * @param {string} userId - The user's stake.com user ID
 * @returns {Promise<Object>} - API response
 */
async function applyBonusCode(code, userId) {
  try {
    if (!STAKE_API_KEY) {
      console.warn('⚠️ STAKE_API_KEY not configured');
      return {
        success: false,
        error: 'API key not configured',
        code: 'CONFIG_ERROR'
      };
    }

    const response = await stakeClient.post('/bonus/apply', {
      code: code,
      user_id: userId
    });

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('❌ Error applying bonus code:', error.message);
    return {
      success: false,
      error: error.message,
      code: error.code
    };
  }
}

/**
 * Check if a bonus code is valid
 * @param {string} code - The bonus code
 * @returns {Promise<Object>} - Validation response
 */
async function validateBonusCode(code) {
  try {
    if (!STAKE_API_KEY) {
      console.warn('⚠️ STAKE_API_KEY not configured');
      return { valid: false };
    }

    const response = await stakeClient.post('/bonus/validate', {
      code: code
    });

    return response.data;
  } catch (error) {
    console.error('❌ Error validating bonus code:', error.message);
    return { valid: false, error: error.message };
  }
}

/**
 * Get user account information
 * @param {string} userId - The user's stake.com user ID
 * @returns {Promise<Object>} - User info
 */
async function getUserInfo(userId) {
  try {
    if (!STAKE_API_KEY) {
      console.warn('⚠️ STAKE_API_KEY not configured');
      return null;
    }

    const response = await stakeClient.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('❌ Error getting user info:', error.message);
    return null;
  }
}

module.exports = {
  applyBonusCode,
  validateBonusCode,
  getUserInfo
};
