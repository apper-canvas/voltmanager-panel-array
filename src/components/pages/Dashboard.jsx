import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import StatCard from '@/components/molecules/StatCard';
import StockAlert from '@/components/organisms/StockAlert';
import SkeletonLoader from '@/components/organisms/SkeletonLoader';
import ErrorState from '@/components/organisms/ErrorState';
import { productService, invoiceService, repairOrderService } from '@/services';

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const [products, invoices, repairOrders] = await Promise.all([
          productService.getAll(),
          invoiceService.getAll(),
          repairOrderService.getPendingOrders()
        ]);

        const todayRevenue = await invoiceService.getTodaysRevenue();
        const lowStockCount = products.filter(p => p.stock <= p.minStock).length;

        setStats({
          todayRevenue,
          totalProducts: products.length,
          lowStockCount,
          pendingOrders: repairOrders.length
        });
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data');
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-heading font-bold text-surface-900">Dashboard</h1>
          <p className="text-surface-600">Welcome back! Here's what's happening in your shop.</p>
        </div>
        <SkeletonLoader count={4} />
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
          <h1 className="text-2xl font-heading font-bold text-surface-900">Dashboard</h1>
          <p className="text-surface-600">Welcome back! Here's what's happening in your shop.</p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <StockAlert />
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <StatCard
            title="Today's Revenue"
            value={`$${stats.todayRevenue?.toFixed(2) || '0.00'}`}
            change="+12.5% from yesterday"
            icon="DollarSign"
            color="success"
            trend="up"
          />
          
          <StatCard
            title="Total Products"
            value={stats.totalProducts || 0}
            change="5 added this week"
            icon="Package"
            color="primary"
            trend="up"
          />
          
          <StatCard
            title="Low Stock Items"
            value={stats.lowStockCount || 0}
            change={stats.lowStockCount > 0 ? "Needs attention" : "All good"}
            icon="AlertTriangle"
            color={stats.lowStockCount > 0 ? "warning" : "success"}
            trend={stats.lowStockCount > 0 ? "down" : "neutral"}
          />
          
          <StatCard
            title="Pending Orders"
            value={stats.pendingOrders || 0}
            change="2 due today"
            icon="Clock"
            color="warning"
            trend="neutral"
          />
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-6">
            <h3 className="text-lg font-heading font-semibold text-surface-900 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button className="w-full flex items-center p-3 text-left rounded-lg border border-surface-200 hover:bg-surface-50 transition-colors">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-primary">📦</span>
                </div>
                <div>
                  <p className="font-medium text-surface-900">Add New Product</p>
                  <p className="text-sm text-surface-500">Expand your inventory</p>
                </div>
              </button>
              
              <button className="w-full flex items-center p-3 text-left rounded-lg border border-surface-200 hover:bg-surface-50 transition-colors">
                <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-success">💳</span>
                </div>
                <div>
                  <p className="font-medium text-surface-900">Process Sale</p>
                  <p className="text-sm text-surface-500">Quick POS transaction</p>
                </div>
              </button>
              
              <button className="w-full flex items-center p-3 text-left rounded-lg border border-surface-200 hover:bg-surface-50 transition-colors">
                <div className="w-8 h-8 bg-warning/10 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-warning">🔧</span>
                </div>
                <div>
                  <p className="font-medium text-surface-900">Create Repair Order</p>
                  <p className="text-sm text-surface-500">Schedule service work</p>
                </div>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-6">
            <h3 className="text-lg font-heading font-semibold text-surface-900 mb-4">
              Recent Activity
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-success rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-surface-900">Sale completed</p>
                  <p className="text-xs text-surface-500">Invoice #INV-001 - $72.90</p>
                  <p className="text-xs text-surface-400">2 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-surface-900">Stock updated</p>
                  <p className="text-xs text-surface-500">LED Bulb 9W restocked</p>
                  <p className="text-xs text-surface-400">4 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-warning rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-surface-900">Repair order created</p>
                  <p className="text-xs text-surface-500">RO-001 - Motor repair</p>
                  <p className="text-xs text-surface-400">6 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard;