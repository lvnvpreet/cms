import React from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Smartphone, Tablet, Monitor } from 'lucide-react';
// TODO: Import necessary hooks/state management for device mode (e.g., from editorSlice)

type DeviceMode = 'mobile' | 'tablet' | 'desktop';

const DevicePreviewToggle: React.FC = () => {
  // TODO: Get current device mode from state (e.g., useSelector)
  const currentDeviceMode: DeviceMode = 'desktop'; // Placeholder

  // TODO: Get dispatch function to update device mode (e.g., useDispatch)
  const handleDeviceChange = (value: DeviceMode) => {
    if (value) { // ToggleGroup allows deselecting, ensure a value is selected
      console.log('Device mode changed to:', value);
      // TODO: Dispatch action to update device mode in state
      // dispatch(setDeviceMode(value));
    }
  };

  return (
    <ToggleGroup
      type="single"
      value={currentDeviceMode}
      onValueChange={handleDeviceChange}
      aria-label="Device preview mode"
      size="sm"
    >
      <ToggleGroupItem value="mobile" aria-label="Mobile preview">
        <Smartphone className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="tablet" aria-label="Tablet preview">
        <Tablet className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="desktop" aria-label="Desktop preview">
        <Monitor className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

// Exporting as named export
export { DevicePreviewToggle };

// Add a default export to satisfy the import in index.tsx for now.
export default DevicePreviewToggle;
