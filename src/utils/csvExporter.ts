import { ClassificationResult, CarrierShipment } from '../types';

export function exportClassificationsToCSV(items: ClassificationResult[], filename = 'HarMonie_Classifications_Report.csv') {
  if (!items || items.length === 0) return;

  const headers = [
    'Classification ID',
    'Date Classified',
    'Product Name',
    'HS Code (6-Digit)',
    'HS Code (10-Digit)',
    'Confidence Score (%)',
    'Origin Country',
    'Destination Country',
    'Declared Value (USD)',
    'Chapter',
    'Heading Title',
    'Duty Rate',
    'WCO Legal Notes'
  ];

  const rows = items.map(item => [
    item.id,
    item.classifiedAt ? new Date(item.classifiedAt).toLocaleString() : '',
    `"${(item.productName || '').replace(/"/g, '""')}"`,
    item.hs6Digit || '',
    item.hsCode || '',
    item.confidenceScore || 0,
    item.originCountry || '',
    item.destinationCountry || '',
    item.declaredValueUsd || 0,
    `"${(item.chapterNumber || '') + ' - ' + (item.chapterTitle || '').replace(/"/g, '""')}"`,
    `"${(item.headingTitle || '').replace(/"/g, '""')}"`,
    `"${((item.dutyRates && item.dutyRates[0]) ? item.dutyRates[0].basicCustomsDuty : 'N/A').replace(/"/g, '""')}"`,
    `"${(item.wcoLegalNotes || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  downloadBlob(csvContent, filename, 'text/csv;charset=utf-8;');
}

export function exportShipmentsToCSV(shipments: CarrierShipment[], filename = 'HarMonie_Carrier_Shipments.csv') {
  if (!shipments || shipments.length === 0) return;

  const headers = [
    'Shipment ID',
    'Tracking Number',
    'Carrier',
    'Product Name',
    'HS Code',
    'Status',
    'Origin',
    'Destination',
    'Declared Value (USD)',
    'Last Updated'
  ];

  const rows = shipments.map(s => [
    s.id,
    s.trackingNumber,
    `"${s.carrier.replace(/"/g, '""')}"`,
    `"${s.productName.replace(/"/g, '""')}"`,
    s.hsCode,
    s.status,
    `"${s.origin.replace(/"/g, '""')}"`,
    `"${s.destination.replace(/"/g, '""')}"`,
    s.declaredValueUsd || 0,
    new Date(s.lastUpdated).toLocaleString()
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  downloadBlob(csvContent, filename, 'text/csv;charset=utf-8;');
}

function downloadBlob(content: string, filename: string, contentType: string) {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
