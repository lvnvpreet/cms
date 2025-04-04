import React, { useState, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Assuming Alert component exists
import { UploadCloud, Link, Store, AlertCircle, CheckCircle } from 'lucide-react';
import { Template } from '@/types'; // Import the shared Template type

interface TemplateImporterProps {
  onImportComplete: (importedTemplates: Template[]) => void; // Callback after successful import
  onClose: () => void;
}

type ImportStatus = 'idle' | 'importing' | 'validating' | 'success' | 'error';
type ImportMethod = 'upload' | 'url' | 'marketplace';

const TemplateImporter: React.FC<TemplateImporterProps> = ({ onImportComplete, onClose }) => {
  const [importMethod, setImportMethod] = useState<ImportMethod>('upload');
  const [importStatus, setImportStatus] = useState<ImportStatus>('idle');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [fileList, setFileList] = useState<FileList | null>(null);
  const [importUrl, setImportUrl] = useState<string>('');

  // Placeholder for validation logic
  const validateTemplate = async (templateData: any): Promise<{ isValid: boolean; message?: string; template?: Template }> => {
    console.log("Validating template...", templateData);
    // TODO: Implement actual validation logic
    // - Check structure, required fields, compatibility, etc.
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate validation time
    const isValid = Math.random() > 0.2; // Simulate validation success/failure
    if (isValid) {
        // Simulate extracting basic info for a valid template
        // Add the required 'source' property
        return { isValid: true, template: { id: `imported-${Date.now()}`, name: templateData.name || 'Imported Template', description: 'Imported template description', category: 'Imported', complexity: 'medium', estimatedTime: 'N/A', popularity: 0, rating: 0, source: 'custom' } };
    } else {
        return { isValid: false, message: "Template validation failed: Invalid format or missing required fields." };
    }
  };

  // Placeholder for import logic
  const handleImport = async () => {
    setImportStatus('importing');
    setFeedbackMessage(null);
    let importedTemplates: Template[] = [];
    let validationError = null;

    try {
      if (importMethod === 'upload' && fileList) {
        setFeedbackMessage(`Importing ${fileList.length} file(s)...`);
        // TODO: Handle file reading (e.g., JSON, zip)
        for (let i = 0; i < fileList.length; i++) {
            const file = fileList[i];
            // Simulate reading and parsing file content
            const fileContent = { name: file.name }; // Replace with actual file parsing
            setImportStatus('validating');
            const validationResult = await validateTemplate(fileContent);
            if (validationResult.isValid && validationResult.template) {
                // Assign 'custom' as source for uploaded templates
                importedTemplates.push({ ...validationResult.template, source: 'custom' });
            } else {
                validationError = validationResult.message || 'Unknown validation error.';
                break; // Stop on first error for simplicity
            }
        }
      } else if (importMethod === 'url' && importUrl) {
        setFeedbackMessage(`Importing from URL: ${importUrl}...`);
        // TODO: Handle fetching data from URL
        // Simulate fetching and parsing
        const fetchedData = { name: `Template from ${importUrl}` }; // Replace with actual fetch/parse
        setImportStatus('validating');
        const validationResult = await validateTemplate(fetchedData);
         if (validationResult.isValid && validationResult.template) {
             // Assign 'custom' as source for URL templates
            importedTemplates.push({ ...validationResult.template, source: 'custom' });
        } else {
            validationError = validationResult.message || 'Unknown validation error.';
        }
      } else if (importMethod === 'marketplace') {
        setFeedbackMessage('Connecting to marketplace...');
        // TODO: Implement marketplace browsing/selection logic
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate marketplace interaction
        validationError = "Marketplace import not yet implemented.";
      }

      if (validationError) {
        throw new Error(validationError);
      }

      if (importedTemplates.length > 0) {
        setImportStatus('success');
        setFeedbackMessage(`Successfully imported ${importedTemplates.length} template(s).`);
        onImportComplete(importedTemplates);
        // Optionally close after a delay or keep open to import more
        // setTimeout(onClose, 1500);
      } else if (!validationError) {
         setImportStatus('error');
         setFeedbackMessage('No valid templates found or import method not supported.');
      }

    } catch (error: any) {
      setImportStatus('error');
      setFeedbackMessage(`Import failed: ${error.message}`);
      console.error("Import error:", error);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFileList(event.target.files);
    setImportStatus('idle'); // Reset status on new file selection
    setFeedbackMessage(null);
  };

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImportUrl(event.target.value);
     setImportStatus('idle');
     setFeedbackMessage(null);
  }

  const isImporting = importStatus === 'importing' || importStatus === 'validating';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg shadow-xl w-full max-w-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Import Templates</h2>

        <Tabs value={importMethod} onValueChange={(value) => setImportMethod(value as ImportMethod)} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="upload"><UploadCloud className="inline-block mr-1 h-4 w-4"/> Upload File(s)</TabsTrigger>
            <TabsTrigger value="url"><Link className="inline-block mr-1 h-4 w-4"/> From URL</TabsTrigger>
            <TabsTrigger value="marketplace"><Store className="inline-block mr-1 h-4 w-4"/> Marketplace</TabsTrigger>
          </TabsList>

          <TabsContent value="upload">
            <div className="space-y-4">
              <Label htmlFor="template-upload">Select template file(s) (.json, .zip, etc.)</Label>
              <Input
                id="template-upload"
                type="file"
                multiple
                onChange={handleFileChange}
                disabled={isImporting}
              />
              {fileList && <p className="text-sm text-muted-foreground">{fileList.length} file(s) selected.</p>}
            </div>
          </TabsContent>

          <TabsContent value="url">
             <div className="space-y-4">
               <Label htmlFor="template-url">Enter template URL</Label>
               <Input
                 id="template-url"
                 type="url"
                 placeholder="https://example.com/template.json"
                 value={importUrl}
                 onChange={handleUrlChange}
                 disabled={isImporting}
               />
             </div>
          </TabsContent>

          <TabsContent value="marketplace">
            <div className="text-center p-8 border rounded-md">
              <p className="text-muted-foreground">Template Marketplace integration coming soon!</p>
              {/* Placeholder for marketplace browser */}
            </div>
          </TabsContent>
        </Tabs>

        {feedbackMessage && (
          <Alert variant={importStatus === 'error' ? 'destructive' : 'default'} className="mt-4">
            {importStatus === 'error' ? <AlertCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
            <AlertTitle>{importStatus === 'error' ? 'Error' : importStatus === 'success' ? 'Success' : 'Status'}</AlertTitle>
            <AlertDescription>{feedbackMessage}</AlertDescription>
          </Alert>
        )}

        <div className="mt-6 flex justify-end space-x-3">
          <Button variant="outline" onClick={onClose} disabled={isImporting}>Cancel</Button>
          <Button
            onClick={handleImport}
            disabled={isImporting || (importMethod === 'upload' && !fileList) || (importMethod === 'url' && !importUrl) || importMethod === 'marketplace'}
          >
            {isImporting ? 'Importing...' : 'Import'}
          </Button>
        </div>
         {/* TODO: Add sections for validation feedback, version handling, permissions/licensing */}
      </div>
    </div>
  );
};

export default TemplateImporter;
