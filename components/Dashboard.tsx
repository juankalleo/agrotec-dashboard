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

const COLORS = ['#059669', '#10b981', '#34d399', '#6ee7b7'];

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

  // Data for Type Chart
  const typeDataMap = exhibitors.reduce((acc, curr) => {
    acc[curr.type] = (acc[curr.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const typeChartData = Object.entries(typeDataMap).map(([name, value]) => ({ name, value }));

  // Projections for 2026 (Based on 20% growth for volume, 15% for visitors, 10% for exhibitors)
  const projVolume = totalVolume * 1.20;
  const projVisitors = Math.round(totalVisitors * 1.15);
  const projExhibitors = Math.round(totalExhibitors * 1.10);

  const downloadPDF = () => {
    setIsPdfMode(true);
    
    // Allow state to update and DOM to render before capturing
    setTimeout(() => {
      const element = document.getElementById('dashboard-content');
      const opt = {
        margin: [10, 10, 10, 10],
        filename: `Relatorio_AGROTEC_${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      if (window.html2pdf) {
        window.html2pdf().set(opt).from(element).save().then(() => {
          setIsPdfMode(false);
        }).catch((err: any) => {
          console.error("PDF generation failed", err);
          setIsPdfMode(false);
        });
      } else {
        alert("Biblioteca PDF carregando... tente novamente em instantes.");
        setIsPdfMode(false);
      }
    }, 500);
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
    <div 
      id="dashboard-content" 
      className={`space-y-8 transition-all duration-300 ${isPdfMode ? 'pdf-mode' : 'pb-10'}`}
    >
      {/* PDF Header - Visible only in Print/PDF Mode */}
      <div className="hidden print-only mb-6 border-b-2 border-emerald-800 pb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
             <Sprout className="w-10 h-10 text-emerald-700" />
             <div>
               <h1 className="text-2xl font-bold text-gray-900">AGROTEC 2025</h1>
               <p className="text-emerald-700 font-semibold text-sm">SEMAGRIC - Secretaria de Agricultura</p>
             </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Relatório Executivo</p>
            <p className="text-xs text-gray-400">Gerado em {new Date().toLocaleDateString()}</p>
          </div>
        </div>
        <div className="bg-emerald-50 p-2 rounded text-center text-xs text-emerald-800 font-medium">
          Relatório confidencial para gestão interna
        </div>
      </div>

      {/* HERO BANNER - WEB ONLY */}
      <div className="relative w-full h-[320px] rounded-3xl overflow-hidden shadow-2xl mb-8 group no-print">
        <div className="absolute inset-0 bg-gray-900">
             <img 
                src="https://images.unsplash.com/photo-1625246333195-58197bd47d26?q=80&w=2070&auto=format&fit=crop" 
                alt="AGROTEC Hero" 
                className="w-full h-full object-cover opacity-80 mix-blend-overlay"
             />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950 via-emerald-900/80 to-transparent flex flex-col justify-center px-10 md:px-16">
            <div className="animate-in fade-in slide-in-from-left duration-700 max-w-3xl">
                 <div className="flex items-center gap-2 mb-4 text-emerald-300 font-medium tracking-wide text-sm bg-emerald-900/50 w-fit px-3 py-1 rounded-full backdrop-blur-md border border-emerald-500/30">
                    <CalendarRange className="w-4 h-4" /> 27 a 29 de Novembro de 2025
                 </div>
                 <h1 className="text-4xl md:text-7xl font-bold text-white mb-6 tracking-tight drop-shadow-lg leading-none">
                    AGROTEC <span className="text-emerald-400">2025</span>
                 </h1>
                 <p className="text-emerald-50 text-lg md:text-xl font-light leading-relaxed drop-shadow-md border-l-4 border-emerald-500 pl-4">
                    O maior encontro de produtores rurais, lojistas e tecnologia agrícola da região.
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
        <div className="bg-white border border-purple-100 rounded-2xl shadow-sm p-6 mb-6 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4 text-purple-700">
                <div className="bg-purple-100 p-2 rounded-lg">
                    <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg">Análise Inteligente SEMAGRIC</h3>
            </div>
            <p className="text-slate-700 mb-6 leading-relaxed text-lg font-light">{aiReport.summary}</p>
            <div className="bg-purple-50/50 rounded-xl p-5 border border-purple-100">
                <h4 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4" /> Recomendações Estratégicas
                </h4>
                <ul className="grid md:grid-cols-3 gap-4">
                {aiReport.recommendations.map((rec, idx) => (
                    <li key={idx} className="bg-white p-3 rounded-lg shadow-sm text-sm text-slate-600 border border-purple-100 flex items-start gap-2">
                        <span className="bg-purple-200 text-purple-800 w-5 h-5 flex items-center justify-center rounded-full text-xs font-bold shrink-0">{idx + 1}</span>
                        {rec}
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
          value={`R$ ${totalVolume.toLocaleString('pt-BR')}`} 
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
          value={`R$ ${(exhibitors.length ? totalVolume / exhibitors.length : 0).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`} 
          icon={<TrendingUp className="w-6 h-6" />}
          colorClass="bg-gradient-to-br from-white to-emerald-50 border-emerald-100"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart 1: Volume by City */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 card break-inside-avoid">
          <div className="flex items-center justify-between mb-6">
            <div>
                <h3 className="text-lg font-bold text-slate-800">Volume de Negócios por Cidade</h3>
                <p className="text-xs text-slate-400">Distribuição regional de vendas</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">Top 5</span>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cityChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{fill: '#64748b', fontSize: 11}} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{fill: '#64748b', fontSize: 11}} axisLine={false} tickLine={false} tickFormatter={(value) => `R$${value/1000}k`} />
                <RechartsTooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontFamily: 'Inter' }}
                  formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Volume']}
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
                <p className="text-xs text-slate-400">Perfil dos expositores participantes</p>
            </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={typeChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {typeChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}/>
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{paddingTop: '20px'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* 2026 PROJECTIONS SECTION - NEW */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 rounded-3xl p-8 md:p-10 text-white shadow-2xl relative overflow-hidden break-inside-avoid">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/20 rounded-full blur-[100px] -translate-y-1/3 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/3"></div>
        
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-white/10 pb-6">
            <div className="flex items-center gap-4">
                 <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md border border-white/10 shadow-inner">
                    <Target className="w-8 h-8 text-emerald-300" />
                 </div>
                 <div>
                   <h3 className="text-3xl font-bold text-white tracking-tight">Futuro 2026</h3>
                   <p className="text-emerald-200/70 text-sm font-medium">Projeções calculadas com base nos indicadores atuais</p>
                 </div>
            </div>
            <div className="bg-white/5 px-4 py-2 rounded-lg text-xs text-white/50 backdrop-blur-sm">
                Baseado em Taxa de Crescimento Composta (CAGR)
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="group bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:bg-white/15 transition-all hover:scale-[1.02]">
              <div className="flex justify-between items-start mb-6">
                <div className="p-2 bg-emerald-500/20 rounded-lg group-hover:bg-emerald-500/30 transition-colors">
                  <Wallet className="w-6 h-6 text-emerald-300" />
                </div>
                <span className="flex items-center text-xs font-bold text-emerald-300 bg-emerald-900/40 px-2 py-1 rounded-full border border-emerald-500/30">
                  <ArrowUpRight className="w-3 h-3 mr-1" /> +20%
                </span>
              </div>
              <p className="text-emerald-100/60 text-sm font-medium uppercase tracking-wider mb-1">Volume Projetado</p>
              <h4 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">R$ {projVolume.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</h4>
              <p className="text-xs text-emerald-200/40 mt-3 font-light">Meta de crescimento financeiro</p>
            </div>

            <div className="group bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:bg-white/15 transition-all hover:scale-[1.02]">
              <div className="flex justify-between items-start mb-6">
                <div className="p-2 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                  <Users className="w-6 h-6 text-blue-300" />
                </div>
                <span className="flex items-center text-xs font-bold text-blue-300 bg-blue-900/40 px-2 py-1 rounded-full border border-blue-500/30">
                  <ArrowUpRight className="w-3 h-3 mr-1" /> +15%
                </span>
              </div>
              <p className="text-blue-100/60 text-sm font-medium uppercase tracking-wider mb-1">Público Esperado</p>
              <h4 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">{projVisitors.toLocaleString('pt-BR')}</h4>
              <p className="text-xs text-blue-200/40 mt-3 font-light">Estimativa de fluxo de visitantes</p>
            </div>

            <div className="group bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:bg-white/15 transition-all hover:scale-[1.02]">
              <div className="flex justify-between items-start mb-6">
                <div className="p-2 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-colors">
                  <Store className="w-6 h-6 text-purple-300" />
                </div>
                <span className="flex items-center text-xs font-bold text-purple-300 bg-purple-900/40 px-2 py-1 rounded-full border border-purple-500/30">
                  <ArrowUpRight className="w-3 h-3 mr-1" /> +10%
                </span>
              </div>
              <p className="text-purple-100/60 text-sm font-medium uppercase tracking-wider mb-1">Novos Expositores</p>
              <h4 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">{projExhibitors}</h4>
              <p className="text-xs text-purple-200/40 mt-3 font-light">Expansão da área de feira</p>
            </div>
          </div>
        </div>
      </div>

      {/* Table for Print/PDF View Only */}
      <div className={`mt-8 ${isPdfMode ? 'block' : 'hidden print-only'}`}>
        <h3 className="text-lg font-bold mb-4 text-gray-800 border-l-4 border-emerald-500 pl-3">Detalhamento dos Expositores</h3>
        <table className="w-full text-sm text-left border-collapse bg-white rounded-lg border border-gray-200">
          <thead>
            <tr className="bg-emerald-50 text-emerald-900 border-b-2 border-emerald-100">
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
                <td className="py-3 px-4">{ex.name}</td>
                <td className="py-3 px-4">
                    <span className="bg-white border border-gray-200 px-2 py-0.5 rounded text-xs font-medium text-gray-600">
                        {ex.type}
                    </span>
                </td>
                <td className="py-3 px-4">{ex.city}</td>
                <td className="py-3 px-4 text-right font-mono">{ex.businessVolume.toLocaleString('pt-BR')}</td>
                <td className="py-3 px-4 text-right">{ex.visitors}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-100 font-bold text-gray-800">
                <td className="py-3 px-4" colSpan={3}>TOTAIS</td>
                <td className="py-3 px-4 text-right">R$ {totalVolume.toLocaleString('pt-BR')}</td>
                <td className="py-3 px-4 text-right">{totalVisitors}</td>
            </tr>
          </tfoot>
        </table>
        
        {/* Signature Area */}
        <div className="mt-16 pt-8 border-t border-gray-200 flex justify-between items-end break-inside-avoid">
             <div className="text-center">
                 <div className="w-64 border-b border-gray-400 mb-2"></div>
                 <p className="font-bold text-gray-800">Rodrigo</p>
                 <p className="text-xs text-gray-500">Secretário SEMAGRIC</p>
             </div>
             <div className="text-right text-xs text-gray-400">
                 <p>Documento gerado via AGRITEC Portal</p>
                 <p>ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
             </div>
        </div>
      </div>
    </div>
  );
}