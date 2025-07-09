const iconMap: Record<string, React.ReactNode> = {
  "icon-fast-performance": (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-8 w-8"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M13 10V3L4 14h7v7l9-11h-7z"
      />
    </svg>
  ),
  "icon-secure-platform": (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-8 w-8"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
      />
    </svg>
  ),
  "icon-scalable-solution": (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-8 w-8"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
      />
    </svg>
  ),
};

const bgColorMap: Record<string, string> = {
  "icon-fast-performance": "bg-blue-100 text-blue-600",
  "icon-secure-platform": "bg-green-100 text-green-600",
  "icon-scalable-solution": "bg-purple-100 text-purple-600",
};

export function getFeatureIcon(iconKey?: string): React.ReactNode {
  if (!iconKey) return null;
  return iconMap[iconKey] || null;
}

export function getFeatureBgColor(iconKey?: string): string {
  return (iconKey && bgColorMap[iconKey]) || "bg-gray-200 text-gray-600";
}
