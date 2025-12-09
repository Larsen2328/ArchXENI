import React, { useState } from 'react';
import { PlanAnalysis } from '../types';
import { Maximize2, Download, CheckCircle2, Ruler, Lightbulb } from 'lucide-react';

interface PlanDisplayProps {
  imageUrl: string;
  analysis: PlanAnalysis;
}

const PlanDisplay: React.FC<PlanDisplayProps> = ({ imageUrl, analysis }) => {
  const [isZoomed, setIsZoomed] = useState(false);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'mon-plan-maison.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Image Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                <Ruler size={18} className="text-indigo-500"/>
                Aperçu du Plan
            </h3>
            <div className="flex gap-2">
                <button 
                    onClick={handleDownload}
                    className="p-2 hover:bg-white rounded-lg text-slate-600 transition-colors border border-transparent hover:border-slate-200 hover:shadow-sm"
                    title="Télécharger"
                >
                    <Download size={18} />
                </button>
                <button 
                    onClick={() => setIsZoomed(true)}
                    className="p-2 hover:bg-white rounded-lg text-slate-600 transition-colors border border-transparent hover:border-slate-200 hover:shadow-sm"
                    title="Agrandir"
                >
                    <Maximize2 size={18} />
                </button>
            </div>
        </div>
        <div className="relative aspect-[4/3] bg-slate-100 w-full group cursor-pointer" onClick={() => setIsZoomed(true)}>
            <img 
                src={imageUrl} 
                alt="Generated Floor Plan" 
                className="w-full h-full object-contain mix-blend-multiply"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 bg-white/90 px-4 py-2 rounded-full text-sm font-medium shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all">
                    Cliquer pour agrandir
                </span>
            </div>
        </div>
      </div>

      {/* Analysis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Details Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2">
                <CheckCircle2 className="text-emerald-500" size={20} />
                Analyse & Surfaces
            </h3>
            <p className="text-slate-600 mb-6 text-sm leading-relaxed">
                {analysis.description}
            </p>

            <div className="space-y-3">
                {analysis.surfaceSuggestions.map((item, index) => (
                    <div key={index} className="flex items-start justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <div>
                            <span className="font-semibold text-slate-700 block">{item.room}</span>
                            <span className="text-xs text-slate-500">{item.tips}</span>
                        </div>
                        <span className="bg-white px-2 py-1 rounded border border-slate-200 text-indigo-600 font-bold text-sm">
                            {item.area}
                        </span>
                    </div>
                ))}
                <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                    <span className="font-bold text-slate-800">Surface Totale Estimée</span>
                    <span className="text-xl font-bold text-indigo-600">{analysis.estimatedTotalArea}</span>
                </div>
            </div>
        </div>

        {/* Tips Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-fit">
            <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2">
                <Lightbulb className="text-amber-500" size={20} />
                Conseils Architecturaux
            </h3>
            <ul className="space-y-4">
                {analysis.constructionTips.map((tip, idx) => (
                    <li key={idx} className="flex gap-3 text-slate-600 text-sm">
                        <div className="min-w-[6px] h-[6px] rounded-full bg-amber-400 mt-1.5" />
                        {tip}
                    </li>
                ))}
            </ul>
        </div>

      </div>

      {/* Zoom Modal */}
      {isZoomed && (
        <div 
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-pointer"
            onClick={() => setIsZoomed(false)}
        >
            <img 
                src={imageUrl} 
                alt="Full Size Plan" 
                className="max-w-full max-h-full rounded shadow-2xl"
            />
            <button 
                className="absolute top-6 right-6 text-white/70 hover:text-white"
                onClick={(e) => { e.stopPropagation(); setIsZoomed(false); }}
            >
                Fermer (Esc)
            </button>
        </div>
      )}
    </div>
  );
};

export default PlanDisplay;
