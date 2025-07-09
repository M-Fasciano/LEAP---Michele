// FeatureGrid component displays a grid of feature items using CMS data
import { useCmsModule } from "@/hooks/useCmsModule.hooks";
import {
  getFeatureIcon, // Helper to get the icon component for a feature
  getFeatureBgColor, // Helper to get the background color class for a feature icon
} from "../../helpers/featureHelpers";

// Interface for a single feature item
export interface FeatureItem {
  id: string;
  content: {
    title: string; // Title of the feature
    description: string; // Description of the feature
    alignment?: string; // Optional alignment property
    icon?: string; // Optional icon identifier
  };
}

// Interface for the attributes of the feature grid
interface FeatureGridAttributes {
  title?: string; // Optional title for the grid
  items: FeatureItem[]; // Array of feature items
}

// Main FeatureGrid component
const FeatureGrid = ({ id }: { id: string }) => {
  // Fetch the CMS module data using the provided id
  const cmsModule = useCmsModule(id);
  // If the module is not found or is not of type 'grid', render nothing
  if (!cmsModule || cmsModule.type !== "grid") return null;
  // Extract attributes from the CMS module
  const { attributes } = cmsModule as { attributes: FeatureGridAttributes };
  // Destructure title and items, with a default title
  const { title = "Our Features", items } = attributes;

  return (
    // Section for the feature grid
    <section id="feature-grid" className="py-16 px-4 md:px-10 bg-gray-50">
      <div className="container mx-auto">
        {/* Grid title */}
        <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>
        {/* Feature items grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white p-8 rounded-lg shadow-md text-center"
            >
              {/* Icon with background color */}
              <div
                className={`${getFeatureBgColor(
                  item.content.icon
                )} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}
              >
                {getFeatureIcon(item.content.icon)}
              </div>
              {/* Feature title */}
              <h3 className="text-xl font-semibold mb-2">
                {item.content.title}
              </h3>
              {/* Feature description */}
              <p className="text-gray-600">{item.content.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureGrid;
