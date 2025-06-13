import { motion } from 'framer-motion';

const StockIndicator = ({ current, minimum, className = '' }) => {
  const percentage = Math.min((current / (minimum * 2)) * 100, 100);
  
  const getColor = () => {
    if (current <= minimum) return 'bg-error';
    if (current <= minimum * 1.5) return 'bg-warning';
    return 'bg-success';
  };

  const getTextColor = () => {
    if (current <= minimum) return 'text-error';
    if (current <= minimum * 1.5) return 'text-warning';
    return 'text-success';
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="flex-1 bg-surface-200 rounded-full h-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`h-2 rounded-full ${getColor()}`}
        />
      </div>
      <span className={`text-sm font-medium ${getTextColor()}`}>
        {current}
      </span>
    </div>
  );
};

export default StockIndicator;