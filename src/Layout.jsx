import { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { routeArray } from '@/config/routes';

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-shrink-0 lg:w-64 bg-surface-50 border-r border-surface-200">
        <div className="flex flex-col w-full">
          {/* Logo */}
          <div className="flex items-center px-6 py-4 border-b border-surface-200">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <ApperIcon name="Zap" className="w-5 h-5 text-white" />
              </div>
              <span className="ml-3 text-xl font-heading font-bold text-surface-900">
                VoltManager
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {routeArray.map((route) => (
              <NavLink
                key={route.id}
                to={route.path}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-surface-600 hover:bg-surface-100 hover:text-surface-900'
                  }`
                }
              >
                <ApperIcon name={route.icon} className="w-5 h-5 mr-3" />
                {route.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={toggleMobileMenu}
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.aside
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed inset-y-0 left-0 w-80 bg-surface-50 border-r border-surface-200 z-50 lg:hidden"
          >
            <div className="flex flex-col h-full">
              {/* Logo */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-surface-200">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <ApperIcon name="Zap" className="w-5 h-5 text-white" />
                  </div>
                  <span className="ml-3 text-xl font-heading font-bold text-surface-900">
                    VoltManager
                  </span>
                </div>
                <button
                  onClick={toggleMobileMenu}
                  className="p-2 text-surface-500 hover:text-surface-700"
                >
                  <ApperIcon name="X" className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                {routeArray.map((route) => (
                  <NavLink
                    key={route.id}
                    to={route.path}
                    onClick={toggleMobileMenu}
                    className={({ isActive }) =>
                      `flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                        isActive
                          ? 'bg-primary text-white shadow-sm'
                          : 'text-surface-600 hover:bg-surface-100 hover:text-surface-900'
                      }`
                    }
                  >
                    <ApperIcon name={route.icon} className="w-5 h-5 mr-3" />
                    {route.label}
                  </NavLink>
                ))}
              </nav>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="flex-shrink-0 h-16 bg-white border-b border-surface-200 z-40">
          <div className="flex items-center justify-between h-full px-6">
            <div className="flex items-center">
              <button
                onClick={toggleMobileMenu}
                className="lg:hidden p-2 text-surface-500 hover:text-surface-700"
              >
                <ApperIcon name="Menu" className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-surface-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="pl-10 pr-4 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              
              <button className="relative p-2 text-surface-500 hover:text-surface-700">
                <ApperIcon name="Bell" className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-error rounded-full"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-surface-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;