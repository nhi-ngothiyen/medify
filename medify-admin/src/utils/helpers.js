/**
 * Utility Helper Functions
 */
/**
 * Format date to readable string
 */
export function formatDate(date) {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}
/**
 * Validate email format
 */
export function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
/**
 * Truncate text to specified length
 */
export function truncate(text, length) {
    if (text.length <= length)
        return text;
    return text.substring(0, length) + '...';
}
