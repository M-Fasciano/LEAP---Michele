// CmsRenderer is a component that dynamically renders CMS modules based on their type
import { FC } from "react";
import HeroSection from "./HeroSection";
import FeatureGrid from "./FeatureGrid";
import ContactForm from "./ContactForm";
import { CmsProvider } from "./CmsContext";

// Interface representing a single CMS module
interface CmsModule {
  id: string; // Unique identifier for the module
  type: string; // Type of the module (e.g., 'hero', 'grid', 'form')
  attributes: unknown; // Additional attributes for the module
}

// Props for the CmsRenderer component
interface CmsRendererProps {
  modules: CmsModule[]; // Array of CMS modules to render
}

// CmsRenderer dynamically renders components based on the module type
const CmsRenderer: FC<CmsRendererProps> = ({ modules }) => {
  return (
    // Provide the modules to child components via CmsProvider context
    <CmsProvider value={modules}>
      {/* Iterate over each module and render the appropriate component based on its type */}
      {modules.map((module) => {
        if (module.type === "hero") {
          // Render HeroSection for 'hero' type modules
          return <HeroSection key={module.id} id={module.id} />;
        }
        if (module.type === "grid") {
          // Render FeatureGrid for 'grid' type modules
          return <FeatureGrid key={module.id} id={module.id} />;
        }
        if (module.type === "form") {
          // Render ContactForm for 'form' type modules
          return <ContactForm key={module.id} id={module.id} />;
        }
        // Add more module types here as needed
        return null; // Return null for unknown module types
      })}
    </CmsProvider>
  );
};

export default CmsRenderer;
