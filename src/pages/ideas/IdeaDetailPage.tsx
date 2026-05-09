import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, Eye, MapPin, Users, DollarSign, Calendar, Tag, MessageCircle, ArrowLeft, Building2 } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { useAuth } from '../../context/AuthContext';
import { startupIdeas, toggleLikeIdea, incrementViews } from '../../data/startupIdeas';
import { findUserById } from '../../data/users';
import { createCollaborationRequest, getRequestsFromInvestor } from '../../data/collaborationRequests';
import { Entrepreneur, StartupIdea } from '../../types';
import toast from 'react-hot-toast';

const STAGE_LABELS: Record<string, string> = {
  idea: '💡 Idea Stage',
  mvp: '🔧 MVP',
  'early-traction': '📈 Early Traction',
  growth: '🚀 Growth Stage',
};

export const IdeaDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [idea, setIdea] = useState<StartupIdea | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestMessage, setRequestMessage] = useState('');

  useEffect(() => {
    const found = startupIdeas.find(i => i.id === id);
    if (found) {
      incrementViews(found.id);
      setIdea({ ...found });
    }
  }, [id]);

  if (!idea) return (
    <div className="text-center py-16">
      <p className="text-gray-600">Idea not found</p>
      <Link to="/ideas"><Button variant="outline" className="mt-4">Browse Ideas</Button></Link>
    </div>
  );

  const entrepreneur = findUserById(idea.entrepreneurId) as Entrepreneur | null;
  const isLiked = user ? idea.likedBy.includes(user.id) : false;
  const isOwnIdea = user?.id === idea.entrepreneurId;
  const isInvestor = user?.role === 'investor';
  const hasRequested = isInvestor && user ? getRequestsFromInvestor(user.id).some(r => r.entrepreneurId === idea.entrepreneurId) : false;

  const handleLike = () => {
    if (!user) return;
    const updated = toggleLikeIdea(idea.id, user.id);
    if (updated) setIdea({ ...updated });
  };

  const handleSendRequest = () => {
    if (!user || !entrepreneur) return;
    const msg = requestMessage || `I'm interested in ${idea.title} and would love to discuss potential investment.`;
    createCollaborationRequest(user.id, entrepreneur.id, msg);
    toast.success('Collaboration request sent!');
    setShowRequestModal(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors">
        <ArrowLeft size={16} /> Back to Ideas
      </button>

      {/* Hero Card */}
      <Card>
        <CardBody className="p-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="primary">{idea.industry}</Badge>
                <Badge variant="secondary">{STAGE_LABELS[idea.stage]}</Badge>
                {idea.tags.map(tag => <Badge key={tag} variant="gray" size="sm">{tag}</Badge>)}
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{idea.title}</h1>
              <p className="text-gray-600 text-base">{idea.summary}</p>

              <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-500">
                <span className="flex items-center gap-1"><MapPin size={14} /> {idea.location}</span>
                <span className="flex items-center gap-1"><Users size={14} /> Team of {idea.teamSize}</span>
                <span className="flex items-center gap-1 font-semibold text-primary-700"><DollarSign size={14} /> Seeking {idea.fundingNeeded}</span>
                <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(idea.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 min-w-[160px]">
              {isInvestor && !isOwnIdea && (
                <>
                  {hasRequested ? (
                    <Button variant="outline" disabled>Request Sent ✓</Button>
                  ) : (
                    <Button onClick={() => setShowRequestModal(true)} leftIcon={<DollarSign size={16} />}>
                      Request to Invest
                    </Button>
                  )}
                  {entrepreneur && (
                    <Link to={`/chat/${entrepreneur.id}`}>
                      <Button variant="outline" fullWidth leftIcon={<MessageCircle size={16} />}>Message</Button>
                    </Link>
                  )}
                </>
              )}
              <div className="flex gap-3 text-sm text-gray-500 justify-center pt-1">
                <button onClick={handleLike} className={`flex items-center gap-1.5 transition-colors ${isLiked ? 'text-red-500' : 'hover:text-red-400'}`}>
                  <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} /> {idea.likes}
                </button>
                <span className="flex items-center gap-1.5"><Eye size={16} /> {idea.views}</span>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Founder Info */}
      {entrepreneur && (
        <Card>
          <CardHeader><h2 className="font-semibold text-gray-900">About the Founder</h2></CardHeader>
          <CardBody>
            <div className="flex items-start gap-4">
              <Avatar src={entrepreneur.avatarUrl} alt={entrepreneur.name} size="lg" status={entrepreneur.isOnline ? 'online' : 'offline'} />
              <div className="flex-1">
                <Link to={`/profile/entrepreneur/${entrepreneur.id}`} className="font-bold text-gray-900 hover:text-primary-700 flex items-center gap-1">
                  {entrepreneur.name} <Building2 size={14} />
                </Link>
                <p className="text-sm text-primary-600 font-medium">{entrepreneur.startupName}</p>
                <p className="text-sm text-gray-600 mt-1">{entrepreneur.bio}</p>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Detailed Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><h2 className="font-semibold text-gray-900">🎯 The Problem</h2></CardHeader>
          <CardBody><p className="text-gray-700 text-sm leading-relaxed">{idea.problem}</p></CardBody>
        </Card>
        <Card>
          <CardHeader><h2 className="font-semibold text-gray-900">💡 Our Solution</h2></CardHeader>
          <CardBody><p className="text-gray-700 text-sm leading-relaxed">{idea.solution}</p></CardBody>
        </Card>
        <Card>
          <CardHeader><h2 className="font-semibold text-gray-900">💰 Business Model</h2></CardHeader>
          <CardBody><p className="text-gray-700 text-sm leading-relaxed">{idea.businessModel}</p></CardBody>
        </Card>
        {idea.traction && (
          <Card>
            <CardHeader><h2 className="font-semibold text-gray-900">📊 Traction</h2></CardHeader>
            <CardBody><p className="text-gray-700 text-sm leading-relaxed">{idea.traction}</p></CardBody>
          </Card>
        )}
      </div>

      {/* Request Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <h2 className="font-bold text-gray-900">Send Collaboration Request</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <p className="text-sm text-gray-600">Send a message to <strong>{entrepreneur?.name}</strong> about investing in <strong>{idea.title}</strong></p>
              <textarea
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows={4}
                placeholder={`I'm interested in ${idea.title} and would love to discuss potential investment opportunities...`}
                value={requestMessage}
                onChange={e => setRequestMessage(e.target.value)}
              />
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setShowRequestModal(false)}>Cancel</Button>
                <Button onClick={handleSendRequest} leftIcon={<DollarSign size={16} />}>Send Request</Button>
              </div>
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
};
