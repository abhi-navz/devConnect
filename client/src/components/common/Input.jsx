const Input = ({
    label,
    type = 'text',
    name,
    value,
    onChange,
    placeholder,
    required = false,
    error,
  }) => {
    return (
      <div className="mb-4">
        {label && (
          <label htmlFor={name} className="block text-sm font-medium text-text-secondary mb-1.5">
            {label}
          </label>
        )}
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full bg-bg-tertiary border ${
            error ? 'border-danger' : 'border-border'
          } text-text-primary rounded-lg px-4 py-2.5 placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent transition-colors`}
        />
        {error && <p className="text-danger text-xs mt-1">{error}</p>}
      </div>
    );
  };
  
  export default Input;
  