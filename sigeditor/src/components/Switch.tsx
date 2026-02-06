import React from 'react';

interface SwitchProps {
    checked: boolean;
    onChange: () => void;
    label?: string;
    className?: string;
}

const Switch: React.FC<SwitchProps> = ({ checked, onChange, label, className = '' }) => {
    return (
        <label className={`inline-flex items-center cursor-pointer ${className}`}>
            <input
                type="checkbox"
                className="sr-only"
                checked={checked}
                onChange={onChange}
            />
            <div className={`toggle-switch ${checked ? 'toggle-switch-checked' : ''}`}></div>
            {label && <span className="ms-3 text-sm font-medium text-text">{label}</span>}
        </label>
    );
};

export default Switch;
