
import React, { useState } from 'react';
import { Share2, Link, Copy, Check } from 'lucide-react';

interface PublishButtonProps {
    onPublish: () => void;
    disabled?: boolean;
}

const PublishButton: React.FC<PublishButtonProps> = ({ onPublish, disabled }) => {
    return (
        <button
            onClick={onPublish}
            disabled={disabled}
            className={`btn btn-primary ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            title="Publish and get a shareable link (15 min expiry)"
        >
            <Share2 size={18} />
            <span>Publish</span>
        </button>
    );
};

export default PublishButton;

interface PublishModalProps {
    isOpen: boolean;
    onClose: () => void;
    url: string;
    expiresIn: string;
}

export const PublishModal: React.FC<PublishModalProps> = ({ isOpen, onClose, url, expiresIn }) => {
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const fullUrl = `${window.location.origin}${url}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(fullUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-text-muted hover:text-text transition-colors"
                >
                    ✕
                </button>

                <h3 className="text-xl font-semibold text-text mb-4 flex items-center gap-2">
                    <Share2 className="text-indigo-500" size={24} />
                    Published Successfully
                </h3>

                <div className="bg-background-dark p-4 rounded-lg border border-border/50 mb-4">
                    <div className="flex items-center gap-2 text-sm text-text-muted mb-2">
                        <Link size={14} />
                        <span>Shareable Link</span>
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            readOnly
                            value={fullUrl}
                            className="flex-1 bg-surface border border-border rounded px-3 py-2 text-sm text-text focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}
                        />
                        <button
                            onClick={handleCopy}
                            className="btn btn-secondary px-3"
                            title="Copy to clipboard"
                        >
                            {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                        </button>
                    </div>
                </div>

                <div className="text-sm text-yellow-500/80 bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-lg"
                    style={{ color: '#eab308', backgroundColor: 'rgba(234, 179, 8, 0.1)', borderColor: 'rgba(234, 179, 8, 0.2)' }}>
                    ⚠️ This link will expire in {expiresIn}.
                </div>

                <div className="mt-6 flex justify-end">
                    <button onClick={onClose} className="btn btn-primary">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};
