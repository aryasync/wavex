import { ReactNode } from 'react';

/**
 * SectionCard Component
 * A reusable card component with a title and content area
 */
const SectionCard = ({ 
  title, 
  children, 
  className = "",
  titleClassName = "text-xl font-bold mb-6 text-left"
}) => {
  return (
    <div className={`${className} mb-6`}>
      <h3 className={titleClassName}>
        {title}
      </h3>
      {children}
    </div>
  );
};

export default SectionCard;
