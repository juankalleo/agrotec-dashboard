export enum ExhibitorType {
  AGRICULTURA_FAMILIAR = 'Agricultura familiar',
  AGROINDÚSTRIAS = 'Agroindústrias',
  PSICULTURA = 'Psicultura',
  MANDIOCULTURA = 'Mandiocultura',
  APICULTURA = 'Apicultura',
  CAFÉ = 'Café',
  CARNE = 'Carne',
  ARTESANATO = 'Artesanato',
  EMPRESAS = 'Empresas',
  BANCOS_TRADICIONAIS = 'Bancos tradicionais',
  REPRESENTANTES_FINANCEIRAS = 'Representantes financeiras',
  CONCESSIONÁRIAS_TRATORES = 'Concessionárias tratores',
  CONCESSIONÁRIAS_VEÍCULOS = 'Concessionárias veículos'
}

export interface Exhibitor {
  id: string;
  name: string;
  type: ExhibitorType;
  products: string; // Comma separated list of products
  city: string;
  businessVolume: number; // Volume de negócios generated (R$)
  visitors: number; // Number of visitors
}

export interface GalleryPhoto {
  id: string;
  url: string;
  title: string;
  category: string;
  date: string;
}

export interface DashboardStats {
  totalVolume: number;
  totalVisitors: number;
  totalExhibitors: number;
  topCity: string;
}

export interface AiReportData {
  summary: string;
  recommendations: string[];
  generatedAt: string;
}

// Declare global html2pdf variable
declare global {
  var html2pdf: any;
}