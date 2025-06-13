import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';

const Settings = () => {
  const [shopInfo, setShopInfo] = useState({
    name: 'VoltManager Electric Supply',
    address: '123 Main Street, Anytown, USA 12345',
    phone: '(555) 123-4567',
    email: 'info@voltmanager.com',
    taxRate: 8.0
  });

  const [notifications, setNotifications] = useState({
    lowStock: true,
    newOrders: true,
    paymentReminders: false,
    systemUpdates: true
  });

  const [backup, setBackup] = useState({
    lastBackup: '2024-01-15T10:30:00Z',
    autoBackup: true,
    backupFrequency: 'daily'
  });

  const [loading, setLoading] = useState(false);

  const handleShopInfoSave = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Shop information updated successfully');
    } catch (error) {
      toast.error('Failed to update shop information');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationsSave = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      toast.success('Notification preferences updated');
    } catch (error) {
      toast.error('Failed to update notification preferences');
    } finally {
      setLoading(false);
    }
  };

  const handleBackupNow = async () => {
    setLoading(true);
    try {
      // Simulate backup process
      await new Promise(resolve => setTimeout(resolve, 2000));
      setBackup(prev => ({ ...prev, lastBackup: new Date().toISOString() }));
      toast.success('Backup completed successfully');
    } catch (error) {
      toast.error('Backup failed');
    } finally {
      setLoading(false);
    }
  };

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
    <div className="p-6 max-w-4xl mx-auto">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-2xl font-heading font-bold text-surface-900">Settings</h1>
          <p className="text-surface-600">Manage your shop configuration and preferences</p>
        </motion.div>

        <div className="space-y-6">
          {/* Shop Information */}
          <motion.div variants={itemVariants}>
            <Card className="p-6">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                  <ApperIcon name="Store" className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-heading font-semibold text-surface-900">
                    Shop Information
                  </h2>
                  <p className="text-sm text-surface-600">
                    Basic information about your electrical shop
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Shop Name"
                  value={shopInfo.name}
                  onChange={(e) => setShopInfo({ ...shopInfo, name: e.target.value })}
                />
                <Input
                  label="Phone Number"
                  value={shopInfo.phone}
                  onChange={(e) => setShopInfo({ ...shopInfo, phone: e.target.value })}
                />
                <div className="md:col-span-2">
                  <Input
                    label="Address"
                    value={shopInfo.address}
                    onChange={(e) => setShopInfo({ ...shopInfo, address: e.target.value })}
                  />
                </div>
                <Input
                  label="Email Address"
                  type="email"
                  value={shopInfo.email}
                  onChange={(e) => setShopInfo({ ...shopInfo, email: e.target.value })}
                />
                <Input
                  label="Tax Rate (%)"
                  type="number"
                  step="0.1"
                  value={shopInfo.taxRate}
                  onChange={(e) => setShopInfo({ ...shopInfo, taxRate: parseFloat(e.target.value) })}
                />
              </div>

              <div className="flex justify-end mt-6">
                <Button
                  onClick={handleShopInfoSave}
                  loading={loading}
                  icon="Save"
                >
                  Save Changes
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Notification Settings */}
          <motion.div variants={itemVariants}>
            <Card className="p-6">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center mr-4">
                  <ApperIcon name="Bell" className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <h2 className="text-lg font-heading font-semibold text-surface-900">
                    Notifications
                  </h2>
                  <p className="text-sm text-surface-600">
                    Configure when and how you receive notifications
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {Object.entries(notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between py-3 border-b border-surface-100 last:border-b-0">
                    <div>
                      <h3 className="font-medium text-surface-900">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </h3>
                      <p className="text-sm text-surface-600">
                        {key === 'lowStock' && 'Get notified when products are running low'}
                        {key === 'newOrders' && 'Receive alerts for new repair orders'}
                        {key === 'paymentReminders' && 'Reminders for overdue payments'}
                        {key === 'systemUpdates' && 'Important system and feature updates'}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => setNotifications({ ...notifications, [key]: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-surface-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-surface-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                ))}
              </div>

              <div className="flex justify-end mt-6">
                <Button
                  onClick={handleNotificationsSave}
                  loading={loading}
                  icon="Save"
                >
                  Save Preferences
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Backup & Data */}
          <motion.div variants={itemVariants}>
            <Card className="p-6">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center mr-4">
                  <ApperIcon name="Database" className="w-5 h-5 text-success" />
                </div>
                <div>
                  <h2 className="text-lg font-heading font-semibold text-surface-900">
                    Backup & Data
                  </h2>
                  <p className="text-sm text-surface-600">
                    Manage your data backups and system maintenance
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-medium text-surface-900 mb-2">Last Backup</h3>
                  <p className="text-surface-600">
                    {new Date(backup.lastBackup).toLocaleDateString()} at{' '}
                    {new Date(backup.lastBackup).toLocaleTimeString()}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-surface-900 mb-2">Auto Backup</h3>
                  <div className="flex items-center space-x-4">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={backup.autoBackup}
                        onChange={(e) => setBackup({ ...backup, autoBackup: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-surface-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-surface-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                    <select
                      value={backup.backupFrequency}
                      onChange={(e) => setBackup({ ...backup, backupFrequency: e.target.value })}
                      className="px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      disabled={!backup.autoBackup}
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handleBackupNow}
                  loading={loading}
                  icon="Download"
                  variant="secondary"
                >
                  Backup Now
                </Button>
                <Button
                  variant="secondary"
                  icon="Upload"
                >
                  Restore from Backup
                </Button>
                <Button
                  variant="secondary"
                  icon="FileDown"
                >
                  Export Data
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* System Information */}
          <motion.div variants={itemVariants}>
            <Card className="p-6">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-info/10 rounded-lg flex items-center justify-center mr-4">
                  <ApperIcon name="Info" className="w-5 h-5 text-info" />
                </div>
                <div>
                  <h2 className="text-lg font-heading font-semibold text-surface-900">
                    System Information
                  </h2>
                  <p className="text-sm text-surface-600">
                    Version and system details
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-medium text-surface-900 mb-2">Version</h3>
                  <p className="text-surface-600">VoltManager v1.0.0</p>
                </div>
                <div>
                  <h3 className="font-medium text-surface-900 mb-2">Database</h3>
                  <p className="text-surface-600">Local Storage</p>
                </div>
                <div>
                  <h3 className="font-medium text-surface-900 mb-2">Status</h3>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-success rounded-full mr-2"></div>
                    <span className="text-success">Active</span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Settings;