import React, { useState, useEffect, useCallback } from 'react';
import { Resizable } from 're-resizable';
import FileTabs, { FileTab } from './FileTabs'; // Import FileTab type
import CodePanel from './CodePanel';
import ErrorDisplay, { CodeError } from './ErrorDisplay'; // Import CodeError from ErrorDisplay
// import { useSyncEngine } from '../SyncEngine';
// import { useEditorState } from '../../store/slices/editorSlice';

// Use FileTab type for files, potentially extend it if needed locally
interface EditorFile extends FileTab {
  content: string;
  cursorPosition?: { line: number; column: number };
  selection?: any;
  // Add other properties specific to the editor's internal state if necessary
}

// Props for CodeEditor, including the generated code from UI changes
interface CodeEditorProps {
  generatedHtml?: string; // Optional for initial render
  generatedCss?: string;
  generatedJs?: string;
  // Add props for code changes propagating back up if needed
  // onHtmlChange?: (content: string) => void;
  // onCssChange?: (content: string) => void;
  // onJsChange?: (content: string) => void;
}

interface EditorSettings {
  theme: string;
  fontSize: number;
  // Add other settings
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  generatedHtml = '', // Default to empty strings
  generatedCss = '',
  generatedJs = '',
}) => {
  // State Management
  // Initialize with default files for generated content
  const [files, setFiles] = useState<EditorFile[]>([
    { id: 'gen-html', name: 'index.html', type: 'html', language: 'html', content: generatedHtml || '// Waiting for UI changes...' },
    { id: 'gen-css', name: 'style.css', type: 'css', language: 'css', content: generatedCss || '/* Waiting for UI changes... */' },
    { id: 'gen-js', name: 'script.js', type: 'javascript', language: 'javascript', content: generatedJs || '// Waiting for UI changes...' },
  ]);
  const [activeFileId, setActiveFileId] = useState<string | null>('gen-html'); // Start with HTML active
  const [editorSettings, setEditorSettings] = useState<EditorSettings>({
    theme: 'vs-dark', // Example setting
    fontSize: 14,
  });
  // const [errors, setErrors] = useState<CodeError[]>([]); // Linter/Error state removed

  // Placeholder for SyncEngine integration (Code -> UI direction)
  // const { syncCodeChange } = useSyncEngine();

  // Placeholder for global state integration

  // Effect to update file content when generated code props change
  useEffect(() => {
    setFiles(prevFiles => {
      const updatedFiles = [...prevFiles];
      const htmlFileIndex = updatedFiles.findIndex(f => f.id === 'gen-html');
      const cssFileIndex = updatedFiles.findIndex(f => f.id === 'gen-css');
      const jsFileIndex = updatedFiles.findIndex(f => f.id === 'gen-js');

      if (htmlFileIndex !== -1 && updatedFiles[htmlFileIndex].content !== generatedHtml) {
        updatedFiles[htmlFileIndex] = { ...updatedFiles[htmlFileIndex], content: generatedHtml };
      } else if (htmlFileIndex === -1) {
        // Add if missing (shouldn't happen with initial state, but good practice)
        updatedFiles.push({ id: 'gen-html', name: 'index.html', type: 'html', language: 'html', content: generatedHtml });
      }

      if (cssFileIndex !== -1 && updatedFiles[cssFileIndex].content !== generatedCss) {
        updatedFiles[cssFileIndex] = { ...updatedFiles[cssFileIndex], content: generatedCss };
      } else if (cssFileIndex === -1) {
        updatedFiles.push({ id: 'gen-css', name: 'style.css', type: 'css', language: 'css', content: generatedCss });
      }

      if (jsFileIndex !== -1 && updatedFiles[jsFileIndex].content !== generatedJs) {
        updatedFiles[jsFileIndex] = { ...updatedFiles[jsFileIndex], content: generatedJs };
      } else if (jsFileIndex === -1) {
        updatedFiles.push({ id: 'gen-js', name: 'script.js', type: 'javascript', language: 'javascript', content: generatedJs });
      }

      // If no file was active and we just added files, activate the HTML one
      if (!activeFileId && updatedFiles.length > 0) {
          const htmlIdx = updatedFiles.findIndex(f => f.id === 'gen-html');
          if (htmlIdx !== -1) setActiveFileId(updatedFiles[htmlIdx].id);
      }


      return updatedFiles;
    });
  }, [generatedHtml, generatedCss, generatedJs, activeFileId]); // Rerun when generated code changes

    // Handle file switching
  const handleSelectFile = useCallback((fileId: string) => {
    // Save current editor state (cursor, selection) before switching
    const currentFileIndex = files.findIndex(f => f.id === activeFileId);
    if (currentFileIndex !== -1) {
      // TODO: Get cursor/selection state from CodePanel/Monaco Editor instance
      // const updatedFiles = [...files];
      // updatedFiles[currentFileIndex] = {
      //   ...updatedFiles[currentFileIndex],
      //   cursorPosition: ...,
      //   selection: ...,
      // };
      // setFiles(updatedFiles);
    }
    setActiveFileId(fileId);
  }, [activeFileId, files]);

  // Handle code changes from CodePanel (only receives newContent)
  const handleCodeChange = useCallback((newContent: string) => {
    if (!activeFileId) return; // Should not happen if a file is active

    setFiles(prevFiles =>
      prevFiles.map(file =>
        file.id === activeFileId ? { ...file, content: newContent, isModified: true } : file // Mark as modified
      )
    );
    // TODO: Debounce this call
    // syncCodeChange(activeFileId, newContent); // Sync with SyncEngine

    // Removed setErrors([]) call

  }, [activeFileId /*, syncCodeChange */]);

  // Removed handleErrors function as linter is disabled

  // Removed useEffect for clearing errors

  // Effect for SyncEngine UI changes subscription (placeholder)
  useEffect(() => {
    // const unsubscribe = subscribeToUIChanges((change) => {
    //   // Update code based on UI changes
    //   console.log('Received UI change:', change);
    //   // Find the relevant file and update its content
    // });
    // return () => unsubscribe();
  }, [/* subscribeToUIChanges */]);

  // Effect for Keyboard Shortcuts (placeholder)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Example: Ctrl+S for saving (though auto-sync might be preferred)
      if (event.ctrlKey && event.key === 's') {
        event.preventDefault();
        console.log('Save action triggered (implement actual save/sync)');
        // Potentially trigger a manual sync or save operation
      }
      // Add more shortcuts (e.g., find, replace, format)
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeFileId, files /* dependencies for save action */]);


  const activeFile = files.find(file => file.id === activeFileId);

  return (
    // Ensure the main container is flex column and takes full height/width
    <div className="flex flex-col h-full w-full bg-background"> {/* Add h-full back */}
      {/* File Tabs */}
        <FileTabs
          files={files.map(f => ({ id: f.id, name: f.name, type: f.type, language: f.language, isModified: f.isModified, hasErrors: f.hasErrors }))}
          activeFileId={activeFileId}
          onSelectTab={handleSelectFile} // Match prop name from FileTabs component
          onCloseTab={(fileId) => { /* TODO: Implement file closing logic */ console.log("Close", fileId); }}
          // onReorderTabs={(reordered) => setFiles(reordered)} // Optional: If FileTabs handles reordering
          // onCreateFile={() => { /* TODO: Implement file creation */ }} // Optional
        />
      {/* Removed wrapper div */}

      {/* Container for CodePanel and ErrorDisplay - Simplify flex, add min-h-0 */}
      <div className="flex flex-col flex-grow overflow-hidden min-h-0">
        {/* Code Panel - Remove overflow-auto, let CodeMirror handle scroll */}
        <div className="flex-grow"> {/* Removed overflow-auto */}
          {activeFile ? (
            <CodePanel
              fileId={activeFile.id}
              language={activeFile.language} // Pass language for syntax highlighting
              content={activeFile.content} // Pass current content
              onChange={handleCodeChange} // Pass updated handler
              // onError={handleErrors} // Removed onError prop
              // Pass editor settings and initial state
              theme={editorSettings.theme}
              fontSize={editorSettings.fontSize}
              // initialCursorPosition={activeFile.cursorPosition} // TODO: Implement state restoration
              // initialSelection={activeFile.selection}
            />
          ) : (
            <div style={{ padding: '20px', textAlign: 'center', color: '#888' }}>
              Select a file to start editing.
            </div>
          )}
        </div>

        {/* Error Display - Completely removed for debugging */}
        {/* {errors.length > 0 && (
           <Resizable
             defaultSize={{ width: '100%', height: '100px' }}
             minHeight={50}  // Min height when resizing
             maxHeight={300} // Max height when resizing
             enable={{ top: true, right: false, bottom: false, left: false, topRight: false, bottomRight: false, bottomLeft: false, topLeft: false }} // Only allow resizing from top handle
             className="shrink-0 border-t border-border"
           >
             <ErrorDisplay
              errors={errors}
              onNavigate={(line, column) => {
                // TODO: Implement navigation logic in CodePanel/CodeMirror instance
                console.log(`Navigate to Line: ${line}, Column: ${column}`);
              }}
            />
          </Resizable>
        )} */}
      </div>

      {/* TODO: Add status bar, settings controls, etc. */}
    </div>
  );
};

export default CodeEditor;
