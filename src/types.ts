export interface User {
  id: string;
  email: string;
  name: string;
  companyName?: string;
  isAuthenticated: boolean;
  isGuest: boolean;
}

export interface MaterialComposition {
  material: string;
  percentage: number;
  customsNote: string;
}

export interface DutyRate {
  country: string;
  countryName: string;
  basicCustomsDuty: string;
  igstOrVat: string;
  preferentialRate: string;
  mfnRate: string;
  notes: string;
}

export interface RegulatoryCheck {
  id: string;
  country: string;
  agency: string;
  code: string;
  title: string;
  status: 'REQUIRED' | 'RECOMMENDED' | 'EXEMPT' | 'VERIFIED';
  description: string;
  documentRequired: string;
  penaltyWarning: string;
}

export interface OrganizationConfig {
  userName: string;
  companyName: string;
  organizationName: string;
  organizationAddress: string;
  originCountry: string;
  defaultDestinationCountry: string;
  originRole: string;
  taxId: string;
  contactEmail: string;
}

export interface ClassificationResult {
  id: string;
  userId?: string;
  productName: string;
  productDescription: string;
  hsCode: string;
  hs6Digit: string;
  confidenceScore: number;
  chapterNumber: string;
  chapterTitle: string;
  headingNumber: string;
  headingTitle: string;
  subheadingNumber: string;
  subheadingTitle: string;
  wcoLegalNotes: string;
  materialComposition: MaterialComposition[];
  dutyRates: DutyRate[];
  regulatoryChecks: RegulatoryCheck[];
  aiLegalAnalysis: string;
  originCountry: string;
  destinationCountry: string;
  consigneeAddress?: string;
  consigneeName?: string;
  declaredValueUsd: number;
  declarationReady: boolean;
  classifiedAt: string;
  sourceType: string;
  uploadedFileName?: string;
  uploadedFilePreview?: string;
  org?: OrganizationConfig;
}

export interface Checkpoint {
  id: string;
  timestamp: string;
  location: string;
  status: 'IN_TRANSIT' | 'CUSTOMS_HOLD' | 'CLEARED' | 'DELIVERED';
  description: string;
  customsNote?: string;
}

export interface CarrierShipment {
  id: string;
  userId?: string;
  trackingNumber: string;
  carrier: string;
  origin: string;
  destination: string;
  consigneeName?: string;
  consigneeAddress?: string;
  status: 'IN_TRANSIT' | 'CUSTOMS_HOLD' | 'CUSTOMS_CLEARED' | 'DELIVERED';
  hsCode: string;
  productName: string;
  declaredValueUsd: number;
  lastUpdated: string;
  carrierApiStatus: string;
  checkpoints: Checkpoint[];
}

export interface TariffSubheading {
  hsCode: string;
  description: string;
  cbicDutyRate: string;
  exportPolicyIndia: string;
  wcoRulingReference?: string;
}

export interface TariffHeading {
  headingCode: string;
  headingTitle: string;
  subheadings: TariffSubheading[];
}

export interface TariffChapter {
  chapter: string;
  title: string;
  sectionTitle: string;
  description: string;
  headings: TariffHeading[];
}

export interface CustomsDeclaration {
  declarationNumber: string;
  exporterName: string;
  exporterAddress: string;
  exporterCountry: string;
  exporterTaxId: string;
  consigneeName: string;
  consigneeAddress: string;
  consigneeCountry: string;
  invoiceDate: string;
  currency: string;
  items: Array<{
    hsCode: string;
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    originCountry: string;
    netWeightKg: number;
  }>;
  incoterms: string;
  totalDeclaredValue: number;
  complianceCertifiedBy: string;
}
