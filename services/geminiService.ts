import { Exhibitor } from "../types";

// Função refatorada para usar dados estáticos (Massa de dados) ao invés da IA
// Isso permite o uso em produção sem chave de API
export const generateExecutiveReport = async (
  exhibitors: Exhibitor[],
  stats: { totalVolume: number; totalVisitors: number }
): Promise<{ summary: string; recommendations: string[] }> => {
  
  // Simula um tempo de processamento para manter a UX de "Analisando..."
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Lógica simples para tornar a mensagem levemente dinâmica baseada nos dados
  const isHighPerformance = stats.totalVolume > 1000000;

  return {
    summary: `A AGROTEC 2025 apresenta resultados expressivos, consolidando-se como o principal vetor de desenvolvimento tecnológico para o campo na região. ${isHighPerformance ? 'O volume de negócios superou as expectativas iniciais, demonstrando a força econômica do setor.' : 'Os indicadores apontam para um crescimento sustentável.'} A diversidade de expositores, reunindo representantes de vários setores do agronegócio, criou um ambiente propício para networking qualificado e fechamento de contratos de longo prazo, validando as estratégias da SEMAGRIC para o fomento local.`,
    recommendations: [
      "Expandir a infraestrutura de conectividade no parque para suportar mais demonstrações de IoT e agricultura de precisão.",
      "Criar rodadas de negócios segmentadas por cultura (Soja, Café, Pecuária) para otimizar o tempo dos produtores e aumentar o ticket médio.",
      "Implementar um sistema de pré-credenciamento digital para capturar dados mais detalhados sobre o perfil de compra dos visitantes antes do evento."
    ]
  };
};