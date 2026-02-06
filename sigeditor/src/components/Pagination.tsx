import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    onItemsPerPageChange: (pageSize: number) => void;
    className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    itemsPerPage,
    totalItems,
    onPageChange,
    onItemsPerPageChange,
    className = ''
}) => {
    return (
        <div className={`flex items-center justify-between px-2 py-4 ${className}`}>
            <div className="flex items-center gap-4 text-sm text-text-muted">
                <span>
                    {itemsPerPage === -1 ? (
                        <>
                            Showing all <span className="font-medium text-text">{totalItems}</span> results
                        </>
                    ) : (
                        <>
                            Showing <span className="font-medium text-text">{Math.min(totalItems, (currentPage - 1) * itemsPerPage + 1)}</span> to{' '}
                            <span className="font-medium text-text">{Math.min(totalItems, currentPage * itemsPerPage)}</span> of{' '}
                            <span className="font-medium text-text">{totalItems}</span> results
                        </>
                    )}
                </span>

                <select
                    value={itemsPerPage}
                    onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                    className="bg-surface border border-border rounded px-2 py-1 text-xs text-text focus:outline-none focus:border-primary"
                >
                    <option value={10}>10 per page</option>
                    <option value={20}>20 per page</option>
                    <option value={50}>50 per page</option>
                    <option value={100}>100 per page</option>
                    <option value={-1}>All</option>
                </select>
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded hover:bg-surface border border-transparent hover:border-border disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronLeft size={16} />
                </button>

                <div className="text-sm font-medium">
                    Page {currentPage} of {totalPages}
                </div>

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || itemsPerPage === -1}
                    className="p-2 rounded hover:bg-surface border border-transparent hover:border-border disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
};

export default Pagination;
