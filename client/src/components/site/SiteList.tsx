import React, { useState } from 'react';
import SiteCard from './SiteCard'; // Import the SiteCard component
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { LayoutGrid, List } from 'lucide-react';
import { Spinner } from '@/components/core/Spinner'; // Assuming a Spinner component exists
import { Site } from '@/types'; // Import Site type from central types file

// Define the props for the SiteList component
interface SiteListProps {
  sites: Site[];
  isLoading: boolean;
  error?: string | null;
  onEditSite: (id: string) => void;
  onPreviewSite: (id: string) => void;
  onPublishSite: (id: string) => void;
  onDeleteSite: (id: string) => void;
  onCreateNewSite: () => void;
  // Add handlers for bulk actions, pagination changes etc. if needed
}

const SiteList: React.FC<SiteListProps> = ({
  sites,
  isLoading,
  error,
  onEditSite,
  onPreviewSite,
  onPublishSite,
  onDeleteSite,
  onCreateNewSite,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('lastModified'); // Default sort
  const [filterStatus, setFilterStatus] = useState('all'); // Default filter
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid'); // Default view
  const [selectedSites, setSelectedSites] = useState<string[]>([]); // For bulk actions

  // --- Filtering and Sorting Logic (Basic Implementation) ---
  const filteredAndSortedSites = sites
    .filter(site => {
      // Search filter
      const matchesSearch = site.name.toLowerCase().includes(searchTerm.toLowerCase());
      // Status filter
      const matchesStatus = filterStatus === 'all' || site.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      // Sorting logic
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'createdAt') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy === 'lastModified') {
        return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime();
      }
      return 0; // Default: no specific sort order if sortBy is unknown
    });

  // --- Selection Logic ---
  const handleSelectSite = (id: string) => {
    setSelectedSites(prevSelected =>
      prevSelected.includes(id)
        ? prevSelected.filter(siteId => siteId !== id)
        : [...prevSelected, id]
    );
  };

  const isSiteSelected = (id: string) => selectedSites.includes(id);

  // --- Render Logic ---
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" /> {/* Use your Spinner component */}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600 text-center p-4">Error loading sites: {error}</div>;
  }

  if (!isLoading && sites.length === 0) {
    return (
      <div className="text-center p-10 border border-dashed rounded-lg">
        <h3 className="text-xl font-semibold mb-2">No Sites Yet</h3>
        <p className="text-muted-foreground mb-4">Get started by creating your first website.</p>
        <Button onClick={onCreateNewSite}>Create New Site</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toolbar: Search, Filter, Sort, View Toggle, Create Button */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 p-4 border rounded-lg bg-card">
        <Input
          placeholder="Search sites..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
        />
        <div className="flex flex-wrap gap-2">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lastModified">Last Modified</SelectItem>
              <SelectItem value="createdAt">Created Date</SelectItem>
              <SelectItem value="name">Name</SelectItem>
            </SelectContent>
          </Select>
          <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as 'grid' | 'list')} variant="outline">
            <ToggleGroupItem value="grid" aria-label="Grid view">
              <LayoutGrid className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="list" aria-label="List view">
              <List className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
         <Button onClick={onCreateNewSite} className="md:ml-auto">Create New Site</Button>
      </div>

       {/* Bulk Actions (Placeholder) */}
       {selectedSites.length > 0 && (
        <div className="p-2 border rounded-lg bg-secondary text-secondary-foreground flex items-center gap-2">
          <span>{selectedSites.length} selected</span>
          <Button variant="outline" size="sm">Delete Selected</Button>
          {/* Add other bulk actions */}
        </div>
      )}

      {/* Site Cards Grid/List */}
      {filteredAndSortedSites.length > 0 ? (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4' // Basic list layout, refine as needed
          }
        >
          {filteredAndSortedSites.map((site) => (
            <SiteCard
              key={site.id}
              site={site}
              isSelected={isSiteSelected(site.id)}
              onSelect={handleSelectSite} // Pass selection handler
              onEdit={onEditSite}
              onPreview={onPreviewSite}
              onPublish={onPublishSite}
              onDelete={onDeleteSite}
            />
          ))}
        </div>
      ) : (
         <div className="text-center p-10 border border-dashed rounded-lg">
            <h3 className="text-xl font-semibold mb-2">No Matching Sites</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters.</p>
         </div>
      )}

      {/* Pagination (Placeholder) */}
      {/* Implement pagination controls here if needed */}
      {/* Example: <Pagination totalItems={totalSiteCount} itemsPerPage={itemsPerPage} currentPage={currentPage} onPageChange={handlePageChange} /> */}

    </div>
  );
};

export default SiteList;
