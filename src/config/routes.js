import Dashboard from '@/components/pages/Dashboard';
import Inventory from '@/components/pages/Inventory';
import POS from '@/components/pages/POS';
import Orders from '@/components/pages/Orders';
import Analytics from '@/components/pages/Analytics';
import Settings from '@/components/pages/Settings';

export const routes = {
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'LayoutDashboard',
    component: Dashboard
  },
  inventory: {
    id: 'inventory',
    label: 'Inventory',
    path: '/inventory',
    icon: 'Package',
    component: Inventory
  },
  pos: {
    id: 'pos',
    label: 'POS',
    path: '/pos',
    icon: 'ShoppingCart',
    component: POS
  },
  orders: {
    id: 'orders',
    label: 'Orders',
    path: '/orders',
    icon: 'FileText',
    component: Orders
  },
  analytics: {
    id: 'analytics',
    label: 'Analytics',
    path: '/analytics',
    icon: 'TrendingUp',
    component: Analytics
  },
  settings: {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    icon: 'Settings',
    component: Settings
  }
};

export const routeArray = Object.values(routes);
export default routes;