// Provides context and provider for CMS modules in the application
import { createContext, ReactNode } from "react";

// Interface representing a single CMS module
export interface CmsModule {
  id: string; // Unique identifier for the module
  type: string; // Type of the module (e.g., 'hero', 'feature-grid')
  attributes: unknown; // Module-specific attributes
}

// Type for the CMS context, which is an array of CmsModule
// Used to provide all CMS modules to the component tree
type CmsContextType = CmsModule[];

// Create a React context for CMS modules, defaulting to undefined
export const CmsContext = createContext<CmsContextType | undefined>(undefined);

// Provider component for CmsContext
// Wrap your component tree with this to provide CMS modules via context
export const CmsProvider = ({
  children,
  value,
}: {
  children: ReactNode;
  value: CmsContextType;
}) => <CmsContext.Provider value={value}>{children}</CmsContext.Provider>;
