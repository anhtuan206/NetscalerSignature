import type { SignatureFile, SignatureRule } from '../types/Signature';

export const parseXML = (xmlContent: string): SignatureFile | null => {
    try {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlContent, "text/xml");

        const root = xmlDoc.querySelector("SignaturesFile");
        if (!root) return null;

        const schema_version = root.getAttribute("schema_version") || "";
        const version = root.getAttribute("version") || "";

        const ruleNodes = xmlDoc.querySelectorAll("SignatureRule");
        const rules: SignatureRule[] = Array.from(ruleNodes).map((node) => {
            const el = node as Element;
            const logStringNode = el.querySelector("LogString");
            const logString = logStringNode ? logStringNode.textContent || "" : "";

            return {
                id: el.getAttribute("id") || "",
                actions: el.getAttribute("actions") || "",
                category: el.getAttribute("category") || "",
                enabled: el.getAttribute("enabled") || "",
                source: el.getAttribute("source") || "",
                sourceid: el.getAttribute("sourceid") || "",
                type: el.getAttribute("type") || "",
                version: el.getAttribute("version") || "",
                cpu: el.getAttribute("cpu") || "",
                year: el.getAttribute("year") || "",
                severity: el.getAttribute("severity") || "",
                logString,
                _domElement: el,
            };
        });

        return {
            schema_version,
            version,
            rules,
        };
    } catch (e) {
        console.error("Failed to parse XML", e);
        return null;
    }
};
