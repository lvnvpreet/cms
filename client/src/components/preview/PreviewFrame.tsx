import React, { useRef, useEffect } from 'react';

interface PreviewFrameProps {
  htmlContent: string; // The HTML string to render in the iframe
  // Add props for CSS, JS, communication, error handling later
  onLoad?: () => void; // Callback when iframe content is loaded
  onError?: (error: any) => void; // Callback for iframe errors
}

const PreviewFrame: React.FC<PreviewFrameProps> = ({
  htmlContent,
  onLoad,
  onError,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    // Function to update iframe content
    const updateFrameContent = () => {
      try {
        // Use srcDoc for better security and handling complex HTML
        iframe.srcdoc = htmlContent;

        // Attach load/error handlers directly to the iframe element
        const handleLoad = () => {
          console.log('PreviewFrame content loaded.');
          if (onLoad) onLoad();
        };

        const handleError = (event: ErrorEvent) => {
          console.error('Error within PreviewFrame:', event.error);
          if (onError) onError(event.error);
        };

        // Clear previous listeners before adding new ones
        iframe.removeEventListener('load', handleLoad);
        iframe.removeEventListener('error', handleError); // Note: iframe 'error' might not catch all script errors

        iframe.addEventListener('load', handleLoad);
        iframe.addEventListener('error', handleError); // For network errors loading iframe resources

        // Consider adding message event listener for communication from iframe content
        // window.addEventListener('message', handleMessageFromFrame);

      } catch (error) {
        console.error('Error setting up PreviewFrame:', error);
        if (onError) onError(error);
      }
    };

    updateFrameContent();

    // Cleanup function
    return () => {
      // Remove listeners if component unmounts
      // Note: iframe listeners might persist if srcdoc is just updated,
      // but good practice for unmounting.
      // iframe.removeEventListener('load', handleLoad); // handleLoad is defined inside useEffect
      // iframe.removeEventListener('error', handleError); // handleError is defined inside useEffect
      // window.removeEventListener('message', handleMessageFromFrame);
    };
    // Re-run effect when htmlContent changes
  }, [htmlContent, onLoad, onError]);

  return (
    <iframe
      ref={iframeRef}
      title="Site Preview"
      sandbox="allow-scripts allow-same-origin allow-popups allow-forms" // Adjust sandbox rules as needed
      style={{
        width: '100%',
        height: '100%',
        border: 'none', // Remove default iframe border
        display: 'block', // Prevent extra space below iframe
      }}
      // srcDoc is set dynamically in the useEffect hook
    />
  );
};

export default PreviewFrame;
