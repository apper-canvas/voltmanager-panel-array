import { motion } from 'framer-motion';

const SkeletonLoader = ({ count = 3, type = 'card' }) => {
  const skeletonVariants = {
    pulse: {
      opacity: [0.6, 1, 0.6],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  if (type === 'table') {
    return (
      <div className="space-y-4">
        {[...Array(count)].map((_, i) => (
          <motion.div
            key={i}
            variants={skeletonVariants}
            animate="pulse"
            className="bg-white p-4 rounded-lg shadow-sm"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-surface-200 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-surface-200 rounded w-3/4"></div>
                <div className="h-3 bg-surface-200 rounded w-1/2"></div>
              </div>
              <div className="w-20 h-6 bg-surface-200 rounded"></div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          variants={skeletonVariants}
          animate="pulse"
          className="bg-white p-6 rounded-lg shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="h-4 bg-surface-200 rounded w-1/2"></div>
            <div className="w-8 h-8 bg-surface-200 rounded-lg"></div>
          </div>
          <div className="h-8 bg-surface-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-surface-200 rounded w-1/3"></div>
        </motion.div>
      ))}
    </div>
  );
};

export default SkeletonLoader;