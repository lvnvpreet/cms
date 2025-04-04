import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Spinner } from '@/components/core/Spinner';
import { Template } from '@/types'; // Import the Template type
// import { fetchTemplates } from '@/services/templateService'; // Placeholder

// Mock template data
const mockTemplates: Template[] = [
  {
    id: 'tmpl-1',
    name: 'Modern Portfolio',
    description: 'A sleek template for showcasing creative work.',
    category: 'Portfolio',
    tags: ['minimal', 'creative', 'photography'],
    previewImageUrl: '/template-previews/modern-portfolio.jpg',
    complexity: 'medium',
    estimatedTime: '15 mins',
    popularity: 150,
    rating: 4.5,
    status: 'popular',
    source: 'built-in',
  },
  {
    id: 'tmpl-2',
    name: 'Simple Blog',
    description: 'A clean and straightforward blog layout.',
    category: 'Blog',
    tags: ['minimal', 'content', 'personal'],
    previewImageUrl: '/template-previews/simple-blog.jpg',
    complexity: 'low',
    estimatedTime: '5 mins',
    popularity: 200,
    rating: 4.0,
    status: 'new',
    source: 'built-in',
  },
  {
    id: 'tmpl-3',
    name: 'E-commerce Storefront',
    description: 'Feature-rich template for online stores.',
    category: 'E-commerce',
    tags: ['store', 'products', 'business'],
    previewImageUrl: '/template-previews/ecommerce-store.jpg',
    complexity: 'high',
    estimatedTime: '1 hour',
    popularity: 80,
    rating: 4.8,
    status: 'featured',
    source: 'built-in',
  },
  // Add more mock templates as needed
];

const TemplatesPage: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');

  useEffect(() => {
    const loadTemplates = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Replace with actual API call
        // const data = await fetchTemplates();
        await new Promise(resolve => setTimeout(resolve, 600)); // Simulate delay
        setTemplates(mockTemplates);
      } catch (err) {
        console.error('Failed to load templates:', err);
        setError('Failed to load templates.');
      } finally {
        setIsLoading(false);
      }
    };
    loadTemplates();
  }, []);

  // --- Filtering and Sorting Logic ---
  const filteredAndSortedTemplates = templates
    .filter(template => {
      const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           template.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || template.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'rating') {
        return b.rating - a.rating;
      } else if (sortBy === 'popularity') {
        return b.popularity - a.popularity;
      }
      // Add more sort options if needed (e.g., complexity, date added)
      return 0;
    });

  // --- Render Logic ---
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Choose a Template</h1>

      {/* Toolbar: Search, Filter, Sort */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 p-4 border rounded-lg bg-card mb-8">
        <Input
          placeholder="Search templates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
        />
        <div className="flex flex-wrap gap-2">
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {/* Dynamically generate categories from loaded templates */}
              {[...new Set(mockTemplates.map(t => t.category))].map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popularity">Popularity</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              {/* Add more sort options */}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
          <p className="ml-4">Loading Templates...</p>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="text-red-500 text-center py-10">{error}</div>
      )}

      {/* Empty State (after loading, no results) */}
      {!isLoading && !error && filteredAndSortedTemplates.length === 0 && (
        <div className="text-center py-10 border border-dashed rounded-lg">
          <h3 className="text-xl font-semibold mb-2">No Matching Templates Found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters.</p>
        </div>
      )}

      {/* Template Gallery */}
      {!isLoading && !error && filteredAndSortedTemplates.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedTemplates.map((template) => (
            <Card key={template.id} className="overflow-hidden flex flex-col">
              <div className="h-40 bg-muted flex items-center justify-center">
                {/* Placeholder for preview image */}
                {template.previewImageUrl ? (
                   <img src={template.previewImageUrl} alt={template.name} className="object-cover h-full w-full" />
                ) : (
                  <span className="text-sm text-muted-foreground">No Preview</span>
                )}
              </div>
              <CardHeader>
                <CardTitle>{template.name}</CardTitle>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-end">
                {/* Add more details like tags, rating etc. if needed */}
                <div className="mt-4 flex justify-between items-center">
                   {/* Placeholder: Link to preview the template */}
                   <Button variant="outline" size="sm">Preview</Button>
                   {/* Placeholder: Button to select/use the template */}
                   <Button size="sm" asChild>
                     {/* Link to editor, potentially passing template ID */}
                     <Link to={`/editor/new?template=${template.id}`}>Use Template</Link>
                   </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Placeholder for community templates, custom templates, import/export */}
      <section className="mt-12 text-center">
         <p className="text-muted-foreground">[Community Templates / Custom Templates Section Placeholder]</p>
         {/* <Button variant="secondary">Browse Community Templates</Button> */}
         {/* <Button variant="secondary" className="ml-2">Upload Custom Template</Button> */}
      </section>
    </div>
  );
};

export default TemplatesPage;
