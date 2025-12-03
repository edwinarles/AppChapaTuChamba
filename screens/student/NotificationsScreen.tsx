import React, { useState } from 'react';
import { MOCK_NOTIFICATIONS } from '../../constants';
import { Trash2, BellOff } from 'lucide-react';

const NotificationsScreen: React.FC = () => {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-brand-dark">Notificaciones</h1>
        {notifications.length > 0 && (
          <button onClick={() => setNotifications([])} className="text-sm text-red-500 font-medium hover:underline">
            Borrar todo
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="bg-gray-100 p-6 rounded-full mb-4">
            <BellOff size={48} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-700">Estás al día</h3>
          <p className="text-gray-500 max-w-xs">No tienes notificaciones nuevas por el momento. ¡Revisa más tarde!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div key={notif.id} className={`p-4 rounded-2xl border transition-all flex gap-4 ${notif.read ? 'bg-white border-gray-100' : 'bg-brand-light/10 border-brand-light'}`}>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className={`text-sm font-bold ${notif.read ? 'text-gray-700' : 'text-brand-dark'}`}>{notif.title}</h4>
                  <span className="text-xs text-gray-400">{notif.time}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
              </div>
              <button 
                onClick={() => deleteNotification(notif.id)}
                className="self-center p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsScreen;