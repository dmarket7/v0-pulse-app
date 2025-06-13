import { TimezoneData } from '../services/api';

/**
 * Get timezone information for signup
 * Works in React Native environment
 */
export function getTimezoneData(): TimezoneData {
  try {
    const now = new Date();

    // Get timezone offset in minutes (negative for UTC+, positive for UTC-)
    const offsetMinutes = now.getTimezoneOffset();

    // Convert to hours for API (reverse sign to match standard timezone notation)
    const offsetHours = -offsetMinutes / 60;

    // Try to get timezone identifier (works in modern environments)
    let timezone: string | undefined;
    let timezoneAbbr: string | undefined;
    let locale: string | undefined;

    // Get timezone identifier using Intl.DateTimeFormat
    try {
      timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch (error) {
      console.warn('Could not detect timezone identifier:', error);
    }

    // Get locale
    try {
      locale = Intl.DateTimeFormat().resolvedOptions().locale;
    } catch (error) {
      console.warn('Could not detect locale:', error);
    }

    // Get timezone abbreviation
    try {
      const formatter = new Intl.DateTimeFormat('en', {
        timeZoneName: 'short',
        timeZone: timezone,
      });
      const parts = formatter.formatToParts(now);
      const timeZonePart = parts.find(part => part.type === 'timeZoneName');
      timezoneAbbr = timeZonePart?.value;
    } catch (error) {
      console.warn('Could not detect timezone abbreviation:', error);
    }

    return {
      timezone,
      offset: offsetHours,
      locale,
      timezone_abbr: timezoneAbbr,
    };
  } catch (error) {
    console.error('Error detecting timezone data:', error);

    // Fallback: return basic offset information
    const now = new Date();
    const offsetMinutes = now.getTimezoneOffset();
    const offsetHours = -offsetMinutes / 60;

    return {
      offset: offsetHours,
    };
  }
}

/**
 * Format timezone data for display
 */
export function formatTimezoneDisplay(timezoneData: TimezoneData): string {
  const { timezone, offset, timezone_abbr } = timezoneData;

  if (timezone) {
    return `${timezone} (${timezone_abbr || formatOffset(offset)})`;
  }

  if (offset !== undefined) {
    return formatOffset(offset);
  }

  return 'Unknown timezone';
}

/**
 * Format timezone offset for display
 */
function formatOffset(offset?: number): string {
  if (offset === undefined) return '';

  const sign = offset >= 0 ? '+' : '-';
  const absOffset = Math.abs(offset);
  const hours = Math.floor(absOffset);
  const minutes = Math.round((absOffset - hours) * 60);

  if (minutes === 0) {
    return `UTC${sign}${hours}`;
  } else {
    return `UTC${sign}${hours}:${minutes.toString().padStart(2, '0')}`;
  }
}