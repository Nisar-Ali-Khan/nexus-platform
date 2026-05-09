import { Notification } from '../types';

export const notifications: Notification[] = [
  {
    id: 'notif1',
    userId: 'e1',
    type: 'collaboration',
    fromUserId: 'i1',
    content: 'Michael Rodriguez sent you a collaboration request for TechWave AI',
    relatedId: 'req1',
    isRead: false,
    createdAt: '2024-02-15T10:30:00Z'
  },
  {
    id: 'notif2',
    userId: 'e1',
    type: 'like',
    fromUserId: 'i2',
    content: 'Jennifer Lee liked your startup idea "AI-Powered Financial Analytics"',
    relatedId: 'idea1',
    isRead: false,
    createdAt: '2024-02-14T15:20:00Z'
  },
  {
    id: 'notif3',
    userId: 'e1',
    type: 'message',
    fromUserId: 'i3',
    content: 'Robert Torres sent you a message',
    isRead: true,
    createdAt: '2024-02-13T09:15:00Z'
  },
  {
    id: 'notif4',
    userId: 'i1',
    type: 'connection',
    fromUserId: 'e1',
    content: 'Sarah Johnson accepted your collaboration request',
    relatedId: 'req2',
    isRead: false,
    createdAt: '2024-02-15T11:00:00Z'
  },
  {
    id: 'notif5',
    userId: 'i1',
    type: 'like',
    fromUserId: 'e3',
    content: 'Maya Patel liked your investor profile',
    isRead: true,
    createdAt: '2024-02-12T14:30:00Z'
  }
];

export const getNotificationsForUser = (userId: string): Notification[] => {
  return notifications
    .filter(n => n.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const getUnreadCount = (userId: string): number => {
  return notifications.filter(n => n.userId === userId && !n.isRead).length;
};

export const markAsRead = (notifId: string): void => {
  const notif = notifications.find(n => n.id === notifId);
  if (notif) notif.isRead = true;
};

export const markAllAsRead = (userId: string): void => {
  notifications.forEach(n => {
    if (n.userId === userId) n.isRead = true;
  });
};

export const addNotification = (notif: Omit<Notification, 'id' | 'createdAt'>): Notification => {
  const newNotif: Notification = {
    ...notif,
    id: `notif${notifications.length + 1}_${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  notifications.push(newNotif);
  return newNotif;
};
