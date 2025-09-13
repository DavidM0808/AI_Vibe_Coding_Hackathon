import { useState, useEffect } from 'react'
import { ArrowLeft, Activity, Cpu, MemoryStick, HardDrive, Wifi, Zap, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Clock, Target, BarChart3, LineChart, PieChart, Settings, Download, RefreshCw, Play, Pause } from 'lucide-react'
import { Link } from 'react-router-dom'

interface PerformanceMetric {
  id: string
  name: string
  value: number
  unit: string
  status: 'good' | 'warning' | 'critical'
  trend: 'up' | 'down' | 'stable'
  change: number
  threshold: {
    warning: number
    critical: number
  }
}

interface SystemResource {
  id: string
  name: string
  usage: number
  available: number
  total: number
  processes: Array<{
    name: string
    usage: number
    pid: number
  }>
}

interface PerformanceTest {
  id: string
  name: string
  type: 'load' | 'stress' | 'endurance' | 'spike' | 'volume'
  status: 'idle' | 'running' | 'completed' | 'failed'
  duration: number
  results?: {
    avgResponseTime: number
    maxResponseTime: number
    throughput: number
    errorRate: number
    score: number
  }
}

interface NetworkMetric {
  latency: number
  bandwidth: number
  packetLoss: number
  connections: number
}

export default function PerformanceMonitor() {
  const [isMonitoring, setIsMonitoring] = useState(true)
  const [selectedTimeRange, setSelectedTimeRange] = useState('1h')
  const [coreSpeedConnected, setCoreSpeedConnected] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [selectedMetric, setSelectedMetric] = useState<string>('overview')

  const [metrics] = useState<PerformanceMetric[]>([
    {
      id: 'response-time',
      name: 'Response Time',
      value: 245,
      unit: 'ms',
      status: 'good',
      trend: 'down',
      change: -12,
      threshold: { warning: 500, critical: 1000 }
    },
    {
      id: 'throughput',
      name: 'Throughput',
      value: 1247,
      unit: 'req/s',
      status: 'good',
      trend: 'up',
      change: 8,
      threshold: { warning: 800, critical: 500 }
    },
    {
      id: 'error-rate',
      name: 'Error Rate',
      value: 0.8,
      unit: '%',
      status: 'good',
      trend: 'stable',
      change: 0,
      threshold: { warning: 2, critical: 5 }
    },
    {
      id: 'availability',
      name: 'Availability',
      value: 99.97,
      unit: '%',
      status: 'good',
      trend: 'stable',
      change: 0,
      threshold: { warning: 99.5, critical: 99 }
    },
    {
      id: 'load-time',
      name: 'Page Load Time',
      value: 1.2,
      unit: 's',
      status: 'warning',
      trend: 'up',
      change: 15,
      threshold: { warning: 1.5, critical: 3 }
    },
    {
      id: 'memory-usage',
      name: 'Memory Usage',
      value: 68,
      unit: '%',
      status: 'warning',
      trend: 'up',
      change: 5,
      threshold: { warning: 70, critical: 85 }
    }
  ])

  const [systemResources] = useState<SystemResource[]>([
    {
      id: 'cpu',
      name: 'CPU',
      usage: 45,
      available: 55,
      total: 100,
      processes: [
        { name: 'node', usage: 25, pid: 1234 },
        { name: 'chrome', usage: 15, pid: 5678 },
        { name: 'vscode', usage: 5, pid: 9012 }
      ]
    },
    {
      id: 'memory',
      name: 'Memory',
      usage: 12.8,
      available: 3.2,
      total: 16,
      processes: [
        { name: 'node', usage: 4.2, pid: 1234 },
        { name: 'chrome', usage: 6.1, pid: 5678 },
        { name: 'vscode', usage: 2.5, pid: 9012 }
      ]
    },
    {
      id: 'disk',
      name: 'Disk I/O',
      usage: 234,
      available: 766,
      total: 1000,
      processes: [
        { name: 'node', usage: 120, pid: 1234 },
        { name: 'postgres', usage: 89, pid: 3456 },
        { name: 'system', usage: 25, pid: 0 }
      ]
    }
  ])

  const [performanceTests] = useState<PerformanceTest[]>([
    {
      id: 'load-test-1',
      name: 'API Load Test',
      type: 'load',
      status: 'completed',
      duration: 300,
      results: {
        avgResponseTime: 245,
        maxResponseTime: 890,
        throughput: 1247,
        errorRate: 0.8,
        score: 92
      }
    },
    {
      id: 'stress-test-1',
      name: 'Database Stress Test',
      type: 'stress',
      status: 'running',
      duration: 180
    },
    {
      id: 'endurance-test-1',
      name: 'Frontend Endurance Test',
      type: 'endurance',
      status: 'idle',
      duration: 0
    }
  ])

  const [networkMetrics] = useState<NetworkMetric>({
    latency: 23,
    bandwidth: 847,
    packetLoss: 0.1,
    connections: 156
  })

  const connectCoreSpeed = () => {
    setCoreSpeedConnected(true)
    setTimeout(() => {
      alert('Connected to CoreSpeed! Advanced performance analytics are now available.')
    }, 1000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-emerald-400'
      case 'warning': return 'text-yellow-400'
      case 'critical': return 'text-red-400'
      default: return 'text-slate-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <CheckCircle className="h-4 w-4 text-emerald-400" />
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-400" />
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-400" />
      default: return <Clock className="h-4 w-4 text-slate-400" />
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3 text-emerald-400" />
      case 'down': return <TrendingDown className="h-3 w-3 text-red-400" />
      default: return <div className="h-3 w-3 bg-slate-400 rounded-full" />
    }
  }

  const getTestStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-emerald-400'
      case 'running': return 'text-blue-400'
      case 'failed': return 'text-red-400'
      default: return 'text-slate-400'
    }
  }

  const getTestTypeIcon = (type: string) => {
    switch (type) {
      case 'load': return <BarChart3 className="h-4 w-4 text-blue-400" />
      case 'stress': return <Zap className="h-4 w-4 text-yellow-400" />
      case 'endurance': return <Clock className="h-4 w-4 text-purple-400" />
      case 'spike': return <TrendingUp className="h-4 w-4 text-orange-400" />
      case 'volume': return <PieChart className="h-4 w-4 text-emerald-400" />
      default: return <Activity className="h-4 w-4 text-slate-400" />
    }
  }

  const getResourceIcon = (id: string) => {
    switch (id) {
      case 'cpu': return <Cpu className="h-5 w-5 text-blue-400" />
      case 'memory': return <MemoryStick className="h-5 w-5 text-purple-400" />
      case 'disk': return <HardDrive className="h-5 w-5 text-emerald-400" />
      default: return <Activity className="h-5 w-5 text-slate-400" />
    }
  }

  const getUsageColor = (usage: number, total: number) => {
    const percentage = (usage / total) * 100
    if (percentage >= 85) return 'text-red-400'
    if (percentage >= 70) return 'text-yellow-400'
    return 'text-emerald-400'
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
              <Activity className="h-6 w-6 text-emerald-400" />
              <h1 className="text-xl font-bold text-white">Performance Monitor</h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* CoreSpeed Integration */}
            <button
              onClick={connectCoreSpeed}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                coreSpeedConnected 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              <Zap className="h-4 w-4" />
              <span>{coreSpeedConnected ? 'CoreSpeed Connected' : 'Connect CoreSpeed'}</span>
            </button>

            {/* Time Range Selector */}
            <select 
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="bg-slate-700 text-slate-300 border border-slate-600 rounded-lg px-3 py-2 text-sm"
            >
              <option value="5m">Last 5 minutes</option>
              <option value="1h">Last hour</option>
              <option value="24h">Last 24 hours</option>
              <option value="7d">Last 7 days</option>
            </select>

            {/* Auto Refresh Toggle */}
            <label className="flex items-center space-x-2 text-slate-300">
              <input 
                type="checkbox" 
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Auto-refresh</span>
            </label>

            {/* Monitor Toggle */}
            <button
              onClick={() => setIsMonitoring(!isMonitoring)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                isMonitoring 
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                  : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
              }`}
            >
              {isMonitoring ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              <span>{isMonitoring ? 'Monitoring' : 'Paused'}</span>
            </button>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <button className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 hover:text-white transition-colors">
                <RefreshCw className="h-4 w-4" />
              </button>
              <button className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 hover:text-white transition-colors">
                <Download className="h-4 w-4" />
              </button>
              <button className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 hover:text-white transition-colors">
                <Settings className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Left Sidebar - Navigation */}
        <div className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
          <div className="p-4">
            <h3 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wide">Monitoring</h3>
            <div className="space-y-1">
              {[
                { id: 'overview', name: 'Overview', icon: Activity },
                { id: 'metrics', name: 'Metrics', icon: BarChart3 },
                { id: 'resources', name: 'System Resources', icon: Cpu },
                { id: 'network', name: 'Network', icon: Wifi },
                { id: 'tests', name: 'Performance Tests', icon: Target }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedMetric(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedMetric === item.id
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* System Status */}
          <div className="p-4 border-t border-slate-700">
            <h3 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wide">System Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-sm">Overall Health</span>
                <div className="flex items-center space-x-1">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  <span className="text-emerald-400 text-sm font-medium">Good</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-sm">Uptime</span>
                <span className="text-white text-sm font-medium">99.97%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-sm">Active Alerts</span>
                <span className="text-yellow-400 text-sm font-medium">2</span>
              </div>
            </div>
          </div>

          {/* CoreSpeed AI */}
          {coreSpeedConnected && (
            <div className="p-4 border-t border-slate-700">
              <h3 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wide flex items-center gap-2">
                <Zap className="h-4 w-4 text-emerald-400" />
                CoreSpeed AI
              </h3>
              <div className="space-y-2">
                <button className="w-full p-3 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 rounded-lg text-white text-sm font-medium transition-all flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Optimize Performance
                </button>
                <button className="w-full p-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 text-sm font-medium transition-colors flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Predict Issues
                </button>
                <button className="w-full p-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 text-sm font-medium transition-colors flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Generate Report
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {selectedMetric === 'overview' && (
              <div className="space-y-6">
                {/* Key Metrics Grid */}
                <div>
                  <h2 className="text-lg font-semibold text-white mb-4">Key Performance Metrics</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {metrics.slice(0, 6).map((metric) => (
                      <div key={metric.id} className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-slate-300 text-sm font-medium">{metric.name}</h3>
                          {getStatusIcon(metric.status)}
                        </div>
                        <div className="flex items-end justify-between">
                          <div>
                            <div className={`text-2xl font-bold ${getStatusColor(metric.status)}`}>
                              {metric.value}{metric.unit}
                            </div>
                            <div className="flex items-center space-x-1 mt-1">
                              {getTrendIcon(metric.trend)}
                              <span className={`text-xs ${
                                metric.change > 0 ? 'text-emerald-400' : 
                                metric.change < 0 ? 'text-red-400' : 'text-slate-400'
                              }`}>
                                {metric.change > 0 ? '+' : ''}{metric.change}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* System Resources */}
                <div>
                  <h2 className="text-lg font-semibold text-white mb-4">System Resources</h2>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {systemResources.map((resource) => (
                      <div key={resource.id} className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                        <div className="flex items-center space-x-3 mb-3">
                          {getResourceIcon(resource.id)}
                          <h3 className="text-white font-medium">{resource.name}</h3>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Usage</span>
                            <span className={getUsageColor(resource.usage, resource.total)}>
                              {resource.id === 'memory' ? `${resource.usage.toFixed(1)} GB` : 
                               resource.id === 'disk' ? `${resource.usage} MB/s` :
                               `${resource.usage}%`}
                            </span>
                          </div>
                          <div className="w-full bg-slate-700 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                (resource.usage / resource.total) * 100 >= 85 ? 'bg-red-500' :
                                (resource.usage / resource.total) * 100 >= 70 ? 'bg-yellow-500' :
                                'bg-emerald-500'
                              }`}
                              style={{ width: `${(resource.usage / resource.total) * 100}%` }}
                            />
                          </div>
                          <div className="text-xs text-slate-500">
                            {resource.id === 'memory' ? 
                              `${resource.available.toFixed(1)} GB available of ${resource.total} GB` :
                              resource.id === 'disk' ?
                              `${resource.available} MB/s available` :
                              `${resource.available}% available`
                            }
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Performance Tests */}
                <div>
                  <h2 className="text-lg font-semibold text-white mb-4">Recent Performance Tests</h2>
                  <div className="bg-slate-800 rounded-lg border border-slate-700">
                    <div className="divide-y divide-slate-700">
                      {performanceTests.map((test) => (
                        <div key={test.id} className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              {getTestTypeIcon(test.type)}
                              <div>
                                <h3 className="text-white font-medium">{test.name}</h3>
                                <p className="text-slate-400 text-sm capitalize">{test.type} test</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className={`text-sm font-medium ${getTestStatusColor(test.status)}`}>
                                {test.status}
                              </div>
                              <div className="text-slate-400 text-sm">
                                {test.duration > 0 ? `${test.duration}s` : 'Not started'}
                              </div>
                            </div>
                          </div>
                          {test.results && (
                            <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
                              <div className="bg-slate-700/50 rounded p-2">
                                <div className="text-slate-400 text-xs">Avg Response</div>
                                <div className="text-white font-medium">{test.results.avgResponseTime}ms</div>
                              </div>
                              <div className="bg-slate-700/50 rounded p-2">
                                <div className="text-slate-400 text-xs">Throughput</div>
                                <div className="text-white font-medium">{test.results.throughput} req/s</div>
                              </div>
                              <div className="bg-slate-700/50 rounded p-2">
                                <div className="text-slate-400 text-xs">Error Rate</div>
                                <div className="text-white font-medium">{test.results.errorRate}%</div>
                              </div>
                              <div className="bg-slate-700/50 rounded p-2">
                                <div className="text-slate-400 text-xs">Score</div>
                                <div className="text-emerald-400 font-medium">{test.results.score}/100</div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedMetric === 'metrics' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-white">Performance Metrics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {metrics.map((metric) => (
                    <div key={metric.id} className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white font-medium">{metric.name}</h3>
                        {getStatusIcon(metric.status)}
                      </div>
                      <div className={`text-3xl font-bold mb-2 ${getStatusColor(metric.status)}`}>
                        {metric.value}{metric.unit}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          {getTrendIcon(metric.trend)}
                          <span className={`text-sm ${
                            metric.change > 0 ? 'text-emerald-400' : 
                            metric.change < 0 ? 'text-red-400' : 'text-slate-400'
                          }`}>
                            {metric.change > 0 ? '+' : ''}{metric.change}% from last period
                          </span>
                        </div>
                      </div>
                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Warning threshold</span>
                          <span className="text-yellow-400">{metric.threshold.warning}{metric.unit}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Critical threshold</span>
                          <span className="text-red-400">{metric.threshold.critical}{metric.unit}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedMetric === 'network' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-white">Network Performance</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                    <div className="flex items-center space-x-2 mb-2">
                      <Wifi className="h-5 w-5 text-blue-400" />
                      <h3 className="text-slate-300 font-medium">Latency</h3>
                    </div>
                    <div className="text-2xl font-bold text-emerald-400">{networkMetrics.latency}ms</div>
                    <div className="text-slate-400 text-sm">Average response time</div>
                  </div>
                  <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingUp className="h-5 w-5 text-purple-400" />
                      <h3 className="text-slate-300 font-medium">Bandwidth</h3>
                    </div>
                    <div className="text-2xl font-bold text-emerald-400">{networkMetrics.bandwidth} Mbps</div>
                    <div className="text-slate-400 text-sm">Current throughput</div>
                  </div>
                  <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-400" />
                      <h3 className="text-slate-300 font-medium">Packet Loss</h3>
                    </div>
                    <div className="text-2xl font-bold text-emerald-400">{networkMetrics.packetLoss}%</div>
                    <div className="text-slate-400 text-sm">Data transmission loss</div>
                  </div>
                  <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                    <div className="flex items-center space-x-2 mb-2">
                      <Target className="h-5 w-5 text-emerald-400" />
                      <h3 className="text-slate-300 font-medium">Connections</h3>
                    </div>
                    <div className="text-2xl font-bold text-emerald-400">{networkMetrics.connections}</div>
                    <div className="text-slate-400 text-sm">Active connections</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}