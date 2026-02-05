import { useState, useMemo } from 'react';
import type { SignatureFile, SignatureRule } from './types/Signature';
import { parseXML } from './utils/xmlParser';
import { generateXML } from './utils/xmlGenerator';
import FileUpload from './components/FileUpload';
import SignatureGrid from './components/SignatureGrid';
import FilterPanel from './components/FilterPanel';
import ExportButton from './components/ExportButton';
import { ShieldCheck, Search } from 'lucide-react';

function App() {
  const [fileData, setFileData] = useState<SignatureFile | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('');
  const [filterEnabled, setFilterEnabled] = useState('');
  const [filterBlock, setFilterBlock] = useState('');
  const [filterLog, setFilterLog] = useState('');
  const [filterStats, setFilterStats] = useState('');
  const [searchText, setSearchText] = useState('');

  const handleFileUpload = (content: string) => {
    // ... existing ...
    const parsed = parseXML(content);
    if (parsed) {
      setFileData(parsed);
    } else {
      alert("Failed to parse XML file.");
    }
  };

  const handleExport = () => {
    // ... existing ...
    if (!fileData) return;
    const xmlString = generateXML(fileData);
    const blob = new Blob([xmlString], { type: 'text/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'edited_signatures.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleRuleUpdate = (updatedRule: SignatureRule) => {
    // ... existing ...
    if (!fileData) return;
    setFileData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        rules: prev.rules.map(r => r.id === updatedRule.id ? updatedRule : r)
      };
    });
  };

  const handleBatchUpdate = (updatedRules: SignatureRule[]) => {
    // ... existing ...
    if (!fileData) return;
    const updatesMap = new Map(updatedRules.map(r => [r.id, r]));

    setFileData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        rules: prev.rules.map(r => updatesMap.get(r.id) || r)
      };
    });
  };

  const handleResetFilters = () => {
    setSelectedCategory('');
    setSelectedSeverity('');
    setFilterEnabled('');
    setFilterBlock('');
    setFilterLog('');
    setFilterStats('');
    setSearchText('');
  };

  // Derive unique categories and severities for filters
  const { categories, severities } = useMemo(() => {
    if (!fileData) return { categories: [], severities: [] };
    const cats = Array.from(new Set(fileData.rules.map(r => r.category).filter(Boolean))).sort();
    const sevs = Array.from(new Set(fileData.rules.map(r => r.severity).filter(Boolean))).sort();
    return { categories: cats, severities: sevs };
  }, [fileData]);

  const filteredRules = useMemo(() => {
    if (!fileData) return [];
    return fileData.rules.filter(rule => {
      const matchCategory = selectedCategory ? rule.category === selectedCategory : true;
      const matchSeverity = selectedSeverity ? rule.severity === selectedSeverity : true;

      const matchEnabled = filterEnabled ? rule.enabled === filterEnabled : true;
      const actions = rule.actions.split(',').map(s => s.trim());
      const matchBlock = filterBlock ? (filterBlock === 'YES' ? actions.includes('block') : !actions.includes('block')) : true;
      const matchLog = filterLog ? (filterLog === 'YES' ? actions.includes('log') : !actions.includes('log')) : true;
      const matchStats = filterStats ? (filterStats === 'YES' ? actions.includes('stats') : !actions.includes('stats')) : true;

      const matchSearch = searchText ?
        (rule.id.toLowerCase().includes(searchText.toLowerCase()) ||
          rule.logString.toLowerCase().includes(searchText.toLowerCase())) : true;

      return matchCategory && matchSeverity && matchEnabled && matchBlock && matchLog && matchStats && matchSearch;
    });
  }, [fileData, selectedCategory, selectedSeverity, filterEnabled, filterBlock, filterLog, filterStats, searchText]);

  return (
    <div className="page-container">
      {/* Header */}
      <header className="page-header">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-primary to-secondary rounded-xl shadow-glow">
            <ShieldCheck className="text-white w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              NetScaler Signature Viewer
            </h1>
            <p className="text-text-muted">Manage and Audit XML Signature Rules</p>
          </div>
        </div>
        <div>
          {fileData && (
            <div className="flex gap-4 items-center">
              <div className="text-right mr-4 hidden sm:block">
                <div className="text-sm font-semibold text-text">{fileData.rules.length} Rules</div>
                <div className="text-xs text-text-muted">v{fileData.version} (Schema {fileData.schema_version})</div>
              </div>
              <ExportButton onExport={handleExport} />
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      <main>
        {!fileData ? (
          <div className="max-w-2xl mx-auto mt-20">
            <FileUpload onFileUpload={handleFileUpload} />
          </div>
        ) : (
          <div className="app-layout fade-in-up">
            {/* Sidebar (Filters) - Left Side */}
            <div className="sidebar-column">
              <FilterPanel
                categories={categories}
                severities={severities}
                selectedCategory={selectedCategory}
                selectedSeverity={selectedSeverity}
                filterEnabled={filterEnabled}
                filterBlock={filterBlock}
                filterLog={filterLog}
                filterStats={filterStats}
                onCategoryChange={setSelectedCategory}
                onSeverityChange={setSelectedSeverity}
                onFilterEnabledChange={setFilterEnabled}
                onFilterBlockChange={setFilterBlock}
                onFilterLogChange={setFilterLog}
                onFilterStatsChange={setFilterStats}
                onReset={handleResetFilters}
              />
              <div className="mt-6 text-center text-text-muted text-sm glass-panel p-4">
                <div className="font-semibold text-text mb-1">Status</div>
                Showing {filteredRules.length} of {fileData.rules.length} rules
              </div>
            </div>

            {/* Main Content (Grid & Search) */}
            <div className="main-column">
              {/* Global Search */}
              <div className="relative w-full max-w-2xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search signatures by ID or Log content..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-surface border border-border rounded-xl text-text shadow-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary focus:shadow-glow transition-all"
                />
              </div>

              <SignatureGrid
                rules={filteredRules}
                onRuleUpdate={handleRuleUpdate}
                onBatchUpdate={handleBatchUpdate}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
