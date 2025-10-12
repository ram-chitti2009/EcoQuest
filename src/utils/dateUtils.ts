/**
 * Utility functions for handling dates consistently across the application
 * Prevents timezone-related "one day behind" issues when parsing dates from database
 */

/**
 * Parse a date string (YYYY-MM-DD) in local timezone to avoid UTC offset issues
 * @param dateString - Date string in YYYY-MM-DD format
 * @returns Date object in local timezone
 */
export function parseLocalDate(dateString: string): Date {
  const dateParts = dateString.split('-')
  return new Date(
    parseInt(dateParts[0]), // year
    parseInt(dateParts[1]) - 1, // month (0-indexed)
    parseInt(dateParts[2]) // day
  )
}

/**
 * Get current date as YYYY-MM-DD string in local timezone
 * @returns Date string in YYYY-MM-DD format
 */
export function getCurrentLocalDateString(): string {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
    .toISOString()
    .split('T')[0]
}

/**
 * Format a date string for display using local timezone parsing
 * @param dateString - Date string in YYYY-MM-DD format
 * @param options - Intl.DateTimeFormatOptions for formatting
 * @returns Formatted date string
 */
export function formatLocalDate(
  dateString: string, 
  options?: Intl.DateTimeFormatOptions
): string {
  const localDate = parseLocalDate(dateString)
  return localDate.toLocaleDateString('en-US', options)
}