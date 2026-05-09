import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, PieChart, TrendingUp, Search, ArrowRight, Heart, Eye, DollarSign } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { EntrepreneurCard } from '../../components/entrepreneur/EntrepreneurCard';
import { useAuth } from '../../context/AuthContext';
import { entrepreneurs } from '../../data/users';
import { getRequestsFromInvestor } from '../../data/collaborationRequests';
import { startupIdeas } from '../../data/startupIdeas';

const INDUSTRY_DATA = [
  { label: 'FinTech', pct: 35, color: '#3B82F6' },
  { label: 'HealthTech', pct: 25, color: '#14B8A6' },
  { label: 'CleanTech', pct: 22, color: '#22C55E' },
  { label: 'AgTech', pct: 18, color: '#F59E0B' },
];

export const InvestorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  if (!user) return null;

  const sentRequests = getRequestsFromInvestor(user.id);
  const accepted = sentRequests.filter(r => r.status === 'accepted');
  const totalIdeas = startupIdeas.length;
  const industries = Array.from(new Set(entrepreneurs.map(e => e.industry)));

  const filtered = entrepreneurs.filter(e =>
    !searchQuery ||
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.startupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.industry.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {user.name.split(' ')[0]} 👋</h1>
          <p className="text-gray-500 mt-1">Discover your next investment opportunity</p>
        </div>
        <Link to="/ideas">
          <Button leftIcon={<TrendingUp size={18} />}>Explore Ideas</Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Startups', value: entrepreneurs.length, icon: <Users size={20} />, color: 'bg-blue-50', iconColor: 'text-blue-600', iconBg: 'bg-blue-100' },
          { label: 'Industries', value: industries.length, icon: <PieChart size={20} />, color: 'bg-teal-50', iconColor: 'text-teal-600', iconBg: 'bg-teal-100' },
          { label: 'Your Connections', value: accepted.length, icon: <Heart size={20} />, color: 'bg-purple-50', iconColor: 'text-purple-600', iconBg: 'bg-purple-100' },
          { label: 'Active Ideas', value: totalIdeas, icon: <DollarSign size={20} />, color: 'bg-amber-50', iconColor: 'text-amber-600', iconBg: 'bg-amber-100' },
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
        {/* Industry Breakdown */}
        <Card>
          <CardHeader>
            <h2 className="text-base font-semibold text-gray-900">Industry Breakdown</h2>
          </CardHeader>
          <CardBody className="space-y-3">
            {INDUSTRY_DATA.map(item => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700 font-medium">{item.label}</span>
                  <span className="text-gray-500">{item.pct}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-700"
                    style={{ width: `${item.pct}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </CardBody>
        </Card>

        {/* Trending Ideas */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex justify-between items-center">
            <h2 className="text-base font-semibold text-gray-900">Trending Ideas</h2>
            <Link to="/ideas" className="text-xs text-primary-600 hover:underline flex items-center gap-1">See all <ArrowRight size={12} /></Link>
          </CardHeader>
          <CardBody className="space-y-3">
            {startupIdeas.sort((a, b) => b.likes - a.likes).slice(0, 3).map(idea => (
              <Link key={idea.id} to={`/ideas/${idea.id}`} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-primary-50 transition-colors group">
                <div className="flex-1 min-w-0 mr-4">
                  <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-primary-700">{idea.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="primary" size="sm">{idea.industry}</Badge>
                    <span className="text-xs text-primary-700 font-medium">{idea.fundingNeeded}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-400 flex-shrink-0">
                  <span className="flex items-center gap-1"><Heart size={12} className="text-red-400" /> {idea.likes}</span>
                  <span className="flex items-center gap-1"><Eye size={12} /> {idea.views}</span>
                </div>
              </Link>
            ))}
          </CardBody>
        </Card>
      </div>

      {/* Startups Directory */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <h2 className="text-base font-semibold text-gray-900">Featured Startups</h2>
            <div className="w-full sm:w-64">
              <Input
                placeholder="Quick search..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                startAdornment={<Search size={16} />}
                fullWidth
              />
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.slice(0, 6).map(e => (
              <EntrepreneurCard key={e.id} entrepreneur={e} />
            ))}
          </div>
          {filtered.length > 6 && (
            <div className="text-center mt-4">
              <Link to="/entrepreneurs">
                <Button variant="outline">View All {filtered.length} Startups</Button>
              </Link>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};
