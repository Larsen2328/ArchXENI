import React, { useState } from 'react';
import { RoomConfig, GeneratedPlan } from './types';
import ConfigForm from './components/ConfigForm';
import PlanDisplay from './components/PlanDisplay';
import { generateArchitecturalAnalysis, generateFloorPlanImage } from './services/geminiService';
import { PencilRuler, DraftingCompass, LayoutTemplate } from 'lucide-react';

const App: React.FC = () => {
  // Initial state matches the user's request
  const [config, setConfig] = useState<RoomConfig>({
    bedrooms: 3,
    bathrooms: 1,
    office: true,
    laundry: true,
    separateWc: true,
    openKitchen: true,
    garage: false,
    style: 'modern'
  });

  const [loading, setLoading] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedPlan | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Generate Text Analysis & Prompt
      const { analysis, imagePrompt } = await generateArchitecturalAnalysis(config);
      
      // 2. Generate Image based on the prompt
      const imageUrl = await generateFloorPlanImage(imagePrompt);

      setGeneratedPlan({
        imageUrl,
        analysis
      });
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue lors de la génération.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
                <LayoutTemplate size={24} />
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">ArchiPlan <span className="text-indigo-600">AI</span></h1>
          </div>
          <div className="text-sm text-slate-500 hidden sm:block">
            Généré par Google Gemini 2.5 & Imagen
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Sidebar: Configuration */}
          <div className="lg:col-span-4 xl:col-span-3">
            <ConfigForm 
                config={config} 
                setConfig={setConfig} 
                onSubmit={handleGenerate} 
                isLoading={loading}
            />
          </div>

          {/* Right Area: Display */}
          <div className="lg:col-span-8 xl:col-span-9">
            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r">
                    <p className="text-red-700">{error}</p>
                </div>
            )}

            {!generatedPlan && !loading && !error && (
                <div className="h-[500px] flex flex-col items-center justify-center text-center border-2 border-dashed border-slate-300 rounded-xl bg-slate-50/50">
                    <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6 text-indigo-400">
                        <DraftingCompass size={40} />
                    </div>
                    <h2 className="text-xl font-semibold text-slate-700 mb-2">Prêt à dessiner votre future maison ?</h2>
                    <p className="text-slate-500 max-w-md">
                        Configurez vos besoins sur la gauche (nombre de chambres, style...) et cliquez sur "Générer" pour obtenir un plan unique.
                    </p>
                </div>
            )}

            {loading && (
                <div className="h-[500px] flex flex-col items-center justify-center text-center rounded-xl bg-white shadow-sm border border-slate-100">
                    <div className="relative w-24 h-24 mb-6">
                         <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                         <div className="absolute inset-0 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
                         <div className="absolute inset-0 flex items-center justify-center text-indigo-600">
                            <PencilRuler size={32} />
                         </div>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800">Conception en cours...</h3>
                    <p className="text-slate-500 mt-2">L'IA analyse vos besoins et dessine le plan.</p>
                    <div className="mt-8 max-w-xs w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div className="bg-indigo-500 h-full rounded-full animate-progress" style={{width: '80%'}}></div>
                    </div>
                </div>
            )}

            {generatedPlan && !loading && (
                <PlanDisplay 
                    imageUrl={generatedPlan.imageUrl}
                    analysis={generatedPlan.analysis}
                />
            )}
          </div>

        </div>
      </main>

      <style>{`
        @keyframes progress {
            0% { width: 0%; transform: translateX(-100%); }
            50% { width: 50%; }
            100% { width: 100%; transform: translateX(100%); }
        }
        .animate-progress {
            animation: progress 2s infinite linear;
        }
      `}</style>
    </div>
  );
};

export default App;