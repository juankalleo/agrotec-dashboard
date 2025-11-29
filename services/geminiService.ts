import { GoogleGenAI, Type } from "@google/genai";
import { Exhibitor } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateExecutiveReport = async (
  exhibitors: Exhibitor[],
  stats: { totalVolume: number; totalVisitors: number }
): Promise<{ summary: string; recommendations: string[] }> => {
  
  const prompt = `
    Atue como um Analista Sênior de Agronegócios para a SEMAGRIC (Secretaria de Agricultura de Porto Velho).
    Analise os dados da feira AGROTEC abaixo e gere um relatório executivo para o Secretário Rodrigo.

    DADOS DA FEIRA:
    - Volume Total de Negócios: R$ ${stats.totalVolume.toLocaleString('pt-BR')}
    - Total de Visitantes: ${stats.totalVisitors}
    - Número de Expositores: ${exhibitors.length}
    - Dados Detalhados (Amostra): ${JSON.stringify(exhibitors.slice(0, 10))}

    Gere um resumo estratégico destacando o desempenho e 3 recomendações breves para a próxima edição focado em crescimento.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING,
              description: "Um parágrafo resumindo o sucesso da feira e pontos chave."
            },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Lista de 3 recomendações estratégicas."
            }
          },
          required: ["summary", "recommendations"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Sem resposta da IA");
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Erro ao gerar relatório com IA:", error);
    return {
      summary: "Não foi possível gerar a análise inteligente no momento. Os dados brutos estão disponíveis nos gráficos.",
      recommendations: ["Verificar conexão com API", "Tentar novamente mais tarde"]
    };
  }
};