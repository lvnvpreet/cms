/**
 * @fileoverview Contains general utility functions for the client.
 *
 * Provides common browser-specific utilities.
 * Contains DOM manipulation helpers.
 * Includes functional programming utilities.
 * Has miscellaneous helpers that don't fit other categories.
 */

// TODO: Add specific helper functions as needed throughout client-side development.

/**
 * Debounces a function, ensuring it's only called after a certain period of inactivity.
 * @param func The function to debounce.
 * @param wait The debounce delay in milliseconds.
 * @returns A debounced version of the function.
 */
export const debounce = <T extends (...args: any[]) => any>(func: T, wait: number): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
      timeoutId = null;
    }, wait);
  };
};

/**
 * Throttles a function, ensuring it's called at most once within a specified time window.
 * @param func The function to throttle.
 * @param limit The throttle time limit in milliseconds.
 * @returns A throttled version of the function.
 */
export const throttle = <T extends (...args: any[]) => any>(func: T, limit: number): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean = false;
    let lastResult: ReturnType<T>;

    return (...args: Parameters<T>) => {
        if (!inThrottle) {
            inThrottle = true;
            lastResult = func(...args);
            setTimeout(() => {
                inThrottle = false;
            }, limit);
        }
        // Optionally return the last result or handle calls during throttle period
        // return lastResult;
    };
};


/**
 * Generates a simple unique ID (for client-side use, not cryptographically secure).
 * @param prefix Optional prefix for the ID.
 * @returns A unique string ID.
 */
export const generateUniqueId = (prefix: string = 'id-'): string => {
  return prefix + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
};

/**
 * Copies text to the clipboard.
 * @param text The text to copy.
 * @returns A promise that resolves when copying is successful, or rejects on failure.
 */
export const copyToClipboard = (text: string): Promise<void> => {
  if (!navigator.clipboard) {
    // Fallback for older browsers (less reliable)
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed'; // Prevent scrolling to bottom
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return Promise.resolve();
    } catch (err) {
      console.error('Fallback copy failed:', err);
      return Promise.reject(new Error('Failed to copy text'));
    }
  }
  // Modern async clipboard API
  return navigator.clipboard.writeText(text).catch(err => {
      console.error('Async clipboard copy failed:', err);
      return Promise.reject(new Error('Failed to copy text'));
  });
};

/**
 * Checks if the current environment is a touch device.
 * @returns True if it's likely a touch device, false otherwise.
 */
export const isTouchDevice = (): boolean => {
    return ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
};


// TODO: Add DOM manipulation helpers if needed (e.g.,addClass, removeClass, findAncestor)
// TODO: Add functional programming utilities (e.g., compose, pipe) if desired.
