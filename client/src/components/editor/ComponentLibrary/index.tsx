import React, { useState } from 'react';
import ComponentCategory from './ComponentCategory';
import ComponentPreview from './ComponentPreview';
import SearchComponent from './SearchComponent';

// Define basic types here for now (consider moving to types.ts later)
interface ComponentData {
  id: string;
  name: string;
  description: string;
  category: string;
  type: string; // Crucial for drag-and-drop identification
}

interface Category {
  name: string;
  count?: number;
}


interface ComponentLibraryProps {
  // Define props if needed, e.g., configuration, available components
}

const ComponentLibrary: React.FC<ComponentLibraryProps> = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  // Add state for view mode, favorites, etc. as needed

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    // Implement search logic
  };

  const handleSelectCategory = (category: string | null) => {
    setSelectedCategory(category);
    // Implement category filtering logic
  };

  // Placeholder for component data - replace with actual data fetching/management
  // TODO: Fetch this from a registry or configuration
  const components: ComponentData[] = [
    { id: '1', name: 'Button', category: 'Core', description: 'A standard button', type: 'Button' },
    { id: '2', name: 'Card', category: 'Core', description: 'Displays content in a card', type: 'Card' },
    { id: '3', name: 'Input', category: 'Form', description: 'A text input field', type: 'Input' },
    { id: '4', name: 'Checkbox', category: 'Form', description: 'A checkbox input', type: 'Checkbox' },
    { id: '5', name: 'Container', category: 'Layout', description: 'A basic layout container', type: 'Container' },
    { id: '6', name: 'Heading', category: 'Core', description: 'A text heading', type: 'Heading' },
  ];

  const filteredComponents = components.filter((comp: ComponentData) => {
    const matchesSearch = comp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          comp.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || comp.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate category counts (example)
  const categoryCounts = components.reduce((acc, comp) => {
    acc[comp.category] = (acc[comp.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Placeholder for categories - replace with actual category data
  const categories: Category[] = [
    { name: 'Core', count: categoryCounts['Core'] || 0 },
    { name: 'Form', count: categoryCounts['Form'] || 0 },
    { name: 'Layout', count: categoryCounts['Layout'] || 0 },
  ];


  return (
    <div className="component-library-panel h-full flex flex-col bg-gray-100 border-l border-gray-300">
      <div className="p-2 border-b border-gray-300">
        <h2 className="text-lg font-semibold mb-2">Component Library</h2>
        <SearchComponent onSearch={handleSearch} initialValue={searchTerm} />
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Category Section */}
        <div className="w-1/4 p-2 border-r border-gray-300 overflow-y-auto">
          <ComponentCategory
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={handleSelectCategory}
          />
        </div>

        {/* Component List/Preview Section */}
        <div className="w-3/4 p-2 overflow-y-auto">
          {/* <h3 className="text-md font-semibold mb-2">Components</h3> */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2"> {/* Responsive grid */}
            {filteredComponents.length > 0 ? (
              filteredComponents.map(comp => (
                <ComponentPreview key={comp.id} component={comp} />
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500 mt-4">No components found.</p>
            )}
          </div>
        </div>
      </div>

      {/* Optional Footer for settings, view modes etc. */}
      {/* <div className="p-2 border-t border-gray-300">
        Footer/Settings
      </div> */}
    </div>
  );
};

export default ComponentLibrary;
