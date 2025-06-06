import React, { useCallback, useMemo } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { EditorView, keymap, highlightActiveLineGutter, drawSelection, dropCursor, rectangularSelection, crosshairCursor } from '@codemirror/view';
import { EditorState, Extension } from '@codemirror/state';
import { history, defaultKeymap, historyKeymap } from '@codemirror/commands';
import { indentOnInput, syntaxHighlighting, defaultHighlightStyle, bracketMatching } from '@codemirror/language';
import { closeBrackets, autocompletion, closeBracketsKeymap, completionKeymap } from '@codemirror/autocomplete';
import { highlightSelectionMatches, searchKeymap } from '@codemirror/search';
// import { linter, lintGutter, lintKeymap, Diagnostic } from "@codemirror/lint"; // Remove lint imports

import { getSyntaxHighlightingExtension } from './SyntaxHighlighter';
import { CodeError } from './ErrorDisplay'; // Import CodeError from ErrorDisplay


// Define expected props
export interface CodePanelProps { // Add export
  fileId: string; // ID of the file being edited
  language: 'typescript' | 'css' | 'html' | 'javascript' | string; // Language for syntax highlighting
  content: string; // Current content of the file
  onChange: (newContent: string) => void; // Callback when content changes
  onError?: (errors: CodeError[]) => void; // Callback for reporting errors
  theme?: string; // e.g., 'vs-dark', 'github-light'
  fontSize?: number;
  initialCursorPosition?: { line: number; column: number }; // For restoring state
  initialSelection?: any; // For restoring state
  // Add other relevant props like readOnly, etc.
}

const CodePanel: React.FC<CodePanelProps> = ({
  fileId, // Use fileId if needed for context, e.g., in linters
  language,
  content,
  onChange,
  onError,
  theme = 'vs-dark', // Default theme
  fontSize = 14, // Default font size
  // initialCursorPosition, // TODO: Implement restoring cursor/selection
  // initialSelection,
}) => {

  // Memoize the onChange callback to prevent unnecessary re-renders of CodeMirror
  const handleCodeChange = useCallback((value: string) => {
    onChange(value);
    // TODO: Implement debounced linting/error checking here or in parent
    // Example: Trigger linting and call onError if present
    // const lintErrors = runLinter(value, language);
    // if (onError) {
    //   onError(lintErrors);
    // }
  }, [onChange, onError, language, fileId]);

  // TODO: Implement a proper linter source based on language
  // const myLinter = linter(view => { // Comment out linter function
    // Replace with actual linting logic (e.g., using ESLint, stylelint, etc.)
    // For now, return empty diagnostics to remove the console.log warning
    // let diagnostics: Diagnostic[] = []; // Explicitly type diagnostics array
    // if (language === 'javascript' || language === 'typescript') {
    //   // Example: Find console.log statements (very basic)
    //   const matches = view.state.doc.toString().matchAll(/console\.log/g);
    //   for (const match of matches) {
    //       if (match.index !== undefined) {
    //           const pos = match.index;
    //           diagnostics.push({
    //               from: pos,
    //               to: pos + 11, // length of "console.log"
    //               severity: "warning" as "warning" | "info" | "error", // Explicitly type severity
    //               message: "Avoid using console.log in production code.",
    //               // actions: [{...}] // Optional actions
    //           });
    //       }
    //   }
    // }
    // Removed the if(onError) block as diagnostics variable is no longer available
    // Always return empty diagnostics for now
    // return []; // Explicitly return empty array
  // }); // Comment out linter function

  // Memoize extensions to avoid re-creating them on every render
  const editorExtensions = useMemo(() => {
    // Basic theme extension using the fontSize prop
    const dynamicTheme = EditorView.theme({
      '&': {
        height: '100%',
        fontSize: `${fontSize}px`, // Use prop for font size
      },
      '.cm-scroller': { overflow: 'auto' },
      // Add more theme styles if needed
    });

    // Explicitly type the extensions array
    const extensions: Extension[] = [
      // Essentials from basicSetup replacement
      highlightActiveLineGutter(),
      history(),
      drawSelection(),
      dropCursor(),
      EditorState.allowMultipleSelections.of(true),
      indentOnInput(),
      syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
      bracketMatching(),
      closeBrackets(),
      autocompletion(),
      rectangularSelection(),
      crosshairCursor(),
      highlightSelectionMatches(),
      keymap.of([
          ...closeBracketsKeymap,
          ...defaultKeymap,
          ...searchKeymap,
          ...historyKeymap,
          ...completionKeymap,
          // ...lintKeymap // Remove lint keymap
      ]),
      // Existing extensions
      // lintGutter(), // Remove lint gutter
      getSyntaxHighlightingExtension(language), // Language specific syntax highlighting
      dynamicTheme, // Custom theme adjustments
      // myLinter, // Remove linter
      // TODO: Add keymaps, theme extensions based on props
    ];
    return extensions; // Return the typed array
  }, [language, fontSize]); // Remove myLinter from dependencies

  return (
    // Ensure CodeMirror fills its container - Add border for debugging
    <div className="h-full w-full overflow-hidden border-2 border-lime-500">
      <CodeMirror
        value={content} // Use content prop
        height="100%" // Ensure it takes full height
        minHeight="100%" // Explicitly set minHeight
        style={{ height: '100%' }} // Add inline style as fallback
        extensions={editorExtensions}
        onChange={handleCodeChange} // Use memoized handler
        // theme={theme} // Pass theme prop if using a CodeMirror theme extension
        // TODO: Handle initialCursorPosition and initialSelection
      />
    </div>
  );
};

export default CodePanel;
