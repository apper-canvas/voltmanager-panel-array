import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Input from '@/components/atoms/Input';
import SearchBar from '@/components/molecules/SearchBar';
import SkeletonLoader from '@/components/organisms/SkeletonLoader';
import ErrorState from '@/components/organisms/ErrorState';
import ApperIcon from '@/components/ApperIcon';
import { productService, invoiceService } from '@/services';

const POS = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState({ name: '', phone: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

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

    setFilteredProducts(filtered);
  }, [products, selectedCategory]);

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setFilteredProducts(products);
      return;
    }

    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.sku.toLowerCase().includes(query.toLowerCase())
    );
    
    setFilteredProducts(filtered);
  };

  const addToCart = (product) => {
    if (product.stock <= 0) {
      toast.error('Product is out of stock');
      return;
    }

    const existingItem = cart.find(item => item.productId === product.id);
    
    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        toast.error('Not enough stock available');
        return;
      }
      
      setCart(prevCart =>
        prevCart.map(item =>
          item.productId === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart(prevCart => [
        ...prevCart,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1
        }
      ]);
    }
    
    toast.success(`${product.name} added to cart`);
  };

  const updateCartQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const product = products.find(p => p.id === productId);
    if (newQuantity > product.stock) {
      toast.error('Not enough stock available');
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.productId === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.productId !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setCustomer({ name: '', phone: '' });
  };

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateTax = (subtotal) => {
    return subtotal * 0.08; // 8% tax
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = calculateTax(subtotal);
    return subtotal + tax;
  };

  const processPayment = async () => {
    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    if (!customer.name.trim()) {
      toast.error('Customer name is required');
      return;
    }

    setProcessing(true);
    
    try {
      const subtotal = calculateSubtotal();
      const tax = calculateTax(subtotal);
      const total = calculateTotal();

      const invoice = {
        customerName: customer.name,
        customerPhone: customer.phone,
        items: [...cart],
        subtotal,
        tax,
        total,
        paymentMethod: 'Cash' // Default to cash for this demo
      };

      const newInvoice = await invoiceService.create(invoice);
      
      // Update product stock
      for (const item of cart) {
        await productService.updateStock(item.productId, -item.quantity);
      }

      // Refresh products to show updated stock
      const updatedProducts = await productService.getAll();
      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts);

      toast.success(`Payment processed! Invoice #${newInvoice.id}`);
      clearCart();
      
    } catch (err) {
      toast.error('Failed to process payment');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-heading font-bold text-surface-900">Point of Sale</h1>
          <p className="text-surface-600">Process sales and generate invoices</p>
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

  return (
    <div className="p-6 max-w-full overflow-hidden">
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-bold text-surface-900">Point of Sale</h1>
        <p className="text-surface-600">Process sales and generate invoices</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Catalog */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="flex-1">
                  <SearchBar
                    placeholder="Search products..."
                    onSearch={handleSearch}
                  />
                </div>
                
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
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              <AnimatePresence>
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="w-full min-w-0"
                  >
                    <Card 
                      hover 
                      clickable
                      onClick={() => addToCart(product)}
                      className={`p-4 ${product.stock <= 0 ? 'opacity-50' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-surface-900 truncate">
                            {product.name}
                          </h3>
                          <p className="text-sm text-surface-500">
                            SKU: {product.sku}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-lg font-bold text-primary">
                              ${product.price.toFixed(2)}
                            </span>
                            <span className={`text-sm px-2 py-1 rounded-full ${
                              product.stock > product.minStock 
                                ? 'bg-success/10 text-success' 
                                : product.stock > 0 
                                  ? 'bg-warning/10 text-warning'
                                  : 'bg-error/10 text-error'
                            }`}>
                              {product.stock} left
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </Card>
        </div>

        {/* Cart and Checkout */}
        <div className="space-y-6">
          {/* Customer Info */}
          <Card className="p-6">
            <h3 className="font-semibold text-surface-900 mb-4">Customer Information</h3>
            <div className="space-y-4">
              <Input
                label="Customer Name *"
                value={customer.name}
                onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                placeholder="Enter customer name"
              />
              <Input
                label="Phone Number"
                value={customer.phone}
                onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                placeholder="(555) 123-4567"
              />
            </div>
          </Card>

          {/* Cart */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-surface-900">Cart</h3>
              {cart.length > 0 && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={clearCart}
                  icon="Trash2"
                >
                  Clear
                </Button>
              )}
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-8">
                <ApperIcon name="ShoppingCart" className="w-12 h-12 text-surface-300 mx-auto mb-2" />
                <p className="text-surface-500">Cart is empty</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                <AnimatePresence>
                  {cart.map((item) => (
                    <motion.div
                      key={item.productId}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex items-center justify-between p-3 bg-surface-50 rounded-lg"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-surface-900 truncate">
                          {item.name}
                        </p>
                        <p className="text-sm text-surface-600">
                          ${item.price.toFixed(2)} each
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                        >
                          <ApperIcon name="Minus" className="w-3 h-3" />
                        </Button>
                        
                        <span className="px-2 py-1 bg-white rounded text-sm font-medium min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
                        
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                        >
                          <ApperIcon name="Plus" className="w-3 h-3" />
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeFromCart(item.productId)}
                        >
                          <ApperIcon name="X" className="w-3 h-3" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            {cart.length > 0 && (
              <div className="mt-6 pt-4 border-t border-surface-200">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${calculateSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (8%):</span>
                    <span>${calculateTax(calculateSubtotal()).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t border-surface-200">
                    <span>Total:</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  className="w-full mt-4"
                  onClick={processPayment}
                  loading={processing}
                  disabled={processing || cart.length === 0}
                  icon="CreditCard"
                >
                  Process Payment
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default POS;