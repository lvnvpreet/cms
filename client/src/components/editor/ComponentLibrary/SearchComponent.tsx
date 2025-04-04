import React, { useState, ChangeEvent } from 'react';
import { Input } from '@/components/ui/input'; // Assuming you have a reusable Input component
import { Search } from 'lucide-react'; // Using lucide-react for icons

interface SearchComponentProps {
  onSearch: (searchTerm: string) => void;
  initialValue?: string; // Optional initial value for the search
}

const SearchComponent: React.FC<SearchComponentProps> = ({ onSearch, initialValue = '' }) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);
    onSearch(newSearchTerm); // Call the callback function on every change
  };

  return (
    <div className="search-component relative">
      <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
      <Input
        type="text"
        placeholder="Search components..."
        value={searchTerm}
        onChange={handleChange}
        className="w-full p-1 pl-8 border border-gray-300 rounded" // Added padding-left for icon
      />
      {/* Add clear button or advanced search options later if needed */}
    </div>
  );
};

export default SearchComponent;
