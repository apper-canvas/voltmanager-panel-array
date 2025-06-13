import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Card from '@/components/atoms/Card';
import StatCard from '@/components/molecules/StatCard';
import SkeletonLoader from '@/components/organisms/SkeletonLoader';
import ErrorState from '@/components/organisms/ErrorState';
import ApperIcon from '@/components/ApperIcon';
import { productService, invoiceService, restockPredictionService } from '@/services';

const Analytics = () => {
  const [analytics, setAnalytics] = useState({});
  const [predictions, setPredictions] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [predictionsLoading, setPredictionsLoading] = useState(false);

  useEffect(() => {
    const loadAnalyticsData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const [productsResult, invoicesResult, predictionsResult] = await Promise.all([
          productService.getAll(),
          invoiceService.getAll(),
          restockPredictionService.getAll()
        ]);

        setProducts(productsResult);
        setPredictions(predictionsResult);

        // Calculate analytics
        const totalRevenue = invoicesResult.reduce((sum, invoice) => sum + invoice.total, 0);
        const totalCost = productsResult.reduce((sum, product) => sum + (product.cost * product.stock), 0);
        const totalValue = productsResult.reduce((sum, product) => sum + (product.price * product.stock), 0);
        const margin = totalRevenue > 0 ? ((totalRevenue - totalCost) / totalRevenue) * 100 : 0;

        // Top selling products (mock calculation based on invoices)
        const productSales = {};
        invoicesResult.forEach(invoice => {
          invoice.items.forEach(item => {
            productSales[item.productId] = (productSales[item.productId] || 0) + item.quantity;
          });
        });

        const topProducts = Object.entries(productSales)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 5)
          .map(([productId, quantity]) => {
            const product = productsResult.find(p => p.id === productId);
            return { product, quantity };
          });

        setAnalytics({
          totalRevenue,
          totalValue,
          margin,
          topProducts,
          lowStockCount: productsResult.filter(p => p.stock <= p.minStock).length,
          totalOrders: invoicesResult.length
        });

      } catch (err) {
        setError(err.message || 'Failed to load analytics data');
        toast.error('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    loadAnalyticsData();
  }, []);

  const generatePredictions = async () => {
    setPredictionsLoading(true);
    try {
      const newPredictions = await restockPredictionService.generatePredictions();
      setPredictions(newPredictions);
      toast.success('AI predictions updated successfully');
    } catch (err) {
      toast.error('Failed to generate predictions');
    } finally {
      setPredictionsLoading(false);
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'text-success bg-success/10';
    if (confidence >= 0.6) return 'text-warning bg-warning/10';
    return 'text-error bg-error/10';
  };

  const getConfidenceLabel = (confidence) => {
    if (confidence >= 0.8) return 'High';
    if (confidence >= 0.6) return 'Medium';
    return 'Low';
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-heading font-bold text-surface-900">Analytics</h1>
          <p className="text-surface-600">Business insights and AI-powered predictions</p>
        </div>
        <SkeletonLoader count={6} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState 
          message={error}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="p-6 max-w-full overflow-hidden">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-2xl font-heading font-bold text-surface-900">Analytics</h1>
          <p className="text-surface-600">Business insights and AI-powered predictions</p>
        </motion.div>

        {/* KPI Cards */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <StatCard
            title="Total Revenue"
            value={`$${analytics.totalRevenue?.toFixed(2) || '0.00'}`}
            change="+15.3% this month"
            icon="DollarSign"
            color="success"
            trend="up"
          />
          
          <StatCard
            title="Inventory Value"
            value={`$${analytics.totalValue?.toFixed(2) || '0.00'}`}
            change="Current stock value"
            icon="Package"
            color="primary"
            trend="neutral"
          />
          
          <StatCard
            title="Profit Margin"
            value={`${analytics.margin?.toFixed(1) || '0.0'}%`}
            change="+2.1% from last month"
            icon="TrendingUp"
            color="success"
            trend="up"
          />
          
          <StatCard
            title="Total Orders"
            value={analytics.totalOrders || 0}
            change="This month"
            icon="ShoppingCart"
            color="info"
            trend="up"
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Products */}
          <motion.div variants={itemVariants}>
            <Card className="p-6">
              <h3 className="text-lg font-heading font-semibold text-surface-900 mb-4">
                Top Selling Products
              </h3>
              <div className="space-y-4">
                {analytics.topProducts?.map((item, index) => (
                  <div key={item.product?.id || index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <span className="text-primary font-medium text-sm">#{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium text-surface-900">
                          {item.product?.name || 'Unknown Product'}
                        </p>
                        <p className="text-sm text-surface-500">
                          SKU: {item.product?.sku || 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-surface-900">{item.quantity} sold</p>
                      <p className="text-sm text-success">
                        ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                )) || (
                  <p className="text-surface-500 text-center py-8">No sales data available</p>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Stock Status */}
          <motion.div variants={itemVariants}>
            <Card className="p-6">
              <h3 className="text-lg font-heading font-semibold text-surface-900 mb-4">
                Stock Status Overview
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-success/5 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-success/20 rounded-lg flex items-center justify-center">
                      <ApperIcon name="CheckCircle" className="w-4 h-4 text-success" />
                    </div>
                    <span className="font-medium text-surface-900">Well Stocked</span>
                  </div>
                  <span className="text-success font-bold">
                    {products.filter(p => p.stock > p.minStock * 1.5).length}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-warning/5 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-warning/20 rounded-lg flex items-center justify-center">
                      <ApperIcon name="AlertTriangle" className="w-4 h-4 text-warning" />
                    </div>
                    <span className="font-medium text-surface-900">Low Stock</span>
                  </div>
                  <span className="text-warning font-bold">
                    {products.filter(p => p.stock <= p.minStock && p.stock > 0).length}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-error/5 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-error/20 rounded-lg flex items-center justify-center">
                      <ApperIcon name="XCircle" className="w-4 h-4 text-error" />
                    </div>
                    <span className="font-medium text-surface-900">Out of Stock</span>
                  </div>
                  <span className="text-error font-bold">
                    {products.filter(p => p.stock === 0).length}
                  </span>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* AI Predictions */}
        <motion.div variants={itemVariants}>
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-heading font-semibold text-surface-900">
                  AI Restock Predictions
                </h3>
                <p className="text-sm text-surface-600">
                  Based on 30-day sales trends and current stock levels
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={generatePredictions}
                disabled={predictionsLoading}
                className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {predictionsLoading ? (
                  <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
                )}
                Refresh Predictions
              </motion.button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-surface-200">
                    <th className="text-left py-3 font-medium text-surface-700">Product</th>
                    <th className="text-left py-3 font-medium text-surface-700">Current Stock</th>
                    <th className="text-left py-3 font-medium text-surface-700">Predicted Demand</th>
                    <th className="text-left py-3 font-medium text-surface-700">Suggested Order</th>
                    <th className="text-left py-3 font-medium text-surface-700">Confidence</th>
                    <th className="text-left py-3 font-medium text-surface-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {predictions.map((prediction) => {
                    const product = products.find(p => p.id === prediction.productId);
                    return (
                      <tr key={prediction.productId} className="border-b border-surface-100">
                        <td className="py-4">
                          <div>
                            <p className="font-medium text-surface-900">
                              {product?.name || 'Unknown Product'}
                            </p>
                            <p className="text-sm text-surface-500">
                              SKU: {product?.sku || 'N/A'}
                            </p>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                            prediction.currentStock <= (product?.minStock || 0)
                              ? 'bg-error/10 text-error'
                              : 'bg-success/10 text-success'
                          }`}>
                            {prediction.currentStock}
                          </span>
                        </td>
                        <td className="py-4 text-surface-700">
                          {prediction.predictedDemand}
                        </td>
                        <td className="py-4 text-surface-700 font-medium">
                          {prediction.suggestedOrder}
                        </td>
                        <td className="py-4">
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              getConfidenceColor(prediction.confidence)
                            }`}>
                              {getConfidenceLabel(prediction.confidence)}
                            </span>
                            <span className="text-sm text-surface-500">
                              {(prediction.confidence * 100).toFixed(0)}%
                            </span>
                          </div>
                        </td>
                        <td className="py-4">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-3 py-1 bg-primary text-white text-sm rounded hover:bg-primary/90 transition-colors"
                          >
                            Order Now
                          </motion.button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {predictions.length === 0 && (
                <div className="text-center py-8">
                  <ApperIcon name="TrendingUp" className="w-12 h-12 text-surface-300 mx-auto mb-2" />
                  <p className="text-surface-500">No predictions available</p>
                  <p className="text-sm text-surface-400">Click "Refresh Predictions" to generate AI insights</p>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Analytics;