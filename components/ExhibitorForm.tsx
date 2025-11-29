import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Exhibitor, ExhibitorType } from '../types';

interface ExhibitorFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (exhibitor: Omit<Exhibitor, 'id'>) => void;
  initialData?: Exhibitor;
}

export const ExhibitorForm: React.FC<ExhibitorFormProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: ExhibitorType.PRODUTOR_RURAL,
    products: '',
    city: 'Porto Velho',
    businessVolume: 0,
    visitors: 0
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        type: initialData.type,
        products: initialData.products,
        city: initialData.city,
        businessVolume: initialData.businessVolume,
        visitors: initialData.visitors
      });
    } else {
      setFormData({
        name: '',
        type: ExhibitorType.PRODUTOR_RURAL,
        products: '',
        city: 'Porto Velho',
        businessVolume: 0,
        visitors: 0
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-800">
            {initialData ? 'Editar Expositor' : 'Novo Expositor'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Expositor / Empresa</label>
            <input 
              required
              type="text" 
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Ex: Fazenda Santa Clara"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
              <select 
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value as ExhibitorType})}
              >
                {Object.values(ExhibitorType).map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cidade de Origem</label>
              <input 
                required
                type="text" 
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Produtos (Separados por vírgula)</label>
            <input 
              required
              type="text" 
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              value={formData.products}
              onChange={(e) => setFormData({...formData, products: e.target.value})}
              placeholder="Ex: Queijo, Café, Trator AG-20"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Volume de Negócios (R$)</label>
              <input 
                required
                type="number" 
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                value={formData.businessVolume}
                onChange={(e) => setFormData({...formData, businessVolume: Number(e.target.value)})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Visitantes no Stand</label>
              <input 
                required
                type="number" 
                min="0"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                value={formData.visitors}
                onChange={(e) => setFormData({...formData, visitors: Number(e.target.value)})}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-50">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors shadow-sm"
            >
              {initialData ? 'Salvar Alterações' : 'Adicionar Expositor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};