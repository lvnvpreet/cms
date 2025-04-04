import React from 'react';

interface Category {
  name: string;
  count?: number; // Optional: show component count per category
  // Add support for nested categories if needed
  // children?: Category[];
}

interface ComponentCategoryProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

const ComponentCategory: React.FC<ComponentCategoryProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  // Add 'All' category for clearing the filter
  const allCategories = [{ name: 'All' }, ...categories];

  return (
    <div className="component-category">
      <h3 className="text-md font-semibold mb-2">Categories</h3>
      <ul>
        {allCategories.map((cat) => (
          <li
            key={cat.name}
            className={`cursor-pointer p-1 rounded mb-1 flex justify-between items-center ${
              selectedCategory === (cat.name === 'All' ? null : cat.name)
                ? 'bg-blue-200 font-semibold'
                : 'hover:bg-gray-200'
            }`}
            onClick={() => onSelectCategory(cat.name === 'All' ? null : cat.name)}
          >
            <span>{cat.name}</span>
            {cat.count !== undefined && (
              <span className="text-xs bg-gray-300 rounded-full px-1.5 py-0.5">
                {cat.count}
              </span>
            )}
          </li>
          // Add logic here to render nested categories if implemented
        ))}
      </ul>
    </div>
  );
};

export default ComponentCategory;
