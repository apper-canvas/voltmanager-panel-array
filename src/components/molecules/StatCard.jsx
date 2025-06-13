import { motion } from 'framer-motion';
import Card from '@/components/atoms/Card';
import ApperIcon from '@/components/ApperIcon';

const StatCard = ({ 
  title, 
  value, 
  change, 
  icon, 
  color = 'primary',
  trend = 'up',
  loading = false 
}) => {
  const colorClasses = {
    primary: 'text-primary bg-primary/10',
    success: 'text-success bg-success/10',
    warning: 'text-warning bg-warning/10',
    error: 'text-error bg-error/10'
  };

  const trendClasses = {
    up: 'text-success',
    down: 'text-error',
    neutral: 'text-surface-500'
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-2">
            <div className="h-4 bg-surface-200 rounded w-1/2"></div>
            <div className="w-8 h-8 bg-surface-200 rounded-lg"></div>
          </div>
          <div className="h-8 bg-surface-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-surface-200 rounded w-1/3"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card hover className="p-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-surface-600">{title}</h3>
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <ApperIcon name={icon} className="w-4 h-4" />
        </div>
      </div>
      
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="text-2xl font-bold text-surface-900 mb-1"
      >
        {value}
      </motion.div>
      
      {change && (
        <div className={`flex items-center text-sm ${trendClasses[trend]}`}>
          <ApperIcon 
            name={trend === 'up' ? 'TrendingUp' : trend === 'down' ? 'TrendingDown' : 'Minus'} 
            className="w-3 h-3 mr-1" 
          />
          {change}
        </div>
      )}
    </Card>
  );
};

export default StatCard;