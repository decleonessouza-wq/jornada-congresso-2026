import { Link, useLocation } from 'react-router-dom';
import { Map, Trophy, MessageCircle, Heart, Medal } from 'lucide-react';
import { playNavClick } from '../lib/sounds';

const items = [
  { path: '/jornada', icon: Map, label: 'Jornada', color: 'text-violet-600', bg: 'bg-violet-100' },
  { path: '/progresso', icon: Trophy, label: 'Progresso', color: 'text-amber-500', bg: 'bg-amber-100' },
  { path: '/ranking', icon: Medal, label: 'Caminhada', color: 'text-orange-500', bg: 'bg-orange-100' },
  { path: '/mural', icon: MessageCircle, label: 'Mural', color: 'text-blue-500', bg: 'bg-blue-100' },
  { path: '/oracao', icon: Heart, label: 'Oração', color: 'text-pink-500', bg: 'bg-pink-100' },
];

export default function BottomNav() {
  const { pathname } = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-100 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      <div className="max-w-md mx-auto flex justify-around py-2 px-1">
        {items.map(item => {
          const active = pathname === item.path || (pathname.startsWith('/fase') && item.path === '/jornada');
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={playNavClick}
              className={`flex flex-col items-center py-1.5 px-2 rounded-2xl transition-all duration-200 min-w-[52px] ${
                active ? `${item.bg} ${item.color}` : 'text-gray-400'
              }`}
            >
              <item.icon className={`h-5 w-5 transition-transform ${active ? 'scale-110' : ''}`} />
              <span className="text-[9px] mt-0.5 font-bold">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}