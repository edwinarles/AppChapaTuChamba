import React, { useState } from 'react';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { User, Mail, Phone, Calendar, Edit2, Save, Camera, Trash2, AlertTriangle } from 'lucide-react';

interface ProfileScreenProps {
  onLogout: () => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ onLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  // CU:06 Actualizar info personal
  const [userData, setUserData] = useState({
    name: 'Juan Perez',
    email: 'juan.perez@student.edu',
    phone: '987654321',
    birthDate: '2000-05-15',
    gender: 'Masculino'
  });

  const handleSave = () => {
    setIsEditing(false);
    alert("Perfil actualizado correctamente (CU:05, CU:06)");
  };
  
  // CU:09 Eliminar Perfil
  const handleDeleteAccount = () => {
    if(confirm("¿ESTÁS SEGURO? Esta acción eliminará permanentemente tu cuenta y preferencias de la base de datos. (CU:09)")) {
        onLogout();
        alert("Tu cuenta ha sido eliminada. (CU:09)");
    }
  }

  return (
    <div className="p-4 md:p-8 pb-24 max-w-xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-brand-dark">Mi Perfil</h1>
        <button 
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className="p-2 rounded-full bg-brand-light/50 text-brand-dark hover:bg-brand-light transition-colors"
          title="Editar Perfil (CU:05)"
        >
          {isEditing ? <Save size={20} /> : <Edit2 size={20} />}
        </button>
      </div>

      <div className="flex flex-col items-center mb-8">
        <div className="relative">
          <img 
            src="https://picsum.photos/id/64/150/150" 
            alt="Profile" 
            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
          />
          {isEditing && (
            <button className="absolute bottom-0 right-0 bg-brand-dark text-white p-2 rounded-full shadow-md hover:scale-105 transition-transform">
              <Camera size={18} />
            </button>
          )}
        </div>
        {!isEditing && (
          <div className="text-center mt-4">
            <h2 className="text-xl font-bold text-gray-900">{userData.name}</h2>
            <p className="text-gray-500">Estudiante de Ingeniería de Sistemas</p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
        {isEditing ? (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="text-xs text-brand-accent font-bold uppercase mb-2">Editando Información Personal (CU:06)</div>
            <Input 
              label="Nombre Completo" 
              value={userData.name} 
              onChange={(e) => setUserData({...userData, name: e.target.value})}
            />
            <Input 
              label="Email" 
              type="email"
              value={userData.email} 
              onChange={(e) => setUserData({...userData, email: e.target.value})}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Teléfono</label>
              <div className="flex">
                <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-100 border border-r-0 border-gray-200 rounded-l-xl">
                  +51
                </span>
                <input 
                  type="tel" 
                  className="rounded-none rounded-r-xl bg-white border border-gray-200 text-gray-900 focus:ring-brand-dark focus:border-brand-dark block flex-1 min-w-0 w-full text-sm p-2.5" 
                  value={userData.phone}
                  onChange={(e) => setUserData({...userData, phone: e.target.value})}
                />
              </div>
            </div>
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">Género</label>
               <div className="flex gap-2">
                  {['Masculino', 'Femenino', 'Otro'].map(g => (
                      <button 
                        key={g}
                        onClick={() => setUserData({...userData, gender: g})}
                        className={`px-4 py-2 rounded-full text-sm border transition-colors ${userData.gender === g ? 'bg-brand-dark text-white border-brand-dark' : 'bg-white text-gray-600 border-gray-200'}`}
                      >
                        {g}
                      </button>
                  ))}
               </div>
            </div>
            <Input 
              label="Fecha de Nacimiento" 
              type="date"
              value={userData.birthDate} 
              onChange={(e) => setUserData({...userData, birthDate: e.target.value})}
            />
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="bg-brand-bg p-2 rounded-lg text-brand-dark"><Mail size={20} /></div>
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase">Email</p>
                <p className="text-gray-900 font-medium">{userData.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-brand-bg p-2 rounded-lg text-brand-dark"><Phone size={20} /></div>
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase">Teléfono</p>
                <p className="text-gray-900 font-medium">+51 {userData.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-brand-bg p-2 rounded-lg text-brand-dark"><User size={20} /></div>
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase">Género</p>
                <p className="text-gray-900 font-medium">{userData.gender}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-brand-bg p-2 rounded-lg text-brand-dark"><Calendar size={20} /></div>
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase">Cumpleaños</p>
                <p className="text-gray-900 font-medium">{userData.birthDate}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 space-y-4">
        <Button variant="outline" fullWidth onClick={onLogout}>Cerrar Sesión (CU:02)</Button>
        
        <div className="pt-6 border-t border-gray-200">
            <h3 className="text-red-600 font-bold mb-2 flex items-center gap-2"><AlertTriangle size={18}/> Zona de Peligro</h3>
            <button 
                onClick={handleDeleteAccount}
                className="w-full p-3 border border-red-200 bg-red-50 text-red-600 rounded-xl flex items-center justify-center gap-2 hover:bg-red-100 transition-colors font-medium"
            >
                <Trash2 size={18}/> Eliminar Cuenta (CU:09)
            </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;