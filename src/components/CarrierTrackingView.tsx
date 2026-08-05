import React, { useState, useEffect } from 'react';
import { CarrierShipment, User } from '../types';
import { SAMPLE_CARRIER_SHIPMENTS } from '../data/sampleData';
import { 
  Truck, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Plus, 
  ShieldCheck, 
  RefreshCw, 
  MapPin, 
  ArrowRight,
  Sparkles,
  Lock,
  Building,
  FileCheck,
  Edit3
} from 'lucide-react';

interface CarrierTrackingViewProps {
  user: User;
  onRequireAuth: (reason: string) => void;
  freeTriesRemaining: number;
}

export const CarrierTrackingView: React.FC<CarrierTrackingViewProps> = ({
  user,
  onRequireAuth,
  freeTriesRemaining
}) => {
  const [shipments, setShipments] = useState<CarrierShipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTracking, setSearchTracking] = useState('');
  const [selectedShipmentId, setSelectedShipmentId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Edit Shipment Address Modal State
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editOrigin, setEditOrigin] = useState('');
  const [editDestination, setEditDestination] = useState('');
  const [editConsigneeName, setEditConsigneeName] = useState('');
  const [editConsigneeAddress, setEditConsigneeAddress] = useState('');
  const [editDeclaredValue, setEditDeclaredValue] = useState('');

  // Form states for adding new shipment
  const [newTrackingNumber, setNewTrackingNumber] = useState('');
  const [newCarrier, setNewCarrier] = useState('DHL Express');
  const [newOrigin, setNewOrigin] = useState('Mumbai Air Cargo (BOM), India');
  const [newDestination, setNewDestination] = useState('Frankfurt Airport (FRA), Germany');
  const [newConsigneeName, setNewConsigneeName] = useState('Global Import Partners GmbH');
  const [newConsigneeAddress, setNewConsigneeAddress] = useState('Industriestrasse 42, 60311 Frankfurt, Germany');
  const [newHsCode, setNewHsCode] = useState('3301.29.9010');
  const [newProductName, setNewProductName] = useState('Ayurvedic Essential Oils Export');
  const [newDeclaredValue, setNewDeclaredValue] = useState('1450');

  const fetchShipments = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/carrier-shipments?userId=${user.id || 'guest'}`, {
        headers: { 'X-User-Id': user.id || 'guest' }
      });
      if (res.ok) {
        const data = await res.json();
        setShipments(data && data.length > 0 ? data : SAMPLE_CARRIER_SHIPMENTS);
        if (data && data.length > 0) setSelectedShipmentId(data[0].id);
        else setSelectedShipmentId(SAMPLE_CARRIER_SHIPMENTS[0].id);
      } else {
        setShipments(SAMPLE_CARRIER_SHIPMENTS);
        setSelectedShipmentId(SAMPLE_CARRIER_SHIPMENTS[0].id);
      }
    } catch (e) {
      console.warn('Failed to fetch shipments, using sample data:', e);
      setShipments(SAMPLE_CARRIER_SHIPMENTS);
      setSelectedShipmentId(SAMPLE_CARRIER_SHIPMENTS[0].id);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, [user.id]);

  const handleSimulateEvent = async (shipmentId: string, status: string, description: string) => {
    try {
      const res = await fetch(`/api/carrier-shipments/${shipmentId}/simulate-event`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': user.id || 'guest'
        },
        body: JSON.stringify({
          status,
          eventDescription: description,
          location: 'Customs Clearance EDI Hub'
        })
      });

      if (res.ok) {
        const updated = await res.json();
        setShipments(prev => prev.map(s => s.id === shipmentId ? updated : s));
      }
    } catch (e) {
      console.error('Failed to simulate event:', e);
    }
  };

  const handleAddShipmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user.isAuthenticated && freeTriesRemaining <= 0) {
      onRequireAuth('Please sign in or register to add and track custom carrier shipments.');
      return;
    }

    try {
      const res = await fetch('/api/carrier-shipments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': user.id || 'guest'
        },
        body: JSON.stringify({
          trackingNumber: newTrackingNumber || `TRK-${Date.now().toString().slice(-8)}`,
          carrier: newCarrier,
          origin: newOrigin,
          destination: newDestination,
          hsCode: newHsCode,
          productName: newProductName,
          declaredValueUsd: Number(newDeclaredValue) || 1000,
          userId: user.id || 'guest'
        })
      });

      if (res.ok) {
        const created = await res.json();
        setShipments(prev => [created, ...prev]);
        setSelectedShipmentId(created.id);
        setShowAddForm(false);
        setNewTrackingNumber('');
      }
    } catch (e) {
      console.error('Failed to add shipment:', e);
    }
  };

  const openEditAddressModal = (shipment: CarrierShipment) => {
    setEditOrigin(shipment.origin || '');
    setEditDestination(shipment.destination || '');
    setEditConsigneeName(shipment.consigneeName || 'Global Trade Partners');
    setEditConsigneeAddress(shipment.consigneeAddress || shipment.destination || '');
    setEditDeclaredValue(String(shipment.declaredValueUsd || 1000));
    setIsEditingAddress(true);
  };

  const handleSaveAddressEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeShipment) return;

    try {
      const res = await fetch(`/api/carrier-shipments/${activeShipment.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': user.id || 'guest'
        },
        body: JSON.stringify({
          origin: editOrigin,
          destination: editDestination,
          consigneeName: editConsigneeName,
          consigneeAddress: editConsigneeAddress,
          declaredValueUsd: Number(editDeclaredValue) || activeShipment.declaredValueUsd
        })
      });

      if (res.ok) {
        const updated = await res.json();
        setShipments(prev => prev.map(s => s.id === updated.id ? updated : s));
        setIsEditingAddress(false);
      } else {
        // Fallback local state update
        setShipments(prev => prev.map(s => s.id === activeShipment.id ? {
          ...s,
          origin: editOrigin,
          destination: editDestination,
          consigneeName: editConsigneeName,
          consigneeAddress: editConsigneeAddress,
          declaredValueUsd: Number(editDeclaredValue) || s.declaredValueUsd
        } : s));
        setIsEditingAddress(false);
      }
    } catch (e) {
      console.error('Failed to update address:', e);
      setIsEditingAddress(false);
    }
  };

  const activeShipment = shipments.find(s => s.id === selectedShipmentId) || shipments[0];

  const filteredShipments = shipments.filter(s => {
    if (!searchTracking) return true;
    const q = searchTracking.toLowerCase();
    return s.trackingNumber.toLowerCase().includes(q) || s.carrier.toLowerCase().includes(q) || s.productName.toLowerCase().includes(q);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0d2e1a] via-[#144227] to-[#0a2313] text-[#e3f4eb] p-6 sm:p-8 rounded-3xl border border-[#236b3f] shadow-xl mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1b5430] border border-emerald-500/40 text-emerald-200 text-xs font-semibold mb-3">
              <Truck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Multi-Carrier Customs Clearance & Logistics Tracking</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-sans tracking-tight">
              Carrier Compliance Tracking
            </h1>
            <p className="text-xs sm:text-sm text-emerald-200/90 mt-1 max-w-2xl">
              Real-time customs clearance audit logs for DHL Express, FedEx, UPS, India Post EMS, and Maersk with live ICEGATE / Customs clearance simulations.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#071f11] font-bold text-xs sm:text-sm shadow transition-all flex items-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Track New Shipment</span>
          </button>
        </div>
      </div>

      {/* Pre-populated Test Tracking Numbers Section */}
      <div className="bg-[#0e2c19] border border-[#206339] rounded-2xl p-4 sm:p-5 mb-8 text-emerald-100">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 uppercase tracking-wider mb-3">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>Click Sample Tracking Numbers to Test Live Customs Tracking:</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => setSelectedShipmentId('SHP-DHL-948102')}
            className={`p-3 rounded-xl border text-left transition-all ${
              selectedShipmentId === 'SHP-DHL-948102'
                ? 'bg-[#1a4a2b] border-emerald-400 text-white shadow-md'
                : 'bg-[#123821] border-[#22633a] text-emerald-200 hover:border-emerald-500/60'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-bold text-amber-300">
              <span>DHL-94810293</span>
              <span className="px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-600/40 text-[10px]">IN TRANSIT</span>
            </div>
            <p className="text-[11px] font-medium text-emerald-100 mt-1">DHL Express • Vetiver Essential Oils</p>
            <p className="text-[10px] text-emerald-300/80 mt-0.5">Mumbai (BOM) → Frankfurt (FRA)</p>
          </button>

          <button
            type="button"
            onClick={() => setSelectedShipmentId('SHP-FEDEX-881029')}
            className={`p-3 rounded-xl border text-left transition-all ${
              selectedShipmentId === 'SHP-FEDEX-881029'
                ? 'bg-[#1a4a2b] border-emerald-400 text-white shadow-md'
                : 'bg-[#123821] border-[#22633a] text-emerald-200 hover:border-emerald-500/60'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-bold text-amber-300">
              <span>FEDEX-88102941</span>
              <span className="px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-600/40 text-[10px]">CUSTOMS HOLD</span>
            </div>
            <p className="text-[11px] font-medium text-emerald-100 mt-1">FedEx • Brass Handicraft Statues</p>
            <p className="text-[10px] text-emerald-300/80 mt-0.5">Delhi (DEL) → New York (JFK)</p>
          </button>

          <button
            type="button"
            onClick={() => setSelectedShipmentId('SHP-UPS-1Z9999')}
            className={`p-3 rounded-xl border text-left transition-all ${
              selectedShipmentId === 'SHP-UPS-1Z9999'
                ? 'bg-[#1a4a2b] border-emerald-400 text-white shadow-md'
                : 'bg-[#123821] border-[#22633a] text-emerald-200 hover:border-emerald-500/60'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-bold text-emerald-300">
              <span>UPS-1Z999999999</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-600/40 text-[10px]">CLEARED</span>
            </div>
            <p className="text-[11px] font-medium text-emerald-100 mt-1">UPS • Handloom Mulberry Silk</p>
            <p className="text-[10px] text-emerald-300/80 mt-0.5">Chennai (MAA) → London (LHR)</p>
          </button>
        </div>
      </div>

      {/* Add Shipment Form Modal / Collapsible */}
      {showAddForm && (
        <div className="bg-[#0f321d] border border-emerald-500/50 rounded-2xl p-6 shadow-xl mb-8 animate-fade-in">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-emerald-400" />
            <span>Add Custom Carrier Shipment for Tracking</span>
          </h3>
          <form onSubmit={handleAddShipmentSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-emerald-200 mb-1">Tracking Number</label>
              <input
                type="text"
                required
                value={newTrackingNumber}
                onChange={e => setNewTrackingNumber(e.target.value)}
                placeholder="DHL-99210294 or FEDEX-129481"
                className="w-full px-3 py-2 bg-[#164328] border border-[#2b7c4a] rounded-xl text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-emerald-200 mb-1">Carrier Service</label>
              <select
                value={newCarrier}
                onChange={e => setNewCarrier(e.target.value)}
                className="w-full px-3 py-2 bg-[#164328] border border-[#2b7c4a] rounded-xl text-white text-xs"
              >
                <option value="DHL Express">DHL Express</option>
                <option value="FedEx Cross-Border">FedEx Cross-Border</option>
                <option value="UPS Supply Chain">UPS Supply Chain</option>
                <option value="India Post EMS">India Post EMS</option>
                <option value="Maersk Line">Maersk Line</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-emerald-200 mb-1">Product Name</label>
              <input
                type="text"
                value={newProductName}
                onChange={e => setNewProductName(e.target.value)}
                placeholder="Spices / Essential Oils / Textiles"
                className="w-full px-3 py-2 bg-[#164328] border border-[#2b7c4a] rounded-xl text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-emerald-200 mb-1">HS Code</label>
              <input
                type="text"
                value={newHsCode}
                onChange={e => setNewHsCode(e.target.value)}
                placeholder="3301.29.9010"
                className="w-full px-3 py-2 bg-[#164328] border border-[#2b7c4a] rounded-xl text-white text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-emerald-200 mb-1">Origin Port / Cargo Hub</label>
              <input
                type="text"
                value={newOrigin}
                onChange={e => setNewOrigin(e.target.value)}
                placeholder="Mumbai Air Cargo (BOM)"
                className="w-full px-3 py-2 bg-[#164328] border border-[#2b7c4a] rounded-xl text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-emerald-200 mb-1">Destination Airport / Hub</label>
              <input
                type="text"
                value={newDestination}
                onChange={e => setNewDestination(e.target.value)}
                placeholder="Frankfurt Airport (FRA)"
                className="w-full px-3 py-2 bg-[#164328] border border-[#2b7c4a] rounded-xl text-white text-xs"
              />
            </div>

            <div className="sm:col-span-2 flex items-center justify-end gap-3 mt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 rounded-xl bg-[#174327] text-emerald-200 hover:text-white text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#071f11] font-bold text-xs shadow"
              >
                Add & Start Tracking
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Grid Layout: Shipment List vs Detailed View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Shipment List */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-emerald-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTracking}
              onChange={e => setSearchTracking(e.target.value)}
              placeholder="Filter by tracking # or carrier..."
              className="w-full pl-9 pr-3 py-2 bg-[#0e2c19] border border-[#206339] rounded-xl text-white placeholder-emerald-400/60 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {filteredShipments.map((s) => {
              const isSelected = activeShipment?.id === s.id;
              return (
                <div
                  key={s.id}
                  onClick={() => setSelectedShipmentId(s.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#164828] border-emerald-400 text-white shadow-lg'
                      : 'bg-[#0d2a17] border-[#1f5e36] text-emerald-200 hover:bg-[#123820]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono font-bold text-xs text-amber-300">{s.trackingNumber}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      s.status === 'CUSTOMS_CLEARED' || s.status === 'DELIVERED'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-600/40'
                        : s.status === 'CUSTOMS_HOLD'
                        ? 'bg-amber-950 text-amber-300 border border-amber-600/40'
                        : 'bg-blue-950 text-blue-300 border border-blue-600/40'
                    }`}>
                      {s.status.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="text-xs font-bold text-white truncate">{s.productName}</p>
                  <div className="flex items-center justify-between text-[11px] text-emerald-300/80 mt-1">
                    <span>{s.carrier}</span>
                    <span className="font-mono">HS {s.hsCode}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Live Tracking Detail & Event Simulator */}
        {activeShipment && (
          <div className="lg:col-span-2 space-y-6">
            {/* Shipment Summary Card */}
            <div className="bg-[#0e2c19] border border-[#206339] rounded-2xl p-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1f5f37]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-extrabold text-white font-mono">{activeShipment.trackingNumber}</span>
                    <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold">
                      {activeShipment.carrier}
                    </span>
                  </div>
                  <p className="text-xs text-emerald-300 mt-1 font-semibold">{activeShipment.productName}</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-xs text-emerald-400 font-semibold block">Declared Value (USD)</span>
                    <span className="text-lg font-bold text-amber-300 font-mono">${activeShipment.declaredValueUsd}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => openEditAddressModal(activeShipment)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-700/80 hover:bg-emerald-600 text-white font-bold text-xs shadow transition-all flex items-center gap-1.5 border border-emerald-500/40"
                    title="Edit Delivery Address & Route"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Edit Delivery Address</span>
                  </button>
                </div>
              </div>

              {/* Route Progress & Delivery Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6 p-4 rounded-xl bg-[#092213] border border-[#1a502e]">
                <div>
                  <span className="text-[10px] text-emerald-400 uppercase tracking-wider block font-bold">Origin Cargo Port / Exporter</span>
                  <p className="text-xs font-bold text-white mt-0.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{activeShipment.origin}</span>
                  </p>
                </div>

                <div>
                  <span className="text-[10px] text-emerald-400 uppercase tracking-wider block font-bold">Destination Delivery Address</span>
                  <p className="text-xs font-bold text-white mt-0.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{activeShipment.destination}</span>
                  </p>
                  {activeShipment.consigneeAddress && (
                    <p className="text-[11px] text-emerald-300/80 mt-1 pl-5">
                      Consignee: {activeShipment.consigneeName || 'Importer'} — {activeShipment.consigneeAddress}
                    </p>
                  )}
                </div>
              </div>

              {/* Interactive Customs Clearance Simulator Controls */}
              <div className="bg-[#123922] p-4 rounded-xl border border-emerald-500/30 mb-6">
                <span className="text-xs font-bold text-emerald-200 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Test Live Customs Clearance Status Simulation:</span>
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleSimulateEvent(activeShipment.id, 'CUSTOMS_CLEARED', 'ICEGATE Customs EDI clearance verified. Duty payment confirmed.')}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Simulate Customs Clearance</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSimulateEvent(activeShipment.id, 'CUSTOMS_HOLD', 'Customs inspection hold triggered: Certificate of Origin verification required.')}
                    className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Trigger Customs Hold</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSimulateEvent(activeShipment.id, 'DELIVERED', 'Consignee delivery completed. Customs audit trail archived.')}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Mark Delivered</span>
                  </button>
                </div>
              </div>

              {/* Checkpoints Timeline */}
              <div>
                <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span>Customs & Carrier Audit Timeline</span>
                </h4>

                <div className="space-y-4 relative pl-4 border-l-2 border-emerald-700/60 ml-2">
                  {activeShipment.checkpoints.map((chk, idx) => (
                    <div key={chk.id || idx} className="relative group">
                      <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0e2c19]" />
                      <div className="bg-[#10341e] border border-[#1f5f37] rounded-xl p-3.5 text-xs">
                        <div className="flex items-center justify-between font-mono text-[11px] text-emerald-300">
                          <span>{new Date(chk.timestamp).toLocaleString()}</span>
                          <span className="font-bold text-amber-300">{chk.location}</span>
                        </div>
                        <p className="text-emerald-100 font-semibold mt-1">{chk.description}</p>
                        {chk.customsNote && (
                          <div className="mt-2 text-[11px] text-emerald-400/90 italic bg-[#0a2213] p-2 rounded border border-emerald-800/40">
                            Customs Audit Note: {chk.customsNote}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Address & Route Modal */}
      {isEditingAddress && activeShipment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-[#0e2c19] text-[#e3f4eb] border border-[#206339] rounded-2xl shadow-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 border-b border-[#1f5f37] pb-3">
              <Edit3 className="w-5 h-5 text-emerald-400" />
              <span>Edit Delivery Address & Route Details</span>
            </h3>

            <form onSubmit={handleSaveAddressEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-emerald-200 mb-1">
                  Origin Cargo Port / Exporter Address
                </label>
                <input
                  type="text"
                  required
                  value={editOrigin}
                  onChange={e => setEditOrigin(e.target.value)}
                  className="w-full px-3 py-2 bg-[#164328] border border-[#2b7c4a] rounded-xl text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-emerald-200 mb-1">
                  Destination Customs Entry / Airport / Port
                </label>
                <input
                  type="text"
                  required
                  value={editDestination}
                  onChange={e => setEditDestination(e.target.value)}
                  className="w-full px-3 py-2 bg-[#164328] border border-[#2b7c4a] rounded-xl text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-emerald-200 mb-1">
                  Consignee / Importer Business Name
                </label>
                <input
                  type="text"
                  value={editConsigneeName}
                  onChange={e => setEditConsigneeName(e.target.value)}
                  placeholder="Global Import Partners GmbH"
                  className="w-full px-3 py-2 bg-[#164328] border border-[#2b7c4a] rounded-xl text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-emerald-200 mb-1">
                  Consignee Full Delivery Street Address
                </label>
                <textarea
                  rows={2}
                  value={editConsigneeAddress}
                  onChange={e => setEditConsigneeAddress(e.target.value)}
                  placeholder="Industriestrasse 42, 60311 Frankfurt, Germany"
                  className="w-full px-3 py-2 bg-[#164328] border border-[#2b7c4a] rounded-xl text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-emerald-200 mb-1">
                  Declared Value USD
                </label>
                <input
                  type="number"
                  value={editDeclaredValue}
                  onChange={e => setEditDeclaredValue(e.target.value)}
                  className="w-full px-3 py-2 bg-[#164328] border border-[#2b7c4a] rounded-xl text-white text-xs font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingAddress(false)}
                  className="px-4 py-2 rounded-xl bg-[#174327] text-emerald-200 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#071f11] font-bold text-xs shadow"
                >
                  Save Address Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
