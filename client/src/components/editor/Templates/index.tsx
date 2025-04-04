import React, { useState, useMemo, useEffect } from 'react';
// Correctly import the default exports from their respective files
import TemplateCard from './TemplateCard';
import TemplatePreview from './TemplatePreview';
import TemplateImporter from './TemplateImporter';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Search } from 'lucide-react';
import { Template } from '@/types'; // Import the shared Template type

// Placeholder Data (Replace with actual data fetching/management)
const initialTemplates: Template[] = [
  { id: 't1', name: 'Landing Page Hero', description: 'A modern hero section for landing pages.', category: 'Section', tags: ['hero', 'modern', 'landing'], complexity: 'low', estimatedTime: '5 mins', popularity: 150, rating: 4.5, previewImageUrl: '/placeholder-hero.png', source: 'built-in', status: 'featured' },
  { id: 't2', name: 'Product Feature Grid', description: 'Showcase product features effectively.', category: 'Section', tags: ['features', 'grid', 'product'], complexity: 'medium', estimatedTime: '15 mins', popularity: 95, rating: 4.2, previewImageUrl: '/placeholder-features.png', source: 'built-in' },
  { id: 't3', name: 'Full E-commerce Homepage', description: 'A complete homepage template for online stores.', category: 'Page', tags: ['ecommerce', 'store', 'full-page'], complexity: 'high', estimatedTime: '1 hour', popularity: 210, rating: 4.8, previewImageUrl: '/placeholder-ecommerce.png', source: 'built-in', status: 'popular' },
  { id: 't4', name: 'Simple Blog Post Layout', description: 'A clean layout for blog content.', category: 'Page', tags: ['blog', 'minimal', 'content'], complexity: 'low', estimatedTime: '10 mins', popularity: 120, rating: 4.0, previewImageUrl: '/placeholder-blog.png', source: 'built-in' },
  // Add more templates...
];

const TemplatesInterface: React.FC = () => {
  const [allTemplates, setAllTemplates] = useState<Template[]>(initialTemplates);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTemplateForPreview, setSelectedTemplateForPreview] = useState<Template | null>(null);
  const [showImporter, setShowImporter] = useState(false);
  const [favoriteTemplateIds, setFavoriteTemplateIds] = useState<Set<string>>(new Set(['t3'])); // Example favorite

  // --- Filtering Logic ---
  const categories = useMemo(() => {
    const cats = new Set(allTemplates.map(t => t.category));
    return ['all', ...Array.from(cats)];
  }, [allTemplates]);

  const filteredTemplates = useMemo(() => {
    return allTemplates.filter(template => {
      const matchesSearch = searchTerm === '' ||
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [allTemplates, searchTerm, selectedCategory]);

  // --- Handlers ---
  const handlePreview = (id: string) => {
    const template = allTemplates.find(t => t.id === id);
    setSelectedTemplateForPreview(template || null);
  };

  const handleClosePreview = () => {
    setSelectedTemplateForPreview(null);
  };

  const handleApply = (templateId: string, customizations?: any) => {
    console.log(`Applying template ${templateId} with customizations:`, customizations);
    // TODO: Implement actual template application logic
    // This would likely involve interacting with the editor state/canvas
    alert(`Template ${templateId} applied (placeholder)!`);
    handleClosePreview(); // Close preview after applying
  };

  const handleFavorite = (id: string) => {
    setFavoriteTemplateIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleOpenImporter = () => {
    setShowImporter(true);
  };

  const handleCloseImporter = () => {
    setShowImporter(false);
  };

  const handleImportComplete = (importedTemplates: Template[]) => {
     console.log('Imported templates:', importedTemplates);
     // Add imported templates to the main list (ensure unique IDs if necessary)
     setAllTemplates(prev => [...prev, ...importedTemplates.map(t => ({...t, source: t.source || 'custom'} as Template))]); // Mark as custom if source not set
     handleCloseImporter();
     // Optionally show a success message
  };

  // TODO: Add logic for recently used templates

  return (
    <div className="p-4 md:p-6 h-full flex flex-col">
      {/* Header: Title, Search, Filters, Import */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-4 md:mb-6 gap-4">
        <h1 className="text-2xl font-semibold">Templates</h1>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0 md:w-64">
             <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
             <Input
               type="search"
               placeholder="Search templates..."
               className="pl-8 w-full"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat} className="capitalize">{cat === 'all' ? 'All Categories' : cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleOpenImporter}>
            <PlusCircle className="mr-2 h-4 w-4" /> Import
          </Button>
        </div>
      </div>

      {/* TODO: Add section for Favorites / Recently Used */}

      {/* Template Grid */}
      <div className="flex-grow overflow-y-auto">
        {filteredTemplates.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {filteredTemplates.map(template => (
              <TemplateCard
                key={template.id}
                template={template}
                onPreview={handlePreview}
                onApply={(id: string) => handleApply(id)} // Add explicit type for id
                onFavorite={handleFavorite}
                isFavorited={favoriteTemplateIds.has(template.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground mt-10">
            No templates found matching your criteria.
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedTemplateForPreview && (
        <TemplatePreview
          template={selectedTemplateForPreview}
          onClose={handleClosePreview}
          onApply={handleApply}
        />
      )}
      {showImporter && (
        <TemplateImporter
          onClose={handleCloseImporter}
          onImportComplete={handleImportComplete}
        />
      )}
    </div>
  );
};

export default TemplatesInterface;
