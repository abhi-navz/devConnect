const Button = ({
    children,
    type = 'button',
    onClick,
    variant = 'primary',
    disabled = false,
    fullWidth = false,
    className = '',
  }) => {
    const baseStyles =
      'font-medium rounded-lg px-4 py-2.5 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed';
  
    const variants = {
      primary: 'bg-accent text-bg-primary hover:bg-accent-hover',
      secondary: 'bg-bg-tertiary text-text-primary border border-border hover:bg-border',
      danger: 'bg-danger text-text-primary hover:opacity-90',
      ghost: 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary',
    };
  
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      >
        {children}
      </button>
    );
  };
  
  export default Button;