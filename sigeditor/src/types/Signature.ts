export interface SignatureRule {
  id: string;
  actions: string; // e.g., "block,log"
  category: string;
  enabled: string; // "ON" | "OFF"
  source: string;
  sourceid: string;
  type: string;
  version: string;
  cpu: string;
  year: string;
  severity: string;
  logString: string; // From <LogString>
  // Preservation of raw references/patterns if needed for reconstruction
  // For now, we might not render them all, but we should parse them to keep the file integrity if we re-export.
  // However, simpler approach for MVP: store the original Element if possible?
  // No, let's map what we need. If we need to export fully, we might need to store the raw XML string of the node or use Source preservation.
  // Given the requirement "user can download the edited xml file", we must be careful not to lose data.
  // Best approach: Parse into a DOM, keep the DOM in memory, update the DOM when user edits, and serialize the DOM for export.
  // This avoids mapping 100% of the complex schemas like PatternList manually.
  
  // So the Interface here is mainly for the UI to consume.
  
  _domElement?: Element; // Reference to the original XML element for easy updating/serialization
}

export interface SignatureFile {
  schema_version: string;
  version: string;
  rules: SignatureRule[];
}
