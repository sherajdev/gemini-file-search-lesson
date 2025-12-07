/**
 * Utility functions for formatting data for display
 */

import { formatDistanceToNow } from 'date-fns';

/**
 * Format file size in bytes to human-readable format
 *
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted size (e.g., "1.5 MB", "256 KB")
 */
export function formatFileSize(bytes: number | undefined): string {
  if (bytes === undefined || bytes === null) {
    return 'Unknown';
  }

  if (bytes === 0) {
    return '0 B';
  }

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  // Limit to TB (index 4)
  const unitIndex = Math.min(i, units.length - 1);

  // Format with up to 2 decimal places, remove trailing zeros
  const value = bytes / Math.pow(k, unitIndex);
  const formatted = value.toFixed(2).replace(/\.?0+$/, '');

  return `${formatted} ${units[unitIndex]}`;
}

/**
 * Format ISO date string to relative time
 *
 * @param {string} dateString - ISO 8601 date string
 * @returns {string} Relative time (e.g., "2 hours ago", "3 days ago")
 */
export function formatRelativeTime(dateString: string | undefined): string {
  if (!dateString) {
    return 'Unknown';
  }

  try {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    return 'Invalid date';
  }
}

/**
 * Format ISO date string to absolute date and time
 *
 * @param {string} dateString - ISO 8601 date string
 * @returns {string} Formatted date and time (e.g., "12/5/2025, 3:45:30 PM")
 */
export function formatAbsoluteTime(dateString: string | undefined): string {
  if (!dateString) {
    return 'Unknown';
  }

  try {
    const date = new Date(dateString);
    return date.toLocaleString();
  } catch (error) {
    return 'Invalid date';
  }
}

/**
 * Get file icon based on MIME type
 *
 * @param {string} mimeType - MIME type (e.g., "application/pdf")
 * @returns {string} Icon name for lucide-react
 */
export function getFileIcon(mimeType: string | undefined): string {
  if (!mimeType) {
    return 'File';
  }

  if (mimeType.includes('pdf')) {
    return 'FileText';
  }

  if (mimeType.includes('text')) {
    return 'FileText';
  }

  if (mimeType.includes('image')) {
    return 'Image';
  }

  if (mimeType.includes('video')) {
    return 'Video';
  }

  if (mimeType.includes('audio')) {
    return 'Music';
  }

  if (mimeType.includes('json')) {
    return 'FileCode';
  }

  if (mimeType.includes('html')) {
    return 'FileCode';
  }

  if (mimeType.includes('markdown')) {
    return 'FileText';
  }

  if (mimeType.includes('word') || mimeType.includes('document')) {
    return 'FileText';
  }

  return 'File';
}
