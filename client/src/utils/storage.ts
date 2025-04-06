/**
 * @fileoverview Manages client-side storage operations (localStorage, sessionStorage).
 *
 * Handles localStorage and sessionStorage interactions.
 * Provides utilities for storing and retrieving editor state.
 * Includes functions for caching responses and UI preferences.
 * Manages temporary storage for unsaved changes.
 */

// TODO: Implement robust error handling (e.g., storage quota exceeded).
// TODO: Consider adding prefixing to keys to avoid collisions.

type StorageType = 'localStorage' | 'sessionStorage';

/**
 * Retrieves an item from client-side storage.
 * Automatically parses JSON strings.
 * @param key The key of the item to retrieve.
 * @param type The type of storage ('localStorage' or 'sessionStorage'). Defaults to 'localStorage'.
 * @returns The retrieved item, or null if not found or an error occurs.
 */
export const getItem = <T = any>(key: string, type: StorageType = 'localStorage'): T | null => {
  try {
    const storage = window[type];
    const item = storage.getItem(key);
    if (item === null) {
      return null;
    }
    // Attempt to parse JSON, fallback to raw string if parsing fails
    try {
      return JSON.parse(item) as T;
    } catch (e) {
      // If it's not valid JSON, return it as a plain string (adjust type if necessary)
      // This might require the caller to handle potential string type returns if T is not string
      return item as any;
    }
  } catch (error) {
    console.error(`Error getting item "${key}" from ${type}:`, error);
    return null;
  }
};

/**
 * Stores an item in client-side storage.
 * Automatically stringifies objects/arrays.
 * @param key The key under which to store the item.
 * @param value The item to store.
 * @param type The type of storage ('localStorage' or 'sessionStorage'). Defaults to 'localStorage'.
 * @returns True if successful, false otherwise.
 */
export const setItem = (key: string, value: any, type: StorageType = 'localStorage'): boolean => {
  try {
    const storage = window[type];
    const valueToStore = typeof value === 'object' ? JSON.stringify(value) : String(value);
    storage.setItem(key, valueToStore);
    return true;
  } catch (error) {
    console.error(`Error setting item "${key}" in ${type}:`, error);
    return false;
  }
};

/**
 * Removes an item from client-side storage.
 * @param key The key of the item to remove.
 * @param type The type of storage ('localStorage' or 'sessionStorage'). Defaults to 'localStorage'.
 * @returns True if successful, false otherwise.
 */
export const removeItem = (key: string, type: StorageType = 'localStorage'): boolean => {
  try {
    const storage = window[type];
    storage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing item "${key}" from ${type}:`, error);
    return false;
  }
};

/**
 * Clears all items from the specified client-side storage.
 * Use with caution!
 * @param type The type of storage ('localStorage' or 'sessionStorage'). Defaults to 'localStorage'.
 * @returns True if successful, false otherwise.
 */
export const clearStorage = (type: StorageType = 'localStorage'): boolean => {
    try {
        const storage = window[type];
        storage.clear();
        return true;
    } catch (error) {
        console.error(`Error clearing ${type}:`, error);
        return false;
    }
}

// Example usage for editor state, preferences, etc.
// const EDITOR_STATE_KEY = 'cmsEditorState';
// const UI_PREFS_KEY = 'cmsUserPrefs';

// export const saveEditorState = (state: any) => setItem(EDITOR_STATE_KEY, state, 'sessionStorage');
// export const loadEditorState = () => getItem<any>(EDITOR_STATE_KEY, 'sessionStorage');
// export const saveUserPreferences = (prefs: any) => setItem(UI_PREFS_KEY, prefs, 'localStorage');
// export const loadUserPreferences = () => getItem<any>(UI_PREFS_KEY, 'localStorage');
