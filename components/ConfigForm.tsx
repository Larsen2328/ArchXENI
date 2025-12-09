import React from 'react';
import { RoomConfig } from '../types';
import { BedDouble, Bath, Briefcase, Shirt, Warehouse, CarFront, Utensils } from 'lucide-react';

interface ConfigFormProps {
  config: RoomConfig;
  setConfig: React.Dispatch<React.SetStateAction<RoomConfig>>;
  onSubmit: () => void;
  isLoading: boolean;
}

const ConfigForm: React.FC<ConfigFormProps> = ({ config, setConfig, onSubmit, isLoading }) => {
  
  const toggle = (key: keyof RoomConfig) => {
    setConfig(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const increment = (key: 'bedrooms' | 'bathrooms') => {
    setConfig(prev => ({ ...prev, [key]: Math.min(prev[key] + 1, 8) }));
  };

  const decrement = (key: 'bedrooms' | 'bathrooms') => {
    setConfig(prev => ({ ...prev, [key]: Math.max(prev[key] - 1, 1) }));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-fit sticky top-6">
      <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <span className="bg-indigo-100 text-indigo-600 p-1.5 rounded-lg">
            <Warehouse size={20} />
        </span>
        Configuration
      </h2>

      <div className="space-y-6">
        {/* Rooms Counters */}
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <label className="text-slate-600 font-medium flex items-center gap-2">
                    <BedDouble size={18} /> Chambres
                </label>
                <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-1">
                    <button onClick={() => decrement('bedrooms')} className="w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm text-slate-600 hover:bg-slate-100">-</button>
                    <span className="w-4 text-center font-semibold text-slate-800">{config.bedrooms}</span>
                    <button onClick={() => increment('bedrooms')} className="w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm text-slate-600 hover:bg-slate-100">+</button>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <label className="text-slate-600 font-medium flex items-center gap-2">
                    <Bath size={18} /> Salles de bain
                </label>
                <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-1">
                    <button onClick={() => decrement('bathrooms')} className="w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm text-slate-600 hover:bg-slate-100">-</button>
                    <span className="w-4 text-center font-semibold text-slate-800">{config.bathrooms}</span>
                    <button onClick={() => increment('bathrooms')} className="w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm text-slate-600 hover:bg-slate-100">+</button>
                </div>
            </div>
        </div>

        <hr className="border-slate-100" />

        {/* Toggles */}
        <div className="grid grid-cols-1 gap-3">
            <button 
                onClick={() => toggle('office')}
                className={`flex items-center justify-between p-3 rounded-lg border transition-all ${config.office ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 hover:bg-slate-50 text-slate-600'}`}
            >
                <span className="flex items-center gap-2 font-medium"><Briefcase size={18}/> Bureau</span>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${config.office ? 'bg-indigo-500 border-indigo-500' : 'border-slate-300'}`}>
                    {config.office && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
            </button>

            <button 
                onClick={() => toggle('laundry')}
                className={`flex items-center justify-between p-3 rounded-lg border transition-all ${config.laundry ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 hover:bg-slate-50 text-slate-600'}`}
            >
                <span className="flex items-center gap-2 font-medium"><Shirt size={18}/> Buanderie</span>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${config.laundry ? 'bg-indigo-500 border-indigo-500' : 'border-slate-300'}`}>
                    {config.laundry && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
            </button>

            <button 
                onClick={() => toggle('separateWc')}
                className={`flex items-center justify-between p-3 rounded-lg border transition-all ${config.separateWc ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 hover:bg-slate-50 text-slate-600'}`}
            >
                <span className="flex items-center gap-2 font-medium"><span className="font-bold text-xs border border-current px-1 rounded">WC</span> WC Indépendant</span>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${config.separateWc ? 'bg-indigo-500 border-indigo-500' : 'border-slate-300'}`}>
                    {config.separateWc && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
            </button>
            
             <button 
                onClick={() => toggle('openKitchen')}
                className={`flex items-center justify-between p-3 rounded-lg border transition-all ${config.openKitchen ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 hover:bg-slate-50 text-slate-600'}`}
            >
                <span className="flex items-center gap-2 font-medium"><Utensils size={18}/> Cuisine Ouverte</span>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${config.openKitchen ? 'bg-indigo-500 border-indigo-500' : 'border-slate-300'}`}>
                    {config.openKitchen && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
            </button>

             <button 
                onClick={() => toggle('garage')}
                className={`flex items-center justify-between p-3 rounded-lg border transition-all ${config.garage ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 hover:bg-slate-50 text-slate-600'}`}
            >
                <span className="flex items-center gap-2 font-medium"><CarFront size={18}/> Garage</span>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${config.garage ? 'bg-indigo-500 border-indigo-500' : 'border-slate-300'}`}>
                    {config.garage && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
            </button>
        </div>

        <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Style Architectural</label>
            <select 
                value={config.style}
                onChange={(e) => setConfig(prev => ({ ...prev, style: e.target.value as any }))}
                className="w-full p-3 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
                <option value="modern">Moderne / Contemporain</option>
                <option value="traditional">Traditionnel</option>
                <option value="minimalist">Minimaliste</option>
                <option value="farmhouse">Campagne / Farmhouse</option>
            </select>
        </div>

        <button
            onClick={onSubmit}
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 mt-4"
        >
            {isLoading ? (
                <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Génération...
                </>
            ) : (
                'Générer le Plan'
            )}
        </button>
      </div>
    </div>
  );
};

export default ConfigForm;
