import { useState } from 'react';
import Input from '@/components/atoms/Input';
import { motion } from 'framer-motion';

const SearchBar = ({ 
  placeholder = 'Search...', 
  onSearch, 
  className = '',
  debounceMs = 300 
}) => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (value) => {
    setIsSearching(true);
    
    // Debounce the search
    setTimeout(async () => {
      if (onSearch) {
        await onSearch(value);
      }
      setIsSearching(false);
    }, debounceMs);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    handleSearch(value);
  };

  const clearSearch = () => {
    setQuery('');
    handleSearch('');
  };

  return (
    <div className={`relative ${className}`}>
      <Input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        icon="Search"
        iconPosition="left"
        className="pr-10"
      />
      
      {query && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={clearSearch}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-surface-400 hover:text-surface-600"
        >
          <span className="sr-only">Clear search</span>
          ✕
        </motion.button>
      )}
      
      {isSearching && (
        <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;