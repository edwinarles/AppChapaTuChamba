import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../../components/Button';
import { UserPreferences } from '../../types';
import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Award,
  Laptop,
  Code,
  Search,
  X,
} from 'lucide-react';

// --- Reusable Components ---

interface AccordionItemProps {
  title: string;
  icon?: React.ElementType;
  isOpen: boolean;
  onClick: () => void;
  children: React.ReactNode;
  headerAction?: React.ReactNode;
  subLabel?: string;
}

const AccordionItem: React.FC<AccordionItemProps> = ({
  title,
  icon: Icon,
  isOpen,
  onClick,
  children,
  headerAction,
  subLabel,
}) => (
  <div className="bg-white rounded-2xl shadow-sm mb-4 overflow-hidden border border-gray-100">
    <button
      className="w-full p-5 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
      onClick={onClick}
    >
      <div className="flex items-center gap-4 text-[#1E1B4B] font-bold text-lg">
        {Icon && (
          <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] flex items-center justify-center text-[#1E1B4B]">
            <Icon size={20} />
          </div>
        )}
        <div className="flex flex-col items-start">
          <span>{title}</span>
          {!isOpen && subLabel && (
            <span className="text-xs font-normal text-gray-400 mt-0.5">
              {subLabel}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3">
        {headerAction && (
          <div onClick={(e) => e.stopPropagation()}>{headerAction}</div>
        )}
        {isOpen ? (
          <ChevronUp size={20} className="text-gray-400" />
        ) : (
          <ChevronDown size={20} className="text-gray-400" />
        )}
      </div>
    </button>
    <div
      className={`transition-all duration-300 ease-in-out overflow-hidden ${
        isOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
      }`}
    >
      <div className="px-5 pb-6 pt-2">{children}</div>
    </div>
  </div>
);

const SegmentedControl = ({
  options,
  selected,
  onChange,
  multi = false,
}: {
  options: string[];
  selected: string | string[];
  onChange: (val: string) => void;
  multi?: boolean;
}) => (
  <div className="flex flex-wrap gap-2">
    {options.map((option) => {
      const isSelected = multi
        ? (selected as string[]).includes(option)
        : selected === option;

      return (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={`flex-1 min-w-[80px] py-3 px-4 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
            isSelected
              ? 'bg-[#FF9F43] text-white shadow-md' // Orange accent from image
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          {option}
        </button>
      );
    })}
  </div>
);

const InputGroup = ({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}) => (
  <div className="mb-4 last:mb-0">
    <label className="text-sm font-bold text-[#1E1B4B] mb-2 block">
      {label}
    </label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 focus:ring-2 focus:ring-[#1E1B4B]/20 focus:border-[#1E1B4B] outline-none transition-all"
    />
  </div>
);

// --- Main App Component ---

interface Props {
  currentPreferences: UserPreferences;
  onSave: (prefs: UserPreferences) => void;
}

const PreferencesScreen: React.FC<Props> = ({ currentPreferences, onSave }) => {
  // Section State
  const [openSection, setOpenSection] = useState<string | null>(
    'career'
  );

  // Local State initialized from Props
  const [prefs, setPrefs] = useState<UserPreferences>(currentPreferences);

  // Aux state for UI logic only
  const [careerSearch, setCareerSearch] = useState('');
  const [skillSearch, setSkillSearch] = useState('');

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const removeSkill = (skillToRemove: string) => {
    setPrefs(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skillToRemove) }));
  };

  const addSkill = (skill: string) => {
    if (!prefs.skills.includes(skill)) {
      setPrefs(prev => ({ ...prev, skills: [...prev.skills, skill] }));
    }
  };

  const careerOptions = [
    'Ingeniería de Sistemas',
    'Diseño Gráfico',
    'Marketing Digital',
    'Administración',
    'Psicología',
    'Derecho',
    'Desarrollo Web',
    'Data Science',
    'Arquitectura',
    'Contabilidad',
  ].filter((c) => c.toLowerCase().includes(careerSearch.toLowerCase()));

  const skillsOptions = [
    'Python', 'Java', 'React', 'Figma', 'Excel Avanzado', 'Inglés', 'Liderazgo', 'Ventas'
  ].filter(s => !prefs.skills.includes(s) && s.toLowerCase().includes(skillSearch.toLowerCase()));


  return (
    <div className="min-h-screen bg-[#F3F4F6] p-4 md:p-8 font-sans text-slate-800 flex justify-center items-start pt-10">
      <div className="w-full max-w-md pb-24 space-y-6">
        <div className="mb-2">
          <h1 className="text-2xl font-bold text-[#1E1B4B]">
            Tus Preferencias
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Estas opciones son utilizadas por nuestra IA para buscar las mejores ofertas en tiempo real.
          </p>
        </div>

        {/* --- NEW SECTIONS (Professional Info) - Moving to Top as priority --- */}
        <div>
          <h2 className="text-lg font-bold text-gray-400 mb-4">
            Información profesional
          </h2>

          {/* Carrera */}
          <AccordionItem
            title="Carrera / Rol"
            subLabel={prefs.career}
            headerAction={<Code className="text-blue-500" size={20} />}
            isOpen={openSection === 'career'}
            onClick={() => toggleSection('career')}
          >
            <div className="relative mb-4">
              <Search
                className="absolute left-3 top-3.5 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Busca tu carrera"
                value={careerSearch}
                onChange={(e) => setCareerSearch(e.target.value)}
                className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#FF9F43]"
              />
              {careerSearch && (
                <button
                  onClick={() => setCareerSearch('')}
                  className="absolute right-3 top-3.5 text-gray-400"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <div className="max-h-48 overflow-y-auto scrollbar-thin">
              {careerOptions.map((opt) => (
                <div
                  key={opt}
                  onClick={() => setPrefs({...prefs, career: opt})}
                  className={`p-3 rounded-lg text-sm cursor-pointer transition-colors ${
                    prefs.career === opt
                      ? 'bg-gray-50 text-[#FF9F43] font-semibold'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {opt}
                </div>
              ))}
            </div>
          </AccordionItem>

          {/* Conocimientos */}
          <AccordionItem
            title="Habilidades / Keywords"
            isOpen={openSection === 'skills'}
            onClick={() => toggleSection('skills')}
          >
            <div className="relative mb-4">
              <Search
                className="absolute left-3 top-3.5 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Agregar habilidad (ej: React)"
                value={skillSearch}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && skillSearch) {
                    addSkill(skillSearch);
                    setSkillSearch('');
                  }
                }}
                onChange={(e) => setSkillSearch(e.target.value)}
                className="w-full pl-10 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#FF9F43]"
              />
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {skillsOptions.slice(0, 5).map(s => (
                <button key={s} onClick={() => addSkill(s)} className="text-xs border border-dashed border-gray-300 px-2 py-1 rounded-full hover:border-[#FF9F43] text-gray-500">
                  + {s}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {prefs.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 text-xs font-medium"
                >
                  {skill}
                  <button
                    onClick={() => removeSkill(skill)}
                    className="ml-2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          </AccordionItem>
        </div>

        <div className="h-px bg-gray-200 my-8" />

        {/* --- ORIGINAL SECTIONS (Collapsible Group 1) --- */}
        <div className="space-y-4">
          <AccordionItem
            title="Sector"
            icon={Briefcase}
            isOpen={openSection === 'sector'}
            onClick={() => toggleSection('sector')}
          >
            <InputGroup
              label="General"
              value={prefs.sectorGeneral}
              onChange={(v) => setPrefs({...prefs, sectorGeneral: v})}
            />
            <InputGroup
              label="Sub sector"
              value={prefs.sectorSub}
              onChange={(v) => setPrefs({...prefs, sectorSub: v})}
            />
          </AccordionItem>

          <AccordionItem
            title="Localización"
            icon={MapPin}
            isOpen={openSection === 'location'}
            onClick={() => toggleSection('location')}
          >
            <InputGroup
              label="Departamento"
              value={prefs.locationDept}
              onChange={(v) => setPrefs({...prefs, locationDept: v})}
            />
            <InputGroup
              label="Distrito"
              value={prefs.locationDist}
              onChange={(v) => setPrefs({...prefs, locationDist: v})}
            />
          </AccordionItem>

          <AccordionItem
            title="Experiencia"
            icon={Award}
            isOpen={openSection === 'experience'}
            onClick={() => toggleSection('experience')}
          >
            <SegmentedControl
              options={['Sin experiencia', '1 año exp.', '2 a + años exp.']}
              selected={prefs.experience}
              onChange={(v) => setPrefs({...prefs, experience: v})}
            />
          </AccordionItem>

          <AccordionItem
            title="Sueldo"
            icon={DollarSign}
            isOpen={openSection === 'salary'}
            onClick={() => toggleSection('salary')}
          >
            <div className="pt-4 pb-2">
              <div className="flex justify-between mb-4">
                <span className="font-bold text-[#1E1B4B]">S/{prefs.salary}</span>
              </div>
              <input
                type="range"
                min="0"
                max="5000"
                step="100"
                value={prefs.salary}
                onChange={(e) => setPrefs({...prefs, salary: parseInt(e.target.value)})}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#FF9F43]"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>S/0</span>
                <span>S/5000+</span>
              </div>
            </div>
          </AccordionItem>

          <AccordionItem
            title="Horario"
            icon={Clock}
            isOpen={openSection === 'schedule'}
            onClick={() => toggleSection('schedule')}
          >
            <SegmentedControl
              options={['Part time', 'Full time', 'Variable']}
              selected={prefs.schedule}
              onChange={(v) => setPrefs({...prefs, schedule: v})}
            />
          </AccordionItem>

          <AccordionItem
            title="Modalidad"
            icon={Laptop}
            isOpen={openSection === 'modality'}
            onClick={() => toggleSection('modality')}
          >
            <SegmentedControl
              options={['Presencial', 'Remoto', 'Mixto']}
              selected={prefs.modality}
              onChange={(v) => setPrefs({...prefs, modality: v})}
            />
          </AccordionItem>
        </div>

        <div className="mt-8 pt-4">
          <Button
            onClick={() => onSave(prefs)}
            fullWidth
            className="py-4 text-lg bg-[#1E1B4B] hover:bg-[#2D2A5E] shadow-xl shadow-[#1E1B4B]/20"
          >
            GUARDAR Y BUSCAR
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PreferencesScreen;
