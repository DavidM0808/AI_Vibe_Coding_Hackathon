import React, { useState, useMemo } from 'react'
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Settings, 
  Filter, 
  Search, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Bug,
  Shield,
  Zap,
  FileText,
  RefreshCw,
  ChevronDown,
  ChevronRight
} from 'lucide-react'

interface Test {
  id: string
  name: string
  description: string
  status: 'passed' | 'failed' | 'running' | 'pending'
  type: 'unit' | 'integration' | 'e2e' | 'performance' | 'security'
  duration: number
  file: string
  coverage?: number
  error?: string
}

interface TestSuite {
  id: string
  name: string
  description: string
  testCount: number
  passedCount: number
  failedCount: number
}

export default function TestingCenter() {
  const [selectedSuite, setSelectedSuite] = useState('all')
  const [selectedTest, setSelectedTest] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showAIPanel, setShowAIPanel] = useState(false)

  // Mock data
  const testSuites: TestSuite[] = [
    {
      id: 'auth',
      name: 'Authentication',
      description: 'User authentication and authorization tests',
      testCount: 12,
      passedCount: 10,
      failedCount: 2
    },
    {
      id: 'api',
      name: 'API Endpoints',
      description: 'Backend API functionality tests',
      testCount: 24,
      passedCount: 22,
      failedCount: 2
    }
  ]

  const tests: Test[] = [
    {
      id: '1',
      name: 'User Login Flow',
      description: 'Test user authentication with valid credentials',
      status: 'passed',
      type: 'e2e',
      duration: 2.3,
      file: 'tests/auth/login.spec.ts',
      coverage: 95
    },
    {
      id: '2',
      name: 'Password Validation',
      description: 'Test password strength validation',
      status: 'failed',
      type: 'unit',
      duration: 0.8,
      file: 'tests/auth/password.test.ts',
      coverage: 87,
      error: 'Expected password to be rejected but it was accepted'
    }
  ]

  const filteredTests = useMemo(() => {
    return tests.filter(test => {
      const matchesSearch = test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           test.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = filterStatus === 'all' || test.status === filterStatus
      const matchesType = filterType === 'all' || test.type === filterType
      const matchesSuite = selectedSuite === 'all' || 
                          (selectedSuite === 'auth' && test.file.includes('auth')) ||
                          (selectedSuite === 'api' && test.file.includes('api'))
      
      return matchesSearch && matchesStatus && matchesType && matchesSuite
    })
  }, [tests, searchQuery, filterStatus, filterType, selectedSuite])

  const getStatusIcon = (status: Test['status']) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-4 w-4 text-emerald-400" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-400" />
      case 'running':
        return <Clock className="h-4 w-4 text-blue-400 animate-spin" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-400" />
    }
  }

  const getTypeIcon = (type: Test['type']) => {
    switch (type) {
      case 'unit':
        return <FileText className="h-4 w-4 text-blue-400" />
      case 'integration':
        return <Zap className="h-4 w-4 text-purple-400" />
      case 'e2e':
        return <Play className="h-4 w-4 text-emerald-400" />
      case 'performance':
        return <RotateCcw className="h-4 w-4 text-orange-400" />
      case 'security':
        return <Shield className="h-4 w-4 text-red-400" />
    }
  }

  const getCoverageColor = (coverage: number) => {
    if (coverage >= 90) return 'text-emerald-400'
    if (coverage >= 70) return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Testing Center</h1>
            <p className="text-slate-400 mt-1">Comprehensive test suite powered by TestSprite</p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 hover:text-white transition-colors">
              <Settings className="h-5 w-5" />
            </button>
            <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white font-medium transition-colors flex items-center gap-2">
              <Play className="h-4 w-4" />
              Run All Tests
            </button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Sidebar */}
        <div className="w-80 bg-slate-800 border-r border-slate-700 flex flex-col">
          {/* Test Suites */}
          <div className="p-4 border-b border-slate-700">
            <h3 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wide">Test Suites</h3>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedSuite('all')}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  selectedSuite === 'all'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-300 hover:bg-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">All Tests</span>
                  <span className="text-sm opacity-75">{tests.length}</span>
                </div>
              </button>
              {testSuites.map((suite) => (
                <button
                  key={suite.id}
                  onClick={() => setSelectedSuite(suite.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedSuite === suite.id
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">{suite.name}</span>
                    <span className="text-sm opacity-75">{suite.testCount}</span>
                  </div>
                  <p className="text-xs opacity-75 text-left">{suite.description}</p>
                  <div className="flex items-center space-x-2 mt-2 text-xs">
                    <span className="text-emerald-400">{suite.passedCount} passed</span>
                    <span className="text-red-400">{suite.failedCount} failed</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Filters */}
          <div className="p-4 border-b border-slate-700">
            <h3 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wide">Filters</h3>
            
            {/* Search */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search tests..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="mb-4">
              <label className="block text-slate-400 text-sm mb-2">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full p-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">All Status</option>
                <option value="passed">Passed</option>
                <option value="failed">Failed</option>
                <option value="running">Running</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            {/* Type Filter */}
            <div className="mb-4">
              <label className="block text-slate-400 text-sm mb-2">Type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full p-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">All Types</option>
                <option value="unit">Unit</option>
                <option value="integration">Integration</option>
                <option value="e2e">E2E</option>
                <option value="performance">Performance</option>
                <option value="security">Security</option>
              </select>
            </div>
          </div>

          {/* AI Testing Assistant */}
          <div className="p-4">
            <button
              onClick={() => setShowAIPanel(!showAIPanel)}
              className="w-full p-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg text-white font-medium transition-colors flex items-center gap-2"
            >
              <Zap className="h-4 w-4" />
              AI Testing Assistant
              {showAIPanel ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
            
            {showAIPanel && (
              <div className="mt-3 space-y-2">
                <button className="w-full p-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 text-sm font-medium transition-colors flex items-center gap-2">
                  <Bug className="h-4 w-4" />
                  Find Edge Cases
                </button>
                <button className="w-full p-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 text-sm font-medium transition-colors flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Security Scan
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Main Content - Test Results */}
        <div className="flex-1 flex flex-col">
          {/* Test Results Header */}
          <div className="bg-slate-800 border-b border-slate-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  {selectedSuite === 'all' ? 'All Tests' : testSuites.find(s => s.id === selectedSuite)?.name}
                </h2>
                <p className="text-slate-400 text-sm">
                  {filteredTests.length} tests • {filteredTests.filter(t => t.status === 'passed').length} passed • {filteredTests.filter(t => t.status === 'failed').length} failed
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-white font-medium">
                    {((filteredTests.filter(t => t.status === 'passed').length / filteredTests.length) * 100).toFixed(1)}%
                  </div>
                  <div className="text-slate-400 text-sm">Success Rate</div>
                </div>
                <button className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 hover:text-white transition-colors">
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Test List */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              <div className="space-y-2">
                {filteredTests.map((test) => (
                  <div 
                    key={test.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedTest === test.id
                        ? 'border-emerald-500 bg-emerald-500/10'
                        : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                    }`}
                    onClick={() => setSelectedTest(test.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(test.status)}
                        {getTypeIcon(test.type)}
                        <div>
                          <h3 className="text-white font-medium">{test.name}</h3>
                          <p className="text-slate-400 text-sm">{test.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-slate-300 text-sm">{test.duration}s</div>
                        {test.coverage && (
                          <div className={`text-xs ${getCoverageColor(test.coverage)}`}>
                            {test.coverage}% coverage
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">{test.file}</span>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          test.type === 'unit' ? 'bg-blue-500/20 text-blue-400' :
                          test.type === 'integration' ? 'bg-purple-500/20 text-purple-400' :
                          test.type === 'e2e' ? 'bg-emerald-500/20 text-emerald-400' :
                          test.type === 'performance' ? 'bg-orange-500/20 text-orange-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {test.type}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          test.status === 'passed' ? 'bg-emerald-500/20 text-emerald-400' :
                          test.status === 'failed' ? 'bg-red-500/20 text-red-400' :
                          test.status === 'running' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {test.status}
                        </span>
                      </div>
                    </div>
                    
                    {test.error && (
                      <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                        <div className="flex items-center space-x-2 mb-1">
                          <AlertTriangle className="h-4 w-4 text-red-400" />
                          <span className="text-red-400 font-medium text-sm">Error</span>
                        </div>
                        <p className="text-red-300 text-sm font-mono">{test.error}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Test Details */}
        {selectedTest && (
          <div className="w-96 bg-slate-800 border-l border-slate-700 flex flex-col">
            {(() => {
              const test = filteredTests.find(t => t.id === selectedTest)
              if (!test) return null
              
              return (
                <>
                  <div className="p-4 border-b border-slate-700">
                    <div className="flex items-center space-x-2 mb-3">
                      {getStatusIcon(test.status)}
                      <h3 className="text-lg font-semibold text-white">{test.name}</h3>
                    </div>
                    <p className="text-slate-400 text-sm mb-4">{test.description}</p>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-700/50 rounded-lg p-3">
                        <div className="text-slate-400 text-xs mb-1">Duration</div>
                        <div className="text-white font-medium">{test.duration}s</div>
                      </div>
                      <div className="bg-slate-700/50 rounded-lg p-3">
                        <div className="text-slate-400 text-xs mb-1">Coverage</div>
                        <div className={`font-medium ${getCoverageColor(test.coverage || 0)}`}>
                          {test.coverage || 0}%
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 p-4 overflow-y-auto">
                    <h4 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wide">Test Details</h4>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-slate-400 text-sm mb-1">File</label>
                        <div className="bg-slate-700/50 rounded-lg p-2">
                          <code className="text-emerald-400 text-sm">{test.file}</code>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-slate-400 text-sm mb-1">Type</label>
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(test.type)}
                          <span className="text-white capitalize">{test.type}</span>
                        </div>
                      </div>
                      
                      {test.error && (
                        <div>
                          <label className="block text-slate-400 text-sm mb-1">Error Details</label>
                          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                            <code className="text-red-300 text-sm">{test.error}</code>
                          </div>
                        </div>
                      )}
                      
                      <div>
                        <label className="block text-slate-400 text-sm mb-1">Actions</label>
                        <div className="space-y-2">
                          <button className="w-full p-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white text-sm font-medium transition-colors flex items-center gap-2">
                            <Play className="h-4 w-4" />
                            Run Test
                          </button>
                          <button className="w-full p-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 text-sm font-medium transition-colors flex items-center gap-2">
                            <Bug className="h-4 w-4" />
                            Debug
                          </button>
                          <button className="w-full p-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 text-sm font-medium transition-colors flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            View Code
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )
            })()}
          </div>
        )}
      </div>
    </div>
  )
}