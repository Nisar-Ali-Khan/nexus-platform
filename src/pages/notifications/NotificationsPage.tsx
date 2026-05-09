import React, { useState } from 'react';
import { Bell, MessageCircle, UserPlus, DollarSign, Heart, Check } from 'lucide-react';
import { Card, CardBody } from '../../components/ui/Card';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { getNotificationsForUser, markAsRead, markAllAsRead } from '../../data/notifications';
import { findUserById } from '../../data/users';
import { formatDistanceToNow } from 'date-fns';

export const NotificationsPage: React.FC = () => {
  const { user } = useAuth();
  const [notifs, setNotifs] = useState(() => user ? getNotificationsForUser(user.id) : []);

  const handleMarkRead = (id: string) => {
    markAsRead(id);
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleMarkAllRead = () => {
    if (!user) return;
    markAllAsRead(user.id);
    setNotifs(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'message': return <MessageCircle size={16} className="text-primary-600" />;
      case 'connection': return <UserPlus size={16} className="text-secondary-600" />;
      case 'investment': return <DollarSign size={16} className="text-accent-600" />;
      case 'collaboration': return <DollarSign size={16} className="text-success-700" />;
      case 'like': return <Heart size={16} className="text-red-500" />;
      default: return <Bell size={16} className="text-gray-600" />;
    }
  };

  const unreadCount = notifs.filter(n => !n.isRead).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={handleMarkAllRead} leftIcon={<Check size={16} />}>
            Mark all as read
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {notifs.length === 0 && (
          <div className="text-center py-16">
            <Bell size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No notifications yet</p>
          </div>
        )}
        {notifs.map(notif => {
          const fromUser = findUserById(notif.fromUserId);
          return (
            <Card
              key={notif.id}
              className={`transition-all duration-200 cursor-pointer hover:shadow-sm ${!notif.isRead ? 'bg-primary-50 border-primary-100' : ''}`}
              onClick={() => !notif.isRead && handleMarkRead(notif.id)}
            >
              <CardBody className="flex items-start gap-4 p-4">
                <div className="relative flex-shrink-0">
                  <Avatar
                    src={fromUser?.avatarUrl || ''}
                    alt={fromUser?.name || 'User'}
                    size="md"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                    {getIcon(notif.type)}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">{fromUser?.name}</span>{' '}
                        <span className="text-gray-600">{notif.content.replace(fromUser?.name || '', '').trim()}</span>
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                    {!notif.isRead && <Badge variant="primary" size="sm" rounded>New</Badge>}
                  </div>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
