import React, { useRef, useState } from 'react';
import { Camera, MapPin, Calendar, Upload, Trash2, X, Plus, Image as ImageIcon } from 'lucide-react';
import { GalleryPhoto } from '../types';

interface GalleryProps {
  photos: GalleryPhoto[];
  onAddPhoto: (photo: GalleryPhoto) => void;
  onDeletePhoto: (id: string) => void;
}

export const Gallery: React.FC<GalleryProps> = ({ photos, onAddPhoto, onDeletePhoto }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    // Simulate upload delay for better UX
    setTimeout(() => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const newPhoto: GalleryPhoto = {
            id: Date.now().toString(),
            url: reader.result as string,
            title: file.name.split('.')[0] || 'Nova Foto',
            category: 'Upload Recente',
            date: new Date().toISOString().split('T')[0]
          };
          onAddPhoto(newPhoto);
          setIsUploading(false);
        };
        reader.readAsDataURL(file);
    }, 800);
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      
      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <div className="bg-emerald-100 p-2 rounded-lg">
                <Camera className="w-6 h-6 text-emerald-600" />
            </div>
            Galeria Oficial AGROTEC
          </h2>
          <p className="text-slate-500 text-sm mt-1 ml-12">
            {photos.length} registros visuais da feira e expositores
          </p>
        </div>
        
        <div>
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
            />
            <button 
                onClick={triggerUpload}
                disabled={isUploading}
                className="group flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white px-5 py-3 rounded-xl text-sm font-semibold transition-all hover:shadow-lg active:scale-95"
            >
                {isUploading ? (
                    <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Enviando...
                    </>
                ) : (
                    <>
                        <Upload className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                        Nova Foto
                    </>
                )}
            </button>
        </div>
      </div>

      {/* Grid */}
      {photos.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
            <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ImageIcon className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-medium text-slate-600">Nenhuma foto na galeria</h3>
            <p className="text-slate-400 text-sm mb-4">Comece adicionando fotos do evento</p>
            <button onClick={triggerUpload} className="text-emerald-600 font-medium hover:underline">
                Fazer upload agora
            </button>
        </div>
      ) : (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {photos.map((photo) => (
            <div key={photo.id} className="group relative break-inside-avoid rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100">
                <div 
                    className="relative aspect-[4/3] overflow-hidden cursor-zoom-in"
                    onClick={() => setSelectedPhoto(photo)}
                >
                    <img 
                        src={photo.url} 
                        alt={photo.title} 
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                        <span className="text-white font-bold text-lg leading-tight">{photo.title}</span>
                        <span className="text-emerald-300 text-xs font-medium uppercase tracking-wide mt-1">{photo.category}</span>
                    </div>
                </div>
                
                <div className="p-4 bg-white flex justify-between items-center">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <MapPin className="w-3.5 h-3.5 text-emerald-500" /> 
                            <span>Porto Velho</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <Calendar className="w-3.5 h-3.5 text-emerald-500" /> 
                            <span>{new Date(photo.date).toLocaleDateString()}</span>
                        </div>
                    </div>
                    <button 
                        onClick={(e) => { e.stopPropagation(); onDeletePhoto(photo.id); }}
                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Excluir foto"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
            ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm animate-in fade-in duration-200">
            <button 
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-50"
            >
                <X className="w-8 h-8" />
            </button>
            
            <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
                <img 
                    src={selectedPhoto.url} 
                    alt={selectedPhoto.title}
                    className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                />
                <div className="mt-6 text-center">
                    <h3 className="text-2xl font-bold text-white">{selectedPhoto.title}</h3>
                    <div className="flex items-center justify-center gap-4 mt-2 text-white/70">
                        <span className="bg-emerald-500/20 px-3 py-0.5 rounded-full text-emerald-300 text-sm border border-emerald-500/30">
                            {selectedPhoto.category}
                        </span>
                        <span className="text-sm border-l border-white/20 pl-4">
                            {new Date(selectedPhoto.date).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};