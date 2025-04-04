import React from 'react';
import ActionButtons from './ActionButtons';
import DevicePreviewToggle from './DevicePreviewToggle';
import ZoomControls from './ZoomControls';
import HistoryControls from './HistoryControls';
import { Separator } from '@/components/ui/separator'; // Assuming you have a Separator component

const Toolbar: React.FC = () => {
  return (
    <div className="flex h-14 items-center justify-between border-b bg-background px-4">
      {/* Left Section: History Controls */}
      <div className="flex items-center space-x-2">
        <HistoryControls />
      </div>

      {/* Center Section: Device Preview & Zoom */}
      <div className="flex flex-grow items-center justify-center space-x-4">
        <DevicePreviewToggle />
        <Separator orientation="vertical" className="h-6" />
        <ZoomControls />
      </div>

      {/* Right Section: Action Buttons */}
      <div className="flex items-center space-x-2">
        <ActionButtons />
      </div>
    </div>
  );
};

export default Toolbar;
