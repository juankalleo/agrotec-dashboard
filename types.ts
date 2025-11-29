export enum ExhibitorType {
  LOJISTA = 'Lojista',
  FEIRANTE = 'Feirante',
  PRODUTOR_RURAL = 'Produtor Rural'
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