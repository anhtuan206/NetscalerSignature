import React, { useRef } from 'react';
import { Upload } from 'lucide-react';

interface FileUploadProps {
    onFileUpload: (content: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target?.result as string;
                onFileUpload(content);
            };
            reader.readAsText(file);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-8 bg-surface border border-dashed border-border rounded-lg hover:bg-surface-translucent transition-colors cursor-pointer group"
            onClick={() => fileInputRef.current?.click()}>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".xml"
                className="hidden"
            />
            <div className="p-4 bg-primary/10 rounded-full mb-4 group-hover:scale-110 transition-transform">
                <Upload className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-text">Upload Signature XML</h3>
            <p className="text-text-muted text-sm text-center">
                Click to browse or drag and drop your <br />
                <code className="bg-surface/50 px-2 py-1 rounded text-primary">signature.xml</code> file here
            </p>
        </div>
    );
};

export default FileUpload;
