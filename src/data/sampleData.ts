import { ClassificationResult, CarrierShipment } from '../types';

export const INITIAL_CLASSIFICATIONS: ClassificationResult[] = [
  {
    id: 'CLS-IN-US-1024',
    userId: 'demo_trader_01',
    productName: 'Ayurvedic Organic Vetiver Essential Oil',
    productDescription: 'Steam-distilled 100% pure steam extracted Vetiveria zizanioides root essential oil packaged in amber glass export bottles.',
    hsCode: '3301.29.9010',
    hs6Digit: '3301.29',
    confidenceScore: 98,
    chapterNumber: 'Chapter 33',
    chapterTitle: 'Essential Oils and Resinoids; Perfumery, Cosmetic or Toilet Preparations',
    headingNumber: '3301',
    headingTitle: 'Essential oils (terpeneless or not), including concretes and absolutes; resinoids',
    subheadingNumber: '3301.29',
    subheadingTitle: 'Other essential oils of botanical roots and herbs',
    wcoLegalNotes: 'Classified under Chapter 33 Legal Note 3 — Essential oils extracted via aqueous or steam distillation remain classified under Heading 3301.',
    materialComposition: [
      { material: 'Pure Steam-Distilled Vetiver Root Extract', percentage: 100, customsNote: 'Organic certified non-synthetic botanical matrix' }
    ],
    dutyRates: [
      {
        country: 'US',
        countryName: 'United States (US HTSUS)',
        basicCustomsDuty: '0.0% MFN Duty Free',
        igstOrVat: '0.0% Federal Tax',
        preferentialRate: '0.0% under GSP / US Tariff Schedule',
        mfnRate: '0.0%',
        notes: 'US CBP Entry Summary Form 7501 required with FDA Cosmetics Prior Notice.'
      },
      {
        country: 'EU',
        countryName: 'European Union (EU TARIC)',
        basicCustomsDuty: '0.0% (EU GSP Exempt)',
        igstOrVat: '19.0% German VAT',
        preferentialRate: '0% under EU-India GSP Preferences',
        mfnRate: '0.0%',
        notes: 'Requires REACH Annex II chemical registration and EU CPNP cosmetic notification.'
      }
    ],
    regulatoryChecks: [
      {
        id: 'REG-US-FDA',
        country: 'US',
        agency: 'FDA / US Customs CBP',
        code: 'FDA-PN-2026',
        title: 'FDA Prior Notice & Cosmetic Product Facility Registration',
        status: 'REQUIRED',
        description: 'Mandatory prior notice submission before air cargo arrival under MoCRA / FDA Regulations.',
        documentRequired: 'Commercial Invoice, Certificate of Analysis (CoA), SDS (Safety Data Sheet)',
        penaltyWarning: 'Hold or refusal of admission at port of entry if Prior Notice is absent.'
      }
    ],
    aiLegalAnalysis: 'Autonomous legal audit confirms HS 3301.29.9010 is legally binding under WCO General Rules of Interpretation (GRI 1 & 3a). Zero customs duty applies under US HTSUS.',
    originCountry: 'IN',
    destinationCountry: 'US',
    declaredValueUsd: 1450,
    declarationReady: true,
    classifiedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    sourceType: 'MANUAL_ENTRY',
    uploadedFileName: 'Invoice_Vetiver_Export_2026.pdf'
  },
  {
    id: 'CLS-IN-DE-1025',
    userId: 'demo_trader_01',
    productName: 'Brass Handicraft Tara Deity Statue',
    productDescription: 'Hand-cast solid brass traditional Indian deity sculpture with ornamental hand-carving.',
    hsCode: '7419.80.3010',
    hs6Digit: '7419.80',
    confidenceScore: 96,
    chapterNumber: 'Chapter 74',
    chapterTitle: 'Copper and Articles Thereof',
    headingNumber: '7419',
    headingTitle: 'Other articles of copper or brass (including statuettes, ornaments, and artware)',
    subheadingNumber: '7419.80',
    subheadingTitle: 'Cast, moulded, stamped or forged brassware',
    wcoLegalNotes: 'Classified under WCO Note 1 to Chapter 74 — Statuettes and decorative art castings fall under Heading 7419.80.',
    materialComposition: [
      { material: 'Copper Alloy (Brass Matrix Cu-Zn)', percentage: 85, customsNote: 'Traditional brass artware composition' },
      { material: 'Lead & Zinc trace binding elements', percentage: 15, customsNote: 'Non-hazardous casting alloy' }
    ],
    dutyRates: [
      {
        country: 'DE',
        countryName: 'Germany / European Union (EU TARIC)',
        basicCustomsDuty: '0.0% Duty Free Handicraft',
        igstOrVat: '19.0% German Import Turnover Tax (EUST)',
        preferentialRate: '0.0% under EU Handicraft Agreement',
        mfnRate: '3.2%',
        notes: 'Handicraft Certificate issued by Export Promotion Council for Handicrafts (EPCH) applies zero duty.'
      }
    ],
    regulatoryChecks: [
      {
        id: 'REG-EU-ART',
        country: 'DE',
        agency: 'German Federal Customs / Zollamt',
        code: 'ZOLL-HANDI-01',
        title: 'EPCH Certificate of Origin & Cultural Goods Compliance',
        status: 'VERIFIED',
        description: 'Verified as contemporary handicraft (not antique artifact requiring ASI clearance).',
        documentRequired: 'EPCH Handicraft Certificate & Packing List',
        penaltyWarning: 'Delays if customs demands cultural heritage inspection.'
      }
    ],
    aiLegalAnalysis: 'Classified under HS 7419.80.3010. Qualifies for duty-free entry into Germany under EU Handicraft preferences.',
    originCountry: 'IN',
    destinationCountry: 'DE',
    declaredValueUsd: 820,
    declarationReady: true,
    classifiedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    sourceType: 'IMAGE_UPLOAD',
    uploadedFileName: 'Brass_Statue_Photo.jpg'
  }
];

export const SAMPLE_CARRIER_SHIPMENTS: CarrierShipment[] = [
  {
    id: 'SHP-DHL-948102',
    userId: 'demo_trader_01',
    trackingNumber: 'DHL-94810293',
    carrier: 'DHL Express',
    origin: 'Mumbai Air Cargo Hub (BOM), India',
    destination: 'Frankfurt Airport Hub (FRA), Germany',
    status: 'IN_TRANSIT',
    hsCode: '3301.29.9010',
    productName: 'Ayurvedic Organic Vetiver Essential Oil',
    declaredValueUsd: 1450,
    lastUpdated: new Date().toISOString(),
    carrierApiStatus: 'CONNECTED_LIVE',
    checkpoints: [
      {
        id: 'CHK-01',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        location: 'Frankfurt Airport (FRA) Customs Inspection Zone',
        status: 'IN_TRANSIT',
        description: 'Electronic customs clearance manifest received via ATLAS Zoll API. Document check underway.',
        customsNote: 'HS 3301.29 verified against EU TARIC schedule'
      },
      {
        id: 'CHK-02',
        timestamp: new Date(Date.now() - 14400000).toISOString(),
        location: 'Mumbai Air Cargo Customs (BOM), India',
        status: 'CLEARED',
        description: 'Export clearance granted by CBIC Custom House. Shipping Bill filed under ICEGATE EDI.',
        customsNote: 'LEO (Let Export Order) issued'
      }
    ]
  },
  {
    id: 'SHP-FEDEX-881029',
    userId: 'demo_trader_01',
    trackingNumber: 'FEDEX-88102941',
    carrier: 'FedEx Cross-Border',
    origin: 'Delhi IGI Airport (DEL), India',
    destination: 'New York JFK Airport, USA',
    status: 'CUSTOMS_HOLD',
    hsCode: '7419.80.3010',
    productName: 'Brass Handicraft Sculpture Cargo',
    declaredValueUsd: 820,
    lastUpdated: new Date(Date.now() - 3600000).toISOString(),
    carrierApiStatus: 'CONNECTED_LIVE',
    checkpoints: [
      {
        id: 'CHK-F1',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        location: 'JFK Airport CBP Customs Facility, NY',
        status: 'CUSTOMS_HOLD',
        description: 'US Customs CBP requesting EPCH Handicraft Certificate verification to confirm 0% duty rate.',
        customsNote: 'Awaiting digital document upload via FedEx Trade Networks portal'
      },
      {
        id: 'CHK-F2',
        timestamp: new Date(Date.now() - 28800000).toISOString(),
        location: 'Delhi Cargo Terminal (DEL), India',
        status: 'CLEARED',
        description: 'Export manifest transmitted to carrier. Airway Bill generated.',
        customsNote: 'ICEGATE Duty Exemption Verified'
      }
    ]
  },
  {
    id: 'SHP-UPS-1Z9999',
    userId: 'demo_trader_01',
    trackingNumber: 'UPS-1Z999999999',
    carrier: 'UPS Supply Chain',
    origin: 'Chennai Port (MAA), India',
    destination: 'London Heathrow (LHR), UK',
    status: 'CUSTOMS_CLEARED',
    hsCode: '5007.20.1010',
    productName: 'Handloom Mulberry Silk Sarees',
    declaredValueUsd: 3200,
    lastUpdated: new Date(Date.now() - 7200000).toISOString(),
    carrierApiStatus: 'CONNECTED_LIVE',
    checkpoints: [
      {
        id: 'CHK-U1',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        location: 'London Heathrow Customs Clearance Post',
        status: 'CLEARED',
        description: 'HM Revenue & Customs (HMRC) clearance complete under UK DCTS preferential tariff.',
        customsNote: '0% Preferential Duty Granted'
      }
    ]
  }
];
