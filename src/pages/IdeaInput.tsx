import { useState } from 'react'
import { ArrowRight, Lightbulb, Sparkles, Wand2, FileText, Code, Palette, TestTube, BarChart3, Presentation, Upload, X, Plus, Loader2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

interface ProjectTemplate {
  id: string
  name: string
  description: string
  category: string
  features: string[]
  tech_stack: string[]
  estimated_time: string
  complexity: 'beginner' | 'intermediate' | 'advanced'
}

interface ProcessingStep {
  id: string
  name: string
  status: 'pending' | 'processing' | 'completed' | 'error'
  description: string
}

export default function IdeaInput() {
  const navigate = useNavigate()
  const [ideaText, setIdeaText] = useState('')
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [projectDetails, setProjectDetails] = useState({
    name: '',
    description: '',
    category: '',
    features: [] as string[],
    tech_stack: [] as string[]
  })

  const templates: ProjectTemplate[] = [
    {
      id: 'ecommerce',
      name: 'E-commerce Platform',
      description: 'Complete online store with payment processing',
      category: 'Business',
      features: ['Product catalog', 'Shopping cart', 'Payment gateway', 'User accounts', 'Order management'],
      tech_stack: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
      estimated_time: '2-3 weeks',
      complexity: 'intermediate'
    },
    {
      id: 'saas',
      name: 'SaaS Dashboard',
      description: 'Multi-tenant application with analytics',
      category: 'Business',
      features: ['User management', 'Analytics dashboard', 'Subscription billing', 'API access', 'Team collaboration'],
      tech_stack: ['React', 'Express', 'MongoDB', 'Stripe'],
      estimated_time: '3-4 weeks',
      complexity: 'advanced'
    },
    {
      id: 'social',
      name: 'Social Media App',
      description: 'Social networking platform with real-time features',
      category: 'Social',
      features: ['User profiles', 'Posts & comments', 'Real-time chat', 'Media sharing', 'Notifications'],
      tech_stack: ['React', 'Socket.io', 'PostgreSQL', 'Redis'],
      estimated_time: '4-5 weeks',
      complexity: 'advanced'
    },
    {
      id: 'portfolio',
      name: 'Portfolio Website',
      description: 'Professional portfolio with CMS',
      category: 'Personal',
      features: ['Project showcase', 'Blog', 'Contact form', 'Admin panel', 'SEO optimization'],
      tech_stack: ['React', 'Headless CMS', 'Static hosting'],
      estimated_time: '1-2 weeks',
      complexity: 'beginner'
    }
  ]

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setSelectedFiles(prev => [...prev, ...files])
  }

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const processIdea = async () => {
    if (!ideaText.trim() && !selectedTemplate) return

    setIsProcessing(true)
    const steps: ProcessingStep[] = [
      { id: '1', name: 'Analyzing Requirements', status: 'processing', description: 'Understanding your project needs' },
      { id: '2', name: 'Generating Architecture', status: 'pending', description: 'Creating technical architecture' },
      { id: '3', name: 'Planning Features', status: 'pending', description: 'Breaking down functionality' },
      { id: '4', name: 'Selecting Tech Stack', status: 'pending', description: 'Choosing optimal technologies' },
      { id: '5', name: 'Creating Project', status: 'pending', description: 'Setting up development environment' }
    ]
    setProcessingSteps(steps)

    // Simulate AI processing
    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setProcessingSteps(prev => prev.map((step, index) => {
        if (index === i) return { ...step, status: 'completed' }
        if (index === i + 1) return { ...step, status: 'processing' }
        return step
      }))
    }

    // Simulate project creation
    const template = templates.find(t => t.id === selectedTemplate)
    setProjectDetails({
      name: template?.name || 'AI Generated Project',
      description: template?.description || ideaText.slice(0, 100) + '...',
      category: template?.category || 'Custom',
      features: template?.features || ['Custom feature 1', 'Custom feature 2'],
      tech_stack: template?.tech_stack || ['React', 'Node.js']
    })

    setTimeout(() => {
      navigate('/dashboard')
    }, 1000)
  }

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'beginner': return 'text-emerald-400 bg-emerald-500/20'
      case 'intermediate': return 'text-yellow-400 bg-yellow-500/20'
      case 'advanced': return 'text-red-400 bg-red-500/20'
      default: return 'text-slate-400 bg-slate-500/20'
    }
  }

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-6">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wand2 className="h-8 w-8 text-emerald-400 animate-pulse" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Creating Your Project</h2>
              <p className="text-slate-400">Our AI agents are working together to bring your idea to life</p>
            </div>

            <div className="space-y-4">
              {processingSteps.map((step, index) => (
                <div key={step.id} className="flex items-center gap-4 p-4 bg-slate-700/30 rounded-xl">
                  <div className="flex-shrink-0">
                    {step.status === 'completed' ? (
                      <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    ) : step.status === 'processing' ? (
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <Loader2 className="w-5 h-5 text-white animate-spin" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
                        <span className="text-slate-400 text-sm font-medium">{index + 1}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-medium">{step.name}</h3>
                    <p className="text-slate-400 text-sm">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900">
      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <Sparkles className="h-8 w-8 text-emerald-400" />
              <span className="text-2xl font-bold text-white">IdeaToApp</span>
            </Link>
            <Link 
              to="/dashboard"
              className="text-slate-300 hover:text-white transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lightbulb className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Transform Your Idea Into Reality
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Describe your project in natural language or choose from our templates. 
            Our AI agents will handle the rest.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Idea Input Section */}
          <div className="space-y-8">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <FileText className="h-6 w-6 text-emerald-400" />
                Describe Your Idea
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Project Description
                  </label>
                  <textarea
                    value={ideaText}
                    onChange={(e) => setIdeaText(e.target.value)}
                    placeholder="Describe your project idea in detail. For example: 'I want to build an e-commerce platform for handmade crafts with social features, payment processing, and inventory management...'"
                    className="w-full h-40 bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Upload Reference Files (Optional)
                  </label>
                  <div className="border-2 border-dashed border-slate-600 rounded-xl p-6 text-center hover:border-slate-500 transition-colors">
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                      accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-slate-400 mb-1">Click to upload files</p>
                      <p className="text-slate-500 text-sm">PDF, DOC, TXT, or images</p>
                    </label>
                  </div>
                  
                  {selectedFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-slate-700/30 rounded-lg p-3">
                          <span className="text-slate-300 text-sm">{file.name}</span>
                          <button
                            onClick={() => removeFile(index)}
                            className="text-slate-400 hover:text-red-400 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* AI Features */}
            <div className="bg-gradient-to-br from-emerald-900/30 to-blue-900/30 rounded-2xl p-6 border border-emerald-500/20">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Wand2 className="h-5 w-5 text-emerald-400" />
                AI-Powered Analysis
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Code className="h-4 w-4 text-emerald-400" />
                  Tech Stack Selection
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Palette className="h-4 w-4 text-blue-400" />
                  UI/UX Design
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <TestTube className="h-4 w-4 text-purple-400" />
                  Testing Strategy
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <BarChart3 className="h-4 w-4 text-orange-400" />
                  Performance Optimization
                </div>
              </div>
            </div>
          </div>

          {/* Templates Section */}
          <div className="space-y-8">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Presentation className="h-6 w-6 text-blue-400" />
                Or Choose a Template
              </h2>
              
              <div className="space-y-4">
                {templates.map((template) => (
                  <div 
                    key={template.id}
                    className={`p-6 rounded-xl border cursor-pointer transition-all ${
                      selectedTemplate === template.id
                        ? 'border-emerald-500 bg-emerald-500/10'
                        : 'border-slate-600 bg-slate-700/30 hover:border-slate-500'
                    }`}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-white">{template.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getComplexityColor(template.complexity)}`}>
                        {template.complexity}
                      </span>
                    </div>
                    
                    <p className="text-slate-400 text-sm mb-4">{template.description}</p>
                    
                    <div className="space-y-3">
                      <div>
                        <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Features</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {template.features.slice(0, 3).map((feature, index) => (
                            <span key={index} className="px-2 py-1 bg-slate-600/50 text-slate-300 text-xs rounded">
                              {feature}
                            </span>
                          ))}
                          {template.features.length > 3 && (
                            <span className="px-2 py-1 bg-slate-600/50 text-slate-400 text-xs rounded">
                              +{template.features.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>Est. {template.estimated_time}</span>
                        <span>{template.tech_stack.join(', ')}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="text-center mt-12">
          <button
            onClick={processIdea}
            disabled={!ideaText.trim() && !selectedTemplate}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 disabled:transform-none"
          >
            <Wand2 className="h-5 w-5" />
            Create Project with AI
            <ArrowRight className="h-5 w-5" />
          </button>
          <p className="text-slate-400 text-sm mt-3">
            Our AI agents will analyze your idea and create a complete project structure
          </p>
        </div>
      </div>
    </div>
  )
}