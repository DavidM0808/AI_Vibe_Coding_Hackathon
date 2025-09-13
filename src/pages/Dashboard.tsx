import { useState, useEffect } from 'react'
import { Plus, Play, Pause, Square, Activity, Cpu, MemoryStick, Clock, Users, Code, TestTube, BarChart3, Presentation, Zap, Sparkles, ArrowRight, Settings, Bell, Search } from 'lucide-react'
import { Link } from 'react-router-dom'

interface Project {
  id: string
  name: string
  description: string
  status: 'active' | 'paused' | 'completed' | 'error'
  progress: number
  created_at: string
  agents_active: number
  last_activity: string
}

interface AgentStatus {
  id: string
  name: string
  type: 'design' | 'code' | 'test' | 'performance' | 'pitch' | 'speed'
  status: 'idle' | 'running' | 'error'
  current_task: string
  progress: number
  cpu_usage: number
  memory_usage: number
}

interface SystemMetrics {
  total_projects: number
  active_agents: number
  cpu_usage: number
  memory_usage: number
  uptime: string
}

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'E-commerce Platform',
      description: 'Modern online store with AI recommendations',
      status: 'active',
      progress: 65,
      created_at: '2024-01-15',
      agents_active: 3,
      last_activity: '2 minutes ago'
    },
    {
      id: '2',
      name: 'Task Management App',
      description: 'Collaborative project management tool',
      status: 'paused',
      progress: 40,
      created_at: '2024-01-10',
      agents_active: 0,
      last_activity: '1 hour ago'
    },
    {
      id: '3',
      name: 'Analytics Dashboard',
      description: 'Real-time data visualization platform',
      status: 'completed',
      progress: 100,
      created_at: '2024-01-05',
      agents_active: 0,
      last_activity: '3 days ago'
    }
  ])

  const [agents, setAgents] = useState<AgentStatus[]>([
    {
      id: '1',
      name: 'Design Agent',
      type: 'design',
      status: 'running',
      current_task: 'Creating responsive layouts for product pages',
      progress: 75,
      cpu_usage: 45,
      memory_usage: 32
    },
    {
      id: '2',
      name: 'Code Agent',
      type: 'code',
      status: 'running',
      current_task: 'Implementing payment gateway integration',
      progress: 60,
      cpu_usage: 68,
      memory_usage: 55
    },
    {
      id: '3',
      name: 'Test Agent',
      type: 'test',
      status: 'running',
      current_task: 'Running E2E tests for checkout flow',
      progress: 30,
      cpu_usage: 25,
      memory_usage: 28
    },
    {
      id: '4',
      name: 'Performance Agent',
      type: 'performance',
      status: 'idle',
      current_task: 'Waiting for code completion',
      progress: 0,
      cpu_usage: 5,
      memory_usage: 12
    },
    {
      id: '5',
      name: 'Pitch Agent',
      type: 'pitch',
      status: 'idle',
      current_task: 'Ready to generate presentation',
      progress: 0,
      cpu_usage: 3,
      memory_usage: 8
    },
    {
      id: '6',
      name: 'Speed Agent',
      type: 'speed',
      status: 'running',
      current_task: 'Orchestrating multi-agent workflow',
      progress: 85,
      cpu_usage: 15,
      memory_usage: 18
    }
  ])

  const [systemMetrics] = useState<SystemMetrics>({
    total_projects: 12,
    active_agents: 4,
    cpu_usage: 42,
    memory_usage: 38,
    uptime: '7d 14h 32m'
  })

  const getAgentIcon = (type: string) => {
    switch (type) {
      case 'design': return <Sparkles className="h-5 w-5" />
      case 'code': return <Code className="h-5 w-5" />
      case 'test': return <TestTube className="h-5 w-5" />
      case 'performance': return <BarChart3 className="h-5 w-5" />
      case 'pitch': return <Presentation className="h-5 w-5" />
      case 'speed': return <Zap className="h-5 w-5" />
      default: return <Activity className="h-5 w-5" />
    }
  }

  const getAgentColor = (type: string) => {
    switch (type) {
      case 'design': return 'text-blue-400 bg-blue-500/20'
      case 'code': return 'text-emerald-400 bg-emerald-500/20'
      case 'test': return 'text-purple-400 bg-purple-500/20'
      case 'performance': return 'text-orange-400 bg-orange-500/20'
      case 'pitch': return 'text-pink-400 bg-pink-500/20'
      case 'speed': return 'text-yellow-400 bg-yellow-500/20'
      default: return 'text-slate-400 bg-slate-500/20'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'running': return 'text-emerald-400 bg-emerald-500/20'
      case 'paused':
      case 'idle': return 'text-yellow-400 bg-yellow-500/20'
      case 'completed': return 'text-blue-400 bg-blue-500/20'
      case 'error': return 'text-red-400 bg-red-500/20'
      default: return 'text-slate-400 bg-slate-500/20'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900">
      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2">
                <Sparkles className="h-8 w-8 text-emerald-400" />
                <span className="text-2xl font-bold text-white">IdeaToApp</span>
              </Link>
              <div className="hidden md:flex items-center space-x-1 bg-slate-800/50 rounded-lg p-1">
                <button className="px-3 py-2 bg-emerald-600 text-white rounded-md text-sm font-medium">
                  Dashboard
                </button>
                <Link to="/idea-input" className="px-3 py-2 text-slate-300 hover:text-white rounded-md text-sm font-medium transition-colors">
                  New Project
                </Link>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search projects..."
                  className="bg-slate-800/50 border border-slate-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 w-64"
                />
              </div>
              <button className="p-2 text-slate-400 hover:text-white transition-colors">
                <Bell className="h-5 w-5" />
              </button>
              <button className="p-2 text-slate-400 hover:text-white transition-colors">
                <Settings className="h-5 w-5" />
              </button>
              <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">U</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* System Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <Users className="h-6 w-6 text-emerald-400" />
              </div>
              <span className="text-2xl font-bold text-white">{systemMetrics.total_projects}</span>
            </div>
            <h3 className="text-slate-300 text-sm font-medium">Total Projects</h3>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Activity className="h-6 w-6 text-blue-400" />
              </div>
              <span className="text-2xl font-bold text-white">{systemMetrics.active_agents}</span>
            </div>
            <h3 className="text-slate-300 text-sm font-medium">Active Agents</h3>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <Cpu className="h-6 w-6 text-orange-400" />
              </div>
              <span className="text-2xl font-bold text-white">{systemMetrics.cpu_usage}%</span>
            </div>
            <h3 className="text-slate-300 text-sm font-medium">CPU Usage</h3>
            <div className="mt-2 bg-slate-700 rounded-full h-2">
              <div 
                className="bg-orange-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${systemMetrics.cpu_usage}%` }}
              />
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <MemoryStick className="h-6 w-6 text-purple-400" />
              </div>
              <span className="text-2xl font-bold text-white">{systemMetrics.memory_usage}%</span>
            </div>
            <h3 className="text-slate-300 text-sm font-medium">Memory Usage</h3>
            <div className="mt-2 bg-slate-700 rounded-full h-2">
              <div 
                className="bg-purple-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${systemMetrics.memory_usage}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Projects Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Projects</h2>
              <Link 
                to="/idea-input"
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Plus className="h-4 w-4" />
                New Project
              </Link>
            </div>

            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id} className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">{project.name}</h3>
                      <p className="text-slate-400 text-sm mb-3">{project.description}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-slate-400">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {project.last_activity}
                        </div>
                        <div className="flex items-center gap-1">
                          <Activity className="h-4 w-4" />
                          {project.agents_active} agents active
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-slate-400">Progress</span>
                      <span className="text-white font-medium">{project.progress}%</span>
                    </div>
                    <div className="bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-emerald-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {project.status === 'active' ? (
                        <button className="p-2 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition-colors">
                          <Pause className="h-4 w-4" />
                        </button>
                      ) : (
                        <button className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors">
                          <Play className="h-4 w-4" />
                        </button>
                      )}
                      <button className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors">
                        <Square className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <Link 
                      to={`/project/${project.id}`}
                      className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors"
                    >
                      View Details
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Agent Monitoring Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Agent Status</h2>
            
            <div className="space-y-4">
              {agents.map((agent) => (
                <div key={agent.id} className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${getAgentColor(agent.type)}`}>
                        {getAgentIcon(agent.type)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{agent.name}</h3>
                        <p className="text-slate-400 text-sm">{agent.current_task}</p>
                      </div>
                    </div>
                    
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(agent.status)}`}>
                      {agent.status}
                    </span>
                  </div>
                  
                  {agent.status === 'running' && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-slate-400">Progress</span>
                        <span className="text-white font-medium">{agent.progress}%</span>
                      </div>
                      <div className="bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-emerald-400 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${agent.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-slate-400">CPU</span>
                        <span className="text-white">{agent.cpu_usage}%</span>
                      </div>
                      <div className="bg-slate-700 rounded-full h-1.5">
                        <div 
                          className="bg-orange-400 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${agent.cpu_usage}%` }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-slate-400">Memory</span>
                        <span className="text-white">{agent.memory_usage}%</span>
                      </div>
                      <div className="bg-slate-700 rounded-full h-1.5">
                        <div 
                          className="bg-purple-400 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${agent.memory_usage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}