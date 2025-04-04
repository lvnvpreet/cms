import React, { useState, ReactNode } from 'react';
// import { useAppSelector } from '../../store'; // Placeholder for Redux integration for device selection

type DeviceType = 'desktop' | 'tablet' | 'mobile';
type Orientation = 'portrait' | 'landscape';

interface DevicePreviewProps {
  children: ReactNode; // The content to be previewed (e.g., LivePreview)
  initialDevice?: DeviceType;
  initialOrientation?: Orientation;
}

// Example dimensions (can be refined with presets)
const deviceDimensions: Record<DeviceType, Record<Orientation, { width: string; height: string }>> = {
  desktop: {
    portrait: { width: '100%', height: '100%' }, // Desktop usually doesn't have orientation
    landscape: { width: '100%', height: '100%' },
  },
  tablet: {
    portrait: { width: '768px', height: '1024px' },
    landscape: { width: '1024px', height: '768px' },
  },
  mobile: {
    portrait: { width: '375px', height: '667px' }, // iPhone 6/7/8 size
    landscape: { width: '667px', height: '375px' },
  },
};

const DevicePreview: React.FC<DevicePreviewProps> = ({
  children,
  initialDevice = 'desktop',
  initialOrientation = 'portrait',
}) => {
  // State for device selection - later connect this to Toolbar's DevicePreviewToggle
  const [selectedDevice, setSelectedDevice] = useState<DeviceType>(initialDevice);
  const [orientation, setOrientation] = useState<Orientation>(initialOrientation);

  // In a real app, device selection might come from Redux store updated by the Toolbar
  // const selectedDeviceFromStore = useAppSelector(state => state.ui.previewDevice);
  // useEffect(() => { setSelectedDevice(selectedDeviceFromStore); }, [selectedDeviceFromStore]);

  const currentDimensions = deviceDimensions[selectedDevice][orientation];

  // Basic styling for the device frame simulation
  const frameStyle: React.CSSProperties = {
    margin: '20px auto', // Center the frame
    overflow: 'hidden',
    border: '1px solid #555',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    transition: 'width 0.3s ease, height 0.3s ease',
    width: currentDimensions.width,
    height: currentDimensions.height,
    // Add device-specific chrome/bezel styles later if needed
    backgroundColor: '#fff', // Background for the content area
    position: 'relative', // For potential absolute positioning of children or overlays
  };

  // Style for the content wrapper inside the frame (handles scaling/scrolling)
  const contentWrapperStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    overflow: 'auto', // Allow scrolling within the previewed content
  };

  // Placeholder functions for controls (to be replaced by Toolbar integration)
  const handleDeviceChange = (device: DeviceType) => {
    setSelectedDevice(device);
    // Reset orientation if changing from/to desktop
    if (device === 'desktop') setOrientation('portrait');
    else if (selectedDevice === 'desktop') setOrientation('portrait');
  };

  const handleOrientationChange = () => {
    if (selectedDevice !== 'desktop') {
      setOrientation(prev => (prev === 'portrait' ? 'landscape' : 'portrait'));
    }
  };

  return (
    <div className="device-preview-wrapper" style={{ padding: '10px', background: '#e0e0e0', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Placeholder Controls - These will be moved to the Toolbar */}
      <div style={{ marginBottom: '10px' }}>
        <span>Device: </span>
        <select value={selectedDevice} onChange={(e) => handleDeviceChange(e.target.value as DeviceType)}>
          <option value="desktop">Desktop</option>
          <option value="tablet">Tablet</option>
          <option value="mobile">Mobile</option>
        </select>
        {selectedDevice !== 'desktop' && (
          <button onClick={handleOrientationChange} style={{ marginLeft: '10px' }}>
            Toggle Orientation ({orientation})
          </button>
        )}
      </div>

      {/* The Device Frame */}
      <div style={frameStyle}>
        <div style={contentWrapperStyle}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default DevicePreview;
