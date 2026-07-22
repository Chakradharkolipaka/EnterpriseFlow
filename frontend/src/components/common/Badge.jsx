function Badge({ status }) {
  const getColorClasses = (status) => {
    const normalized = status?.toLowerCase() || '';
    
    // Success states
    if (['confirmed', 'active', 'in'].includes(normalized)) {
      return 'bg-success/20 text-success border-success/30';
    }
    
    // Warning states
    if (['draft', 'lead', 'low stock', 'low-stock'].includes(normalized)) {
      return 'bg-warning/20 text-warning border-warning/30';
    }
    
    // Danger states
    if (['cancelled', 'inactive', 'out'].includes(normalized)) {
      return 'bg-danger/20 text-danger border-danger/30';
    }
    
    // Neutral/default
    return 'bg-muted/20 text-muted border-muted/30';
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getColorClasses(status)}`}>
      {status || 'N/A'}
    </span>
  );
}

export default Badge;
