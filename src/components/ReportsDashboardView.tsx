import React, { useState, useEffect } from 'react';
import { ClassificationResult, User } from '../types';
import { exportClassificationsToCSV } from '../utils/csvExporter';
import { 
  FileText, 
  Download, 
  Search, 
  Trash2, 
  FileCheck, 
  ShieldCheck, 
  Lock, 
  Sparkles,
  Calendar,
  Globe,
  ArrowRight
} from 'lucide-react';

interface ReportsDashboardViewProps {
  user: User;
  onRequireAuth: (reason: string) => void;
  onSelectClassificationForDeclaration: (classification: ClassificationResult) => void;
  freeTriesRemaining: number;
}

export const ReportsDashboardView: React.FC<ReportsDashboardViewProps> = ({
  user,
  onRequireAuth,
  onSelectClassificationForDeclaration,
  freeTriesRemaining
}) => {
  const [classifications, setClassifications] = useState<ClassificationResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterQuery, setFilterQuery] = useState('');

  const fetchClassifications = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/classifications?userId=${user.id || 'guest'}`, {
        headers: {
          'X-User-Id': user.id || 'guest'
        }
      });
      if (res.ok) {
        const data = await res.json();
        setClassifications(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.warn('Failed to fetch classifications:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassifications();
  }, [user.id]);

  const handleExportCSV = () => {
    // Gatekeeping CSV download for guest users if free try exhausted
    if (!user.isAuthenticated && freeTriesRemaining <= 0) {
      onRequireAuth('Please sign in or register to download complete CSV customs audit reports.');
      return;
    }

    if (classifications.length === 0) return;
    exportClassificationsToCSV(classifications, `HarMonie_Classifications_${user.name || 'User'}.csv`);
  };

  const filteredItems = classifications.filter(c => {
    if (!filterQuery) return true;
    const q = filterQuery.toLowerCase();
    return (
      c.productName.toLowerCase().includes(q) ||
      c.hsCode.toLowerCase().includes(q) ||
      c.chapterTitle.toLowerCase().includes(q) ||
      c.originCountry.toLowerCase().includes(q) ||
      c.destinationCountry.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0d2e1a] via-[#144227] to-[#0a2313] text-[#e3f4eb] p-6 sm:p-8 rounded-3xl border border-[#236b3f] shadow-xl mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1b5430] border border-emerald-500/40 text-emerald-200 text-xs font-semibold mb-3">
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              <span>User Data Isolated Audit Vault</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-sans tracking-tight">
              Saved Reports & Declaration Archive
            </h1>
            <p className="text-xs sm:text-sm text-emerald-200/90 mt-1 max-w-2xl">
              Access your personal audit trail of classified commodities, customs duty schedules, and official export declaration forms.
            </p>
          </div>

          <button
            type="button"
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#071f11] font-bold text-xs sm:text-sm shadow transition-all flex items-center gap-2 shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV Audit Report</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-[#0f321d] border border-[#23693e] rounded-2xl p-4 sm:p-5 shadow-lg mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-emerald-400 absolute left-3 top-3" />
          <input
            type="text"
            value={filterQuery}
            onChange={e => setFilterQuery(e.target.value)}
            placeholder="Search saved classifications..."
            className="w-full pl-9 pr-3 py-2 bg-[#164328] border border-[#2b7c4a] rounded-xl text-white placeholder-emerald-400/60 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>

        <div className="text-xs text-emerald-300 font-semibold flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>
            Account: <strong className="text-white">{user.name || user.email || 'Guest Session'}</strong>
          </span>
        </div>
      </div>

      {/* Classifications List Grid */}
      {loading ? (
        <div className="py-16 text-center text-emerald-300">
          <div className="w-8 h-8 border-3 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-semibold">Loading your saved classifications...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-[#0e2c19] border border-[#206339] rounded-2xl p-12 text-center text-emerald-200">
          <FileText className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No Saved Classifications Yet</h3>
          <p className="text-xs text-emerald-300/80 max-w-sm mx-auto mt-1">
            Run an AI Product Classification to save and view your commodity audit records here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredItems.map(item => (
            <div
              key={item.id}
              className="bg-[#0e2c19] border border-[#206339] rounded-2xl p-6 shadow-xl text-emerald-100 flex flex-col justify-between hover:border-emerald-400/70 transition-all"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#1f5f37] mb-4">
                  <span className="font-mono font-extrabold text-lg text-emerald-400">
                    HS {item.hsCode}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[11px] font-bold font-mono">
                    {item.confidenceScore}% Score
                  </span>
                </div>

                <h3 className="text-base font-bold text-white font-sans">{item.productName}</h3>
                <p className="text-xs text-emerald-200/80 mt-1 line-clamp-2">{item.productDescription}</p>

                <div className="mt-4 p-3 rounded-xl bg-[#092213] border border-[#1a502e] grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-emerald-400 font-bold block">Route</span>
                    <span className="text-white font-mono">{item.originCountry} → {item.destinationCountry}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-400 font-bold block">Declared Value</span>
                    <span className="text-amber-300 font-mono font-bold">${item.declaredValueUsd}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#1f5f37] flex items-center justify-between gap-3">
                <span className="text-[10px] text-emerald-400/80 font-mono">
                  {new Date(item.classifiedAt).toLocaleDateString()}
                </span>

                <button
                  type="button"
                  onClick={() => onSelectClassificationForDeclaration(item)}
                  className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#071f11] font-bold text-xs shadow flex items-center gap-1.5 transition-all"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>View Declaration</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
