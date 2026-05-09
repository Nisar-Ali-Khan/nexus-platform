import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Heart, Eye, MapPin, Users, TrendingUp, PlusCircle, ChevronRight } from 'lucide-react';
import { Card, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { useAuth } from '../../context/AuthContext';
import { startupIdeas, toggleLikeIdea } from '../../data/startupIdeas';
import { findUserById } from '../../data/users';
import { Entrepreneur, StartupIdea } from '../../types';

const STAGE_COLORS: Record<string, any> = {
  idea: 'gray',
  mvp: 'accent',
  'early-traction': 'secondary',
  growth: 'primary',
};

const STAGE_LABELS: Record<string, string> = {
  idea: '💡 Idea',
  mvp: '🔧 MVP',
  'early-traction': '📈 Early Traction',
  growth: '🚀 Growth',
};

export const IdeasPage: React.FC = () => {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [selectedStage, setSelectedStage] = useState('');
  const [ideas, setIdeas] = useState(startupIdeas);

  const allIndustries = Array.from(new Set(startupIdeas.map(i => i.industry)));
  const allStages = ['idea', 'mvp', 'early-traction', 'growth'];

  const filtered = ideas.filter(idea => {
    const matchSearch = !search ||
      idea.title.toLowerCase().includes(search.toLowerCase()) ||
      idea.summary.toLowerCase().includes(search.toLowerCase()) ||
      idea.industry.toLowerCase().includes(search.toLowerCase()) ||
      idea.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchIndustry = !selectedIndustry || idea.industry === selectedIndustry;
    const matchStage = !selectedStage || idea.stage === selectedStage;
    return matchSearch && matchIndustry && matchStage;
  });

  const handleLike = (ideaId: string) => {
    if (!user) return;
    const updated = toggleLikeIdea(ideaId, user.id);
    if (updated) setIdeas(prev => prev.map(i => i.id === ideaId ? { ...updated } : i));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Startup Ideas</h1>
          <p className="text-gray-600">Discover innovative startups seeking investment</p>
        </div>
        {user?.role === 'entrepreneur' && (
          <Link to="/ideas/post">
            <Button leftIcon={<PlusCircle size={18} />}>Post Your Idea</Button>
          </Link>
        )}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search by name, industry, or tags..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            startAdornment={<Search size={18} />}
            fullWidth
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <select
            className="px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={selectedIndustry}
            onChange={e => setSelectedIndustry(e.target.value)}
          >
            <option value="">All Industries</option>
            {allIndustries.map(ind => <option key={ind} value={ind}>{ind}</option>)}
          </select>
          <select
            className="px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={selectedStage}
            onChange={e => setSelectedStage(e.target.value)}
          >
            <option value="">All Stages</option>
            {allStages.map(s => <option key={s} value={s}>{STAGE_LABELS[s]}</option>)}
          </select>
        </div>
      </div>

      {/* Stats bar */}
      <div className="flex items-center gap-4 text-sm text-gray-500">
        <span className="flex items-center gap-1"><Filter size={14} /> {filtered.length} results</span>
        {(selectedIndustry || selectedStage || search) && (
          <button
            onClick={() => { setSearch(''); setSelectedIndustry(''); setSelectedStage(''); }}
            className="text-primary-600 hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Ideas Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filtered.map(idea => {
          const entrepreneur = findUserById(idea.entrepreneurId) as Entrepreneur | null;
          const isLiked = user ? idea.likedBy.includes(user.id) : false;
          return (
            <Card key={idea.id} className="hover:shadow-md transition-shadow duration-200 group">
              <CardBody className="p-5">
                {/* Top: author + badges */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {entrepreneur && (
                      <Link to={`/profile/entrepreneur/${entrepreneur.id}`}>
                        <Avatar src={entrepreneur.avatarUrl} alt={entrepreneur.name} size="sm" status={entrepreneur.isOnline ? 'online' : 'offline'} />
                      </Link>
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-900">{entrepreneur?.name}</p>
                      <p className="text-xs text-gray-500">{entrepreneur && (entrepreneur as Entrepreneur).startupName}</p>
                    </div>
                  </div>
                  <Badge variant={STAGE_COLORS[idea.stage]}>{STAGE_LABELS[idea.stage]}</Badge>
                </div>

                {/* Title & Summary */}
                <Link to={`/ideas/${idea.id}`} className="block group-hover:text-primary-700 transition-colors">
                  <h3 className="text-base font-bold text-gray-900 mb-1 leading-tight">{idea.title}</h3>
                </Link>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{idea.summary}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  <Badge variant="primary" size="sm">{idea.industry}</Badge>
                  {idea.tags.slice(0, 3).map(tag => (
                    <Badge key={tag} variant="gray" size="sm">{tag}</Badge>
                  ))}
                </div>

                {/* Meta info */}
                <div className="flex items-center justify-between text-xs text-gray-500 border-t pt-3">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <MapPin size={12} /> {idea.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users size={12} /> {idea.teamSize} people
                    </span>
                    <span className="font-semibold text-primary-700">{idea.fundingNeeded}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleLike(idea.id)}
                      className={`flex items-center gap-1 transition-colors ${isLiked ? 'text-red-500' : 'hover:text-red-400'}`}
                    >
                      <Heart size={14} fill={isLiked ? 'currentColor' : 'none'} />
                      {idea.likes}
                    </button>
                    <span className="flex items-center gap-1">
                      <Eye size={12} /> {idea.views}
                    </span>
                    <Link to={`/ideas/${idea.id}`}>
                      <ChevronRight size={14} className="text-primary-600 hover:text-primary-800" />
                    </Link>
                  </div>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <TrendingUp size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-600 font-medium">No ideas found</p>
          <p className="text-sm text-gray-500 mt-1">Try different search terms or filters</p>
        </div>
      )}
    </div>
  );
};
