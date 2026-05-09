import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Bell, TrendingUp, AlertCircle, PlusCircle, Eye, Heart, Lightbulb, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { CollaborationRequestCard } from '../../components/collaboration/CollaborationRequestCard';
import { useAuth } from '../../context/AuthContext';
import { CollaborationRequest } from '../../types';
import { getRequestsForEntrepreneur } from '../../data/collaborationRequests';
import { getIdeasByEntrepreneur } from '../../data/startupIdeas';
import { investors, findUserById } from '../../data/users';
import { getUnreadCount } from '../../data/notifications';

const MONTH_LABELS = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'];
const VIEW_DATA = [12, 28, 19, 45, 35, 62];
const MAX_VIEWS = Math.max(...VIEW_DATA);

export const EntrepreneurDashboard: React.FC = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<CollaborationRequest[]>([]);

  useEffect(() => {
    if (user) setRequests(getRequestsForEntrepreneur(user.id));
  }, [user]);

  if (!user) return null;

  const myIdeas = getIdeasByEntrepreneur(user.id);
  const totalLikes = myIdeas.reduce((s, i) => s + i.likes, 0);
  const totalViews = myIdeas.reduce((s, i) => s + i.views, 0);
  const pending = requests.filter(r => r.status === 'pending');
  const accepted = requests.filter(r => r.status === 'accepted');
  const unreadNotifs = getUnreadCount(user.id);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.name.split(' ')[0]} 👋</h1>
          <p className="text-gray-500 mt-1">Here's your startup activity overview</p>
        </div>
        <Link to="/ideas/post">
          <Button leftIcon={<PlusCircle size={18} />}>Post New Idea</Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Pending Requests', value: pending.length, icon: <Bell size={20} />, color: 'bg-blue-50', iconColor: 'text-blue-600', iconBg: 'bg-blue-100' },
          { label: 'Connections', value: accepted.length, icon: <Users size={20} />, color: 'bg-teal-50', iconColor: 'text-teal-600', iconBg: 'bg-teal-100' },
          { label: 'Total Views', value: totalViews, icon: <Eye size={20} />, color: 'bg-purple-50', iconColor: 'text-purple-600', iconBg: 'bg-purple-100' },
          { label: 'Idea Likes', value: totalLikes, icon: <Heart size={20} />, color: 'bg-red-50', iconColor: 'text-red-500', iconBg: 'bg-red-100' },
        ].map(stat => (
          <Card key={stat.label} className={`${stat.color} border-0`}>
            <CardBody>
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${stat.iconBg} ${stat.iconColor}`}>{stat.icon}</div>
                <div>
                  <p className="text-xs font-medium text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Views Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex justify-between items-center">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Profile Views</h2>
              <p className="text-xs text-gray-500 mt-0.5">Last 6 months</p>
            </div>
            <Badge variant="primary">+47% this month</Badge>
          </CardHeader>
          <CardBody>
            <div className="flex items-end gap-2 h-36">
              {VIEW_DATA.map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className={`w-full rounded-t-md transition-all duration-500 ${i === VIEW_DATA.length - 1 ? 'bg-primary-500' : 'bg-primary-200'}`}
                    style={{ height: `${(val / MAX_VIEWS) * 100}%` }}
                  />
                  <span className="text-xs text-gray-400">{MONTH_LABELS[i]}</span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* My Ideas */}
        <Card>
          <CardHeader className="flex justify-between items-center">
            <h2 className="text-base font-semibold text-gray-900">My Ideas</h2>
            <Link to="/ideas" className="text-xs text-primary-600 hover:underline flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </CardHeader>
          <CardBody className="space-y-3">
            {myIdeas.length === 0 ? (
              <div className="text-center py-6">
                <Lightbulb size={28} className="mx-auto text-gray-300 mb-2" />
                <p className="text-sm text-gray-500">No ideas posted yet</p>
                <Link to="/ideas/post">
                  <Button size="sm" variant="outline" className="mt-2">Post First Idea</Button>
                </Link>
              </div>
            ) : (
              myIdeas.map(idea => (
                <Link key={idea.id} to={`/ideas/${idea.id}`} className="block p-3 rounded-lg bg-gray-50 hover:bg-primary-50 transition-colors">
                  <p className="text-sm font-medium text-gray-900 line-clamp-1">{idea.title}</p>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Eye size={11} /> {idea.views}</span>
                    <span className="flex items-center gap-1"><Heart size={11} /> {idea.likes}</span>
                    <Badge variant="gray" size="sm">{idea.stage}</Badge>
                  </div>
                </Link>
              ))
            )}
          </CardBody>
        </Card>
      </div>

      {/* Collaboration Requests */}
      <Card>
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-base font-semibold text-gray-900">Collaboration Requests</h2>
          <Badge variant="primary">{pending.length} pending</Badge>
        </CardHeader>
        <CardBody>
          {requests.length > 0 ? (
            <div className="space-y-4">
              {requests.slice(0, 3).map(req => (
                <CollaborationRequestCard
                  key={req.id}
                  request={req}
                  onStatusUpdate={(id, status) => setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r))}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertCircle size={24} className="mx-auto text-gray-300 mb-2" />
              <p className="text-gray-500 text-sm">No collaboration requests yet</p>
              <p className="text-xs text-gray-400 mt-1">Investors will reach out when they're interested in your startup</p>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Recommended Investors */}
      <Card>
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-base font-semibold text-gray-900">Recommended Investors</h2>
          <Link to="/investors" className="text-xs text-primary-600 hover:underline flex items-center gap-1">View all <ArrowRight size={12} /></Link>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {investors.slice(0, 3).map(inv => (
              <Link key={inv.id} to={`/profile/investor/${inv.id}`} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-primary-200 hover:bg-primary-50 transition-all">
                <Avatar src={inv.avatarUrl} alt={inv.name} size="sm" status={inv.isOnline ? 'online' : 'offline'} />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{inv.name}</p>
                  <p className="text-xs text-gray-500">{inv.investmentInterests.slice(0, 2).join(', ')}</p>
                </div>
              </Link>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
