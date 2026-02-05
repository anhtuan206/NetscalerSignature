import React from 'react';

interface BatchToolbarProps {
    selectedCount: number;
    onEnableAll: () => void;
    onDisableAll: () => void;
    onBlockAll: () => void;
    onRemoveBlockAll: () => void;
    onLogAll: () => void;
    onRemoveLogAll: () => void;
    onStatsAll: () => void;
    onRemoveStatsAll: () => void;
    onClearSelection: () => void;
}

const BatchToolbar: React.FC<BatchToolbarProps> = ({
    selectedCount,
    onEnableAll,
    onDisableAll,
    onBlockAll,
    onRemoveBlockAll,
    onLogAll,
    onRemoveLogAll,
    onStatsAll,
    onRemoveStatsAll,
    onClearSelection
}) => {
    if (selectedCount === 0) return null;

    return (
        <div className="w-full bg-surface border border-border shadow-glow rounded-xl p-4 flex flex-col gap-3 mb-6 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center justify-between border-b border-border/50 pb-2 mb-1">
                <span className="font-semibold text-text">{selectedCount} Selected</span>
                <button onClick={onClearSelection} className="text-xs text-text-muted hover:text-text">Clear Selection</button>
            </div>

            <div className="flex gap-4">
                {/* Enable/Disable Group */}
                <div className="flex flex-col gap-1 items-center border-r border-border/50 pr-4 mr-2">
                    <span className="text-[10px] uppercase text-text-muted text-center font-bold">Enable</span>
                    <div className="flex gap-1">
                        <button onClick={onEnableAll} className="btn-batch btn-batch-primary" title="Turn On All">Turn On</button>
                        <button onClick={onDisableAll} className="btn-batch btn-batch-secondary" title="Turn Off All">Turn Off</button>
                    </div>
                </div>

                {/* Actions Group */}
                <div className="flex gap-4">
                    <div className="flex flex-col gap-1 items-center">
                        <span className="text-[10px] uppercase text-text-muted text-center font-bold">Block</span>
                        <div className="flex gap-1">
                            <button onClick={onBlockAll} className="btn-batch btn-batch-action" title="Enable Block">Enable</button>
                            <button onClick={onRemoveBlockAll} className="btn-batch btn-batch-secondary" title="Disable Block">Disable</button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1 items-center">
                        <span className="text-[10px] uppercase text-text-muted text-center font-bold">Log</span>
                        <div className="flex gap-1">
                            <button onClick={onLogAll} className="btn-batch btn-batch-action" title="Enable Log">Enable</button>
                            <button onClick={onRemoveLogAll} className="btn-batch btn-batch-secondary" title="Disable Log">Disable</button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1 items-center">
                        <span className="text-[10px] uppercase text-text-muted text-center font-bold">Stats</span>
                        <div className="flex gap-1">
                            <button onClick={onStatsAll} className="btn-batch btn-batch-action" title="Enable Stats">Enable</button>
                            <button onClick={onRemoveStatsAll} className="btn-batch btn-batch-secondary" title="Disable Stats">Disable</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BatchToolbar;
