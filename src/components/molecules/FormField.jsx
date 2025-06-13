import Input from '@/components/atoms/Input';

const FormField = ({ 
  name, 
  label, 
  type = 'text', 
  required = false, 
  error,
  register,
  ...props 
}) => {
  const validation = required ? { required: `${label} is required` } : {};
  
  return (
    <div>
      <Input
        label={label}
        type={type}
        error={error}
        {...(register ? register(name, validation) : {})}
        {...props}
      />
    </div>
  );
};

export default FormField;