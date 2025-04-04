import React, { useRef } from 'react'; // Import useRef
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useDrag } from 'react-dnd'; // Import useDrag
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge'; // Import Badge component
import { Star, Eye, CheckCircle, Clock } from 'lucide-react'; // Example icons
import { Template, ItemTypes } from '@/types'; // Import the shared Template type and ItemTypes

interface TemplateCardProps {
  template: Template;
  layout?: 'grid' | 'list' | 'compact'; // Optional layout prop
  onApply: (id: string) => void;
  onPreview: (id: string) => void;
  onFavorite: (id: string) => void; // Assuming a favorite mechanism
  isFavorited?: boolean; // Add isFavorited prop
}

const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  layout = 'grid', // Default layout
  onApply,
  onPreview,
  onFavorite,
  isFavorited = false, // Default to false
}) => {
  // --- Drag Hook ---
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.TEMPLATE,
    item: { template }, // Pass the whole template object
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));
  const dragRef = useRef<HTMLDivElement>(null); // Create a ref
  drag(dragRef); // Connect the drag source to the ref

  // Basic styling - adjust based on actual layout needs
  // Note: Opacity is applied to the wrapper div below
  const cardWrapperClasses = `
    cursor-grab
    ${layout === 'list' ? 'flex items-center' : ''}
    ${layout === 'compact' ? 'p-2' : 'p-4'}
  `; // Classes for the draggable wrapper

  const cardInnerClasses = `
    border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 h-full w-full
  `; // Classes for the inner Card component

  const previewClasses = `
    bg-gray-200
    ${layout === 'grid' ? 'h-40 w-full' : ''}
    ${layout === 'list' ? 'h-24 w-32 mr-4 flex-shrink-0' : ''}
    ${layout === 'compact' ? 'h-16 w-16 mr-2 flex-shrink-0' : ''}
    flex items-center justify-center text-gray-500
  `; // Placeholder for image/preview

  // Apply the dragRef to the wrapper div
  return (
    <div
      ref={dragRef} // Assign the ref here
      className={cardWrapperClasses}
      style={{ opacity: isDragging ? 0.5 : 1 }} // Apply opacity to the wrapper
    >
      <Card className={cardInnerClasses}> {/* Card itself doesn't need drag classes */}
        {/* Visual Preview Placeholder */}
        <div className={previewClasses}>
          {template.previewImageUrl ? (
            <img src={template.previewImageUrl} alt={`${template.name} preview`} className="object-cover h-full w-full" />
          ) : (
            <span>Preview</span>
          )}
        </div>

        <div className={`flex-grow ${layout !== 'list' ? 'mt-4' : ''} ${layout === 'compact' ? '' : 'p-4'}`}> {/* Adjust padding for non-compact */}
          <CardHeader className={`p-0 ${layout !== 'compact' ? 'pb-2' : ''}`}>
            <div className="flex items-center justify-between">
               <CardTitle className={`text-lg font-semibold ${layout === 'compact' ? 'text-base' : ''}`}>{template.name}</CardTitle>
               {template.status && layout !== 'compact' && (
                 <Badge variant="secondary" className="ml-2 capitalize">{template.status}</Badge>
               )}
            </div>
            {layout !== 'compact' && <CardDescription className="text-sm text-gray-600 mt-1">{template.description}</CardDescription>}
          </CardHeader>

          {layout !== 'compact' && (
            <CardContent className="text-sm space-y-2 p-0 pt-2 pb-4"> {/* Adjust padding */}
              <div className="flex items-center justify-between text-gray-500">
                <span>Category: {template.category}</span>
                <div className="flex items-center space-x-2">
                  <Star size={16} className="text-yellow-500" />
                  <span>{template.rating.toFixed(1)} ({template.popularity} uses)</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-gray-500">
                 <span className="flex items-center"><Clock size={14} className="mr-1" /> {template.estimatedTime}</span>
                 <span>Complexity: {template.complexity}</span>
              </div>
            </CardContent>
          )}

          <CardFooter className={`flex p-0 ${layout === 'compact' ? 'mt-2' : 'space-x-2 pt-4'} justify-end`}> {/* Adjust padding */}
            <Button variant="outline" size={layout === 'compact' ? 'sm' : 'default'} onClick={() => onPreview(template.id)} title="Preview" aria-label="Preview Template">
              <Eye size={16} />
              {layout !== 'compact' && <span className="ml-1">Preview</span>}
            </Button>
            <Button variant="outline" size={layout === 'compact' ? 'sm' : 'default'} onClick={() => onFavorite(template.id)} title={isFavorited ? "Remove from Favorites" : "Add to Favorites"} aria-label={isFavorited ? "Remove from Favorites" : "Add to Favorites"}>
              <Star size={16} fill={isFavorited ? 'currentColor' : 'none'} className={isFavorited ? 'text-yellow-500' : ''} />
            </Button>
            <Button size={layout === 'compact' ? 'sm' : 'default'} onClick={() => onApply(template.id)} title="Apply" aria-label="Apply Template">
              <CheckCircle size={16} />
              {layout !== 'compact' && <span className="ml-1">Apply</span>}
            </Button>
          </CardFooter>
        </div>
      </Card>
    </div>
  );
};

export default TemplateCard;
