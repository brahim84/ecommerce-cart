// *********************
// Role of the component: Section title that can be used on any page
// Name of the component: SectionTitle.tsx
// Developer: Rahim Basheer
// Version: 1.0
// Component call: <SectionTitle />
// Input parameters: {title: string; path: string}
// Output: div containing h1 for page title and p for page location path 
// *********************

const SectionTitle = ({ title, path }: { title: string; path: string }) => {
  return (
    <div className="relative mb-6 h-[120px] max-sm:h-[80px] flex flex-col items-center justify-center bg-gradient-to-l from-white to-blue-600">
      {/* Content */}
      <div className="text-center px-4">
        <h1 className="text-4xl font-extrabold text-white drop-shadow-sm max-md:text-4xl max-sm:text-3xl">
          {title}
        </h1>
        <p className="mt-3 text-lg font-medium text-white/90 max-sm:text-base">
          {path}
        </p>
      </div>
    </div>
  );
};

export default SectionTitle;
