import type { SignatureFile, SignatureRule } from '../types/Signature';

export const generateXML = (file: SignatureFile): string => {
    // Use the DOM structure we verified. 
    // We assume the _domElement in each rule is the source of truth for structure,
    // and we've been updating strict attributes on it.

    // If we just kept _domElement, we just need to serialize the root document.
    // But wait, the `file` object might not hold the whole document reference.
    // We need to keep the `xmlDoc` reference somewhere or reconstruct it.

    // Better approach: 
    // 1. We kept `_domElement`. 
    // 2. We can reconstruct a container.

    if (file.rules.length === 0) return "";

    // Assuming all rules come from the same doc, we can take the ownerDocument of the first rule
    // and serialize it.
    // However, filtering might hide some rules. Using `file.rules` implies we export only the CURRENT view?
    // Usually "download the edited xml file" implies the WHOLE file with edits.
    // The user requirement says "user will allow to enable/disable rule... user can download the editted xml file."
    // This implies the full file.

    // So, we should probably store the `xmlDoc` in the main state, and modify it directly when users toggle things.
    // The `rules` array is a projection for the UI.

    const firstRule = file.rules.find(r => r._domElement);
    if (!firstRule || !firstRule._domElement) {
        return '<?xml version="1.0" encoding="UTF-8"?><Error>No DOM elements found</Error>';
    }

    const doc = firstRule._domElement.ownerDocument;
    const serializer = new XMLSerializer();
    return serializer.serializeToString(doc);
};

export const updateSignatureAttribute = (rule: SignatureRule, attr: string, value: string) => {
    if (rule._domElement) {
        rule._domElement.setAttribute(attr, value);
    }
    // Update local object as well to reflect in UI immediately without re-parsing
    (rule as any)[attr] = value;
};
