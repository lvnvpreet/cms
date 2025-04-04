import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Define the props for the SiteCard component
interface SiteCardProps {
  site: {
    id: string;
    name: string;
    thumbnailUrl?: string; // Optional thumbnail URL
    createdAt: string;
    lastModified: string;
    status: 'draft' | 'published' | 'archived';
    type?: string; // Optional site type or template info
    visits?: number; // Optional site stats snapshot
    pages?: number; // Optional site stats snapshot
    sharedWith?: string[]; // Optional collaboration info
  };
  isSelected?: boolean; // Optional selection state
  onSelect?: (id: string) => void; // Optional selection handler
  onEdit: (id: string) => void;
  onPreview: (id: string) => void;
  onPublish: (id: string) => void;
  onDelete: (id: string) => void;
  // Add other action handlers as needed (e.g., archive, duplicate)
}

const SiteCard: React.FC<SiteCardProps> = ({
  site,
  isSelected,
  onSelect,
  onEdit,
  onPreview,
  onPublish,
  onDelete,
}) => {
  const handleSelect = () => {
    if (onSelect) {
      onSelect(site.id);
    }
  };

  // Placeholder for loading state - implement actual logic later
  const isLoading = false;

  if (isLoading) {
    // Render a loading skeleton or spinner
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-300 rounded w-3/4"></div>
        </CardHeader>
        <CardContent>
          <div className="h-32 bg-gray-300 rounded mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-1/4"></div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="h-8 bg-gray-300 rounded w-16"></div>
          <div className="h-8 bg-gray-300 rounded w-8"></div>
        </CardFooter>
      </Card>
    );
  }

  const getStatusBadgeVariant = (status: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (status) {
      case 'published':
        return 'default'; // Or a success variant if available
      case 'draft':
        return 'secondary';
      case 'archived':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  return (
    <Card
      className={`transition-all duration-200 ease-in-out hover:shadow-lg ${
        isSelected ? 'ring-2 ring-primary ring-offset-2' : ''
      }`}
      onClick={handleSelect} // Allow selecting the card itself if needed
    >
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <CardTitle className="text-lg font-semibold">{site.name}</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">More actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(site.id)}>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onPreview(site.id)}>Preview</DropdownMenuItem>
            {site.status !== 'published' && (
              <DropdownMenuItem onClick={() => onPublish(site.id)}>Publish</DropdownMenuItem>
            )}
            {/* Add Archive, Duplicate etc. here */}
            <DropdownMenuItem className="text-red-600" onClick={() => onDelete(site.id)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        {site.thumbnailUrl ? (
          <img
            src={site.thumbnailUrl}
            alt={`${site.name} preview`}
            className="w-full h-32 object-cover rounded-md mb-4 bg-gray-100" // Added background color
          />
        ) : (
          <div className="w-full h-32 flex items-center justify-center bg-gray-100 rounded-md mb-4 text-gray-400">
            No Preview
          </div>
        )}
        <div className="text-sm text-muted-foreground mb-1">
          Created: {new Date(site.createdAt).toLocaleDateString()}
        </div>
        <div className="text-sm text-muted-foreground mb-3">
          Modified: {new Date(site.lastModified).toLocaleDateString()}
        </div>
        <div className="flex items-center justify-between mb-2">
            <Badge variant={getStatusBadgeVariant(site.status)}>{site.status}</Badge>
            {site.type && <Badge variant="outline">{site.type}</Badge>}
        </div>
        {/* Optional Stats Snapshot */}
        {(site.visits !== undefined || site.pages !== undefined) && (
            <div className="text-xs text-muted-foreground border-t pt-2 mt-2">
                {site.visits !== undefined && <span>Visits: {site.visits}</span>}
                {site.visits !== undefined && site.pages !== undefined && <span className="mx-1">|</span>}
                {site.pages !== undefined && <span>Pages: {site.pages}</span>}
            </div>
        )}
         {/* Optional Collaboration Info */}
         {site.sharedWith && site.sharedWith.length > 0 && (
            <div className="text-xs text-muted-foreground mt-1">
                Shared with: {site.sharedWith.length} user(s)
            </div>
         )}
      </CardContent>
      <CardFooter className="flex justify-start space-x-2">
        {/* Quick Actions - Consider if these are needed if also in dropdown */}
        <Button variant="outline" size="sm" onClick={() => onEdit(site.id)}>
          Edit
        </Button>
        <Button variant="secondary" size="sm" onClick={() => onPreview(site.id)}>
          Preview
        </Button>
        {/* Add other primary actions if necessary */}
      </CardFooter>
    </Card>
  );
};

export default SiteCard;
