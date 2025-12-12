import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { Download, Loader2, Sparkles, TrendingUp, Users, Wallet, Store, Sprout, Target, ArrowUpRight, CalendarRange } from 'lucide-react';
import { Exhibitor } from '../types';
import { StatCard } from './StatCard';
import { generateExecutiveReport } from '../services/geminiService';

interface DashboardProps {
  exhibitors: Exhibitor[];
}

const COLORS = ['#059669', '#10b981', '#34d399', '#6ee7b7', '#0891b2', '#0284c7', '#2563eb', '#7c3aed', '#a855f7', '#d946ef', '#ec4899', '#f43f5e', '#f97316'];

// Helper para formatar moeda BRL
const formatBRL = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 2
  }).format(value);
};

// Helper compact (ex: 1.5M) para gráficos
const formatCompactBRL = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    notation: 'compact',
    maximumFractionDigits: 1
  }).format(value);
};

export const Dashboard: React.FC<DashboardProps> = ({ exhibitors }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPdfMode, setIsPdfMode] = useState(false);
  const [aiReport, setAiReport] = useState<{ summary: string; recommendations: string[] } | null>(null);

  // Calculated Stats
  const totalVolume = exhibitors.reduce((acc, curr) => acc + curr.businessVolume, 0);
  const totalVisitors = exhibitors.reduce((acc, curr) => acc + curr.visitors, 0);
  const totalExhibitors = exhibitors.length;
  
  // Data for City Chart
  const cityDataMap = exhibitors.reduce((acc, curr) => {
    acc[curr.city] = (acc[curr.city] || 0) + curr.businessVolume;
    return acc;
  }, {} as Record<string, number>);
  
  const cityChartData = Object.entries(cityDataMap)
    .map(([name, value]) => ({ name, value: Number(value) }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5); // Top 5 cities

  // Data for Type Chart (by business volume)
  const typeDataMap = exhibitors.reduce((acc, curr) => {
    acc[curr.type] = (acc[curr.type] || 0) + curr.businessVolume;
    return acc;
  }, {} as Record<string, number>);

  const typeChartData = Object.entries(typeDataMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => a.value - b.value); // Ordem crescente

  // Projections for 2026 (Based on 20% growth for volume, 15% for visitors, 10% for exhibitors)
  const projVolume = totalVolume * 1.20;
  const projVisitors = Math.round(totalVisitors * 1.15);
  const projExhibitors = Math.round(totalExhibitors * 1.10);

  // Helper para ajustar tamanho da fonte baseado no tamanho do valor
  const getProjectionFontSize = (value: string) => {
    const length = value.length;
    if (length <= 10) return 'text-3xl lg:text-4xl';
    if (length <= 15) return 'text-2xl lg:text-3xl';
    if (length <= 20) return 'text-xl lg:text-2xl';
    return 'text-lg lg:text-xl';
  };

  const downloadPDF = () => {
    setIsPdfMode(true);
    
    // Aguarda renderização completa
    requestAnimationFrame(() => {
      setTimeout(() => {
        const element = document.getElementById('pdf-content');
        
        if (!element) {
          console.error("Elemento #pdf-content não encontrado");
          alert("❌ Erro: Elemento PDF não encontrado");
          setIsPdfMode(false);
          return;
        }

        console.log("Elemento encontrado:", element);
        console.log("Dimensões:", element.offsetWidth, "x", element.offsetHeight);
        console.log("ScrollHeight:", element.scrollHeight);

        // Configuração otimizada para capturar todo o conteúdo
        const opt = {
          margin: 0,
          filename: `Relatorio_AGROTEC_${new Date().toISOString().split('T')[0]}.pdf`,
          image: { type: 'jpeg', quality: 0.95 },
          html2canvas: { 
            scale: 1,
            useCORS: true,
            allowTaint: true,
            logging: true,
            backgroundColor: '#ffffff',
            width: 794,
            height: element.scrollHeight,
            windowWidth: 794,
            windowHeight: element.scrollHeight,
            x: 0,
            y: 0,
            scrollY: 0,
            scrollX: 0,
          },
          jsPDF: { 
            unit: 'px', 
            format: [794, element.scrollHeight], 
            orientation: 'portrait',
            hotfixes: ['px_scaling']
          },
          pagebreak: { 
            mode: ['avoid-all'],
            avoid: '.no-break'
          }
        };

        if (window.html2pdf) {
          console.log("Iniciando geração do PDF...");
          window.html2pdf()
            .set(opt)
            .from(element)
            .save()
            .then(() => {
              console.log("PDF gerado com sucesso!");
              setIsPdfMode(false);
              alert('✅ Relatório exportado com sucesso!');
            })
            .catch((err: any) => {
              console.error("Erro completo ao gerar PDF:", err);
              alert("❌ Erro ao gerar PDF. Veja o console (F12) para detalhes.");
              setIsPdfMode(false);
            });
        } else {
          console.error("html2pdf não está definido");
          alert("❌ Biblioteca PDF não carregada. Recarregue a página (F5).");
          setIsPdfMode(false);
        }
      }, 2000);
    });
  };

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      const report = await generateExecutiveReport(exhibitors, { totalVolume, totalVisitors });
      setAiReport(report);
      // Wait for AI report to render then download
      setTimeout(() => {
        downloadPDF();
      }, 500);
    } catch (e) {
      alert("Erro ao gerar relatório");
      downloadPDF(); // Download anyway even if AI fails
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
    {/* OVERLAY - Esconde conteúdo da web durante geração */}
    {isPdfMode && (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        zIndex: 8888,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#059669'
      }}>
        📄 Gerando PDF... Aguarde
      </div>
    )}

    {/* PDF CONTENT - Renderizado quando isPdfMode = true */}
    {isPdfMode && (
      <div id="pdf-content" style={{ 
        position: 'fixed',
        top: '0',
        left: '0',
        width: '794px',
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        padding: '30px 40px',
        fontFamily: 'Arial, sans-serif',
        zIndex: 9999,
        boxSizing: 'border-box',
        overflow: 'visible'
      }}>
        {/* PDF Header */}
        <div style={{ marginBottom: '20px', paddingBottom: '15px', borderBottom: '3px solid #059669' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', margin: '0 0 5px 0' }}>
                AGROTEC 2025
              </h1>
              <p style={{ fontSize: '14px', color: '#059669', fontWeight: '600', margin: 0 }}>
                SEMAGRIC - Secretaria de Agricultura
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '13px', fontWeight: '600', color: '#374151', margin: '0 0 3px 0' }}>
                Relatório Executivo
              </p>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
          <div style={{ marginTop: '10px', padding: '8px 12px', backgroundColor: '#d1fae5', borderLeft: '4px solid #059669', fontSize: '12px', color: '#065f46' }}>
            📊 Relatório confidencial para gestão interna • 27-29 de Novembro de 2025
          </div>
        </div>

        {/* AI Report */}
        {aiReport && (
          <div className="no-break" style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#faf5ff', border: '2px solid #e9d5ff', borderRadius: '8px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#581c87', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              ✨ Análise Inteligente SEMAGRIC
            </h3>
            <p style={{ fontSize: '13px', color: '#1f2937', lineHeight: '1.6', marginBottom: '12px' }}>
              {aiReport.summary}
            </p>
            <div style={{ padding: '12px', backgroundColor: '#ffffff', border: '1px solid #e9d5ff', borderRadius: '6px' }}>
              <h4 style={{ fontSize: '13px', fontWeight: 'bold', color: '#6b21a8', marginBottom: '8px' }}>
                🎯 Recomendações Estratégicas
              </h4>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '12px', color: '#4b5563', lineHeight: '1.8' }}>
                {aiReport.recommendations.map((rec, idx) => (
                  <li key={idx} style={{ marginBottom: '4px' }}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* KPIs */}
        <div className="no-break" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
          <div style={{ padding: '12px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px' }}>
            <p style={{ fontSize: '11px', color: '#166534', fontWeight: '600', margin: '0 0 4px 0', textTransform: 'uppercase' }}>💰 Volume de Negócios</p>
            <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#052e16', margin: 0 }}>{formatBRL(totalVolume)}</p>
          </div>
          <div style={{ padding: '12px', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px' }}>
            <p style={{ fontSize: '11px', color: '#1e40af', fontWeight: '600', margin: '0 0 4px 0', textTransform: 'uppercase' }}>👥 Total Visitantes</p>
            <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e3a8a', margin: 0 }}>{totalVisitors.toLocaleString('pt-BR')}</p>
          </div>
          <div style={{ padding: '12px', backgroundColor: '#fef3c7', border: '1px solid #fde68a', borderRadius: '8px' }}>
            <p style={{ fontSize: '11px', color: '#92400e', fontWeight: '600', margin: '0 0 4px 0', textTransform: 'uppercase' }}>🏪 Expositores</p>
            <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#78350f', margin: 0 }}>{exhibitors.length}</p>
          </div>
          <div style={{ padding: '12px', backgroundColor: '#fce7f3', border: '1px solid #fbcfe8', borderRadius: '8px' }}>
            <p style={{ fontSize: '11px', color: '#9f1239', fontWeight: '600', margin: '0 0 4px 0', textTransform: 'uppercase' }}>📊 Ticket Médio</p>
            <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#881337', margin: 0 }}>
              {formatBRL(exhibitors.length ? totalVolume / exhibitors.length : 0)}
            </p>
          </div>
        </div>

        {/* Projections */}
        <div className="no-break" style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#1e293b', borderRadius: '8px', color: '#ffffff' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px', color: '#ffffff' }}>
            🎯 Projeções 2026
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
            <div style={{ padding: '10px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '6px' }}>
              <p style={{ fontSize: '10px', color: '#94a3b8', margin: '0 0 4px 0' }}>VOLUME PROJETADO</p>
              <p style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>{formatBRL(projVolume)}</p>
            </div>
            <div style={{ padding: '10px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '6px' }}>
              <p style={{ fontSize: '10px', color: '#94a3b8', margin: '0 0 4px 0' }}>PÚBLICO ESPERADO</p>
              <p style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>{projVisitors.toLocaleString('pt-BR')}</p>
            </div>
            <div style={{ padding: '10px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '6px' }}>
              <p style={{ fontSize: '10px', color: '#94a3b8', margin: '0 0 4px 0' }}>NOVOS EXPOSITORES</p>
              <p style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>{projExhibitors}</p>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="no-break" style={{ marginTop: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px', color: '#111827', paddingLeft: '10px', borderLeft: '4px solid #059669' }}>
            Detalhamento dos Expositores
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px', backgroundColor: '#ffffff', border: '1px solid #e5e7eb', tableLayout: 'fixed' }}>
            <colgroup>
              <col style={{ width: '25%' }} />
              <col style={{ width: '18%' }} />
              <col style={{ width: '18%' }} />
              <col style={{ width: '20%' }} />
              <col style={{ width: '19%' }} />
            </colgroup>
            <thead>
              <tr style={{ backgroundColor: '#d1fae5', color: '#065f46' }}>
                <th style={{ padding: '8px 6px', textAlign: 'left', fontWeight: '600', borderBottom: '2px solid #059669', fontSize: '10px' }}>Nome</th>
                <th style={{ padding: '8px 6px', textAlign: 'left', fontWeight: '600', borderBottom: '2px solid #059669', fontSize: '10px' }}>Categoria</th>
                <th style={{ padding: '8px 6px', textAlign: 'left', fontWeight: '600', borderBottom: '2px solid #059669', fontSize: '10px' }}>Cidade</th>
                <th style={{ padding: '8px 6px', textAlign: 'right', fontWeight: '600', borderBottom: '2px solid #059669', fontSize: '10px' }}>Volume</th>
                <th style={{ padding: '8px 6px', textAlign: 'right', fontWeight: '600', borderBottom: '2px solid #059669', fontSize: '10px' }}>Visitantes</th>
              </tr>
            </thead>
            <tbody>
              {exhibitors.map((ex, idx) => (
                <tr key={ex.id} style={{ backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f9fafb', pageBreakInside: 'avoid' }}>
                  <td style={{ padding: '6px', borderBottom: '1px solid #f3f4f6', color: '#1f2937', fontWeight: '500', fontSize: '10px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ex.name}</td>
                  <td style={{ padding: '6px', borderBottom: '1px solid #f3f4f6', color: '#059669', fontSize: '9px' }}>{ex.type}</td>
                  <td style={{ padding: '6px', borderBottom: '1px solid #f3f4f6', color: '#6b7280', fontSize: '10px' }}>{ex.city}</td>
                  <td style={{ padding: '6px', borderBottom: '1px solid #f3f4f6', textAlign: 'right', fontFamily: 'monospace', fontWeight: '600', color: '#111827', fontSize: '10px' }}>
                    {formatBRL(ex.businessVolume)}
                  </td>
                  <td style={{ padding: '6px', borderBottom: '1px solid #f3f4f6', textAlign: 'right', color: '#374151', fontSize: '10px' }}>
                    {ex.visitors.toLocaleString('pt-BR')}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ backgroundColor: '#d1fae5', fontWeight: 'bold', color: '#065f46' }}>
                <td colSpan={3} style={{ padding: '10px 6px', borderTop: '2px solid #059669', fontSize: '10px' }}>TOTAIS</td>
                <td style={{ padding: '10px 6px', textAlign: 'right', fontFamily: 'monospace', borderTop: '2px solid #059669', fontSize: '10px' }}>
                  {formatBRL(totalVolume)}
                </td>
                <td style={{ padding: '10px 6px', textAlign: 'right', borderTop: '2px solid #059669', fontSize: '10px' }}>
                  {totalVisitors.toLocaleString('pt-BR')}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Signature */}
        <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '2px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '200px', borderBottom: '2px solid #6b7280', marginBottom: '5px' }}></div>
            <p style={{ fontSize: '13px', fontWeight: 'bold', color: '#111827', margin: '0 0 2px 0' }}>Rodrigo</p>
            <p style={{ fontSize: '10px', color: '#6b7280', margin: 0 }}>Secretário SEMAGRIC</p>
          </div>
          <div style={{ textAlign: 'right', fontSize: '10px', color: '#9ca3af' }}>
            <p style={{ margin: '0 0 2px 0' }}>Documento gerado via AGROTEC Portal</p>
            <p style={{ margin: 0, fontFamily: 'monospace' }}>ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
          </div>
        </div>
      </div>
    )}

    {/* MAIN DASHBOARD - Web View */}
    <div 
      id="dashboard-content" 
      className="space-y-8 pb-10"
    >
      {/* PDF Header - Visible only in Print/PDF Mode */}
      <div className="hidden print-only mb-8 border-b-2 border-emerald-700 pb-6 break-inside-avoid">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
             <div className="bg-emerald-100 p-3 rounded-lg">
               <Sprout className="w-12 h-12 text-emerald-700" />
             </div>
             <div>
               <h1 className="text-3xl font-bold text-gray-900 mb-1">AGROTEC 2025</h1>
               <p className="text-emerald-700 font-semibold text-base">SEMAGRIC - Secretaria de Agricultura</p>
             </div>
          </div>
          <div className="text-right">
            <p className="text-base font-semibold text-gray-700 mb-1">Relatório Executivo</p>
            <p className="text-sm text-gray-500">Gerado em {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
          </div>
        </div>
        <div className="bg-emerald-50 border-l-4 border-emerald-600 p-3 rounded text-sm text-emerald-900 font-medium">
          📊 Relatório confidencial para gestão interna • 27-29 de Novembro de 2025
        </div>
      </div>

      {/* HERO BANNER - WEB ONLY */}
      <div className="relative w-full h-[320px] rounded-3xl overflow-hidden shadow-2xl mb-8 group no-print bg-white">
        <div className="absolute inset-0 bg-white">
             <img 
                src="https://images.unsplash.com/photo-1625246333195-58197bd47d26?q=80&w=2070&auto=format&fit=crop" 
                alt="AGROTEC Hero" 
                className="w-full h-full object-cover opacity-15"
             />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/98 to-white flex flex-col justify-center px-10 md:px-16">
            <div className="animate-in fade-in slide-in-from-left duration-700 max-w-3xl">
                 <div className="flex items-center gap-2 mb-4 text-emerald-700 font-medium tracking-wide text-sm bg-emerald-50 w-fit px-3 py-1 rounded-full border border-emerald-300">
                    <CalendarRange className="w-4 h-4" /> 27 a 29 de Novembro de 2025
                 </div>
                 <h1 className="text-4xl md:text-7xl font-bold text-slate-800 mb-6 tracking-tight leading-none">
                    AGROTEC <span className="text-emerald-600">2025</span>
                 </h1>
                 <p className="text-slate-700 text-lg md:text-xl font-light leading-relaxed border-l-4 border-emerald-600 pl-4">
                    Encontro de agricultura e empreendimentos dos setores primário e de suporte ao agronegócio da região.
                 </p>
            </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-end gap-4 no-print border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Painel Gerencial</h2>
          <p className="text-slate-500 text-sm mt-1">Visão geral em tempo real dos indicadores da feira</p>
        </div>
        <button
          onClick={handleGenerateReport}
          disabled={isGenerating}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-6 py-3 rounded-xl font-medium transition-all hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed active:scale-95 group"
        >
          {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />}
          {isGenerating ? 'Analisando Dados...' : 'Exportar Relatório Completo'}
        </button>
      </div>

      {/* AI Insight Section */}
      {aiReport && (
        <div className="bg-gradient-to-br from-purple-50 to-white border-2 border-purple-200 rounded-2xl shadow-sm p-6 mb-6 overflow-hidden relative break-inside-avoid">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-purple-100">
                <div className="bg-purple-600 p-2.5 rounded-lg shadow-md">
                    <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-purple-900">Análise Inteligente SEMAGRIC</h3>
                  <p className="text-xs text-purple-600">Gerada por IA baseada nos dados coletados</p>
                </div>
            </div>
            <p className="text-gray-800 mb-6 leading-relaxed text-base">{aiReport.summary}</p>
            <div className="bg-white rounded-xl p-5 border-2 border-purple-100 shadow-sm">
                <h4 className="font-bold text-purple-900 mb-4 flex items-center gap-2 text-base">
                    <Target className="w-5 h-5" /> Recomendações Estratégicas
                </h4>
                <ul className="grid md:grid-cols-3 gap-3">
                {aiReport.recommendations.map((rec, idx) => (
                    <li key={idx} className="bg-purple-50 p-3 rounded-lg shadow-sm text-sm text-gray-700 border border-purple-200 flex items-start gap-2">
                        <span className="bg-purple-600 text-white w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold shrink-0">{idx + 1}</span>
                        <span className="pt-0.5">{rec}</span>
                    </li>
                ))}
                </ul>
            </div>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Volume de Negócios" 
          value={formatBRL(totalVolume)}
          icon={<Wallet className="w-6 h-6" />}
          trend="+12% vs. 2024"
        />
        <StatCard 
          title="Total de Visitantes" 
          value={totalVisitors.toLocaleString('pt-BR')} 
          icon={<Users className="w-6 h-6" />}
          trend="Recorde de público"
        />
        <StatCard 
          title="Expositores Ativos" 
          value={exhibitors.length.toString()} 
          icon={<Store className="w-6 h-6" />}
        />
        <StatCard 
          title="Ticket Médio" 
          value={formatBRL(exhibitors.length ? totalVolume / exhibitors.length : 0)}
          icon={<TrendingUp className="w-6 h-6" />}
          colorClass="bg-gradient-to-br from-white to-emerald-50 border-emerald-100"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-8">
        {/* Chart 1: Volume by City */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 card break-inside-avoid">
          <div className="flex items-center justify-between mb-6">
            <div>
                <h3 className="text-lg font-bold text-slate-800">Volume de Negócios por Cidade</h3>
                <p className="text-xs text-slate-400">Distribuição regional de vendas</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">Top 5</span>
          </div>
          <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cityChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{fill: '#64748b', fontSize: 11}} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{fill: '#64748b', fontSize: 11}} axisLine={false} tickLine={false} tickFormatter={(value) => formatCompactBRL(value)} />
                <RechartsTooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontFamily: 'Inter' }}
                  formatter={(value: number) => [formatBRL(value), 'Volume']}
                />
                <Bar dataKey="value" fill="#10b981" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Exhibitor Distribution */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 card break-inside-avoid">
           <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-800">Distribuição por Categoria</h3>
                <p className="text-xs text-slate-400">Volume de negócios por perfil de expositor</p>
            </div>
          <div style={{ display: 'flex', gap: '20px', height: '500px' }}>
            {/* Gráfico */}
            <div style={{ flex: '1', minWidth: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={typeChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={120}
                    fill="#8884d8"
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                    minAngle={5}
                  >
                    {typeChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                    formatter={(value: number) => formatBRL(value)}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legenda Vertical */}
            <div style={{ flex: '0 0 280px', overflowY: 'auto', paddingRight: '10px' }}>
              <div style={{ fontSize: '10px', lineHeight: '1.8' }}>
                {typeChartData.map((entry, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', whiteSpace: 'nowrap' }}>
                    <div style={{ 
                      width: '12px', 
                      height: '12px', 
                      borderRadius: '50%', 
                      backgroundColor: COLORS[index % COLORS.length],
                      flexShrink: 0
                    }} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {entry.name}: {formatBRL(entry.value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table for Print/PDF View Only */}
      <div className={`mt-8 ${isPdfMode ? 'block' : 'hidden print-only'} break-inside-avoid`}>
        <h3 className="text-lg font-bold mb-4 text-gray-800 border-l-4 border-emerald-500 pl-3">Detalhamento dos Expositores</h3>
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="w-full text-sm text-left border-collapse bg-white">
            <thead>
              <tr className="bg-emerald-50 text-emerald-900 border-b-2 border-emerald-200">
                <th className="py-3 px-4 font-semibold">Nome</th>
                <th className="py-3 px-4 font-semibold">Categoria</th>
                <th className="py-3 px-4 font-semibold">Cidade</th>
                <th className="py-3 px-4 font-semibold text-right">Volume (R$)</th>
                <th className="py-3 px-4 font-semibold text-right">Visitantes</th>
              </tr>
            </thead>
            <tbody>
              {exhibitors.map((ex, index) => (
                <tr key={ex.id} className={`border-b border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <td className="py-2.5 px-4 font-medium text-gray-800">{ex.name}</td>
                  <td className="py-2.5 px-4">
                      <span className="bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-xs font-medium text-emerald-700">
                          {ex.type}
                      </span>
                  </td>
                  <td className="py-2.5 px-4 text-gray-600">{ex.city}</td>
                  <td className="py-2.5 px-4 text-right font-mono font-semibold text-gray-800">{formatBRL(ex.businessVolume)}</td>
                  <td className="py-2.5 px-4 text-right text-gray-700">{ex.visitors.toLocaleString('pt-BR')}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-emerald-100 font-bold text-emerald-900 border-t-2 border-emerald-200">
                  <td className="py-3 px-4" colSpan={3}>TOTAIS</td>
                  <td className="py-3 px-4 text-right font-mono">{formatBRL(totalVolume)}</td>
                  <td className="py-3 px-4 text-right">{totalVisitors.toLocaleString('pt-BR')}</td>
              </tr>
            </tfoot>
          </table>
        </div>
        
        {/* Signature Area */}
        <div className="mt-12 pt-6 border-t-2 border-gray-200 flex justify-between items-end break-inside-avoid">
             <div className="text-center">
                 <div className="w-64 border-b-2 border-gray-400 mb-2"></div>
                 <p className="font-bold text-gray-800 text-sm">Rodrigo</p>
                 <p className="text-xs text-gray-500 mt-1">Secretário SEMAGRIC</p>
             </div>
             <div className="text-right text-xs text-gray-400">
                 <p className="mb-1">Documento gerado via AGROTEC Portal</p>
                 <p className="font-mono">ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
             </div>
        </div>
      </div>
    </div>
    </>
  );
}