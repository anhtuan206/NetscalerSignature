import React, { useState } from 'react';
import type { SignatureRule } from '../types/Signature';
import { updateSignatureAttribute } from '../utils/xmlGenerator';
import { Check, X } from 'lucide-react';
import Switch from './Switch';
import BatchToolbar from './BatchToolbar';

// Extracted for performance optimization and cleaner code
const ActionToggle = ({ active, variant, onClick }: { active: boolean, variant: 'block' | 'log' | 'stats', onClick: () => void }) => {
    const activeClass = variant === 'block' ? 'action-btn-block' : variant === 'log' ? 'action-btn-log' : 'action-btn-stats';
    return (
        <button
            onClick={onClick}
            className={`action-btn ${active ? `action-btn-active ${activeClass}` : ''}`}
        >
            {active ? <Check size={16} strokeWidth={3} /> : <X size={16} />}
        </button>
    );
};

interface SignatureGridProps {
    rules: SignatureRule[];
    onRuleUpdate: (updatedRule: SignatureRule) => void;
    onBatchUpdate: (updatedRules: SignatureRule[]) => void;
}

const SignatureGrid: React.FC<SignatureGridProps> = ({ rules, onRuleUpdate, onBatchUpdate }) => {
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedIds(new Set(rules.map(r => r.id)));
        } else {
            setSelectedIds(new Set());
        }
    };

    const handleSelectRow = (id: string) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setSelectedIds(newSet);
    };

    const handleToggleAction = (rule: SignatureRule, actionType: 'block' | 'log' | 'stats') => {
        let currentActions = rule.actions.split(',').map(s => s.trim()).filter(s => s !== '');
        const exists = currentActions.includes(actionType);

        let newActions: string[];
        if (exists) {
            newActions = currentActions.filter(a => a !== actionType);
        } else {
            newActions = [...currentActions, actionType];
        }

        const newActionString = newActions.join(',');
        updateSignatureAttribute(rule, 'actions', newActionString);
        onRuleUpdate({ ...rule, actions: newActionString });
    };

    const handleToggleEnabled = (rule: SignatureRule) => {
        const newState = rule.enabled === 'ON' ? 'OFF' : 'ON';
        updateSignatureAttribute(rule, 'enabled', newState);
        onRuleUpdate({ ...rule, enabled: newState });
    };

    // Batch Operaions
    const applyBatchAction = (transform: (rule: SignatureRule) => SignatureRule) => {
        const updates: SignatureRule[] = [];
        rules.forEach(rule => {
            if (selectedIds.has(rule.id)) {
                const updated = transform({ ...rule }); // Copy
                // Update DOM attribute for persistence
                if (updated.enabled !== rule.enabled) updateSignatureAttribute(updated, 'enabled', updated.enabled);
                if (updated.actions !== rule.actions) updateSignatureAttribute(updated, 'actions', updated.actions);
                updates.push(updated);
            }
        });
        onBatchUpdate(updates);
    };

    const batchSetEnabled = (val: 'ON' | 'OFF') => applyBatchAction(r => ({ ...r, enabled: val }));

    const batchUpdateAction = (action: string, add: boolean) => applyBatchAction(r => {
        let currentActions = r.actions.split(',').map(s => s.trim()).filter(s => s !== '');
        const exists = currentActions.includes(action);
        if (add && !exists) currentActions.push(action);
        if (!add && exists) currentActions = currentActions.filter(a => a !== action);
        return { ...r, actions: currentActions.join(',') };
    });

    const isAllSelected = rules.length > 0 && selectedIds.size === rules.length;

    return (
        <div className="relative">
            <BatchToolbar
                selectedCount={selectedIds.size}
                onEnableAll={() => batchSetEnabled('ON')}
                onDisableAll={() => batchSetEnabled('OFF')}
                onBlockAll={() => batchUpdateAction('block', true)}
                onRemoveBlockAll={() => batchUpdateAction('block', false)}
                onLogAll={() => batchUpdateAction('log', true)}
                onRemoveLogAll={() => batchUpdateAction('log', false)}
                onStatsAll={() => batchUpdateAction('stats', true)}
                onRemoveStatsAll={() => batchUpdateAction('stats', false)}
                onClearSelection={() => setSelectedIds(new Set())}
            />

            <div className="overflow-x-auto glass-panel">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-border bg-surface/50 text-text-muted text-xs uppercase tracking-wider">
                            <th className="p-6 w-16 text-center">
                                <input
                                    type="checkbox"
                                    checked={isAllSelected}
                                    onChange={handleSelectAll}
                                    className="rounded border-border bg-surface text-primary focus:ring-primary w-5 h-5 cursor-pointer"
                                />
                            </th>
                            <th className="p-6 font-semibold w-32">Enable</th>
                            <th className="p-6 font-semibold w-28 text-center">Block</th>
                            <th className="p-6 font-semibold w-28 text-center">Log</th>
                            <th className="p-6 font-semibold w-28 text-center">Stats</th>
                            <th className="p-6 font-semibold w-32 cursor-pointer hover:text-primary">ID</th>
                            <th className="p-6 font-semibold min-w-[300px]">Log String</th>
                            <th className="p-6 font-semibold">Category</th>
                            <th className="p-6 font-semibold">Severity</th>
                            <th className="p-6 font-semibold">Year</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {rules.length === 0 && (
                            <tr>
                                <td colSpan={10} className="p-12 text-center text-text-muted">No signatures found matching your filters.</td>
                            </tr>
                        )}
                        {rules.map((rule) => {
                            const actions = rule.actions.split(',').map(s => s.trim());
                            const isBlock = actions.includes('block');
                            const isLog = actions.includes('log');
                            const isStats = actions.includes('stats');
                            const isEnabled = rule.enabled === 'ON';
                            const isSelected = selectedIds.has(rule.id);

                            return (
                                <tr key={rule.id} className={`row-base ${isSelected ? 'row-selected' : ''} ${!isEnabled ? 'row-disabled' : ''}`}>
                                    <td className="p-6 text-center">
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => handleSelectRow(rule.id)}
                                            className="rounded border-border bg-surface text-primary focus:ring-primary w-5 h-5 cursor-pointer"
                                        />
                                    </td>
                                    <td className="p-6">
                                        <Switch
                                            checked={isEnabled}
                                            onChange={() => handleToggleEnabled(rule)}
                                            className={isEnabled ? "opacity-100" : "opacity-70"}
                                        />
                                    </td>
                                    <td className="p-6 text-center">
                                        <ActionToggle
                                            active={isBlock}
                                            variant="block"
                                            onClick={() => handleToggleAction(rule, 'block')}
                                        />
                                    </td>
                                    <td className="p-6 text-center">
                                        <ActionToggle
                                            active={isLog}
                                            variant="log"
                                            onClick={() => handleToggleAction(rule, 'log')}
                                        />
                                    </td>
                                    <td className="p-6 text-center">
                                        <ActionToggle
                                            active={isStats}
                                            variant="stats"
                                            onClick={() => handleToggleAction(rule, 'stats')}
                                        />
                                    </td>
                                    <td className="p-6 font-mono text-text-muted">{rule.id}</td>
                                    <td className="p-6 text-text font-medium truncate max-w-xs" title={rule.logString}>
                                        {rule.logString}
                                    </td>
                                    <td className="p-6">
                                        <span className="badge badge-category">{rule.category}</span>
                                    </td>
                                    <td className="p-6">
                                        <span className={`badge badge-border ${rule.severity === 'HIGH' ? 'badge-high' : rule.severity === 'MEDIUM' ? 'badge-medium' : 'badge-low'}`}>
                                            {rule.severity}
                                        </span>
                                    </td>
                                    <td className="p-6 text-text-muted">{rule.year}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SignatureGrid;
