import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import SearchBar from '@/components/molecules/SearchBar';
import SkeletonLoader from '@/components/organisms/SkeletonLoader';
import ErrorState from '@/components/organisms/ErrorState';
import EmptyState from '@/components/organisms/EmptyState';
import ApperIcon from '@/components/ApperIcon';
import { invoiceService, repairOrderService } from '@/services';

const Orders = () => {
  const [activeTab, setActiveTab] = useState('invoices');
  const [invoices, setInvoices] = useState([]);
  const [repairOrders, setRepairOrders] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [filteredRepairOrders, setFilteredRepairOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const [invoicesResult, repairOrdersResult] = await Promise.all([
          invoiceService.getAll(),
          repairOrderService.getAll()
        ]);
        
        setInvoices(invoicesResult);
        setRepairOrders(repairOrdersResult);
        setFilteredInvoices(invoicesResult);
        setFilteredRepairOrders(repairOrdersResult);
      } catch (err) {
        setError(err.message || 'Failed to load orders');
        toast.error('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleInvoiceSearch = async (query) => {
    if (!query.trim()) {
      setFilteredInvoices(invoices);
      return;
    }

    const filtered = invoices.filter(invoice =>
      invoice.id.toLowerCase().includes(query.toLowerCase()) ||
      invoice.customerName.toLowerCase().includes(query.toLowerCase()) ||
      invoice.customerPhone.includes(query)
    );
    
    setFilteredInvoices(filtered);
  };

  const handleRepairOrderSearch = async (query) => {
    if (!query.trim()) {
      setFilteredRepairOrders(repairOrders);
      return;
    }

    const filtered = repairOrders.filter(order =>
      order.id.toLowerCase().includes(query.toLowerCase()) ||
      order.customerName.toLowerCase().includes(query.toLowerCase()) ||
      order.deviceInfo.toLowerCase().includes(query.toLowerCase()) ||
      order.issue.toLowerCase().includes(query.toLowerCase())
    );
    
    setFilteredRepairOrders(filtered);
  };

  const updateRepairOrderStatus = async (orderId, newStatus) => {
    try {
      const updatedOrder = await repairOrderService.update(orderId, { status: newStatus });
      
      setRepairOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? updatedOrder : order
        )
      );
      
      setFilteredRepairOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? updatedOrder : order
        )
      );
      
      toast.success('Repair order status updated');
    } catch (err) {
      toast.error('Failed to update repair order status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'in-progress':
        return 'bg-info/10 text-info border-info/20';
      case 'completed':
        return 'bg-success/10 text-success border-success/20';
      default:
        return 'bg-surface-100 text-surface-600 border-surface-200';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-heading font-bold text-surface-900">Orders</h1>
          <p className="text-surface-600">Manage invoices and repair orders</p>
        </div>
        <SkeletonLoader count={5} type="table" />
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

  const tabs = [
    { id: 'invoices', label: 'Invoices', icon: 'Receipt', count: invoices.length },
    { id: 'repairs', label: 'Repair Orders', icon: 'Wrench', count: repairOrders.length }
  ];

  return (
    <div className="p-6 max-w-full overflow-hidden">
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-bold text-surface-900">Orders</h1>
        <p className="text-surface-600">Manage invoices and repair orders</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-surface-100 p-1 rounded-lg w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-white text-primary shadow-sm'
                : 'text-surface-600 hover:text-surface-900'
            }`}
          >
            <ApperIcon name={tab.icon} className="w-4 h-4 mr-2" />
            {tab.label}
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
              activeTab === tab.id
                ? 'bg-primary/10 text-primary'
                : 'bg-surface-200 text-surface-600'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="mb-6">
        <SearchBar
          placeholder={`Search ${activeTab === 'invoices' ? 'invoices' : 'repair orders'}...`}
          onSearch={activeTab === 'invoices' ? handleInvoiceSearch : handleRepairOrderSearch}
        />
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'invoices' ? (
          <motion.div
            key="invoices"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {filteredInvoices.length === 0 ? (
              <EmptyState
                title="No invoices found"
                description="No invoices match your search criteria."
                icon="Receipt"
              />
            ) : (
              <div className="space-y-4">
                {filteredInvoices.map((invoice) => (
                  <motion.div
                    key={invoice.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full min-w-0"
                  >
                    <Card hover className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                            <ApperIcon name="Receipt" className="w-5 h-5 text-success" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-surface-900">
                              Invoice #{invoice.id}
                            </h3>
                            <p className="text-sm text-surface-500">
                              {format(new Date(invoice.date), 'MMM dd, yyyy at hh:mm a')}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-success">
                            ${invoice.total.toFixed(2)}
                          </p>
                          <p className="text-sm text-surface-500">
                            {invoice.paymentMethod}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="font-medium text-surface-900 mb-2">Customer</h4>
                          <p className="text-surface-700">{invoice.customerName}</p>
                          {invoice.customerPhone && (
                            <p className="text-sm text-surface-500">{invoice.customerPhone}</p>
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium text-surface-900 mb-2">Items</h4>
                          <div className="space-y-1">
                            {invoice.items.slice(0, 2).map((item, index) => (
                              <p key={index} className="text-sm text-surface-700">
                                {item.quantity}x {item.name} - ${(item.quantity * item.price).toFixed(2)}
                              </p>
                            ))}
                            {invoice.items.length > 2 && (
                              <p className="text-sm text-surface-500">
                                +{invoice.items.length - 2} more items
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-surface-200">
                        <div className="text-sm text-surface-600">
                          Subtotal: ${invoice.subtotal.toFixed(2)} | Tax: ${invoice.tax.toFixed(2)}
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="ghost" icon="Eye">
                            View
                          </Button>
                          <Button size="sm" variant="ghost" icon="Printer">
                            Print
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="repairs"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {filteredRepairOrders.length === 0 ? (
              <EmptyState
                title="No repair orders found"
                description="No repair orders match your search criteria."
                icon="Wrench"
              />
            ) : (
              <div className="space-y-4">
                {filteredRepairOrders.map((order) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full min-w-0"
                  >
                    <Card hover className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <ApperIcon name="Wrench" className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-surface-900">
                              Repair Order #{order.id}
                            </h3>
                            <p className="text-sm text-surface-500">
                              {format(new Date(order.createdDate), 'MMM dd, yyyy')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1).replace('-', ' ')}
                          </span>
                          <select
                            value={order.status}
                            onChange={(e) => updateRepairOrderStatus(order.id, e.target.value)}
                            className="px-3 py-1 border border-surface-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                          >
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="font-medium text-surface-900 mb-2">Customer</h4>
                          <p className="text-surface-700">{order.customerName}</p>
                          {order.customerPhone && (
                            <p className="text-sm text-surface-500">{order.customerPhone}</p>
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium text-surface-900 mb-2">Device</h4>
                          <p className="text-surface-700">{order.deviceInfo}</p>
                          <p className="text-sm text-surface-500 break-words">{order.issue}</p>
                        </div>
                      </div>

                      {order.parts && order.parts.length > 0 && (
                        <div className="mb-4">
                          <h4 className="font-medium text-surface-900 mb-2">Parts Used</h4>
                          <div className="space-y-1">
                            {order.parts.map((part, index) => (
                              <p key={index} className="text-sm text-surface-700">
                                {part.quantity}x {part.name} - ${(part.quantity * part.price).toFixed(2)}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t border-surface-200">
                        <div className="text-sm text-surface-600">
                          Labor: ${order.laborCost?.toFixed(2) || '0.00'}
                          {order.parts && order.parts.length > 0 && (
                            <span className="ml-4">
                              Parts: ${order.parts.reduce((sum, part) => sum + (part.quantity * part.price), 0).toFixed(2)}
                            </span>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="ghost" icon="Eye">
                            View
                          </Button>
                          <Button size="sm" variant="ghost" icon="Edit">
                            Edit
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Orders;