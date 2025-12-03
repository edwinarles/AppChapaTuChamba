import React, { useState } from 'react';
import { MOCK_USERS, MOCK_SOURCES, MOCK_LOGS } from '../../constants';
import { Trash2, Activity, Database, Users, RefreshCw, CheckCircle, XCircle, Play, Plus, ShieldAlert } from 'lucide-react';
import { Toggle } from '../../components/Toggle';
import { Button } from '../../components/Button';

type AdminTab = 'users' | 'sources' | 'monitor' | 'simulation';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('sources');
  const [sources, setSources] = useState(MOCK_SOURCES);
  const [users, setUsers] = useState(MOCK_USERS.filter(u => u.role === 'student'));
  const [systemLogs, setSystemLogs] = useState(MOCK_LOGS);
  const [processing, setProcessing] = useState<string | null>(null);

  // CU:20 Gestionar fuentes, CU:21 Agregar, CU:22 Eliminar
  const handleToggleSource = (id: string) => {
    setSources(sources.map(s => s.id === id ? { ...s, active: !s.active } : s));
  };

  const handleAddSource = () => {
    const name = prompt("Nombre de la nueva fuente (ej: LinkedIn API):");
    if (name) {
      setSources([...sources, { 
        id: `s${Date.now()}`, 
        name, 
        active: true, 
        lastRun: 'Pendiente', 
        icon: name.charAt(0).toUpperCase() 
      }]);
      addLog(`Fuente añadida: ${name} (CU:21)`);
    }
  };

  const handleDeleteSource = (id: string) => {
    if(window.confirm("¿Eliminar esta fuente de scraping? (CU:22)")) {
      setSources(sources.filter(s => s.id !== id));
      addLog(`Fuente eliminada ID: ${id} (CU:22)`);
    }
  };

  // CU:25 Gestionar usuarios
  const deleteUser = (id: string) => {
    if(window.confirm('¿Estás seguro de eliminar este usuario? (CU:25)')) {
        setUsers(users.filter(u => u.id !== id));
        addLog(`Usuario eliminado ID: ${id}`);
    }
  };

  const addLog = (message: string, status: 'active' | 'error' = 'active') => {
    const newLog = {
      id: `l${Date.now()}`,
      status,
      message,
      timestamp: new Date().toLocaleTimeString()
    };
    setSystemLogs(prev => [newLog, ...prev]);
  };

  // Simulation of Timer/Backend Actors
  const simulateProcess = (processName: string, cu: string, duration: number = 2000) => {
    setProcessing(processName);
    addLog(`Iniciando: ${processName} (${cu})...`);
    
    setTimeout(() => {
      setProcessing(null);
      addLog(`Completado: ${processName} (${cu})`, 'active');
    }, duration);
  };

  return (
    <div className="p-4 md:p-8 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-brand-dark">Dashboard Admin</h1>
          <p className="text-gray-500">Panel de Control y Monitoreo de Procesos</p>
        </div>
        <div className="flex flex-wrap gap-1 bg-white p-1 rounded-xl border border-gray-200 mt-4 md:mt-0 shadow-sm">
          <button 
            onClick={() => setActiveTab('sources')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'sources' ? 'bg-brand-dark text-white shadow' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            Fuentes (CU:20)
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'users' ? 'bg-brand-dark text-white shadow' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            Usuarios (CU:25)
          </button>
          <button 
            onClick={() => setActiveTab('monitor')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'monitor' ? 'bg-brand-dark text-white shadow' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            Monitor (CU:23)
          </button>
          <button 
            onClick={() => setActiveTab('simulation')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'simulation' ? 'bg-brand-accent text-brand-dark font-bold shadow' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            Simular Backend
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-xl text-blue-600"><Database size={24}/></div>
          <div>
             <p className="text-sm text-gray-500">Ofertas Procesadas</p>
             <h3 className="text-2xl font-bold text-gray-900">1,240</h3>
             <span className="text-xs text-gray-400">CU:11, CU:12</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="bg-purple-100 p-3 rounded-xl text-purple-600"><Users size={24}/></div>
          <div>
             <p className="text-sm text-gray-500">Reportes Enviados</p>
             <h3 className="text-2xl font-bold text-gray-900">850</h3>
             <span className="text-xs text-gray-400">CU:18, CU:19</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-xl text-green-600"><Activity size={24}/></div>
          <div>
             <p className="text-sm text-gray-500">Estado Sistema</p>
             <h3 className="text-2xl font-bold text-green-600">Activo</h3>
             <span className="text-xs text-gray-400">CU:24</span>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 min-h-[400px]">
        
        {/* CU:20 - CU:22 Gestionar Fuentes */}
        {activeTab === 'sources' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-brand-dark flex items-center gap-2"><Database size={20}/> Integraciones Scrapers (CU:20)</h2>
              <Button onClick={handleAddSource} icon={<Plus size={18} />} className="py-2 px-4">Agregar Fuente (CU:21)</Button>
            </div>
            <div className="space-y-4">
              {sources.map((source) => (
                <div key={source.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:shadow-sm transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xl font-bold text-gray-500">
                      {source.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{source.name}</h3>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <RefreshCw size={12}/> Última ejecucion: {source.lastRun}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-medium ${source.active ? 'text-green-600' : 'text-gray-400'}`}>
                      {source.active ? 'Activo' : 'Inactivo'}
                    </span>
                    <Toggle checked={source.active} onChange={() => handleToggleSource(source.id)} />
                    <button onClick={() => handleDeleteSource(source.id)} className="text-gray-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CU:25 Gestionar Usuarios */}
        {activeTab === 'users' && (
          <div>
            <h2 className="text-xl font-bold text-brand-dark mb-6 flex items-center gap-2"><Users size={20}/> Estudiantes Registrados (CU:25)</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100 text-xs uppercase text-gray-400">
                    <th className="pb-3 pl-2">Usuario</th>
                    <th className="pb-3">Email</th>
                    <th className="pb-3 text-right pr-2">Acción</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {users.map((user) => (
                    <tr key={user.id} className="group hover:bg-gray-50">
                      <td className="py-3 pl-2 flex items-center gap-3">
                        <img src={user.avatar} alt="" className="w-8 h-8 rounded-full" />
                        <span className="font-medium text-gray-900">{user.name}</span>
                      </td>
                      <td className="py-3 text-gray-500">{user.email}</td>
                      <td className="py-3 text-right pr-2">
                        <button onClick={() => deleteUser(user.id)} className="text-gray-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CU:23 & CU:24 Logs y Monitoreo */}
        {activeTab === 'monitor' && (
          <div>
            <h2 className="text-xl font-bold text-brand-dark mb-6 flex items-center gap-2"><Activity size={20}/> Logs del Sistema (CU:23)</h2>
            <div className="space-y-0">
              {systemLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-4 p-4 border-b border-gray-50 last:border-0 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="mt-1">
                    {log.status === 'active' ? (
                      <CheckCircle size={20} className="text-green-500" />
                    ) : (
                      <XCircle size={20} className="text-red-500" />
                    )}
                  </div>
                  <div>
                    <p className="text-gray-800 font-medium">{log.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{log.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CU:10 a CU:19 Simulador de Backend */}
        {activeTab === 'simulation' && (
          <div>
             <h2 className="text-xl font-bold text-brand-dark mb-2 flex items-center gap-2"><ShieldAlert size={20}/> Simulación de Procesos (Backend)</h2>
             <p className="text-gray-500 mb-6">Ejecuta manualmente las tareas programadas del sistema para evidenciar los Casos de Uso 10 al 19.</p>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Módulo Adquisición */}
                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Database size={18} className="text-blue-600"/> Adquisición de Ofertas
                    </h3>
                    <div className="space-y-3">
                        <Button 
                            variant="secondary" fullWidth 
                            disabled={!!processing}
                            onClick={() => simulateProcess('Ejecutando Scrapers Externos', 'CU:10')}
                            icon={processing === 'Ejecutando Scrapers Externos' ? <Activity className="animate-spin"/> : <Play size={16}/>}
                        >
                            Buscar Ofertas (Scraping)
                        </Button>
                        <Button 
                            variant="outline" fullWidth 
                            disabled={!!processing}
                            onClick={() => simulateProcess('Procesando y Categorizando', 'CU:11, CU:12, CU:13')}
                            icon={<RefreshCw size={16}/>}
                        >
                            Procesar y Guardar en DB
                        </Button>
                         <Button 
                            variant="ghost" fullWidth className="text-red-500 hover:bg-red-50"
                            disabled={!!processing}
                            onClick={() => simulateProcess('Purgando Ofertas Caducadas', 'CU:14')}
                            icon={<Trash2 size={16}/>}
                        >
                            Limpiar Ofertas Caducadas
                        </Button>
                    </div>
                </div>

                {/* Módulo Recomendación */}
                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Users size={18} className="text-purple-600"/> Recomendación y Envíos
                    </h3>
                    <div className="space-y-3">
                        <Button 
                            variant="secondary" fullWidth 
                            disabled={!!processing}
                            onClick={() => simulateProcess('Filtrando por Feedback de Usuario', 'CU:16, CU:17')}
                            icon={<Activity size={16}/>}
                        >
                            Generar Match (Algoritmo)
                        </Button>
                        <Button 
                            variant="outline" fullWidth 
                            disabled={!!processing}
                            onClick={() => simulateProcess('Generando Informes Personalizados', 'CU:18')}
                            icon={<Database size={16}/>}
                        >
                            Crear Boletines PDF
                        </Button>
                         <Button 
                            variant="primary" fullWidth 
                            disabled={!!processing}
                            onClick={() => simulateProcess('Enviando Alertas (WhatsApp/Email)', 'CU:19')}
                            icon={<Play size={16}/>}
                        >
                            Enviar Notificaciones
                        </Button>
                    </div>
                </div>
             </div>
             
             <div className="mt-6 bg-black text-green-400 p-4 rounded-xl font-mono text-xs h-32 overflow-y-auto">
                <p className="text-gray-500 border-b border-gray-800 pb-1 mb-2">// Salida del Monitor de Procesos (CU:24)</p>
                {systemLogs.slice(0, 5).map(log => (
                    <p key={`term-${log.id}`} className="mb-1">
                        <span className="text-gray-500">[{log.timestamp}]</span> {log.status === 'active' ? 'INFO:' : 'ERR:'} {log.message}
                    </p>
                ))}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;