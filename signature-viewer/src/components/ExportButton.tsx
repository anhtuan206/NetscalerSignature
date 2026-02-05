import React from 'react';
import { Download } from 'lucide-react';

interface ExportButtonProps {
    onExport: () => void;
    disabled?: boolean;
}

const ExportButton: React.FC<ExportButtonProps> = ({ onExport, disabled }) => {
    return (
        <button
            onClick={onExport}
            disabled={disabled}
            className={`btn btn-primary ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            <Download size={18} />
            <span>Export XML</span>
        </button>
    );
};

export default ExportButton;
