import React, { useState, useEffect } from 'react';
import {
  Home,
  Bell,
  Bookmark,
  User,
  Monitor,
  LogOut,
  Settings,
} from 'lucide-react';
import { Role, UserPreferences, Job } from './types';
import { searchJobsWithAI } from './services/jobService'; // Import service
import { MOCK_JOBS } from './constants';

// Screens
import LoginScreen from './screens/auth/LoginScreen';
import StudentHome from './screens/student/StudentHome';
import PreferencesScreen from './screens/student/PreferencesScreen';
import ProfileScreen from './screens/student/ProfileScreen';
import NotificationsScreen from './screens/student/NotificationsScreen';
import AdminDashboard from './screens/admin/AdminDashboard';
import GuardadoScreen from './screens/student/GuardadoScreen';

type Screen =
  | 'home'
  | 'search'
  | 'notifications'
  | 'saved'
  | 'profile'
  | 'admin_dash';

const App: React.FC = () => {
  const [userRole, setUserRole] = useState<Role>(null);
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');

  // Global State for Preferences
  const [preferences, setPreferences] = useState<UserPreferences>({
    sectorGeneral: 'Tecnología',
    sectorSub: 'Desarrollo Web',
    locationDept: 'Lima',
    locationDist: 'Lima',
    experience: 'Sin experiencia',
    salary: 1200,
    schedule: 'Full time',
    modality: 'Remoto',
    career: 'Ingeniería de Software',
    skills: ['React', 'TypeScript'],
  });

  // Global State for Jobs (Persistence)
  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobsLoading, setJobsLoading] = useState(false);

  // Logic to fetch jobs
  const performSearch = async (prefs: UserPreferences) => {
    setJobsLoading(true);
    try {
      const aiJobs = await searchJobsWithAI(prefs);
      if (aiJobs.length === 0) {
         setJobs(MOCK_JOBS); // Fallback
      } else {
         setJobs(aiJobs);
      }
    } catch (error) {
      console.error("Error fetching jobs", error);
      setJobs(MOCK_JOBS);
    } finally {
      setJobsLoading(false);
    }
  };

  // Simulate checking auth on mount
  useEffect(() => {
    // For demo, we start unauthenticated
  }, []);

  const handleLogin = (role: Role) => {
    setUserRole(role);
    if (role === 'admin') {
      setCurrentScreen('admin_dash');
    } else {
      setCurrentScreen('home');
      // Only fetch if empty to avoid reload on login if state persisted (though state resets on refresh)
      if (jobs.length === 0) {
        performSearch(preferences);
      }
    }
  };

  const handleLogout = () => {
    setUserRole(null);
    setCurrentScreen('home');
    setJobs([]); // Clear jobs on logout
  };

  const handleSavePreferences = (newPrefs: UserPreferences) => {
    setPreferences(newPrefs);
    setCurrentScreen('home');
    // Force refresh when preferences change
    performSearch(newPrefs);
  };

  // Mobile Bottom Nav Item
  const NavItem = ({
    screen,
    icon: Icon,
    label,
  }: {
    screen: Screen;
    icon: any;
    label: string;
  }) => (
    <button
      onClick={() => setCurrentScreen(screen)}
      className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
        currentScreen === screen
          ? 'text-brand-dark'
          : 'text-gray-400 hover:text-gray-600'
      }`}
    >
      <Icon size={24} strokeWidth={currentScreen === screen ? 2.5 : 2} />
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );

  // Desktop Sidebar Item
  const SidebarItem = ({
    screen,
    icon: Icon,
    label,
  }: {
    screen: Screen;
    icon: any;
    label: string;
  }) => (
    <button
      onClick={() => setCurrentScreen(screen)}
      className={`flex items-center w-full px-4 py-3 rounded-xl mb-2 transition-colors ${
        currentScreen === screen
          ? 'bg-brand-light text-brand-dark font-semibold'
          : 'text-gray-500 hover:bg-gray-100'
      }`}
    >
      <Icon size={20} className="mr-3" />
      {label}
    </button>
  );

  // Render Content based on Auth and Screen
  const renderContent = () => {
    if (!userRole) {
      return <LoginScreen onLogin={handleLogin} />;
    }

    if (userRole === 'admin') {
      return <AdminDashboard />;
    }

    // Student Views
    switch (currentScreen) {
      case 'home':
        return (
          <StudentHome 
            preferences={preferences} 
            jobs={jobs} 
            loading={jobsLoading} 
            onRefresh={() => performSearch(preferences)} 
          />
        );
      case 'search':
        return (
          <PreferencesScreen
            currentPreferences={preferences}
            onSave={handleSavePreferences}
          />
        );
      case 'notifications':
        return <NotificationsScreen />;
      case 'profile':
        return <ProfileScreen onLogout={handleLogout} />;
      case 'saved':
        return <GuardadoScreen />;
      default:
        return (
            <StudentHome 
              preferences={preferences} 
              jobs={jobs} 
              loading={jobsLoading} 
              onRefresh={() => performSearch(preferences)} 
            />
          );
    }
  };

  if (!userRole) return <LoginScreen onLogin={handleLogin} />;

  return (
    <div className="flex h-screen w-screen bg-brand-bg overflow-hidden">
      {/* Desktop Sidebar (Hidden on Mobile) */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 h-full p-6">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 bg-brand-dark rounded-lg flex items-center justify-center text-white font-bold text-lg">
            C
          </div>
          <h1 className="text-xl font-bold text-brand-dark tracking-tight">
            ChapaTuChamba
          </h1>
        </div>

        <nav className="flex-1">
          {userRole === 'student' ? (
            <>
              <SidebarItem screen="home" icon={Home} label="Inicio" />
              <SidebarItem
                screen="search"
                icon={Settings}
                label="Preferencias"
              />
              <SidebarItem
                screen="notifications"
                icon={Bell}
                label="Notificaciones"
              />
              <SidebarItem screen="saved" icon={Bookmark} label="Guardados" />
              <SidebarItem screen="profile" icon={User} label="Mi Perfil" />
            </>
          ) : (
            <div className="bg-brand-light/20 p-4 rounded-xl">
              <span className="text-brand-dark font-bold flex items-center gap-2">
                <Monitor size={16} /> Panel Admin
              </span>
            </div>
          )}
        </nav>

        <div className="mt-auto pt-6 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center text-gray-500 hover:text-red-500 transition-colors"
          >
            <LogOut size={18} className="mr-2" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-y-auto relative no-scrollbar w-full">
        {renderContent()}

        {/* Mobile Bottom Spacing for Nav */}
        <div className="h-20 md:hidden"></div>
      </main>

      {/* Mobile Bottom Navigation (Hidden on Desktop) */}
      {userRole === 'student' && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-16 flex justify-around items-center z-50 px-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <NavItem screen="search" icon={Settings} label="Preferencias" />
          <NavItem screen="notifications" icon={Bell} label="Notificaciones" />
          <NavItem screen="home" icon={Home} label="Inicio" />
          <NavItem screen="saved" icon={Bookmark} label="Guardados" />
          <NavItem screen="profile" icon={User} label="Perfil" />
        </nav>
      )}
    </div>
  );
};

export default App;