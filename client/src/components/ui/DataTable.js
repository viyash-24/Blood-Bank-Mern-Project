import React, { useState } from "react";
import { FiChevronLeft, FiChevronRight, FiSearch } from "react-icons/fi";

const DataTable = ({
  columns,
  data = [],
  loading = false,
  emptyMessage = "No data found",
  emptyIcon: EmptyIcon,
  searchable = false,
  searchPlaceholder = "Search...",
  pageSize = 10,
  actions,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = searchable && searchTerm
    ? data.filter((row) =>
        columns.some((col) => {
          const val = col.accessor ? (typeof col.accessor === 'function' ? col.accessor(row) : row[col.accessor]) : '';
          return String(val).toLowerCase().includes(searchTerm.toLowerCase());
        })
      )
    : data;

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const startIdx = (currentPage - 1) * pageSize;
  const paginatedData = filteredData.slice(startIdx, startIdx + pageSize);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
        <div className="animate-pulse p-6 space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/3" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden animate-fade-in-up">
      {/* Search Bar */}
      {searchable && (
        <div className="px-6 pt-5 pb-3">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none transition-all duration-200 focus:border-blood-500 focus:ring-2 focus:ring-blood-500/10 focus:bg-white"
            />
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              {columns.map((col, i) => (
                <th key={i} className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {col.header}
                </th>
              ))}
              {actions && (
                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {paginatedData.map((row, rowIdx) => (
              <tr key={row._id || rowIdx} className="hover:bg-gray-50/80 transition-colors duration-150">
                {columns.map((col, colIdx) => (
                  <td key={colIdx} className="px-6 py-4 text-sm">
                    {col.render ? col.render(row) : (typeof col.accessor === 'function' ? col.accessor(row) : row[col.accessor])}
                  </td>
                ))}
                {actions && (
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {actions(row)}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {paginatedData.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          {EmptyIcon && <EmptyIcon size={40} className="mb-3 opacity-30" />}
          <p className="text-sm font-medium">{emptyMessage}</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Showing {startIdx + 1}–{Math.min(startIdx + pageSize, filteredData.length)} of {filteredData.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <FiChevronLeft size={16} />
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                  currentPage === i + 1
                    ? 'bg-blood-600 text-white shadow-md'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <FiChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default DataTable;
