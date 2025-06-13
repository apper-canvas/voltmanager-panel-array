import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { productService } from '@/services';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';

const StockAlert = () => {
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [isVisible, setIsVisible] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLowStockProducts = async () => {
      try {
        const products = await productService.getLowStockProducts();
        setLowStockProducts(products);
      } catch (error) {
        console.error('Failed to load low stock products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLowStockProducts();
  }, []);

  if (loading || lowStockProducts.length === 0 || !isVisible) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="mb-6"
      >
        <Card className="border-l-4 border-l-warning bg-warning/5 p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-warning/20 rounded-lg">
                <ApperIcon name="AlertTriangle" className="w-5 h-5 text-warning" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-surface-900 mb-1">
                  Low Stock Alert
                </h3>
                <p className="text-sm text-surface-600 mb-3">
                  {lowStockProducts.length} product{lowStockProducts.length === 1 ? '' : 's'} running low on stock
                </p>
                <div className="space-y-2">
                  {lowStockProducts.slice(0, 3).map((product) => (
                    <div key={product.id} className="flex items-center justify-between text-sm">
                      <span className="text-surface-700">{product.name}</span>
                      <span className="text-warning font-medium">
                        {product.stock} left (min: {product.minStock})
                      </span>
                    </div>
                  ))}
                  {lowStockProducts.length > 3 && (
                    <p className="text-sm text-surface-500">
                      +{lowStockProducts.length - 3} more items
                    </p>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="text-surface-400 hover:text-surface-600 p-1"
            >
              <ApperIcon name="X" className="w-4 h-4" />
            </button>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export default StockAlert;