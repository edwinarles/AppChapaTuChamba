import React, { useState } from 'react';
import { Role } from '../../types';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Mail, Lock, User, Chrome, ArrowLeft, Phone, MessageSquare } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (role: Role) => void;
}

type AuthView = 'login' | 'register' | 'recovery_method' | 'recovery_sms' | 'recovery_email' | 'recovery_sent';

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [view, setView] = useState<AuthView>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Mock Login Handler
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple check for admin demo
    if (email.includes('admin')) {
      onLogin('admin');
    } else {
      onLogin('student');
    }
  };

  const renderContent = () => {
    switch (view) {
      case 'login':
        return (
          <>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-brand-dark mb-2">Hola de nuevo! 👋</h1>
              <p className="text-gray-500">Busca tus prácticas ideales hoy.</p>
            </div>
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <Input 
                type="email" 
                placeholder="correo@universidad.edu" 
                label="Email" 
                icon={<Mail size={18} />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input 
                type="password" 
                placeholder="••••••••" 
                label="Contraseña" 
                icon={<Lock size={18} />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="flex justify-end">
                <button type="button" onClick={() => setView('recovery_method')} className="text-sm text-brand-dark font-medium hover:underline">
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
              <Button fullWidth type="submit">Iniciar Sesión</Button>
            </form>
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">O continúa con</span>
                </div>
              </div>
              <div className="mt-6">
                <Button variant="outline" fullWidth icon={<Chrome size={18} />} onClick={() => onLogin('student')}>
                  Entrar con Google
                </Button>
              </div>
            </div>
            <p className="mt-8 text-center text-sm text-gray-600">
              ¿No tienes cuenta?{' '}
              <button onClick={() => setView('register')} className="font-bold text-brand-dark hover:underline">
                Regístrate
              </button>
            </p>
          </>
        );

      case 'register':
        return (
          <>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-brand-dark mb-2">Crea tu cuenta 🚀</h1>
              <p className="text-gray-500">Únete a la comunidad de futuros profesionales.</p>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); onLogin('student'); }} className="space-y-4">
              <Input type="text" placeholder="Juan Perez" label="Nombre Completo" icon={<User size={18} />} />
              <Input type="email" placeholder="correo@universidad.edu" label="Email" icon={<Mail size={18} />} />
              <Input type="password" placeholder="••••••••" label="Contraseña" icon={<Lock size={18} />} />
              <Button fullWidth type="submit">Crear Cuenta</Button>
            </form>
            <p className="mt-8 text-center text-sm text-gray-600">
              ¿Ya tienes cuenta?{' '}
              <button onClick={() => setView('login')} className="font-bold text-brand-dark hover:underline">
                Inicia Sesión
              </button>
            </p>
          </>
        );

      case 'recovery_method':
        return (
          <>
            <div className="mb-6">
              <button onClick={() => setView('login')} className="text-gray-400 hover:text-brand-dark transition-colors">
                <ArrowLeft size={24} />
              </button>
            </div>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-brand-dark mb-2">Recuperar Contraseña</h1>
              <p className="text-gray-500">Selecciona un método para recuperar tu acceso.</p>
            </div>
            <div className="space-y-4">
              <button onClick={() => setView('recovery_email')} className="w-full p-4 border border-gray-200 rounded-xl flex items-center gap-4 hover:border-brand-dark hover:bg-brand-light/10 transition-all group">
                <div className="bg-brand-light p-3 rounded-full text-brand-dark group-hover:bg-brand-dark group-hover:text-white transition-colors">
                  <Mail size={24} />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-gray-900">Enviar Email</h3>
                  <p className="text-sm text-gray-500">Recibe un enlace a tu correo</p>
                </div>
              </button>
              <button onClick={() => setView('recovery_sms')} className="w-full p-4 border border-gray-200 rounded-xl flex items-center gap-4 hover:border-brand-dark hover:bg-brand-light/10 transition-all group">
                <div className="bg-brand-light p-3 rounded-full text-brand-dark group-hover:bg-brand-dark group-hover:text-white transition-colors">
                  <MessageSquare size={24} />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-gray-900">Enviar SMS</h3>
                  <p className="text-sm text-gray-500">Recibe un código a tu celular</p>
                </div>
              </button>
            </div>
          </>
        );

      case 'recovery_email':
        return (
          <>
            <div className="mb-6">
              <button onClick={() => setView('recovery_method')} className="text-gray-400 hover:text-brand-dark transition-colors">
                <ArrowLeft size={24} />
              </button>
            </div>
            <h1 className="text-2xl font-bold text-brand-dark mb-2">Resetear por Email</h1>
            <p className="text-gray-500 mb-6">Ingresa el correo asociado a tu cuenta.</p>
            <form onSubmit={(e) => { e.preventDefault(); setView('recovery_sent'); }}>
              <Input type="email" placeholder="ejemplo@correo.com" label="Email" icon={<Mail size={18} />} required />
              <div className="mt-4">
                <Button fullWidth type="submit">Enviar Enlace</Button>
              </div>
            </form>
          </>
        );

      case 'recovery_sms':
          return (
            <>
              <div className="mb-6">
                <button onClick={() => setView('recovery_method')} className="text-gray-400 hover:text-brand-dark transition-colors">
                  <ArrowLeft size={24} />
                </button>
              </div>
              <h1 className="text-2xl font-bold text-brand-dark mb-2">Resetear por SMS</h1>
              <p className="text-gray-500 mb-6">Ingresa tu número de celular.</p>
              <form onSubmit={(e) => { e.preventDefault(); setView('recovery_sent'); }}>
                <Input type="tel" placeholder="999 000 111" label="Celular" icon={<Phone size={18} />} required />
                <div className="mt-4">
                  <Button fullWidth type="submit">Enviar Código</Button>
                </div>
              </form>
            </>
          );

      case 'recovery_sent':
        return (
          <div className="text-center py-10">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
              <Mail size={40} />
            </div>
            <h2 className="text-2xl font-bold text-brand-dark mb-2">¡Revisa tu bandeja!</h2>
            <p className="text-gray-500 mb-8">Hemos enviado las instrucciones para recuperar tu contraseña.</p>
            <Button variant="secondary" onClick={() => setView('login')}>Volver al Login</Button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        {renderContent()}
      </div>
    </div>
  );
};

export default LoginScreen;