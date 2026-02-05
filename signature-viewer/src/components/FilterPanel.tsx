import React from 'react';
import { Filter, RefreshCcw } from 'lucide-react';

interface FilterPanelProps {
    categories: string[];
    severities: string[];
    selectedCategory: string;
    selectedSeverity: string;
    filterEnabled: string;
    filterBlock: string;
    filterLog: string;
    filterStats: string;
    onCategoryChange: (val: string) => void;
    onSeverityChange: (val: string) => void;
    onFilterEnabledChange: (val: string) => void;
    onFilterBlockChange: (val: string) => void;
    onFilterLogChange: (val: string) => void;
    onFilterStatsChange: (val: string) => void;
    onReset: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
    categories,
    severities,
    selectedCategory,
    selectedSeverity,
    filterEnabled,
    filterBlock,
    filterLog,
    filterStats,
    onCategoryChange,
    onSeverityChange,
    onFilterEnabledChange,
    onFilterBlockChange,
    onFilterLogChange,
    onFilterStatsChange,
    onReset
}) => {
    return (
        <div className="glass-panel p-6 flex flex-col gap-6 sticky top-6">
            <h3 className="font-semibold text-lg flex items-center gap-2">
                <Filter size={20} className="text-primary" />
                Filters
            </h3>

            <div className="h-px bg-border/50 w-full" />

            {/* Filters */}
            <div className="flex flex-col gap-4 w-full">
                <div className="space-y-2">
                    <label className="text-xs font-medium text-text-muted uppercase tracking-wider">Category</label>
                    <select
                        value={selectedCategory}
                        onChange={(e) => onCategoryChange(e.target.value)}
                        className="w-full bg-surface border border-border text-text text-sm rounded-md px-3 py-2 focus:outline-none focus:border-primary"
                    >
                        <option value="">All Categories</option>
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-medium text-text-muted uppercase tracking-wider">Severity</label>
                    <select
                        value={selectedSeverity}
                        onChange={(e) => onSeverityChange(e.target.value)}
                        className="w-full bg-surface border border-border text-text text-sm rounded-md px-3 py-2 focus:outline-none focus:border-primary"
                    >
                        <option value="">All Severities</option>
                        {severities.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-medium text-text-muted uppercase tracking-wider">Status (Enabled)</label>
                    <select
                        value={filterEnabled}
                        onChange={(e) => onFilterEnabledChange(e.target.value)}
                        className="w-full bg-surface border border-border text-text text-sm rounded-md px-3 py-2 focus:outline-none focus:border-primary"
                    >
                        <option value="">All</option>
                        <option value="ON">Enabled Only</option>
                        <option value="OFF">Disabled Only</option>
                    </select>
                </div>

                <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                        <label className="text-[10px] font-medium text-text-muted uppercase tracking-wider">Block</label>
                        <select
                            value={filterBlock}
                            onChange={(e) => onFilterBlockChange(e.target.value)}
                            className="w-full bg-surface border border-border text-text text-xs rounded-md px-1 py-2 focus:outline-none focus:border-primary"
                        >
                            <option value="">All</option>
                            <option value="YES">Yes</option>
                            <option value="NO">No</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-medium text-text-muted uppercase tracking-wider">Log</label>
                        <select
                            value={filterLog}
                            onChange={(e) => onFilterLogChange(e.target.value)}
                            className="w-full bg-surface border border-border text-text text-xs rounded-md px-1 py-2 focus:outline-none focus:border-primary"
                        >
                            <option value="">All</option>
                            <option value="YES">Yes</option>
                            <option value="NO">No</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-medium text-text-muted uppercase tracking-wider">Stats</label>
                        <select
                            value={filterStats}
                            onChange={(e) => onFilterStatsChange(e.target.value)}
                            className="w-full bg-surface border border-border text-text text-xs rounded-md px-1 py-2 focus:outline-none focus:border-primary"
                        >
                            <option value="">All</option>
                            <option value="YES">Yes</option>
                            <option value="NO">No</option>
                        </select>
                    </div>
                </div>

                <div className="pt-2">
                    <button
                        onClick={onReset}
                        className="btn btn-secondary w-full justify-center text-sm py-2"
                        title="Reset Filters"
                    >
                        <RefreshCcw size={14} className="mr-2" />
                        Reset Filters
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FilterPanel;
