import { forwardRef } from 'react';
import ApperIcon from '@/components/ApperIcon';

const Input = forwardRef(({ 
  label, 
  type = 'text', 
  error, 
  icon, 
  iconPosition = 'left',
  className = '',
  ...props 
}, ref) => {
  const inputClasses = `
    w-full px-3 py-2 border rounded-md transition-colors duration-150
    focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
    ${error ? 'border-error' : 'border-surface-300'}
    ${icon && iconPosition === 'left' ? 'pl-10' : ''}
    ${icon && iconPosition === 'right' ? 'pr-10' : ''}
    ${className}
  `;

  return (
    <div className="relative">
      {label && (
        <label className="block text-sm font-medium text-surface-700 mb-1">
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <ApperIcon 
            name={icon} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-surface-400" 
          />
        )}
        
        <input
          ref={ref}
          type={type}
          className={inputClasses}
          {...props}
        />
        
        {icon && iconPosition === 'right' && (
          <ApperIcon 
            name={icon} 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-surface-400" 
          />
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-error">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;