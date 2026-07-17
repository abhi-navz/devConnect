const SkillTag = ({ skill, onRemove }) => {
    return (
      <span className="inline-flex items-center gap-1.5 bg-bg-tertiary border border-border text-text-primary text-sm px-3 py-1 rounded-full">
        {skill}
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-text-muted hover:text-danger transition-colors"
            aria-label={`Remove ${skill}`}
          >
            ×
          </button>
        )}
      </span>
    );
  };
  
  export default SkillTag;