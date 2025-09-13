import { useState, useEffect } from 'react'
import { ArrowLeft, Play, Square, Download, Share2, Code, FileText, Folder, Search, Settings, Terminal, Eye, EyeOff, RotateCcw, Save, Copy, Zap, Sparkles, Bug, GitBranch, RefreshCw } from 'lucide-react'
import { Link } from 'react-router-dom'

interface FileNode {
  id: string
  name: string
  type: 'file' | 'folder'
  content?: string
  children?: FileNode[]
  language?: string
}

interface CodeSuggestion {
  id: string
  type: 'optimization' | 'bug-fix' | 'feature' | 'refactor'
  title: string
  description: string
  code: string
  line: number
}

export default function CodeWorkspace() {
  const [activeFile, setActiveFile] = useState<string>('app.tsx')
  const [code, setCode] = useState(`import React, { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to Your App</h1>
        <div className="counter">
          <button onClick={() => setCount(count - 1)}>-</button>
          <span>{count}</span>
          <button onClick={() => setCount(count + 1)}>+</button>
        </div>
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
      </header>
    </div>
  )
}

export default App`)
  const [isRunning, setIsRunning] = useState(false)
  const [showPreview, setShowPreview] = useState(true)
  const [showTerminal, setShowTerminal] = useState(false)
  const [terminalOutput, setTerminalOutput] = useState('$ npm start\nStarting development server...\nCompiled successfully!\nLocal: http://localhost:3000')
  const [aiSuggestions, setAiSuggestions] = useState<CodeSuggestion[]>([
    {
      id: '1',
      type: 'optimization',
      title: 'Use useCallback for event handlers',
      description: 'Optimize performance by memoizing click handlers',
      code: 'const handleIncrement = useCallback(() => setCount(c => c + 1), [])',
      line: 8
    },
    {
      id: '2',
      type: 'feature',
      title: 'Add reset button',
      description: 'Allow users to reset the counter to zero',
      code: '<button onClick={() => setCount(0)}>Reset</button>',
      line: 12
    }
  ])

  const fileTree: FileNode[] = [
    {
      id: 'src',
      name: 'src',
      type: 'folder',
      children: [
        {
          id: 'app.tsx',
          name: 'App.tsx',
          type: 'file',
          language: 'typescript',
          content: code
        },
        {
          id: 'index.tsx',
          name: 'index.tsx',
          type: 'file',
          language: 'typescript',
          content: 'import React from "react"\nimport ReactDOM from "react-dom"\nimport App from "./App"\n\nReactDOM.render(<App />, document.getElementById("root"))'
        },
        {
          id: 'components',
          name: 'components',
          type: 'folder',
          children: [
            {
              id: 'header.tsx',
              name: 'Header.tsx',
              type: 'file',
              language: 'typescript'
            },
            {
              id: 'button.tsx',
              name: 'Button.tsx',
              type: 'file',
              language: 'typescript'
            }
          ]
        },
        {
          id: 'styles',
          name: 'styles',
          type: 'folder',
          children: [
            {
              id: 'app.css',
              name: 'App.css',
              type: 'file',
              language: 'css'
            }
          ]
        }
      ]
    },
    {
      id: 'public',
      name: 'public',
      type: 'folder',
      children: [
        {
          id: 'index.html',
          name: 'index.html',
          type: 'file',
          language: 'html'
        }
      ]
    },
    {
      id: 'package.json',
      name: 'package.json',
      type: 'file',
      language: 'json'
    }
  ]

  const runCode = () => {
    setIsRunning(true)
    setTerminalOutput(prev => prev + '\n\n$ npm run build\nBuilding for production...\nBuild completed successfully!')
    setTimeout(() => {
      setIsRunning(false)
      setTerminalOutput(prev => prev + '\n\nApplication is running at http://localhost:3000')
    }, 2000)
  }

  const generateCode = () => {
    const newCode = `import React, { useState, useCallback } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  const handleIncrement = useCallback(() => setCount(c => c + 1), [])
  const handleDecrement = useCallback(() => setCount(c => c - 1), [])
  const handleReset = useCallback(() => setCount(0), [])

  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to Your Enhanced App</h1>
        <div className="counter">
          <button onClick={handleDecrement}>-</button>
          <span className="count-display">{count}</span>
          <button onClick={handleIncrement}>+</button>
          <button onClick={handleReset} className="reset-btn">Reset</button>
        </div>
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <div className="features">
          <h3>New Features Added:</h3>
          <ul>
            <li>✅ Optimized event handlers with useCallback</li>
            <li>✅ Reset functionality</li>
            <li>✅ Enhanced styling</li>
          </ul>
        </div>
      </header>
    </div>
  )
}

export default App`
    
    setCode(newCode)
    setTerminalOutput(prev => prev + '\n\n🤖 AI: Code enhanced with optimizations and new features!')
  }

  const renderFileTree = (nodes: FileNode[], depth = 0) => {
    return nodes.map(node => (
      <div key={node.id} style={{ marginLeft: depth * 16 }}>
        <div 
          className={`flex items-center space-x-2 px-2 py-1 rounded cursor-pointer transition-colors ${
            activeFile === node.id ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-700'
          }`}
          onClick={() => node.type === 'file' && setActiveFile(node.id)}
        >
          {node.type === 'folder' ? (
            <Folder className="h-4 w-4 text-blue-400" />
          ) : (
            <FileText className="h-4 w-4 text-slate-400" />
          )}
          <span className="text-sm">{node.name}</span>
        </div>
        {node.children && renderFileTree(node.children, depth + 1)}
      </div>
    ))
  }

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'optimization': return <Zap className="h-4 w-4 text-yellow-400" />
      case 'bug-fix': return <Bug className="h-4 w-4 text-red-400" />
      case 'feature': return <Sparkles className="h-4 w-4 text-blue-400" />
      case 'refactor': return <RefreshCw className="h-4 w-4 text-purple-400" />
      default: return <Code className="h-4 w-4 text-slate-400" />
    }
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
              <Code className="h-6 w-6 text-emerald-400" />
              <h1 className="text-xl font-bold text-white">Code Workspace</h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Run Controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={runCode}
                disabled={isRunning}
                className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                {isRunning ? (
                  <Square className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                <span>{isRunning ? 'Running...' : 'Run'}</span>
              </button>
              
              <button
                onClick={generateCode}
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg transition-all"
              >
                <Sparkles className="h-4 w-4" />
                <span>AI Enhance</span>
              </button>
            </div>

            {/* View Controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className={`p-2 rounded-lg transition-colors ${
                  showPreview ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {showPreview ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </button>
              <button
                onClick={() => setShowTerminal(!showTerminal)}
                className={`p-2 rounded-lg transition-colors ${
                  showTerminal ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                <Terminal className="h-4 w-4" />
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <button className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 hover:text-white transition-colors">
                <Save className="h-4 w-4" />
              </button>
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
        {/* Left Sidebar - File Explorer */}
        <div className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
          <div className="p-4 border-b border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">Explorer</h3>
              <button className="p-1 text-slate-400 hover:text-white transition-colors">
                <Search className="h-4 w-4" />
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search files..."
                className="w-full bg-slate-700 border border-slate-600 rounded-lg pl-10 pr-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto">
            {renderFileTree(fileTree)}
          </div>

          {/* Git Status */}
          <div className="p-4 border-t border-slate-700">
            <div className="flex items-center space-x-2 mb-3">
              <GitBranch className="h-4 w-4 text-emerald-400" />
              <span className="text-sm font-medium text-slate-300">main</span>
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex items-center space-x-2 text-emerald-400">
                <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                <span>2 files modified</span>
              </div>
              <div className="flex items-center space-x-2 text-blue-400">
                <div className="w-2 h-2 bg-blue-400 rounded-full" />
                <span>1 file added</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Editor Tabs */}
          <div className="bg-slate-800 border-b border-slate-700 px-4 py-2 flex items-center space-x-1">
            <div className="flex items-center space-x-2 bg-slate-700 px-3 py-1 rounded-lg">
              <FileText className="h-4 w-4 text-emerald-400" />
              <span className="text-sm text-white">App.tsx</span>
              <button className="text-slate-400 hover:text-white">
                <span className="text-xs">×</span>
              </button>
            </div>
          </div>

          <div className="flex-1 flex">
            {/* Code Editor */}
            <div className={`${showPreview ? 'w-1/2' : 'w-full'} flex flex-col`}>
              <div className="flex-1 bg-slate-900 p-4">
                <div className="bg-slate-800 rounded-lg h-full">
                  <div className="flex items-center justify-between p-3 border-b border-slate-700">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-3 h-3 bg-red-500 rounded-full" />
                        <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                        <div className="w-3 h-3 bg-green-500 rounded-full" />
                      </div>
                      <span className="text-slate-400 text-sm ml-2">App.tsx</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="text-slate-400 hover:text-white transition-colors">
                        <Copy className="h-4 w-4" />
                      </button>
                      <button className="text-slate-400 hover:text-white transition-colors">
                        <Settings className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <textarea
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="w-full h-96 bg-transparent text-slate-300 font-mono text-sm resize-none focus:outline-none"
                      style={{ fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Panel */}
            {showPreview && (
              <div className="w-1/2 border-l border-slate-700 flex flex-col">
                <div className="bg-slate-800 p-3 border-b border-slate-700">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-300">Live Preview</h3>
                    <div className="flex items-center space-x-2">
                      <button className="text-slate-400 hover:text-white transition-colors">
                        <RotateCcw className="h-4 w-4" />
                      </button>
                      <button className="text-slate-400 hover:text-white transition-colors">
                        <Settings className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex-1 bg-white">
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <h1 className="text-2xl font-bold text-slate-800 mb-4">Welcome to Your App</h1>
                      <div className="flex items-center space-x-4 justify-center mb-4">
                        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">-</button>
                        <span className="text-xl font-mono">0</span>
                        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">+</button>
                      </div>
                      <p className="text-slate-600">
                        Edit <code className="bg-slate-100 px-2 py-1 rounded">src/App.tsx</code> and save to reload.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Terminal */}
          {showTerminal && (
            <div className="h-48 bg-slate-900 border-t border-slate-700">
              <div className="bg-slate-800 px-4 py-2 border-b border-slate-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-300">Terminal</h3>
                  <button 
                    onClick={() => setTerminalOutput('')}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </div>
              <div className="p-4 h-full overflow-y-auto">
                <pre className="text-slate-300 font-mono text-sm whitespace-pre-wrap">
                  {terminalOutput}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar - AI Suggestions */}
        <div className="w-80 bg-slate-800 border-l border-slate-700 flex flex-col">
          <div className="p-4 border-b border-slate-700">
            <h3 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wide flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-400" />
              AI Assistant
            </h3>
            <div className="space-y-2">
              <button 
                onClick={generateCode}
                className="w-full p-3 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 rounded-lg text-white text-sm font-medium transition-all flex items-center gap-2"
              >
                <Zap className="h-4 w-4" />
                Optimize Code
              </button>
              <button className="w-full p-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 text-sm font-medium transition-colors flex items-center gap-2">
                <Bug className="h-4 w-4" />
                Find Issues
              </button>
              <button className="w-full p-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 text-sm font-medium transition-colors flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Generate Docs
              </button>
            </div>
          </div>

          {/* Code Suggestions */}
          <div className="flex-1 p-4 overflow-y-auto">
            <h3 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wide">Suggestions</h3>
            <div className="space-y-3">
              {aiSuggestions.map((suggestion) => (
                <div key={suggestion.id} className="bg-slate-700/50 rounded-lg p-3">
                  <div className="flex items-start space-x-2 mb-2">
                    {getSuggestionIcon(suggestion.type)}
                    <div className="flex-1">
                      <h4 className="text-slate-300 font-medium text-sm">{suggestion.title}</h4>
                      <p className="text-slate-400 text-xs mt-1">{suggestion.description}</p>
                    </div>
                  </div>
                  <div className="bg-slate-800 rounded p-2 mt-2">
                    <code className="text-emerald-400 text-xs font-mono">{suggestion.code}</code>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-slate-500 text-xs">Line {suggestion.line}</span>
                    <button className="text-emerald-400 hover:text-emerald-300 text-xs font-medium transition-colors">
                      Apply
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Code Stats */}
          <div className="p-4 border-t border-slate-700">
            <h3 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wide">Code Stats</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-slate-400">
                <span>Lines of Code</span>
                <span className="text-white">247</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Functions</span>
                <span className="text-white">12</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Components</span>
                <span className="text-white">5</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Test Coverage</span>
                <span className="text-emerald-400">87%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}