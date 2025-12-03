import React from 'react';
import { JobCard } from '../../components/JobCard';
import { Sparkles, Loader2, RefreshCw, Globe, Search } from 'lucide-react';
import { UserPreferences, Job } from '../../types';

interface Props {
  preferences: UserPreferences;
  jobs: Job[];
  loading: boolean;
  onRefresh: () => void;
}

const StudentHome: React.FC<Props> = ({ preferences, jobs, loading, onRefresh }) => {
  
  return (
    <div className="pb-20 md:pb-0 min-h-full">
      {/* Header Mobile */}
      <div className="px-4 py-6 md:px-8 max-w-3xl mx-auto">
        
        <div className="bg-gradient-to-r from-brand-dark to-[#2D2A5E] p-6 rounded-2xl mb-8 text-white relative overflow-hidden shadow-xl">
           <div className="absolute top-0 right-0 p-4 opacity-10">
             <Globe size={120} />
           </div>
           
           <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2 text-brand-accent">
                <Sparkles size={18} />
                <span className="text-xs font-bold uppercase tracking-wider">Live Search Active</span>
              </div>
              <h2 className="text-2xl font-bold mb-2">Buscando oportunidades en la web...</h2>
              <p className="text-brand-light/80 text-sm mb-4">
                Nuestro agente está escaneando LinkedIn, Computrabajo y más portales para: <span className="text-white font-semibold underline decoration-brand-accent">{preferences.career}</span>.
              </p>
              
              <div className="flex gap-2">
                 {preferences.skills.slice(0,3).map(s => (
                   <span key={s} className="text-[10px] bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-white border border-white/20">{s}</span>
                 ))}
              </div>
           </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
             <h3 className="font-bold text-xl text-gray-800">Resultados Encontrados ({jobs.length})</h3>
             <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-1 rounded-md border border-blue-100 flex items-center gap-1">
                <Search size={10} /> Powered by Gemini Search Grounding
             </span>
          </div>
          
          <button 
            onClick={onRefresh} 
            disabled={loading}
            className="text-gray-500 hover:text-brand-dark hover:bg-gray-100 p-2 rounded-xl transition-colors"
            title="Actualizar búsqueda"
          >
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        {loading ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center py-8 text-gray-400 gap-2">
                <Loader2 className="animate-spin" size={20} />
                <span className="text-sm">Analizando fuentes externas...</span>
            </div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 animate-pulse">
                <div className="flex gap-4 mb-3">
                   <div className="w-14 h-14 bg-gray-200 rounded-xl"></div>
                   <div className="flex-1 space-y-2">
                      <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                   </div>
                </div>
                <div className="h-10 bg-gray-100 rounded w-full mt-4"></div>
              </div>
            ))}
          </div>
        ) : jobs.length > 0 ? (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} userPreferences={preferences} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-200">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                <Search size={24} />
            </div>
            <h3 className="text-gray-900 font-bold mb-1">Sin resultados exactos</h3>
            <p className="text-gray-500 text-sm max-w-xs mx-auto">
                No encontramos ofertas que coincidan al 100% con tus filtros en este momento. Intenta ampliar tu ubicación o reducir keywords.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default StudentHome;