import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  className = '', 
  hover = false, 
  clickable = false,
  onClick,
  ...props 
}) => {
  const baseClasses = 'bg-white rounded-lg shadow-sm border border-surface-200';
  const hoverClasses = hover || clickable 
    ? 'hover:shadow-md transition-shadow duration-200' 
    : '';
  const clickableClasses = clickable ? 'cursor-pointer' : '';
  
  const cardClasses = `${baseClasses} ${hoverClasses} ${clickableClasses} ${className}`;

  if (clickable || hover) {
    return (
      <motion.div
        whileHover={{ y: -2 }}
        className={cardClasses}
        onClick={onClick}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={cardClasses} onClick={onClick} {...props}>
      {children}
    </div>
  );
};

export default Card;