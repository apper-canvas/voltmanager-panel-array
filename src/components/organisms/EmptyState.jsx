import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const EmptyState = ({ 
  title = 'No items found', 
  description = 'Get started by adding your first item', 
  actionLabel = 'Add Item',
  onAction,
  icon = 'Package',
  className = '' 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`flex flex-col items-center justify-center py-12 ${className}`}
    >
      <motion.div
        animate={{ 
          y: [0, -10, 0],
          transition: { 
            duration: 3, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }
        }}
        className="w-16 h-16 bg-surface-100 rounded-full flex items-center justify-center mb-6"
      >
        <ApperIcon name={icon} className="w-8 h-8 text-surface-400" />
      </motion.div>
      
      <h3 className="text-lg font-medium text-surface-900 mb-2">
        {title}
      </h3>
      
      <p className="text-surface-600 text-center mb-6 max-w-md">
        {description}
      </p>
      
      {onAction && (
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button onClick={onAction} icon="Plus">
            {actionLabel}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default EmptyState;