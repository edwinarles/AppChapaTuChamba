import React, { useEffect, useState } from 'react';
import { Bookmark } from 'lucide-react';
import { Job } from '../types';
import { JobCard } from '../../components/JobCard';

const GuardadoScreen: React.FC = () => {
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);

  useEffect(() => {
    const data = localStorage.getItem('saved_jobs');
    if (data) {
      setSavedJobs(JSON.parse(data));
    }
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-brand-dark mb-4">Tus Guardados</h2>

      {savedJobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center mt-20">
          <Bookmark size={48} className="text-gray-300 mb-4" />
          <p className="text-gray-500">
            Aquí aparecerán las ofertas que guardes para revisar luego.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {savedJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
};

export default GuardadoScreen;
