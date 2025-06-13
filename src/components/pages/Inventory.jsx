import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import SearchBar from '@/components/molecules/SearchBar';
import StockIndicator from '@/components/molecules/StockIndicator';
import SkeletonLoader from '@/components/organisms/SkeletonLoader';
import ErrorState from '@/components/organisms/ErrorState';
import EmptyState from '@/components/organisms/EmptyState';
import ApperIcon from '@/components/ApperIcon';
import { productService } from '@/services';

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const result = await productService.getAll();
        setProducts(result);
        setFilteredProducts(result);
      } catch (err) {
        setError(err.message || 'Failed to load products');
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    let filtered = [...products];

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    if (stockFilter === 'low') {
      filtered = filtered.filter(product => product.stock <= product.minStock);
    } else if (stockFilter === 'out') {
      filtered = filtered.filter(product => product.stock === 0);
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, stockFilter]);

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setFilteredProducts(products);
      return;
    }

    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.sku.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase())
    );
    
    setFilteredProducts(filtered);
  };

  const handleStockAdjustment = async (productId, adjustment) => {
    try {
      const updatedProduct = await productService.updateStock(productId, adjustment);
      
      setProducts(prevProducts =>
        prevProducts.map(product =>
          product.id === productId ? updatedProduct : product
        )
      );
      
      toast.success(`Stock ${adjustment > 0 ? 'increased' : 'decreased'} successfully`);
    } catch (err) {
      toast.error('Failed to update stock');
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-heading font-bold text-surface-900">Inventory</h1>
          <p className="text-surface-600">Manage your product inventory and stock levels</p>
        </div>
        <SkeletonLoader count={6} type="table" />
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

  const categories = ['all', ...new Set(products.map(p => p.category))];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="p-6 max-w-full overflow-hidden">
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-bold text-surface-900">Inventory</h1>
        <p className="text-surface-600">Manage your product inventory and stock levels</p>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            placeholder="Search products by name, SKU, or category..."
            onSearch={handleSearch}
          />
        </div>
        
        <div className="flex gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
          
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Stock</option>
            <option value="low">Low Stock</option>
            <option value="out">Out of Stock</option>
          </select>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <EmptyState
          title="No products found"
          description="No products match your current filters. Try adjusting your search or filters."
          actionLabel="Add Product"
          icon="Package"
        />
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                variants={itemVariants}
                layout
                className="w-full min-w-0"
              >
                <Card hover className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-surface-900 truncate">
                        {product.name}
                      </h3>
                      <p className="text-sm text-surface-500">SKU: {product.sku}</p>
                      <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs rounded-full mt-1">
                        {product.category}
                      </span>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-lg font-bold text-surface-900">
                        ${product.price.toFixed(2)}
                      </p>
                      <p className="text-sm text-surface-500">
                        Cost: ${product.cost.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-surface-700">Stock Level</span>
                      <span className="text-sm text-surface-500">
                        Min: {product.minStock}
                      </span>
                    </div>
                    <StockIndicator 
                      current={product.stock} 
                      minimum={product.minStock} 
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleStockAdjustment(product.id, -1)}
                        disabled={product.stock === 0}
                      >
                        <ApperIcon name="Minus" className="w-4 h-4" />
                      </Button>
                      
                      <span className="px-3 py-1 bg-surface-100 rounded text-sm font-medium min-w-[3rem] text-center">
                        {product.stock}
                      </span>
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleStockAdjustment(product.id, 1)}
                      >
                        <ApperIcon name="Plus" className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="ghost">
                        <ApperIcon name="Edit" className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <ApperIcon name="MoreVertical" className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {product.warrantyMonths && (
                    <div className="mt-3 pt-3 border-t border-surface-200">
                      <div className="flex items-center text-sm text-surface-600">
                        <ApperIcon name="Shield" className="w-4 h-4 mr-1" />
                        {product.warrantyMonths} month warranty
                      </div>
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default Inventory;