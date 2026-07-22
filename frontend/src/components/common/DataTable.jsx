function DataTable({ columns, rows, loading, page, totalPages, onPageChange, emptyMessage }) {
  if (loading) {
    return (
      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="animate-pulse">
          <div className="h-12 bg-surfaceAlt"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-surface border-t border-border"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!rows || rows.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-xl p-12 text-center">
        <p className="text-muted text-lg">{emptyMessage || 'No data found'}</p>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-surfaceAlt">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-6 py-3 text-left text-xs font-semibold text-text uppercase tracking-wider"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((row, idx) => (
              <tr key={row.id || row._id || idx} className="hover:bg-surfaceAlt transition-colors">
                {columns.map((col) => (
                  <td key={col.key} className="px-6 py-4 text-sm text-text">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="bg-surfaceAlt px-6 py-3 flex items-center justify-between border-t border-border">
          <div className="text-sm text-muted">
            Page {page} of {totalPages}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 text-sm font-medium text-text bg-surface border border-border rounded-lg hover:bg-surfaceAlt disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page === totalPages}
              className="px-4 py-2 text-sm font-medium text-text bg-surface border border-border rounded-lg hover:bg-surfaceAlt disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;
