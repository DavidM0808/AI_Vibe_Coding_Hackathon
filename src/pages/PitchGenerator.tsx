import { useState, useEffect } from 'react'
import { ArrowLeft, Presentation, Wand2, Download, Share2, Eye, Edit3, Plus, Trash2, Copy, RotateCcw, Palette, Type, Image, BarChart3, Users, Target, Lightbulb, TrendingUp, DollarSign, Calendar, Clock, Zap, Settings, Play, Pause, SkipForward, SkipBack } from 'lucide-react'
import { Link } from 'react-router-dom'

interface Slide {
  id: string
  type: 'title' | 'content' | 'image' | 'chart' | 'quote' | 'cta' | 'team' | 'timeline'
  title: string
  content?: string
  imageUrl?: string
  chartData?: any
  notes?: string
  duration?: number
}

interface PitchTemplate {
  id: string
  name: string
  description: string
  category: 'startup' | 'product' | 'sales' | 'investor' | 'demo'
  slides: number
  duration: number
  thumbnail: string
}

interface PresentationSettings {
  theme: 'modern' | 'minimal' | 'corporate' | 'creative'
  colorScheme: 'blue' | 'green' | 'purple' | 'orange' | 'red'
  font: 'inter' | 'roboto' | 'poppins' | 'montserrat'
  transition: 'fade' | 'slide' | 'zoom' | 'flip'
  autoAdvance: boolean
  slideTimer: number
}

export default function PitchGenerator() {
  const [slides, setSlides] = useState<Slide[]>([
    {
      id: '1',
      type: 'title',
      title: 'IdeaToApp Platform',
      content: 'Transform Ideas into Applications with AI-Powered Development',
      duration: 30
    },
    {
      id: '2',
      type: 'content',
      title: 'The Problem',
      content: 'Traditional app development is slow, expensive, and requires extensive technical expertise. Small businesses and entrepreneurs struggle to bring their ideas to life.',
      duration: 45
    },
    {
      id: '3',
      type: 'content',
      title: 'Our Solution',
      content: 'IdeaToApp uses AI agents to automate the entire development process - from design to deployment - making app creation accessible to everyone.',
      duration: 60
    },
    {
      id: '4',
      type: 'chart',
      title: 'Market Opportunity',
      content: 'The no-code/low-code market is projected to reach $65B by 2027',
      chartData: { growth: 85, market: 65, users: 450 },
      duration: 45
    },
    {
      id: '5',
      type: 'team',
      title: 'Our Team',
      content: 'Experienced developers and AI researchers passionate about democratizing app development',
      duration: 30
    }
  ])

  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPresenting, setIsPresenting] = useState(false)
  const [deckSpeedConnected, setDeckSpeedConnected] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [presentationMode, setPresentationMode] = useState<'edit' | 'preview' | 'present'>('edit')

  const [settings, setSettings] = useState<PresentationSettings>({
    theme: 'modern',
    colorScheme: 'blue',
    font: 'inter',
    transition: 'fade',
    autoAdvance: false,
    slideTimer: 30
  })

  const [templates] = useState<PitchTemplate[]>([
    {
      id: 'startup-pitch',
      name: 'Startup Pitch Deck',
      description: 'Perfect for investor presentations and funding rounds',
      category: 'startup',
      slides: 12,
      duration: 15,
      thumbnail: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20startup%20pitch%20deck%20presentation%20slide%20with%20clean%20design&image_size=landscape_4_3'
    },
    {
      id: 'product-demo',
      name: 'Product Demo',
      description: 'Showcase your product features and benefits',
      category: 'product',
      slides: 8,
      duration: 10,
      thumbnail: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=product%20demonstration%20presentation%20slide%20with%20modern%20interface&image_size=landscape_4_3'
    },
    {
      id: 'sales-presentation',
      name: 'Sales Presentation',
      description: 'Convert prospects into customers',
      category: 'sales',
      slides: 10,
      duration: 20,
      thumbnail: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20sales%20presentation%20slide%20with%20charts%20and%20graphs&image_size=landscape_4_3'
    },
    {
      id: 'investor-deck',
      name: 'Investor Deck',
      description: 'Comprehensive deck for Series A/B funding',
      category: 'investor',
      slides: 15,
      duration: 25,
      thumbnail: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=investor%20presentation%20deck%20slide%20with%20financial%20charts&image_size=landscape_4_3'
    }
  ])

  const connectDeckSpeed = () => {
    setDeckSpeedConnected(true)
    setTimeout(() => {
      alert('Connected to DeckSpeed! AI-powered presentation generation is now available.')
    }, 1000)
  }

  const generatePitch = async () => {
    setIsGenerating(true)
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 3000))
    setIsGenerating(false)
    alert('AI-generated pitch deck is ready! Enhanced with DeckSpeed intelligence.')
  }

  const addSlide = (type: Slide['type']) => {
    const newSlide: Slide = {
      id: Date.now().toString(),
      type,
      title: 'New Slide',
      content: 'Add your content here...',
      duration: 30
    }
    setSlides([...slides, newSlide])
  }

  const deleteSlide = (id: string) => {
    setSlides(slides.filter(slide => slide.id !== id))
    if (currentSlide >= slides.length - 1) {
      setCurrentSlide(Math.max(0, slides.length - 2))
    }
  }

  const duplicateSlide = (id: string) => {
    const slideIndex = slides.findIndex(slide => slide.id === id)
    if (slideIndex !== -1) {
      const duplicatedSlide = { ...slides[slideIndex], id: Date.now().toString() }
      const newSlides = [...slides]
      newSlides.splice(slideIndex + 1, 0, duplicatedSlide)
      setSlides(newSlides)
    }
  }

  const moveSlide = (fromIndex: number, toIndex: number) => {
    const newSlides = [...slides]
    const [movedSlide] = newSlides.splice(fromIndex, 1)
    newSlides.splice(toIndex, 0, movedSlide)
    setSlides(newSlides)
  }

  const getSlideIcon = (type: Slide['type']) => {
    switch (type) {
      case 'title': return <Type className="h-4 w-4" />
      case 'content': return <Edit3 className="h-4 w-4" />
      case 'image': return <Image className="h-4 w-4" />
      case 'chart': return <BarChart3 className="h-4 w-4" />
      case 'quote': return <Lightbulb className="h-4 w-4" />
      case 'cta': return <Target className="h-4 w-4" />
      case 'team': return <Users className="h-4 w-4" />
      case 'timeline': return <Calendar className="h-4 w-4" />
      default: return <Edit3 className="h-4 w-4" />
    }
  }

  const getThemeColors = () => {
    const themes = {
      modern: 'from-slate-900 to-slate-800',
      minimal: 'from-white to-gray-50',
      corporate: 'from-blue-900 to-blue-800',
      creative: 'from-purple-900 to-pink-800'
    }
    return themes[settings.theme] || themes.modern
  }

  const getColorScheme = () => {
    const colors = {
      blue: 'text-blue-400 border-blue-500',
      green: 'text-emerald-400 border-emerald-500',
      purple: 'text-purple-400 border-purple-500',
      orange: 'text-orange-400 border-orange-500',
      red: 'text-red-400 border-red-500'
    }
    return colors[settings.colorScheme] || colors.blue
  }

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    }
  }

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  const startPresentation = () => {
    setPresentationMode('present')
    setIsPresenting(true)
  }

  const stopPresentation = () => {
    setPresentationMode('edit')
    setIsPresenting(false)
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link 
              to="/dashboard" 
              className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Dashboard</span>
            </Link>
            <div className="h-6 w-px bg-slate-600" />
            <div className="flex items-center space-x-2">
              <Presentation className="h-6 w-6 text-emerald-400" />
              <h1 className="text-xl font-bold text-white">Pitch Generator</h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* DeckSpeed Integration */}
            <button
              onClick={connectDeckSpeed}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                deckSpeedConnected 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              <Zap className="h-4 w-4" />
              <span>{deckSpeedConnected ? 'DeckSpeed Connected' : 'Connect DeckSpeed'}</span>
            </button>

            {/* Mode Selector */}
            <div className="flex bg-slate-700 rounded-lg p-1">
              {[
                { mode: 'edit', icon: Edit3, label: 'Edit' },
                { mode: 'preview', icon: Eye, label: 'Preview' },
                { mode: 'present', icon: Presentation, label: 'Present' }
              ].map(({ mode, icon: Icon, label }) => (
                <button
                  key={mode}
                  onClick={() => setPresentationMode(mode as any)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm transition-colors ${
                    presentationMode === mode
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </button>
              ))}
            </div>

            {/* Generate Button */}
            {deckSpeedConnected && (
              <button
                onClick={generatePitch}
                disabled={isGenerating}
                className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 disabled:from-slate-600 disabled:to-slate-600 text-white px-6 py-2 rounded-lg transition-all"
              >
                <Wand2 className="h-4 w-4" />
                <span>{isGenerating ? 'Generating...' : 'AI Generate'}</span>
              </button>
            )}

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <button className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 hover:text-white transition-colors">
                <Download className="h-4 w-4" />
              </button>
              <button className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 hover:text-white transition-colors">
                <Share2 className="h-4 w-4" />
              </button>
              <button className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 hover:text-white transition-colors">
                <Settings className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Left Sidebar - Slide Navigator & Templates */}
        {presentationMode !== 'present' && (
          <div className="w-80 bg-slate-800 border-r border-slate-700 flex flex-col">
            {/* Templates Section */}
            {!deckSpeedConnected ? (
              <div className="p-4 border-b border-slate-700">
                <h3 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wide">Templates</h3>
                <div className="space-y-2">
                  {templates.slice(0, 3).map((template) => (
                    <button
                      key={template.id}
                      onClick={() => setSelectedTemplate(template.id)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        selectedTemplate === template.id
                          ? 'border-emerald-500 bg-emerald-500/10'
                          : 'border-slate-600 bg-slate-700/50 hover:border-slate-500'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <img 
                          src={template.thumbnail} 
                          alt={template.name}
                          className="w-12 h-8 object-cover rounded bg-slate-600"
                        />
                        <div className="flex-1">
                          <h4 className="text-white font-medium text-sm">{template.name}</h4>
                          <p className="text-slate-400 text-xs">{template.slides} slides • {template.duration}min</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                <button 
                  onClick={connectDeckSpeed}
                  className="w-full mt-3 p-3 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 rounded-lg text-white text-sm font-medium transition-all flex items-center gap-2"
                >
                  <Zap className="h-4 w-4" />
                  Unlock All Templates
                </button>
              </div>
            ) : (
              <div className="p-4 border-b border-slate-700">
                <h3 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wide flex items-center gap-2">
                  <Zap className="h-4 w-4 text-emerald-400" />
                  DeckSpeed AI
                </h3>
                <div className="space-y-2">
                  <button className="w-full p-3 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 rounded-lg text-white text-sm font-medium transition-all flex items-center gap-2">
                    <Wand2 className="h-4 w-4" />
                    Generate from Idea
                  </button>
                  <button className="w-full p-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 text-sm font-medium transition-colors flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    Smart Design
                  </button>
                  <button className="w-full p-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 text-sm font-medium transition-colors flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Auto Charts
                  </button>
                  <button className="w-full p-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 text-sm font-medium transition-colors flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Market Data
                  </button>
                </div>
              </div>
            )}

            {/* Slide Navigator */}
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">Slides</h3>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => addSlide('content')}
                    className="p-1 bg-slate-700 hover:bg-slate-600 rounded text-slate-300 hover:text-white transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                {slides.map((slide, index) => (
                  <div
                    key={slide.id}
                    className={`group p-3 rounded-lg border cursor-pointer transition-all ${
                      currentSlide === index
                        ? 'border-emerald-500 bg-emerald-500/10'
                        : 'border-slate-600 bg-slate-700/50 hover:border-slate-500'
                    }`}
                    onClick={() => setCurrentSlide(index)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className={`w-8 h-6 rounded border-2 flex items-center justify-center ${
                          currentSlide === index ? 'border-emerald-500' : 'border-slate-500'
                        }`}>
                          <span className="text-xs font-medium text-slate-300">{index + 1}</span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          {getSlideIcon(slide.type)}
                          <h4 className="text-white font-medium text-sm truncate">{slide.title}</h4>
                        </div>
                        <p className="text-slate-400 text-xs capitalize">{slide.type} slide</p>
                      </div>
                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            duplicateSlide(slide.id)
                          }}
                          className="p-1 bg-slate-600 hover:bg-slate-500 rounded text-slate-300 hover:text-white transition-colors"
                        >
                          <Copy className="h-3 w-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteSlide(slide.id)
                          }}
                          className="p-1 bg-slate-600 hover:bg-red-600 rounded text-slate-300 hover:text-white transition-colors"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Slide Options */}
              <div className="mt-4 pt-4 border-t border-slate-700">
                <h4 className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">Add Slide</h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { type: 'title', icon: Type, label: 'Title' },
                    { type: 'content', icon: Edit3, label: 'Content' },
                    { type: 'image', icon: Image, label: 'Image' },
                    { type: 'chart', icon: BarChart3, label: 'Chart' },
                    { type: 'team', icon: Users, label: 'Team' },
                    { type: 'timeline', icon: Calendar, label: 'Timeline' }
                  ].map(({ type, icon: Icon, label }) => (
                    <button
                      key={type}
                      onClick={() => addSlide(type as Slide['type'])}
                      className="flex items-center space-x-2 p-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 hover:text-white transition-colors text-xs"
                    >
                      <Icon className="h-3 w-3" />
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content - Slide Editor/Viewer */}
        <div className="flex-1 flex flex-col">
          {/* Slide Content */}
          <div className="flex-1 flex items-center justify-center p-6">
            <div className={`w-full max-w-4xl aspect-video rounded-lg border-2 bg-gradient-to-br ${getThemeColors()} ${getColorScheme()} shadow-2xl overflow-hidden`}>
              {slides[currentSlide] && (
                <div className="h-full flex flex-col justify-center items-center p-12 text-center">
                  {slides[currentSlide].type === 'title' && (
                    <>
                      <h1 className="text-5xl font-bold text-white mb-6">{slides[currentSlide].title}</h1>
                      <p className="text-xl text-slate-300 max-w-2xl">{slides[currentSlide].content}</p>
                    </>
                  )}
                  
                  {slides[currentSlide].type === 'content' && (
                    <>
                      <h2 className="text-4xl font-bold text-white mb-8">{slides[currentSlide].title}</h2>
                      <p className="text-lg text-slate-300 max-w-3xl leading-relaxed">{slides[currentSlide].content}</p>
                    </>
                  )}
                  
                  {slides[currentSlide].type === 'chart' && (
                    <>
                      <h2 className="text-4xl font-bold text-white mb-8">{slides[currentSlide].title}</h2>
                      <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                        <div className="flex items-center justify-center space-x-8">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-emerald-400">85%</div>
                            <div className="text-slate-300">Growth Rate</div>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold text-blue-400">$65B</div>
                            <div className="text-slate-300">Market Size</div>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold text-purple-400">450M</div>
                            <div className="text-slate-300">Users</div>
                          </div>
                        </div>
                      </div>
                      <p className="text-slate-300 mt-4">{slides[currentSlide].content}</p>
                    </>
                  )}
                  
                  {slides[currentSlide].type === 'team' && (
                    <>
                      <h2 className="text-4xl font-bold text-white mb-8">{slides[currentSlide].title}</h2>
                      <div className="grid grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="text-center">
                            <div className="w-20 h-20 bg-slate-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                              <Users className="h-8 w-8 text-slate-400" />
                            </div>
                            <h3 className="text-white font-semibold">Team Member {i}</h3>
                            <p className="text-slate-400 text-sm">Role & Expertise</p>
                          </div>
                        ))}
                      </div>
                      <p className="text-slate-300 mt-6">{slides[currentSlide].content}</p>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Presentation Controls */}
          <div className="bg-slate-800 border-t border-slate-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-slate-400 text-sm">
                  Slide {currentSlide + 1} of {slides.length}
                </span>
                {slides[currentSlide]?.duration && (
                  <div className="flex items-center space-x-2 text-slate-400 text-sm">
                    <Clock className="h-4 w-4" />
                    <span>{slides[currentSlide].duration}s</span>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={prevSlide}
                  disabled={currentSlide === 0}
                  className="p-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-600 rounded-lg text-slate-300 hover:text-white transition-colors"
                >
                  <SkipBack className="h-4 w-4" />
                </button>
                
                {presentationMode === 'present' ? (
                  <button
                    onClick={stopPresentation}
                    className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <Pause className="h-4 w-4" />
                    <span>Stop</span>
                  </button>
                ) : (
                  <button
                    onClick={startPresentation}
                    className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <Play className="h-4 w-4" />
                    <span>Present</span>
                  </button>
                )}
                
                <button
                  onClick={nextSlide}
                  disabled={currentSlide === slides.length - 1}
                  className="p-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-600 rounded-lg text-slate-300 hover:text-white transition-colors"
                >
                  <SkipForward className="h-4 w-4" />
                </button>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-slate-400 text-sm">
                  Total: {slides.reduce((acc, slide) => acc + (slide.duration || 0), 0)}s
                </div>
                <button className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 hover:text-white transition-colors">
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Slide Properties */}
        {presentationMode === 'edit' && slides[currentSlide] && (
          <div className="w-80 bg-slate-800 border-l border-slate-700 flex flex-col">
            <div className="p-4 border-b border-slate-700">
              <h3 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wide">Slide Properties</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-slate-400 text-sm mb-1">Title</label>
                  <input
                    type="text"
                    value={slides[currentSlide].title}
                    onChange={(e) => {
                      const newSlides = [...slides]
                      newSlides[currentSlide].title = e.target.value
                      setSlides(newSlides)
                    }}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-slate-400 text-sm mb-1">Content</label>
                  <textarea
                    value={slides[currentSlide].content || ''}
                    onChange={(e) => {
                      const newSlides = [...slides]
                      newSlides[currentSlide].content = e.target.value
                      setSlides(newSlides)
                    }}
                    rows={4}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm resize-none"
                  />
                </div>
                
                <div>
                  <label className="block text-slate-400 text-sm mb-1">Duration (seconds)</label>
                  <input
                    type="number"
                    value={slides[currentSlide].duration || 30}
                    onChange={(e) => {
                      const newSlides = [...slides]
                      newSlides[currentSlide].duration = parseInt(e.target.value) || 30
                      setSlides(newSlides)
                    }}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-slate-400 text-sm mb-1">Speaker Notes</label>
                  <textarea
                    value={slides[currentSlide].notes || ''}
                    onChange={(e) => {
                      const newSlides = [...slides]
                      newSlides[currentSlide].notes = e.target.value
                      setSlides(newSlides)
                    }}
                    rows={3}
                    placeholder="Add speaker notes..."
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm resize-none"
                  />
                </div>
              </div>
            </div>
            
            {/* Presentation Settings */}
            <div className="p-4 border-b border-slate-700">
              <h3 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wide">Presentation Settings</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-slate-400 text-sm mb-1">Theme</label>
                  <select
                    value={settings.theme}
                    onChange={(e) => setSettings({...settings, theme: e.target.value as any})}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm"
                  >
                    <option value="modern">Modern</option>
                    <option value="minimal">Minimal</option>
                    <option value="corporate">Corporate</option>
                    <option value="creative">Creative</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-slate-400 text-sm mb-1">Color Scheme</label>
                  <select
                    value={settings.colorScheme}
                    onChange={(e) => setSettings({...settings, colorScheme: e.target.value as any})}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm"
                  >
                    <option value="blue">Blue</option>
                    <option value="green">Green</option>
                    <option value="purple">Purple</option>
                    <option value="orange">Orange</option>
                    <option value="red">Red</option>
                  </select>
                </div>
                
                <div>
                  <label className="flex items-center space-x-2 text-slate-300 text-sm">
                    <input
                      type="checkbox"
                      checked={settings.autoAdvance}
                      onChange={(e) => setSettings({...settings, autoAdvance: e.target.checked})}
                      className="rounded"
                    />
                    <span>Auto-advance slides</span>
                  </label>
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="p-4">
              <h3 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wide">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full p-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 text-sm font-medium transition-colors flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Export as PDF
                </button>
                <button className="w-full p-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 text-sm font-medium transition-colors flex items-center gap-2">
                  <Share2 className="h-4 w-4" />
                  Share Link
                </button>
                <button className="w-full p-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 text-sm font-medium transition-colors flex items-center gap-2">
                  <Copy className="h-4 w-4" />
                  Duplicate Deck
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}