import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, LogOut, Sprout, Menu, X, UserCircle, Image, Settings, ChevronRight } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { ExhibitorList } from './components/ExhibitorList';
import { ExhibitorForm } from './components/ExhibitorForm';
import { Gallery } from './components/Gallery';
import { Exhibitor, ExhibitorType, GalleryPhoto } from './types';

function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'exhibitors' | 'gallery'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // States with LocalStorage Persistence - Starts empty for production
  const [exhibitors, setExhibitors] = useState<Exhibitor[]>(() => {
    const saved = localStorage.getItem('agrotec_exhibitors');
    return saved ? JSON.parse(saved) : [];
  });

  const [photos, setPhotos] = useState<GalleryPhoto[]>(() => {
    const saved = localStorage.getItem('agrotec_photos');
    return saved ? JSON.parse(saved) : [];
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExhibitor, setEditingExhibitor] = useState<Exhibitor | undefined>(undefined);

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('agrotec_exhibitors', JSON.stringify(exhibitors));
  }, [exhibitors]);

  useEffect(() => {
    localStorage.setItem('agrotec_photos', JSON.stringify(photos));
  }, [photos]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Exhibitor Actions
  const handleAddExhibitor = (newExhibitorData: Omit<Exhibitor, 'id'>) => {
    if (editingExhibitor) {
      setExhibitors(exhibitors.map(ex => ex.id === editingExhibitor.id ? { ...newExhibitorData, id: ex.id } : ex));
    } else {
      const newExhibitor: Exhibitor = {
        ...newExhibitorData,
        id: Math.random().toString(36).substr(2, 9),
      };
      setExhibitors([...exhibitors, newExhibitor]);
    }
    setEditingExhibitor(undefined);
  };

  const deleteExhibitor = (id: string) => {
    if (confirm('Tem certeza que deseja remover este expositor?')) {
      setExhibitors(exhibitors.filter(ex => ex.id !== id));
    }
  };

  const startEdit = (exhibitor: Exhibitor) => {
    setEditingExhibitor(exhibitor);
    setIsFormOpen(true);
  };

  const openNewForm = () => {
    setEditingExhibitor(undefined);
    setIsFormOpen(true);
  };

  // Gallery Actions
  const handleAddPhoto = (photo: GalleryPhoto) => {
    setPhotos([photo, ...photos]);
  };

  const handleDeletePhoto = (id: string) => {
    if (confirm('Deseja excluir esta foto?')) {
      setPhotos(photos.filter(p => p.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-800">
      
      {/* Mobile Header */}
      <div className="md:hidden bg-emerald-900 text-white p-4 flex justify-between items-center shadow-md z-30 relative">
        <div className="flex items-center gap-2">
          <Sprout className="w-6 h-6 text-emerald-400" />
          <span className="font-bold text-lg tracking-tight">AGROTEC</span>
        </div>
        <button onClick={toggleSidebar} className="p-1 hover:bg-emerald-800 rounded transition-colors">
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed md:sticky top-0 left-0 h-screen w-72 bg-emerald-950 text-white flex flex-col transition-all duration-300 z-20 shadow-2xl md:shadow-none no-print
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Sidebar Header */}
        <div className="p-8 border-b border-emerald-900/50 bg-gradient-to-b from-emerald-900 to-emerald-950">
          <div className="flex items-center gap-4">
            <div className="bg-emerald-500/20 p-2.5 rounded-xl border border-emerald-500/30 backdrop-blur-sm">
              <Sprout className="w-8 h-8 text-emerald-400" />
            </div>
            <div>
              <h1 className="font-bold text-2xl tracking-wide text-white">AGROTEC</h1>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <p className="text-xs text-emerald-300 font-medium tracking-wider">ONLINE SYSTEM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <div className="text-xs font-semibold text-emerald-600/80 uppercase tracking-wider mb-2 px-4 mt-4">Menu Principal</div>
          
          <button 
            onClick={() => { setActiveTab('dashboard'); setIsSidebarOpen(false); }}
            className={`w-full group flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 border border-transparent
              ${activeTab === 'dashboard' 
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20 border-emerald-500/20' 
                : 'text-emerald-300/80 hover:bg-emerald-900/50 hover:text-white hover:pl-5'}`}
          >
            <div className="flex items-center gap-3">
              <LayoutDashboard className={`w-5 h-5 ${activeTab === 'dashboard' ? 'text-white' : 'text-emerald-500 group-hover:text-emerald-400'}`} />
              <span className="font-medium">Dashboard</span>
            </div>
            {activeTab === 'dashboard' && <ChevronRight className="w-4 h-4 opacity-70" />}
          </button>
          
          <button 
            onClick={() => { setActiveTab('exhibitors'); setIsSidebarOpen(false); }}
            className={`w-full group flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 border border-transparent
              ${activeTab === 'exhibitors' 
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20 border-emerald-500/20' 
                : 'text-emerald-300/80 hover:bg-emerald-900/50 hover:text-white hover:pl-5'}`}
          >
            <div className="flex items-center gap-3">
              <Users className={`w-5 h-5 ${activeTab === 'exhibitors' ? 'text-white' : 'text-emerald-500 group-hover:text-emerald-400'}`} />
              <span className="font-medium">Expositores</span>
            </div>
            {activeTab === 'exhibitors' && <ChevronRight className="w-4 h-4 opacity-70" />}
          </button>

          <button 
            onClick={() => { setActiveTab('gallery'); setIsSidebarOpen(false); }}
            className={`w-full group flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 border border-transparent
              ${activeTab === 'gallery' 
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20 border-emerald-500/20' 
                : 'text-emerald-300/80 hover:bg-emerald-900/50 hover:text-white hover:pl-5'}`}
          >
            <div className="flex items-center gap-3">
              <Image className={`w-5 h-5 ${activeTab === 'gallery' ? 'text-white' : 'text-emerald-500 group-hover:text-emerald-400'}`} />
              <span className="font-medium">Galeria de Fotos</span>
            </div>
             {activeTab === 'gallery' && <ChevronRight className="w-4 h-4 opacity-70" />}
          </button>
        </nav>

        {/* User Profile */}
        <div className="p-4 bg-emerald-950 border-t border-emerald-900">
          <div className="flex items-center gap-3 px-4 py-3 bg-emerald-900/40 rounded-xl mb-3 border border-emerald-800/50">
            <div className="bg-gradient-to-br from-emerald-400 to-teal-600 p-0.5 rounded-full shadow-lg">
               <div className="bg-emerald-900 p-1 rounded-full">
                 <UserCircle className="w-6 h-6 text-emerald-100" />
               </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold text-white truncate">Rodrigo</p>
              <p className="text-xs text-emerald-400 truncate">Secretário SEMAGRIC</p>
            </div>
            <button className="text-emerald-400 hover:text-white transition-colors">
              <Settings className="w-4 h-4" />
            </button>
          </div>
          <button className="w-full flex items-center justify-center gap-2 text-sm text-red-300/80 hover:text-red-200 hover:bg-red-900/20 py-2.5 rounded-lg transition-all">
            <LogOut className="w-4 h-4" />
            <span>Sair do Sistema</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full max-w-full">
        <div className="max-w-7xl mx-auto h-full">
          {/* Header context for print */}
          <div className="hidden print-only mb-8 text-center border-b-2 border-emerald-800 pb-4">
            <h1 className="text-3xl font-bold text-emerald-900">RELATÓRIO AGROTEC 2025</h1>
            <p className="text-gray-600 mt-2">Secretaria de Agricultura - SEMAGRIC | Porto Velho - RO</p>
            <p className="text-sm text-gray-500 mt-1">Gerado em: {new Date().toLocaleDateString()}</p>
          </div>

          {activeTab === 'dashboard' && <Dashboard exhibitors={exhibitors} />}
          
          {activeTab === 'exhibitors' && (
            <ExhibitorList 
              exhibitors={exhibitors} 
              onDelete={deleteExhibitor}
              onEdit={startEdit}
              onAdd={openNewForm}
            />
          )}
          
          {activeTab === 'gallery' && (
            <Gallery 
              photos={photos} 
              onAddPhoto={handleAddPhoto}
              onDeletePhoto={handleDeletePhoto}
            />
          )}
        </div>
      </main>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-10 md:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Modals */}
      <ExhibitorForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSubmit={handleAddExhibitor}
        initialData={editingExhibitor}
      />
    </div>
  );
}

export default App;