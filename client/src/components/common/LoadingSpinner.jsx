const LoadingSpinner = ({ label = 'Loading...' }) => {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3">
        <div className="w-8 h-8 border-2 border-border border-t-accent rounded-full animate-spin" />
        <p className="text-text-muted text-sm font-mono">{label}</p>
      </div>
    );
  };
  
  export default LoadingSpinner;