import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Home, Building2, CircleDollarSign, Users, MessageCircle,
  Bell, FileText, Settings, HelpCircle, Lightbulb, PlusCircle
} from 'lucide-react';
import { getUnreadCount } from '../../data/notifications';

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  text: string;
  badge?: number;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon, text, badge }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center py-2.5 px-4 rounded-md transition-colors duration-200 ${
          isActive
            ? 'bg-primary-50 text-primary-700'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        }`
      }
    >
      <span className="mr-3">{icon}</span>
      <span className="text-sm font-medium flex-1">{text}</span>
      {badge !== undefined && badge > 0 && (
        <span className="bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {badge > 9 ? '9+' : badge}
        </span>
      )}
    </NavLink>
  );
};

export const Sidebar: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  const unreadNotifs = getUnreadCount(user.id);

  const entrepreneurItems = [
    { to: '/dashboard/entrepreneur', icon: <Home size={20} />, text: 'Dashboard' },
    { to: '/profile/entrepreneur/' + user.id, icon: <Building2 size={20} />, text: 'My Startup' },
    { to: '/ideas', icon: <Lightbulb size={20} />, text: 'Ideas Feed' },
    { to: '/ideas/post', icon: <PlusCircle size={20} />, text: 'Post Idea' },
    { to: '/investors', icon: <CircleDollarSign size={20} />, text: 'Find Investors' },
    { to: '/messages', icon: <MessageCircle size={20} />, text: 'Messages' },
    { to: '/notifications', icon: <Bell size={20} />, text: 'Notifications', badge: unreadNotifs },
    { to: '/documents', icon: <FileText size={20} />, text: 'Documents' },
  ];

  const investorItems = [
    { to: '/dashboard/investor', icon: <Home size={20} />, text: 'Dashboard' },
    { to: '/profile/investor/' + user.id, icon: <CircleDollarSign size={20} />, text: 'My Portfolio' },
    { to: '/ideas', icon: <Lightbulb size={20} />, text: 'Explore Ideas' },
    { to: '/entrepreneurs', icon: <Users size={20} />, text: 'Find Startups' },
    { to: '/messages', icon: <MessageCircle size={20} />, text: 'Messages' },
    { to: '/notifications', icon: <Bell size={20} />, text: 'Notifications', badge: unreadNotifs },
    { to: '/deals', icon: <FileText size={20} />, text: 'Deals' },
  ];

  const sidebarItems = user.role === 'entrepreneur' ? entrepreneurItems : investorItems;

  const commonItems = [
    { to: '/settings', icon: <Settings size={20} />, text: 'Settings' },
    { to: '/help', icon: <HelpCircle size={20} />, text: 'Help & Support' },
  ];

  return (
    <div className="w-64 bg-white h-full border-r border-gray-200 hidden md:block">
      <div className="h-full flex flex-col">
        <div className="flex-1 py-4 overflow-y-auto">
          <div className="px-3 space-y-1">
            {sidebarItems.map((item, index) => (
              <SidebarItem key={index} to={item.to} icon={item.icon} text={item.text} badge={(item as any).badge} />
            ))}
          </div>

          <div className="mt-8 px-3">
            <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Account
            </h3>
            <div className="mt-2 space-y-1">
              {commonItems.map((item, index) => (
                <SidebarItem key={index} to={item.to} icon={item.icon} text={item.text} />
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200">
          <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-lg p-3 border border-primary-100">
            <p className="text-xs text-primary-700 font-medium">
              {user.role === 'entrepreneur' ? '💡 Pro Tip' : '🎯 Tip'}
            </p>
            <p className="text-xs text-gray-600 mt-1">
              {user.role === 'entrepreneur'
                ? 'Complete your profile to get 3x more investor views!'
                : 'Set up deal alerts to never miss promising startups.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
