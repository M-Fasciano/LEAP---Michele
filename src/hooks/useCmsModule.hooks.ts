import { CmsContext, CmsModule } from "@/components/cms/CmsContext";
import { useContext } from "react";

// Custom hook to retrieve a specific CMS module by its ID from the CmsContext
export const useCmsModule = (id: string): CmsModule | undefined => {
  // Access the CMS context which should provide an array of CmsModule objects
  const context = useContext(CmsContext);
  // Ensure the hook is used within a CmsProvider, otherwise throw an error
  if (!context)
    throw new Error("useCmsModule must be used within a CmsProvider");
  // Find and return the module with the matching ID, or undefined if not found
  return context.find((module) => module.id === id);
};
