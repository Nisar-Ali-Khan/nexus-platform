import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lightbulb, Target, Cpu, DollarSign, Users, MapPin, Tag, ChevronRight, CheckCircle } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';
import { addStartupIdea } from '../../data/startupIdeas';
import toast from 'react-hot-toast';
import { StartupIdea } from '../../types';

const INDUSTRIES = ['FinTech', 'HealthTech', 'CleanTech', 'AgTech', 'EdTech', 'SaaS', 'E-Commerce', 'AI/ML', 'Blockchain', 'Other'];
const STAGES = [
  { value: 'idea', label: 'Idea Stage', desc: 'Concept validated, not yet built' },
  { value: 'mvp', label: 'MVP', desc: 'Minimum viable product ready' },
  { value: 'early-traction', label: 'Early Traction', desc: 'First users/customers acquired' },
  { value: 'growth', label: 'Growth', desc: 'Scaling with proven model' },
];

const steps = ['Basic Info', 'Problem & Solution', 'Business Details', 'Review'];

export const PostIdeaPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: '',
    summary: '',
    industry: '',
    stage: 'idea' as StartupIdea['stage'],
    fundingNeeded: '',
    tags: [] as string[],
    problem: '',
    solution: '',
    businessModel: '',
    traction: '',
    teamSize: 1,
    location: '',
  });

  const update = (field: string, value: any) => setForm(prev => ({ ...prev, [field]: value }));

  const addTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim()) && form.tags.length < 6) {
      update('tags', [...form.tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => update('tags', form.tags.filter(t => t !== tag));

  const handleSubmit = async () => {
    if (!user) return;
    setIsSubmitting(true);
    try {
      await new Promise(r => setTimeout(r, 800));
      addStartupIdea({ ...form, entrepreneurId: user.id });
      toast.success('Your idea has been posted successfully!');
      navigate('/ideas');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    if (currentStep === 0) return form.title && form.summary && form.industry && form.stage && form.fundingNeeded;
    if (currentStep === 1) return form.problem && form.solution;
    if (currentStep === 2) return form.businessModel && form.location;
    return true;
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-5">
            <Input
              label="Startup / Idea Title"
              placeholder="e.g. AI-Powered Financial Analytics for SMBs"
              value={form.title}
              onChange={e => update('title', e.target.value)}
              fullWidth
              startAdornment={<Lightbulb size={18} />}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">One-line Summary</label>
              <textarea
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                rows={2}
                placeholder="Describe your idea in one compelling sentence..."
                value={form.summary}
                onChange={e => update('summary', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
              <div className="flex flex-wrap gap-2">
                {INDUSTRIES.map(ind => (
                  <button
                    key={ind}
                    type="button"
                    onClick={() => update('industry', ind)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                      form.industry === ind
                        ? 'bg-primary-600 text-white border-primary-600'
                        : 'border-gray-300 text-gray-700 hover:border-primary-400'
                    }`}
                  >
                    {ind}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Stage</label>
              <div className="grid grid-cols-2 gap-3">
                {STAGES.map(s => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => update('stage', s.value)}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      form.stage === s.value
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <p className={`text-sm font-semibold ${form.stage === s.value ? 'text-primary-700' : 'text-gray-900'}`}>{s.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{s.desc}</p>
                  </button>
                ))}
              </div>
            </div>
            <Input
              label="Funding Needed"
              placeholder="e.g. $500K, $1.5M, $3M"
              value={form.fundingNeeded}
              onChange={e => update('fundingNeeded', e.target.value)}
              fullWidth
              startAdornment={<DollarSign size={18} />}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags (up to 6)</label>
              <div className="flex gap-2 mb-2 flex-wrap">
                {form.tags.map(tag => (
                  <Badge key={tag} variant="primary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                    {tag} ×
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag (e.g. AI, B2B, Mobile)"
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  startAdornment={<Tag size={18} />}
                />
                <Button type="button" variant="outline" onClick={addTag}>Add</Button>
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <span className="flex items-center gap-1"><Target size={16} /> The Problem</span>
              </label>
              <textarea
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows={4}
                placeholder="What pain point are you solving? Be specific about the problem size and impact..."
                value={form.problem}
                onChange={e => update('problem', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <span className="flex items-center gap-1"><Cpu size={16} /> Your Solution</span>
              </label>
              <textarea
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows={4}
                placeholder="How does your product/service solve this problem uniquely and better than alternatives?"
                value={form.solution}
                onChange={e => update('solution', e.target.value)}
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <span className="flex items-center gap-1"><DollarSign size={16} /> Business Model</span>
              </label>
              <textarea
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows={3}
                placeholder="How do you make money? Describe your revenue streams and pricing..."
                value={form.businessModel}
                onChange={e => update('businessModel', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Traction & Metrics (optional)</label>
              <textarea
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows={3}
                placeholder="Share any users, revenue, partnerships or milestones achieved..."
                value={form.traction}
                onChange={e => update('traction', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Team Size"
                type="number"
                min={1}
                value={form.teamSize}
                onChange={e => update('teamSize', parseInt(e.target.value) || 1)}
                fullWidth
                startAdornment={<Users size={18} />}
              />
              <Input
                label="Location"
                placeholder="e.g. San Francisco, CA"
                value={form.location}
                onChange={e => update('location', e.target.value)}
                fullWidth
                startAdornment={<MapPin size={18} />}
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl p-6 border border-primary-100">
              <h3 className="text-lg font-bold text-gray-900 mb-1">{form.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{form.summary}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="primary">{form.industry}</Badge>
                <Badge variant="secondary">{form.stage}</Badge>
                <Badge variant="accent">{form.fundingNeeded}</Badge>
                {form.tags.map(tag => <Badge key={tag} variant="gray">{tag}</Badge>)}
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wide font-medium">Problem</p>
                  <p className="text-gray-700 mt-1 line-clamp-3">{form.problem}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wide font-medium">Solution</p>
                  <p className="text-gray-700 mt-1 line-clamp-3">{form.solution}</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-white rounded-lg border p-3">
                <p className="text-xs text-gray-500">Team Size</p>
                <p className="text-lg font-bold text-gray-900">{form.teamSize}</p>
              </div>
              <div className="bg-white rounded-lg border p-3">
                <p className="text-xs text-gray-500">Funding</p>
                <p className="text-lg font-bold text-primary-700">{form.fundingNeeded}</p>
              </div>
              <div className="bg-white rounded-lg border p-3">
                <p className="text-xs text-gray-500">Location</p>
                <p className="text-sm font-bold text-gray-900">{form.location || '—'}</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Post Your Startup Idea</h1>
        <p className="text-gray-600">Share your vision with investors on Business Nexus</p>
      </div>

      {/* Step Progress */}
      <div className="flex items-center justify-between">
        {steps.map((step, idx) => (
          <React.Fragment key={step}>
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                idx < currentStep ? 'bg-primary-600 text-white' :
                idx === currentStep ? 'bg-primary-600 text-white ring-4 ring-primary-100' :
                'bg-gray-200 text-gray-500'
              }`}>
                {idx < currentStep ? <CheckCircle size={16} /> : idx + 1}
              </div>
              <span className={`text-sm font-medium hidden sm:block ${idx === currentStep ? 'text-primary-700' : 'text-gray-500'}`}>
                {step}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 ${idx < currentStep ? 'bg-primary-600' : 'bg-gray-200'}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      <Card>
        <CardHeader>
          <h2 className="font-semibold text-gray-900">{steps[currentStep]}</h2>
        </CardHeader>
        <CardBody>
          {renderStep()}
        </CardBody>
      </Card>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => currentStep > 0 ? setCurrentStep(s => s - 1) : navigate('/ideas')}
        >
          {currentStep === 0 ? 'Cancel' : 'Back'}
        </Button>
        {currentStep < steps.length - 1 ? (
          <Button
            onClick={() => setCurrentStep(s => s + 1)}
            disabled={!canProceed()}
            rightIcon={<ChevronRight size={18} />}
          >
            Continue
          </Button>
        ) : (
          <Button onClick={handleSubmit} isLoading={isSubmitting} leftIcon={<CheckCircle size={18} />}>
            Publish Idea
          </Button>
        )}
      </div>
    </div>
  );
};
