import React from 'react';
import { AlertTriangle, XCircle } from 'lucide-react'; // Example icons

// Define the structure for an error/warning object
// This would typically come from a linter or validation service
export interface CodeError { // Export the interface
  id: string;
  line: number;
  column: number;
  message: string;
  severity: 'error' | 'warning';
  source?: string; // e.g., 'eslint', 'stylelint', 'validation'
  // Potential quick-fix suggestions could be added here
  // quickFixes?: QuickFix[];
}

interface ErrorDisplayProps {
  errors: CodeError[];
  // Function to handle navigation when an error is clicked
  onNavigate: (line: number, column: number) => void;
  // Potentially pass editor instance or context for inline markers/tooltips
  // editor?: EditorInstance;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ errors, onNavigate }) => {
  // TODO: Implement inline error indicators in the code editor itself.
  // This usually involves interacting with the editor's API (e.g., Monaco Editor decorations).

  // TODO: Implement hoverable tooltips for inline indicators.

  // TODO: Implement quick-fix suggestions (if applicable).

  const renderSeverityIcon = (severity: 'error' | 'warning') => {
    if (severity === 'error') {
      return <XCircle className="h-4 w-4 text-red-500 mr-2 flex-shrink-0" />;
    }
    return <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2 flex-shrink-0" />;
  };

  return (
    <div className="error-panel p-4 border-t border-gray-700 bg-gray-800 text-white h-full overflow-y-auto">
      <h3 className="text-lg font-semibold mb-2">Problems ({errors.length})</h3>
      {errors.length === 0 ? (
        <p className="text-gray-400">No problems detected.</p>
      ) : (
        <ul className="space-y-1">
          {errors.map((error) => (
            <li
              key={error.id}
              className="flex items-start p-2 rounded hover:bg-gray-700 cursor-pointer text-sm"
              onClick={() => onNavigate(error.line, error.column)}
              title={`Click to navigate to line ${error.line}`}
            >
              {renderSeverityIcon(error.severity)}
              <div className="flex-grow">
                <span className="font-mono text-gray-400 mr-2">
                  [{error.line}:{error.column}]
                </span>
                <span>{error.message}</span>
                {error.source && (
                  <span className="text-xs text-gray-500 ml-2">({error.source})</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
      {/* TODO: Add filtering/sorting options if needed */}
    </div>
  );
};

export default ErrorDisplay;

// TODO: Integrate with linters (ESLint, Stylelint) and validation logic.
// This component expects the processed error data via props.
// The actual linting/validation would happen elsewhere (e.g., in a hook or service)
// and update the 'errors' prop passed to this component in real-time or on demand.
