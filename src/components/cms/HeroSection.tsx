// HeroSection component displays a hero banner with background image, overlay, and content from CMS
import { useCmsModule } from "@/hooks/useCmsModule.hooks";
import Image from "next/image";

// Type definition for the expected CMS attributes for the hero section
interface HeroAttributes {
  background: {
    type: string;
    imageUrl?: string; // Optional background image URL
    overlay: {
      color: string; // Overlay color (e.g., rgba or hex)
      enabled: boolean; // Whether overlay is shown
    };
  };
  content: {
    title: {
      text: string; // Main hero title text
      style: {
        fontSize: string;
        color: string;
        fontWeight: string;
      };
    };
    subtitle: {
      text: string; // Subtitle text
      style: {
        fontSize: string;
        color: string;
      };
    };
  };
}

// Main HeroSection component
const HeroSection = ({ id }: { id: string }) => {
  // Fetch CMS module data by id
  const cmsModule = useCmsModule(id);
  // If no module or wrong type, render nothing
  if (!cmsModule || cmsModule.type !== "hero") return null;
  // Destructure attributes from the CMS module
  const { attributes } = cmsModule as { attributes: HeroAttributes };
  const { background, content } = attributes;
  // Use provided image or fallback
  const bgImage = background.imageUrl || "/images/hero-bg.jpg";

  return (
    <section
      id={id}
      className="relative py-20 flex items-center justify-center"
    >
      {/* Background image and overlay */}
      <div className="absolute inset-0 z-0">
        {background.imageUrl && (
          <Image
            src={bgImage}
            alt="Hero Background"
            className="w-full h-full object-cover"
          />
        )}
        {background.overlay.enabled && (
          <div
            className="absolute inset-0"
            style={{ background: background.overlay.color }}
          />
        )}
      </div>
      {/* Foreground content: title, subtitle, button */}
      <div className="relative z-10 text-center px-4">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
          {content.title.text}
        </h1>
        <p className="text-2xl text-gray-100">{content.subtitle.text}</p>

        <button className="mt-8 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-300">
          Get Started
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
