import React, { useState, useEffect } from 'react';
import { ClassificationResult, CustomsDeclaration, User } from '../types';
import { FileText, X, Printer, Download, ShieldCheck, CheckCircle2, Building, Edit3, Save } from 'lucide-react';

interface DeclarationModalProps {
  isOpen: boolean;
  onClose: () => void;
  classification: ClassificationResult | null;
  user: User;
}

export const DeclarationModal: React.FC<DeclarationModalProps> = ({
  isOpen,
  onClose,
  classification,
  user
}) => {
  const [declaration, setDeclaration] = useState<CustomsDeclaration | null>(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Editable fields
  const [exporterName, setExporterName] = useState('');
  const [exporterAddress, setExporterAddress] = useState('');
  const [exporterTaxId, setExporterTaxId] = useState('');
  const [consigneeName, setConsigneeName] = useState('');
  const [consigneeAddress, setConsigneeAddress] = useState('');
  const [consigneeCountry, setConsigneeCountry] = useState('');
  const [incoterms, setIncoterms] = useState('FOB');

  useEffect(() => {
    if (!isOpen || !classification) return;

    const generateDecl = async () => {
      setLoading(true);
      try {
        const defaultConsigneeName = classification.consigneeName || 'Global Import Partners';
        const defaultConsigneeAddr = classification.consigneeAddress || 
          (classification.destinationCountry === 'DE' ? 'Industriestrasse 42, 60311 Frankfurt, Germany' :
           classification.destinationCountry === 'US' ? '100 Main Street, Suite 400, New York, NY 10001, USA' :
           classification.destinationCountry === 'GB' ? '15 Trade Way, London EC1A 1BB, United Kingdom' :
           classification.destinationCountry === 'IN' ? 'Cargo Complex, Sahar, Mumbai 400099, India' :
           'Free Zone Logistics Hub, Dubai, UAE');

        const res = await fetch('/api/generate-declaration', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-User-Id': user.id || 'guest'
          },
          body: JSON.stringify({
            classificationId: classification.id,
            exporterName: user.companyName || user.name || 'Veritas Exports Ltd.',
            consigneeName: defaultConsigneeName,
            consigneeAddress: defaultConsigneeAddr,
            incoterms: 'FOB'
          })
        });

        if (res.ok) {
          const data: CustomsDeclaration = await res.json();
          // Ensure correct country and address assignment
          if (classification.consigneeAddress) data.consigneeAddress = classification.consigneeAddress;
          if (classification.destinationCountry) {
            data.consigneeCountry = classification.destinationCountry === 'DE' ? 'Germany (DE)' :
              classification.destinationCountry === 'US' ? 'United States (US)' :
              classification.destinationCountry === 'GB' ? 'United Kingdom (GB)' :
              classification.destinationCountry === 'IN' ? 'India (IN)' :
              classification.destinationCountry === 'AE' ? 'United Arab Emirates (AE)' : classification.destinationCountry;
          }
          setDeclaration(data);
          setExporterName(data.exporterName);
          setExporterAddress(data.exporterAddress);
          setExporterTaxId(data.exporterTaxId);
          setConsigneeName(data.consigneeName);
          setConsigneeAddress(data.consigneeAddress);
          setConsigneeCountry(data.consigneeCountry);
          setIncoterms(data.incoterms || 'FOB');
        }
      } catch (e) {
        console.warn('Failed to generate declaration from backend:', e);
      } finally {
        setLoading(false);
      }
    };

    generateDecl();
  }, [isOpen, classification, user]);

  if (!isOpen || !classification) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleSaveEdits = (e: React.FormEvent) => {
    e.preventDefault();
    if (!declaration) return;
    setDeclaration({
      ...declaration,
      exporterName,
      exporterAddress,
      exporterTaxId,
      consigneeName,
      consigneeAddress,
      consigneeCountry,
      incoterms
    });
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl bg-[#0e2c19] text-[#e3f4eb] border border-[#206339] rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        {/* Header & Actions */}
        <div className="flex items-center justify-between border-b border-[#1f5f37] pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-sans">
                Official Customs Export/Import Declaration
              </h2>
              <span className="text-xs text-emerald-300 font-mono">
                {declaration ? declaration.declarationNumber : 'Generating Certificate...'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {declaration && !isEditing && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-3 py-1.5 rounded-lg bg-emerald-700/80 hover:bg-emerald-600 text-white font-bold text-xs shadow transition-all flex items-center gap-1.5 border border-emerald-500/40"
              >
                <Edit3 className="w-3.5 h-3.5 text-emerald-300" />
                <span>Edit Address & Parties</span>
              </button>
            )}
            <button
              type="button"
              onClick={handlePrint}
              className="p-2 rounded-lg bg-[#184529] hover:bg-[#215a37] text-emerald-200 hover:text-white border border-[#276e42] transition-colors"
              title="Print Certificate"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg bg-[#184529] hover:bg-[#215a37] text-emerald-200 hover:text-white border border-[#276e42] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-emerald-300">
            <div className="w-8 h-8 border-3 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-semibold">Compiling Customs Clearance Certificate & Tax Rates...</p>
          </div>
        ) : declaration ? (
          <div className="space-y-6 text-xs text-emerald-100">
            {/* Inline Address / Parties Editor */}
            {isEditing ? (
              <form onSubmit={handleSaveEdits} className="bg-[#0a2313] p-5 rounded-2xl border border-emerald-500/50 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-emerald-400" />
                  <span>Update Shipper & Delivery Address Details</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Shipper */}
                  <div className="space-y-2">
                    <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">Shipper / Exporter</span>
                    <div>
                      <label className="block text-[11px] text-emerald-200 mb-0.5">Exporter Company Name</label>
                      <input
                        type="text"
                        value={exporterName}
                        onChange={e => setExporterName(e.target.value)}
                        className="w-full px-3 py-1.5 bg-[#143e24] border border-[#23683f] rounded-lg text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-emerald-200 mb-0.5">Exporter Street Address</label>
                      <textarea
                        rows={2}
                        value={exporterAddress}
                        onChange={e => setExporterAddress(e.target.value)}
                        className="w-full px-3 py-1.5 bg-[#143e24] border border-[#23683f] rounded-lg text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-emerald-200 mb-0.5">Exporter Tax ID / IEC</label>
                      <input
                        type="text"
                        value={exporterTaxId}
                        onChange={e => setExporterTaxId(e.target.value)}
                        className="w-full px-3 py-1.5 bg-[#143e24] border border-[#23683f] rounded-lg text-white text-xs font-mono"
                      />
                    </div>
                  </div>

                  {/* Consignee */}
                  <div className="space-y-2">
                    <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">Consignee / Delivery Address</span>
                    <div>
                      <label className="block text-[11px] text-emerald-200 mb-0.5">Consignee Business Name</label>
                      <input
                        type="text"
                        value={consigneeName}
                        onChange={e => setConsigneeName(e.target.value)}
                        className="w-full px-3 py-1.5 bg-[#143e24] border border-[#23683f] rounded-lg text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-emerald-200 mb-0.5">Full Delivery Address</label>
                      <textarea
                        rows={2}
                        value={consigneeAddress}
                        onChange={e => setConsigneeAddress(e.target.value)}
                        className="w-full px-3 py-1.5 bg-[#143e24] border border-[#23683f] rounded-lg text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-emerald-200 mb-0.5">Consignee Country</label>
                      <input
                        type="text"
                        value={consigneeCountry}
                        onChange={e => setConsigneeCountry(e.target.value)}
                        className="w-full px-3 py-1.5 bg-[#143e24] border border-[#23683f] rounded-lg text-white text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-[#1a502e]">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-3 py-1.5 rounded-lg bg-[#143e24] text-emerald-200 text-xs font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-emerald-500 text-[#071f11] font-bold text-xs shadow flex items-center gap-1"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Apply Address Updates</span>
                  </button>
                </div>
              </form>
            ) : (
              /* Parties Info Grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#0a2313] p-4 rounded-xl border border-[#1a502e]">
                <div>
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">Shipper / Exporter</span>
                  <p className="font-bold text-white mt-1">{declaration.exporterName}</p>
                  <p className="text-emerald-300/80">{declaration.exporterAddress}</p>
                  <p className="font-mono text-[11px] text-amber-300 mt-1">Tax ID: {declaration.exporterTaxId}</p>
                </div>

                <div>
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">Consignee / Delivery Address</span>
                  <p className="font-bold text-white mt-1">{declaration.consigneeName}</p>
                  <p className="text-emerald-300/80">{declaration.consigneeAddress}</p>
                  <p className="font-mono text-[11px] text-emerald-300 mt-1">Country: {declaration.consigneeCountry}</p>
                </div>
              </div>
            )}

            {/* Line Items Table */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-300 mb-2">
                Declared Commodity Matrix
              </h3>
              <div className="bg-[#10341e] border border-[#1f5f37] rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#143e24] text-emerald-300 font-bold border-b border-[#1f5f37]">
                    <tr>
                      <th className="p-3">HS Code</th>
                      <th className="p-3">Description</th>
                      <th className="p-3">Origin</th>
                      <th className="p-3 text-right">Declared Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1b502e]">
                    <tr>
                      <td className="p-3 font-mono font-bold text-emerald-400">{classification.hsCode}</td>
                      <td className="p-3 text-white font-medium">{classification.productName}</td>
                      <td className="p-3 font-mono">{classification.originCountry}</td>
                      <td className="p-3 text-right font-mono font-bold text-amber-300">${classification.declaredValueUsd} USD</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Legal Certification stamp */}
            <div className="bg-[#123821] border border-emerald-500/40 rounded-xl p-4 flex items-start gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white text-xs">Certified WCO HS Compliance Audit</p>
                <p className="text-[11px] text-emerald-200/90 mt-0.5">{declaration.complianceCertifiedBy}</p>
                <p className="text-[10px] text-emerald-400 mt-1">Certified On: {new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
