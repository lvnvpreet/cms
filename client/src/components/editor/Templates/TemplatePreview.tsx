import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ZoomIn, ZoomOut, Monitor, Tablet, Smartphone } from 'lucide-react';
import { Template } from '@/types'; // Import the shared Template type

interface TemplatePreviewProps {
  template: Template | null; // Allow null if no template is selected
  onClose: () => void;
  onApply: (templateId: string, customizations?: any) => void;
}

type Viewport = 'desktop' | 'tablet' | 'mobile';

const TemplatePreview: React.FC<TemplatePreviewProps> = ({ template, onClose, onApply }) => {
  const [viewport, setViewport] = useState<Viewport>('desktop');
  const [zoomLevel, setZoomLevel] = useState(1);
  // State for potential customizations would go here
  // const [customizations, setCustomizations] = useState({});

  if (!template) {
    return null; // Don't render if no template is selected
  }

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.1, 2)); // Max zoom 200%
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.1, 0.5)); // Min zoom 50%

  // Placeholder dimensions based on viewport
  const getViewportStyle = (): React.CSSProperties => {
    const styles: React.CSSProperties = {
      transform: `scale(${zoomLevel})`,
      transformOrigin: 'top left',
      transition: 'width 0.3s ease, transform 0.1s ease',
      border: '1px solid #ccc',
      overflow: 'auto', // Allow scrolling within the preview if content overflows
      margin: 'auto', // Center the preview area
      backgroundColor: '#fff', // Background for the preview frame
    };
    switch (viewport) {
      case 'tablet':
        styles.width = '768px';
        styles.height = '1024px'; // Example tablet height
        break;
      case 'mobile':
        styles.width = '375px';
        styles.height = '667px'; // Example mobile height
        break;
      case 'desktop':
      default:
        styles.width = '100%'; // Full width of container
        styles.height = 'calc(100vh - 150px)'; // Example desktop height (adjust as needed)
        break;
    }
    return styles;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col z-50 p-4">
      {/* Header Controls */}
      <div className="bg-background p-3 rounded-t-lg flex items-center justify-between border-b">
        <h2 className="text-xl font-semibold">{template.name} Preview</h2>
        <div className="flex items-center space-x-2">
           {/* Viewport Controls */}
           <Button variant={viewport === 'desktop' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewport('desktop')} title="Desktop View"> <Monitor size={18}/> </Button>
           <Button variant={viewport === 'tablet' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewport('tablet')} title="Tablet View"> <Tablet size={18}/> </Button>
           <Button variant={viewport === 'mobile' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewport('mobile')} title="Mobile View"> <Smartphone size={18}/> </Button>

           <span className="mx-2 border-l h-6"></span>

           {/* Zoom Controls */}
           <Button variant="ghost" size="icon" onClick={handleZoomOut} title="Zoom Out"> <ZoomOut size={18}/> </Button>
           <span className="text-sm w-10 text-center">{(zoomLevel * 100).toFixed(0)}%</span>
           <Button variant="ghost" size="icon" onClick={handleZoomIn} title="Zoom In"> <ZoomIn size={18}/> </Button>

           <span className="mx-2 border-l h-6"></span>

           <Button onClick={() => onApply(template.id /*, customizations */)} >Apply Template</Button>
           <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
      </div>

      {/* Main Preview Area */}
      <div className="flex-grow bg-muted p-4 rounded-b-lg overflow-auto flex">
         {/* High-fidelity rendering area */}
         {/* This is a placeholder. Actual implementation depends heavily on how templates are structured and rendered. */}
         {/* Option 1: Iframe (if demoContentUrl points to a renderable page) */}
         {/* <iframe src={template.demoContentUrl} style={getViewportStyle()} title="Template Preview" /> */}

         {/* Option 2: Direct Rendering (if componentDefinitions can be parsed and rendered) */}
         <div style={getViewportStyle()}>
            <div className="p-10 text-center text-muted-foreground">
                High-fidelity preview rendering area for "{template.name}". <br/>
                (Requires template rendering logic) <br/>
                Viewport: {viewport} | Zoom: {(zoomLevel * 100).toFixed(0)}%
            </div>
            {/* TODO: Implement actual template rendering based on template.componentDefinitions, template.styleInfo etc. */}
            {/* TODO: Implement interactive exploration, component structure display, contextual info */}
         </div>

         {/* Optional Sidebar for Customization/Info */}
         {/* {template.customizationParams && (
            <div className="w-64 bg-background p-4 ml-4 rounded border overflow-y-auto">
               <h3 className="font-semibold mb-3">Customize</h3>
               {/* Render customization controls based on template.customizationParams */}
            {/*</div>
         )} */}
      </div>
    </div>
  );
};

export default TemplatePreview;
