import React, { useState, useEffect } from 'react';
import { Job, UserPreferences } from '../types';
import { analyzeMatch } from '../services/jobService';
import {
  Bookmark,
  ThumbsDown,
  ThumbsUp,
  MapPin,
  Clock,
  Wallet,
  ExternalLink,
  Building2,
  Sparkles,
  X,
  Loader2
} from 'lucide-react';

interface JobCardProps {
  job: Job;
  userPreferences?: UserPreferences;
}

export const JobCard: React.FC<JobCardProps> = ({ job, userPreferences }) => {
  const [saved, setSaved] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  useEffect(() => {
    const savedList: Job[] = JSON.parse(
      localStorage.getItem('saved_jobs') || '[]'
    );
    const exists = savedList.some((j) => j.id === job.id);
    setSaved(exists);
  }, [job.id]);

  const toggleSave = () => {
    const savedList: Job[] = JSON.parse(
      localStorage.getItem('saved_jobs') || '[]'
    );
    let updatedList;
    if (saved) {
      updatedList = savedList.filter((j) => j.id !== job.id);
    } else {
      updatedList = [...savedList, job];
    }
    localStorage.setItem('saved_jobs', JSON.stringify(updatedList));
    setSaved(!saved);
  };

  const handleFeedback = (type: 'like' | 'dislike') => {
    console.log(`Feedback: ${type}`);
  };

  const handleAnalyze = async () => {
    if (!userPreferences) return;
    setAnalyzing(true);
    setAnalysisResult(null);
    try {
      const result = await analyzeMatch(job, userPreferences);
      setAnalysisResult(result);
    } catch (error) {
      console.error(error);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 mb-4 border border-gray-100 hover:shadow-md transition-all group relative overflow-hidden">
      
      {job.isNew && (
        <div className="absolute top-0 right-0 bg-orange-100 text-orange-700 text-[10px] font-bold px-3 py-1 rounded-bl-xl z-10">
          NUEVO
        </div>
      )}

      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-4 w-full">
          <div className="w-14 h-14 rounded-xl overflow-hidden border border-gray-100 bg-white flex items-center justify-center shrink-0">
             <img
                src={job.logo}
                alt={job.company}
                className="w-full h-full object-cover"
                onError={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${job.company}&background=random`
                }}
              />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-brand-dark transition-colors truncate pr-8">
              <a href={job.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {job.title}
              </a>
            </h3>
            <div className="flex items-center gap-1 text-gray-500 mt-1">
                <Building2 size={14} />
                <p className="text-sm font-medium truncate">{job.company}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 my-3 text-sm text-gray-600">
        <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 px-2.5 py-1.5 rounded-lg">
          <Wallet size={15} className="text-green-600" />
          <span className="font-semibold text-gray-700">{job.salary || 'A tratar'}</span>
        </div>
        <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 px-2.5 py-1.5 rounded-lg">
          <Clock size={15} className="text-blue-500"/>
          <span>{job.type}</span>
        </div>
        <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 px-2.5 py-1.5 rounded-lg">
          <MapPin size={15} className="text-red-500" />
          <span>{job.location}</span>
        </div>
      </div>

      {job.description && (
        <div className="mb-4 text-gray-600 text-sm leading-relaxed line-clamp-3">
          {job.description}
        </div>
      )}

      {/* Analysis Result Area */}
      {analysisResult && (
        <div className="mb-4 bg-brand-light/20 p-4 rounded-xl border border-brand-light/50 relative animate-in fade-in slide-in-from-top-2">
            <button 
                onClick={() => setAnalysisResult(null)}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            >
                <X size={16} />
            </button>
            <div className="flex items-center gap-2 mb-2 text-brand-dark font-bold text-sm">
                <Sparkles size={16} className="text-brand-accent"/>
                Análisis de IA
            </div>
            <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                {analysisResult}
            </div>
        </div>
      )}

      <div className="flex gap-2 mb-5 overflow-x-auto no-scrollbar pb-1">
        {job.tags?.map((tag) => (
          <span
            key={tag}
            className="text-xs text-brand-dark bg-brand-light/30 px-2.5 py-1 rounded-md font-medium whitespace-nowrap"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-50">
        <div className="flex gap-1">
          <button
            onClick={() => handleFeedback('dislike')}
            className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
          >
            <ThumbsDown size={18} />
          </button>
          <button
            onClick={() => handleFeedback('like')}
            className="p-2 text-gray-300 hover:text-green-500 hover:bg-green-50 rounded-full transition-colors"
          >
            <ThumbsUp size={18} />
          </button>
           <button
            onClick={toggleSave}
            className={`p-2 rounded-full transition-colors ml-1 ${
                saved ? 'text-brand-dark bg-brand-light/50' : 'text-gray-300 hover:text-brand-dark hover:bg-gray-50'
            }`}
           >
            <Bookmark size={18} fill={saved ? 'currentColor' : 'none'} />
           </button>
        </div>

        <div className="flex gap-2">
            {userPreferences && !analysisResult && (
                <button 
                    onClick={handleAnalyze}
                    disabled={analyzing}
                    className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm text-brand-dark bg-white border border-gray-200 hover:bg-gray-50 transition-all disabled:opacity-50"
                >
                    {analyzing ? <Loader2 size={16} className="animate-spin"/> : <Sparkles size={16} />}
                    {analyzing ? 'Analizando...' : 'Analizar'}
                </button>
            )}
            <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-brand-dark hover:bg-brand-dark/90 hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
            Postularse
            <ExternalLink size={16} />
            </a>
        </div>
      </div>
    </div>
  );
};
