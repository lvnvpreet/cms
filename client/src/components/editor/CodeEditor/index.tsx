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

interface EditorSettings {
  theme: string;
  fontSize: number;
  // Add other settings
}

const CodeEditor: React.FC = () => {
  // State Management
  const [files, setFiles] = useState<EditorFile[]>([]); // Example: fetch initial files
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [editorSettings, setEditorSettings] = useState<EditorSettings>({
    theme: 'vs-dark', // Example setting
    fontSize: 14,
  });
  // const [errors, setErrors] = useState<CodeError[]>([]); // Removed errors state completely

  // Placeholder for SyncEngine integration
  // const { syncCodeChange, subscribeToUIChanges } = useSyncEngine();

  // Placeholder for global state integration (e.g., Redux, Zustand)
  // const { activeFileFromStore, updateActiveFileInStore } = useEditorState();

  // Fetch initial files (example)
  useEffect(() => {
    // Replace with actual API call or data source
    // Ensure initial files conform to the extended EditorFile interface (including 'type')
    const initialFiles: EditorFile[] = [
      { id: '1', name: 'App.tsx', type: 'typescript', language: 'typescript', content: '// Start coding here' }, // Changed initial content
      { id: '2', name: 'styles.css', type: 'css', language: 'css', content: 'body { /* Add styles */ }' }, // Changed initial content
    ];
    // Cast to EditorFile[] if necessary, depending on how FileTab is defined
    setFiles(initialFiles as EditorFile[]);
    if (initialFiles.length > 0) {
      setActiveFileId(initialFiles[0].id);
    }
  }, []);

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
