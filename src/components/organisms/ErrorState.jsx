import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const ErrorState = ({ 
  message = 'Something went wrong', 
  onRetry, 
  className = '' 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center py-12 ${className}`}
    >
      <motion.div
        animate={{ 
          rotate: [0, -10, 10, -10, 0],
          transition: { duration: 0.5 }
        }}
        className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mb-4"
      >
        <ApperIcon name="AlertCircle" className="w-8 h-8 text-error" />
      </motion.div>
      
      <h3 className="text-lg font-medium text-surface-900 mb-2">
        Oops! Something went wrong
      </h3>
      
      <p className="text-surface-600 text-center mb-6 max-w-md">
        {message}
      </p>
      
      {onRetry && (
        <Button onClick={onRetry} icon="RefreshCw">
          Try Again
        </Button>
      )}
    </motion.div>
  );
};

export default ErrorState;