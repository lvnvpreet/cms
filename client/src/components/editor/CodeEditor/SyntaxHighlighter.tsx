import { Extension } from '@codemirror/state';
import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';

// Define supported language types explicitly for clarity
export type SupportedLanguage = 'javascript' | 'typescript' | 'html' | 'css' | string; // Allow string for potential future expansion

/**
 * Returns the appropriate CodeMirror language extension based on the file type.
 * @param language The language type (e.g., 'typescript', 'css', 'html').
 * @returns A CodeMirror Extension for syntax highlighting.
 */
export const getSyntaxHighlightingExtension = (language?: SupportedLanguage): Extension => {
  switch (language) {
    case 'typescript':
    case 'javascript':
      // Enable JSX and TypeScript support within JavaScript mode
      return javascript({ jsx: true, typescript: true });
    case 'html':
      // TODO: Potentially configure HTML options if needed (e.g., self-closing tags)
      return html();
    case 'css':
      // TODO: Potentially configure CSS options if needed
      return css();
    default:
      // Fallback to plain JavaScript/TypeScript if language is unknown or undefined
      // This prevents errors if a file type isn't explicitly handled
      console.warn(`Unsupported language type "${language}", falling back to JavaScript/TypeScript highlighting.`);
      return javascript({ jsx: true, typescript: true });
  }
};

// Note: This file doesn't export a React component directly.
// It exports a utility function to be used within the CodeMirror setup.
// If a component wrapper were needed (e.g., for theme integration later),
// it could be added here, but for now, the function is sufficient.
