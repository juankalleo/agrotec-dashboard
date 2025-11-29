import React, { useState } from 'react';
import { Edit2, Trash2, Search, Plus, Filter } from 'lucide-react';
import { Exhibitor, ExhibitorType } from '../types';

interface ExhibitorListProps {
  exhibitors: Exhibitor[];
  onDelete: (id: string) => void;
  onEdit: (exhibitor: Exhibitor) => void;
  onAdd: () => void;
}

export const ExhibitorList: React.FC<ExhibitorListProps> = ({ exhibitors, onDelete, onEdit, onAdd }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('All');

  const filteredExhibitors = exhibitors.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          ex.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || ex.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-in fade-in duration-300">
      <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h2 className="text-xl font-bold text-slate-800">Gerenciar Expositores</h2>
           <p className="text-slate-500 text-sm mt-1">
             Listagem completa e controle de participantes
             <span className="ml-3 bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-100">
                {exhibitors.length} Total
             </span>
           </p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Buscar por nome ou cidade..." 
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={onAdd}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:shadow-lg active:scale-95 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Novo
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100 flex gap-2 overflow-x-auto items-center">
        <Filter className="w-4 h-4 text-slate-400 mr-2" />
        <button 
          onClick={() => setFilterType('All')}
          className={`px-4 py-1.5 text-xs rounded-full font-medium transition-all ${
            filterType === 'All' 
                ? 'bg-slate-800 text-white shadow-md' 
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
          }`}
        >
          Todos
        </button>
        {Object.values(ExhibitorType).map(type => (
          <button 
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-4 py-1.5 text-xs rounded-full font-medium transition-all ${
                filterType === type 
                    ? 'bg-emerald-600 text-white shadow-md' 
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-500">
          <thead className="text-xs text-slate-400 uppercase bg-slate-50/50 font-semibold tracking-wider">
            <tr>
              <th className="px-6 py-4">Expositor</th>
              <th className="px-6 py-4">Categoria</th>
              <th className="px-6 py-4">Produtos & Cidade</th>
              <th className="px-6 py-4 text-right">Vol. Negócios</th>
              <th className="px-6 py-4 text-right">Visitantes</th>
              <th className="px-6 py-4 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredExhibitors.length > 0 ? (
              filteredExhibitors.map((exhibitor) => (
                <tr key={exhibitor.id} className="bg-white hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900 text-base">{exhibitor.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      exhibitor.type === ExhibitorType.PRODUTOR_RURAL ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      exhibitor.type === ExhibitorType.LOJISTA ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      'bg-purple-50 text-purple-700 border-purple-200'
                    }`}>
                      {exhibitor.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-slate-700 truncate max-w-[180px] font-medium">{exhibitor.products}</span>
                      <span className="text-xs text-slate-400 mt-0.5">{exhibitor.city}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-mono font-medium text-emerald-600">
                    R$ {exhibitor.businessVolume.toLocaleString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 text-right text-slate-700 font-medium">
                    {exhibitor.visitors.toLocaleString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => onEdit(exhibitor)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Editar">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => onDelete(exhibitor.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Excluir">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center gap-2">
                    <Filter className="w-8 h-8 opacity-20" />
                    <p>Nenhum expositor encontrado com os filtros atuais.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};