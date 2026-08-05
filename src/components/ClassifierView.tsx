import React, { useState } from 'react';
import { ClassificationResult, User } from '../types';
import { 
  Sparkles, 
  Upload, 
  FileText, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  DollarSign, 
  Globe, 
  FileCheck, 
  ArrowRight,
  Layers,
  Info,
  Lock
} from 'lucide-react';

interface ClassifierViewProps {
  user: User;
  freeTriesRemaining: number;
  consumeFreeTry: () => boolean;
  onRequireAuth: (reason: string) => void;
  onClassificationComplete: (result: ClassificationResult) => void;
  onGenerateDeclaration: (result: ClassificationResult) => void;
}

export const ClassifierView: React.FC<ClassifierViewProps> = ({
  user,
  freeTriesRemaining,
  consumeFreeTry,
  onRequireAuth,
  onClassificationComplete,
  onGenerateDeclaration
}) => {
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [originCountry, setOriginCountry] = useState('IN');
  const [destinationCountry, setDestinationCountry] = useState('US');
  const [consigneeAddress, setConsigneeAddress] = useState('');
  const [declaredValue, setDeclaredValue] = useState('');
  const [rawBomText, setRawBomText] = useState('');
  const [fileDataUrl, setFileDataUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [classification, setClassification] = useState<ClassificationResult | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      setError('File size exceeds 15MB limit.');
      return;
    }

    setFileName(file.name);
    setFileType(file.type);

    const reader = new FileReader();
    reader.onload = () => {
      setFileDataUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!productName && !fileDataUrl && !rawBomText) {
      setError('Please provide a product name, invoice file upload, or Bill of Materials text.');
      return;
    }

    // Gatekeeping check: Guest user gets 1 free try
    if (!user.isAuthenticated && freeTriesRemaining <= 0) {
      onRequireAuth('You have used your 1 free try. Please sign in or register to run unlimited AI product classifications.');
      return;
    }

    setLoading(true);

    // Consume free try if guest
    if (!user.isAuthenticated) {
      consumeFreeTry();
    }

    try {
      const res = await fetch('/api/classify-product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': user.id || 'guest'
        },
        body: JSON.stringify({
          productName,
          productDescription,
          originCountry,
          destinationCountry,
          consigneeAddress,
          declaredValueUsd: declaredValue ? Number(declaredValue) : undefined,
          rawBomText,
          fileDataUrl,
          fileName,
          fileType,
          userId: user.id || 'guest'
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Classification failed.');
      }

      const result: ClassificationResult = await res.json();
      setClassification(result);
      onClassificationComplete(result);
    } catch (err: any) {
      console.error('Classification error:', err);
      setError(err.message || 'An error occurred during classification.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#0d2e1a] via-[#144227] to-[#0a2313] text-[#e3f4eb] p-6 sm:p-8 rounded-3xl border border-[#236b3f] shadow-xl mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1b5430] border border-emerald-500/40 text-emerald-200 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Multimodal AI Customs & WCO Nomenclature Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-sans tracking-tight">
              AI Product HS Code Classifier
            </h1>
            <p className="text-xs sm:text-sm text-emerald-200/90 mt-1 max-w-2xl">
              Upload invoices, product photos, or BOM text to automatically determine 6-to-10 digit HS codes, basic customs duties, IGST/VAT rates, and mandatory import regulatory checks.
            </p>
          </div>

          {!user.isAuthenticated && (
            <div className="bg-[#123821] p-3.5 rounded-2xl border border-amber-500/40 flex items-center gap-3 text-xs shrink-0">
              <Lock className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <p className="font-bold text-amber-200">
                  {freeTriesRemaining > 0 ? '1 Free AI Try Remaining' : 'Free Try Used'}
                </p>
                <p className="text-emerald-300 text-[11px]">
                  {freeTriesRemaining > 0 ? 'Try 1 classification without account' : 'Sign in for unlimited classifications'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Form Column */}
        <div className="lg:col-span-5 bg-[#0f321d] border border-[#23693e] rounded-2xl p-6 shadow-xl text-emerald-100">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            <span>Product & Trade Details</span>
          </h2>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-emerald-200 mb-1">
                Product Name / Item Title
              </label>
              <input
                type="text"
                value={productName}
                onChange={e => setProductName(e.target.value)}
                placeholder="e.g. Ayurvedic Vetiver Oil, Silk Saree, Brass Statue..."
                className="w-full px-3.5 py-2.5 bg-[#164328] border border-[#2b7c4a] rounded-xl text-white placeholder-emerald-500/70 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-emerald-200 mb-1">
                Product Description & Material Details
              </label>
              <textarea
                rows={3}
                value={productDescription}
                onChange={e => setProductDescription(e.target.value)}
                placeholder="100% steam-distilled botanical root extract, packed in amber glass bottles for export..."
                className="w-full px-3.5 py-2.5 bg-[#164328] border border-[#2b7c4a] rounded-xl text-white placeholder-emerald-500/70 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-emerald-200 mb-1">Origin Country</label>
                <select
                  value={originCountry}
                  onChange={e => setOriginCountry(e.target.value)}
                  className="w-full px-3 py-2 bg-[#164328] border border-[#2b7c4a] rounded-xl text-white text-xs"
                >
                  <option value="IN">India (IN)</option>
                  <option value="US">United States (US)</option>
                  <option value="CN">China (CN)</option>
                  <option value="DE">Germany (DE)</option>
                  <option value="GB">United Kingdom (UK)</option>
                  <option value="AE">UAE / Dubai (AE)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-emerald-200 mb-1">Destination Country</label>
                <select
                  value={destinationCountry}
                  onChange={e => setDestinationCountry(e.target.value)}
                  className="w-full px-3 py-2 bg-[#164328] border border-[#2b7c4a] rounded-xl text-white text-xs"
                >
                  <option value="US">United States (US)</option>
                  <option value="DE">Germany / EU (DE)</option>
                  <option value="GB">United Kingdom (GB)</option>
                  <option value="IN">India (IN)</option>
                  <option value="AE">UAE / Dubai (AE)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-emerald-200 mb-1">
                Delivery / Consignee Address (Optional)
              </label>
              <input
                type="text"
                value={consigneeAddress}
                onChange={e => setConsigneeAddress(e.target.value)}
                placeholder="e.g. Industriestrasse 42, 60311 Frankfurt, Germany or 100 Main St, NY, USA"
                className="w-full px-3.5 py-2.5 bg-[#164328] border border-[#2b7c4a] rounded-xl text-white placeholder-emerald-500/70 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-emerald-200 mb-1">
                Declared Value USD (Optional)
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-emerald-400 absolute left-3 top-2.5" />
                <input
                  type="number"
                  value={declaredValue}
                  onChange={e => setDeclaredValue(e.target.value)}
                  placeholder="e.g. 1450"
                  className="w-full pl-9 pr-3 py-2 bg-[#164328] border border-[#2b7c4a] rounded-xl text-white placeholder-emerald-500/70 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 font-mono"
                />
              </div>
            </div>

            {/* Document / Photo Upload */}
            <div>
              <label className="block text-xs font-semibold text-emerald-200 mb-1">
                Upload Commercial Invoice / Product Photo (PDF/JPG/PNG)
              </label>
              <div className="border-2 border-dashed border-[#287948] hover:border-emerald-400 rounded-xl p-4 text-center bg-[#133c24] transition-colors cursor-pointer relative">
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <Upload className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
                <span className="text-xs text-emerald-200 block font-medium">
                  {fileName ? fileName : 'Click or Drag Invoice / Product Photo here'}
                </span>
                <span className="text-[10px] text-emerald-400/80">Supports Multimodal OCR & Label Analysis</span>
              </div>
            </div>

            {/* BOM Text */}
            <div>
              <label className="block text-xs font-semibold text-emerald-200 mb-1">
                Raw Bill of Materials (BOM) / Invoice Spec Text
              </label>
              <textarea
                rows={2}
                value={rawBomText}
                onChange={e => setRawBomText(e.target.value)}
                placeholder="Component matrix: 85% Copper Alloy, 15% Zinc binding..."
                className="w-full px-3.5 py-2 bg-[#164328] border border-[#2b7c4a] rounded-xl text-white placeholder-emerald-500/70 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-[#071f11] font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-emerald-950 border-t-transparent rounded-full animate-spin" />
                  <span>AI Analyzing Tariff Rulings...</span>
                </div>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Run Autonomous AI Classification</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-7 space-y-6">
          {!classification ? (
            <div className="bg-[#0e2c19] border border-[#206339] rounded-2xl p-10 text-center text-emerald-200">
              <ShieldCheck className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white">Ready for AI Customs Audit</h3>
              <p className="text-xs text-emerald-300/80 max-w-md mx-auto mt-1">
                Provide details on the left and click "Run Autonomous AI Classification" to view complete WCO legal notes, duty rates, and clearance documents.
              </p>
            </div>
          ) : (
            <div className="bg-[#0e2c19] border border-[#206339] rounded-2xl p-6 shadow-xl space-y-6 animate-fade-in text-emerald-100">
              {/* Main Classification Result Banner */}
              <div className="bg-gradient-to-r from-[#144227] to-[#0c2e19] p-5 rounded-2xl border border-emerald-500/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>WCO Harmonized System Classification</span>
                  </div>
                  <h3 className="text-2xl font-extrabold text-white font-mono mt-1">
                    HS {classification.hsCode}
                  </h3>
                  <p className="text-xs text-emerald-200 font-medium mt-0.5">{classification.productName}</p>
                </div>

                <div className="text-right">
                  <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-extrabold font-mono">
                    {classification.confidenceScore}% AI Confidence
                  </div>
                  <button
                    type="button"
                    onClick={() => onGenerateDeclaration(classification)}
                    className="mt-3 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#092212] font-bold text-xs shadow transition-all flex items-center gap-1.5 ml-auto"
                  >
                    <FileCheck className="w-4 h-4" />
                    <span>Generate Customs Declaration</span>
                  </button>
                </div>
              </div>

              {/* Legal Chapter & Heading breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#123821] p-4 rounded-xl border border-[#22633a]">
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">Chapter Number & Title</span>
                  <p className="text-xs font-bold text-white mt-1">{classification.chapterNumber}</p>
                  <p className="text-[11px] text-emerald-200/90 mt-0.5">{classification.chapterTitle}</p>
                </div>

                <div className="bg-[#123821] p-4 rounded-xl border border-[#22633a]">
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">Subheading</span>
                  <p className="text-xs font-bold text-white mt-1 font-mono">{classification.subheadingNumber}</p>
                  <p className="text-[11px] text-emerald-200/90 mt-0.5">{classification.subheadingTitle}</p>
                </div>
              </div>

              {/* Duty Rates */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300 mb-2 flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-emerald-400" />
                  <span>Target Country Duty & Tariff Schedule</span>
                </h4>
                {classification.dutyRates.map((duty, idx) => (
                  <div key={idx} className="bg-[#10341e] border border-[#1f5f37] rounded-xl p-4 text-xs space-y-2">
                    <div className="flex items-center justify-between font-bold text-white border-b border-[#1b502e] pb-2">
                      <span>{duty.countryName}</span>
                      <span className="text-amber-300 font-mono">BCD: {duty.basicCustomsDuty}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-emerald-200">
                      <span>IGST / VAT: <strong className="text-white">{duty.igstOrVat}</strong></span>
                      <span>Preferential Rate: <strong className="text-emerald-300">{duty.preferentialRate}</strong></span>
                    </div>
                    <p className="text-[11px] text-emerald-300/80 italic">{duty.notes}</p>
                  </div>
                ))}
              </div>

              {/* WCO Legal Analysis Notes */}
              <div className="bg-[#0b2415] border border-[#1d5733] p-4 rounded-xl text-xs space-y-2">
                <span className="text-emerald-400 font-bold block flex items-center gap-1.5">
                  <Info className="w-4 h-4" />
                  <span>WCO Legal Explanatory Rules & Notes:</span>
                </span>
                <p className="text-emerald-200/90 leading-relaxed">{classification.wcoLegalNotes}</p>
              </div>

              {/* Mandatory Regulatory Checks */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300 mb-2 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Import Regulatory Clearance Regimes</span>
                </h4>
                <div className="space-y-2">
                  {classification.regulatoryChecks.map((reg) => (
                    <div key={reg.id} className="bg-[#123821] border border-[#22633a] p-3.5 rounded-xl text-xs">
                      <div className="flex items-center justify-between font-bold text-white mb-1">
                        <span>{reg.agency} — {reg.title}</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-600/40 text-[10px]">
                          {reg.status}
                        </span>
                      </div>
                      <p className="text-emerald-200 text-[11px]">{reg.description}</p>
                      <p className="text-amber-300/90 text-[10px] mt-1">Required: {reg.documentRequired}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
