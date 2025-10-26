/**
 * Format date to readable string
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

/**
 * Format number with commas
 */
export const formatNumber = (num) => {
  if (!num && num !== 0) return 'N/A';
  return new Intl.NumberFormat('en-US').format(num);
};

/**
 * Format currency
 */
export const formatCurrency = (amount, currency = 'USD') => {
  if (!amount && amount !== 0) return 'N/A';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format height in cm to readable format
 */
export const formatHeight = (cm) => {
  if (!cm) return 'N/A';
  
  const feet = Math.floor(cm / 30.48);
  const inches = Math.round((cm % 30.48) / 2.54);
  
  return `${cm} cm (${feet}'${inches}")`;
};

/**
 * Calculate age from birth date
 */
export const calculateAge = (birthDate) => {
  if (!birthDate) return 'N/A';
  
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

/**
 * Truncate text to specified length
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength) + '...';
};

/**
 * Extract ID from RDF URI
 */
export const extractIdFromUri = (uri) => {
  if (!uri) return null;
  return uri.split('#').pop() || uri.split('/').pop();
};