import { useState } from 'react'
import { ArrowLeft, Palette, Layers, Type, Image, Square, Circle, Triangle, Move, RotateCcw, Copy, Trash2, Download, Share2, Eye, EyeOff, Lock, Unlock, Figma, Sparkles, Wand2, Grid, Ruler, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'

interface DesignElement {
  id: string
  type: 'rectangle' | 'circle' | 'text' | 'image'
  x: number
  y: number
  width: number
  height: number
  color: string
  text?: string
  visible: boolean
  locked: boolean
}

interface DesignTemplate {
  id: string
  name: string
  category: string
  preview: string
  description: string
}

export default function DesignStudio() {
  const [selectedTool, setSelectedTool] = useState<string>('select')
  const [elements, setElements] = useState<DesignElement[]>([
    {
      id: '1',
      type: 'rectangle',
      x: 100,
      y: 100,
      width: 200,
      height: 150,
      color: '#3B82F6',
      visible: true,
      locked: false
    },
    {
      id: '2',
      type: 'text',
      x: 150,
      y: 160,
      width: 100,
      height: 30,
      color: '#FFFFFF',
      text: 'Welcome',
      visible: true,
      locked: false
    }
  ])
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [showGrid, setShowGrid] = useState(true)
  const [zoom, setZoom] = useState(100)
  const [figmaConnected, setFigmaConnected] = useState(false)

  const templates: DesignTemplate[] = [
    {
      id: 'landing',
      name: 'Landing Page',
      category: 'Web',
      preview: 'bg-gradient-to-br from-blue-500 to-purple-600',
      description: 'Modern landing page layout'
    },
    {
      id: 'dashboard',
      name: 'Dashboard',
      category: 'Web',
      preview: 'bg-gradient-to-br from-emerald-500 to-teal-600',
      description: 'Clean dashboard interface'
    },
    {
      id: 'mobile',
      name: 'Mobile App',
      category: 'Mobile',
      preview: 'bg-gradient-to-br from-pink-500 to-rose-600',
      description: 'Mobile-first design'
    },
    {
      id: 'ecommerce',
      name: 'E-commerce',
      category: 'Web',
      preview: 'bg-gradient-to-br from-orange-500 to-red-600',
      description: 'Product showcase layout'
    }
  ]

  const tools = [
    { id: 'select', icon: Move, name: 'Select' },
    { id: 'rectangle', icon: Square, name: 'Rectangle' },
    { id: 'circle', icon: Circle, name: 'Circle' },
    { id: 'text', icon: Type, name: 'Text' },
    { id: 'image', icon: Image, name: 'Image' }
  ]

  const colors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B',
    '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16',
    '#F97316', '#6366F1', '#14B8A6', '#F43F5E'
  ]

  const toggleElementVisibility = (id: string) => {
    setElements(prev => prev.map(el => 
      el.id === id ? { ...el, visible: !el.visible } : el
    ))
  }

  const toggleElementLock = (id: string) => {
    setElements(prev => prev.map(el => 
      el.id === id ? { ...el, locked: !el.locked } : el
    ))
  }

  const deleteElement = (id: string) => {
    setElements(prev => prev.filter(el => el.id !== id))
    if (selectedElement === id) {
      setSelectedElement(null)
    }
  }

  const duplicateElement = (id: string) => {
    const element = elements.find(el => el.id === id)
    if (element) {
      const newElement = {
        ...element,
        id: Date.now().toString(),
        x: element.x + 20,
        y: element.y + 20
      }
      setElements(prev => [...prev, newElement])
    }
  }

  const connectToFigma = () => {
    // Simulate Figma connection
    setFigmaConnected(true)
    setTimeout(() => {
      alert('Connected to Figma! You can now import designs and sync changes.')
    }, 1000)
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
              <Palette className="h-6 w-6 text-emerald-400" />
              <h1 className="text-xl font-bold text-white">Design Studio</h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Figma Integration */}
            <button
              onClick={connectToFigma}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                figmaConnected 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              <Figma className="h-4 w-4" />
              <span>{figmaConnected ? 'Connected' : 'Connect Figma'}</span>
            </button>

            {/* Zoom Controls */}
            <div className="flex items-center space-x-2 bg-slate-700 rounded-lg px-3 py-2">
              <button 
                onClick={() => setZoom(Math.max(25, zoom - 25))}
                className="text-slate-300 hover:text-white"
              >
                -
              </button>
              <span className="text-slate-300 text-sm w-12 text-center">{zoom}%</span>
              <button 
                onClick={() => setZoom(Math.min(200, zoom + 25))}
                className="text-slate-300 hover:text-white"
              >
                +
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <button className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 hover:text-white transition-colors">
                <Download className="h-4 w-4" />
              </button>
              <button className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 hover:text-white transition-colors">
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Left Sidebar - Tools & Templates */}
        <div className="w-80 bg-slate-800 border-r border-slate-700 flex flex-col">
          {/* Tools */}
          <div className="p-4 border-b border-slate-700">
            <h3 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wide">Tools</h3>
            <div className="grid grid-cols-5 gap-2">
              {tools.map((tool) => {
                const Icon = tool.icon
                return (
                  <button
                    key={tool.id}
                    onClick={() => setSelectedTool(tool.id)}
                    className={`p-3 rounded-lg transition-colors ${
                      selectedTool === tool.id
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                    title={tool.name}
                  >
                    <Icon className="h-4 w-4" />
                  </button>
                )
              })}
            </div>
          </div>

          {/* Color Palette */}
          <div className="p-4 border-b border-slate-700">
            <h3 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wide">Colors</h3>
            <div className="grid grid-cols-6 gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  className="w-8 h-8 rounded-lg border-2 border-slate-600 hover:border-slate-400 transition-colors"
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    if (selectedElement) {
                      setElements(prev => prev.map(el => 
                        el.id === selectedElement ? { ...el, color } : el
                      ))
                    }
                  }}
                />
              ))}
            </div>
          </div>

          {/* AI Design Assistant */}
          <div className="p-4 border-b border-slate-700">
            <h3 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wide flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-400" />
              AI Assistant
            </h3>
            <div className="space-y-2">
              <button className="w-full p-3 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 rounded-lg text-white text-sm font-medium transition-all flex items-center gap-2">
                <Wand2 className="h-4 w-4" />
                Generate Layout
              </button>
              <button className="w-full p-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 text-sm font-medium transition-colors flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Suggest Colors
              </button>
              <button className="w-full p-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 text-sm font-medium transition-colors flex items-center gap-2">
                <Type className="h-4 w-4" />
                Optimize Typography
              </button>
            </div>
          </div>

          {/* Templates */}
          <div className="flex-1 p-4 overflow-y-auto">
            <h3 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wide">Templates</h3>
            <div className="space-y-3">
              {templates.map((template) => (
                <div key={template.id} className="group cursor-pointer">
                  <div className={`h-24 rounded-lg ${template.preview} mb-2 flex items-center justify-center group-hover:scale-105 transition-transform`}>
                    <span className="text-white font-medium text-sm">{template.name}</span>
                  </div>
                  <div>
                    <h4 className="text-slate-300 font-medium text-sm">{template.name}</h4>
                    <p className="text-slate-500 text-xs">{template.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col">
          {/* Canvas Toolbar */}
          <div className="bg-slate-800 border-b border-slate-700 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowGrid(!showGrid)}
                className={`flex items-center space-x-2 px-3 py-1 rounded text-sm transition-colors ${
                  showGrid ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                <Grid className="h-4 w-4" />
                <span>Grid</span>
              </button>
              <button className="flex items-center space-x-2 px-3 py-1 rounded text-sm text-slate-300 hover:text-white transition-colors">
                <Ruler className="h-4 w-4" />
                <span>Rulers</span>
              </button>
            </div>
            
            <div className="text-slate-400 text-sm">
              Canvas: 1200 × 800px
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 bg-slate-900 overflow-hidden relative">
            <div 
              className="w-full h-full relative"
              style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left' }}
            >
              {/* Grid */}
              {showGrid && (
                <div 
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: 'linear-gradient(rgba(148, 163, 184, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 163, 184, 0.3) 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                  }}
                />
              )}

              {/* Canvas Background */}
              <div className="absolute top-20 left-20 w-[1200px] h-[800px] bg-white rounded-lg shadow-2xl">
                {/* Design Elements */}
                {elements.map((element) => (
                  <div
                    key={element.id}
                    className={`absolute cursor-pointer transition-all ${
                      selectedElement === element.id ? 'ring-2 ring-emerald-500' : ''
                    } ${!element.visible ? 'opacity-50' : ''} ${
                      element.locked ? 'cursor-not-allowed' : ''
                    }`}
                    style={{
                      left: element.x,
                      top: element.y,
                      width: element.width,
                      height: element.height,
                      backgroundColor: element.type !== 'text' ? element.color : 'transparent',
                      color: element.type === 'text' ? element.color : 'transparent',
                      borderRadius: element.type === 'circle' ? '50%' : '4px'
                    }}
                    onClick={() => !element.locked && setSelectedElement(element.id)}
                  >
                    {element.type === 'text' && (
                      <span className="font-medium text-lg">{element.text}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Layers & Properties */}
        <div className="w-80 bg-slate-800 border-l border-slate-700 flex flex-col">
          {/* Properties */}
          {selectedElement && (
            <div className="p-4 border-b border-slate-700">
              <h3 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wide">Properties</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">X</label>
                    <input 
                      type="number" 
                      className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm"
                      value={elements.find(el => el.id === selectedElement)?.x || 0}
                      onChange={(e) => {
                        const value = parseInt(e.target.value)
                        setElements(prev => prev.map(el => 
                          el.id === selectedElement ? { ...el, x: value } : el
                        ))
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Y</label>
                    <input 
                      type="number" 
                      className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm"
                      value={elements.find(el => el.id === selectedElement)?.y || 0}
                      onChange={(e) => {
                        const value = parseInt(e.target.value)
                        setElements(prev => prev.map(el => 
                          el.id === selectedElement ? { ...el, y: value } : el
                        ))
                      }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Width</label>
                    <input 
                      type="number" 
                      className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm"
                      value={elements.find(el => el.id === selectedElement)?.width || 0}
                      onChange={(e) => {
                        const value = parseInt(e.target.value)
                        setElements(prev => prev.map(el => 
                          el.id === selectedElement ? { ...el, width: value } : el
                        ))
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Height</label>
                    <input 
                      type="number" 
                      className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm"
                      value={elements.find(el => el.id === selectedElement)?.height || 0}
                      onChange={(e) => {
                        const value = parseInt(e.target.value)
                        setElements(prev => prev.map(el => 
                          el.id === selectedElement ? { ...el, height: value } : el
                        ))
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Layers */}
          <div className="flex-1 p-4 overflow-y-auto">
            <h3 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wide flex items-center gap-2">
              <Layers className="h-4 w-4" />
              Layers
            </h3>
            <div className="space-y-1">
              {elements.map((element) => (
                <div 
                  key={element.id}
                  className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                    selectedElement === element.id 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                  onClick={() => setSelectedElement(element.id)}
                >
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-4 h-4 rounded border border-slate-500"
                      style={{ backgroundColor: element.color }}
                    />
                    <span className="text-sm font-medium">
                      {element.type === 'text' ? element.text : element.type}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleElementVisibility(element.id)
                      }}
                      className="p-1 hover:bg-slate-600 rounded"
                    >
                      {element.visible ? (
                        <Eye className="h-3 w-3" />
                      ) : (
                        <EyeOff className="h-3 w-3" />
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleElementLock(element.id)
                      }}
                      className="p-1 hover:bg-slate-600 rounded"
                    >
                      {element.locked ? (
                        <Lock className="h-3 w-3" />
                      ) : (
                        <Unlock className="h-3 w-3" />
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        duplicateElement(element.id)
                      }}
                      className="p-1 hover:bg-slate-600 rounded"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteElement(element.id)
                      }}
                      className="p-1 hover:bg-red-600 rounded text-red-400"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Suggestions */}
          <div className="p-4 border-t border-slate-700">
            <h3 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wide flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-400" />
              AI Suggestions
            </h3>
            <div className="space-y-2">
              <div className="p-3 bg-slate-700/50 rounded-lg">
                <p className="text-slate-300 text-sm mb-2">Improve contrast</p>
                <p className="text-slate-400 text-xs">The text color could be more readable against this background.</p>
              </div>
              <div className="p-3 bg-slate-700/50 rounded-lg">
                <p className="text-slate-300 text-sm mb-2">Add spacing</p>
                <p className="text-slate-400 text-xs">Consider adding more space between elements for better visual hierarchy.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}