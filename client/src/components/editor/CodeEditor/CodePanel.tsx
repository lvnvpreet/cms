import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { basicSetup } from '@codemirror/basic-setup';
import { EditorView } from '@codemirror/view'; // Import EditorView for theme extension

interface CodePanelProps {
  code: string;
  onCodeChange: (newCode: string) => void;
  // Add other props as needed, e.g., language, theme, readOnly
}

const CodePanel: React.FC<CodePanelProps> = ({ code, onCodeChange }) => {
  const onChange = React.useCallback((value: string) => {
    onCodeChange(value);
  }, [onCodeChange]);

  // Basic theme extension (you can customize this further or use pre-built themes)
  const editorTheme = EditorView.theme({
    '&': {
      height: '100%', // Ensure editor fills its container
      fontSize: '14px',
    },
    '.cm-scroller': { overflow: 'auto' },
  });

  return (
    <div style={{ height: '100%', overflow: 'hidden' }}> {/* Container for sizing */}
      <CodeMirror
        value={code}
        height="100%" // Make CodeMirror fill the container height
        extensions={[
          // basicSetup bundles many core features:
          // - Line numbers, code folding, gutters
          // - Highlighting, bracket matching
          // - Autocompletion, linting (if configured)
          // - Default keybindings (including history, selection, movement)
          // - Core performance features like virtual scrolling are inherent to EditorView
          basicSetup,
          // Language support (enables tokenization for syntax highlighting etc.)
          javascript({ jsx: true, typescript: true }),
          editorTheme // Apply basic theme
        ]}
        onChange={onChange}
        // Consider adding options for theme, keymaps, etc.
      />
    </div>
  );
};

export default CodePanel;
