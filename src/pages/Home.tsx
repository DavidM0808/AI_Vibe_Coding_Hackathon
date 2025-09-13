import { ArrowRight, Zap, Code, TestTube, BarChart3, Presentation, Sparkles, CheckCircle, Star } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900">
      {/* Navigation */}
      <nav className="relative z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-8 w-8 text-emerald-400" />
            <span className="text-2xl font-bold text-white">IdeaToApp</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-slate-300 hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="text-slate-300 hover:text-white transition-colors">Pricing</a>
            <a href="#about" className="text-slate-300 hover:text-white transition-colors">About</a>
            <Link to="/dashboard" className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Transform Your
              <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent"> Ideas </span>
              Into Apps
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Harness the power of AI agents to design, code, test, and deploy your applications automatically. 
              From concept to production in minutes, not months.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link 
              to="/dashboard" 
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
            >
              Start Building Now
              <ArrowRight className="h-5 w-5" />
            </Link>
            <button className="border-2 border-slate-600 hover:border-slate-500 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:bg-slate-800">
              Watch Demo
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-3xl font-bold text-emerald-400 mb-2">10x</div>
              <div className="text-slate-300">Faster Development</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-3xl font-bold text-blue-400 mb-2">95%</div>
              <div className="text-slate-300">Code Quality</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-3xl font-bold text-emerald-400 mb-2">24/7</div>
              <div className="text-slate-300">AI Assistance</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Powered by AI Agents
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Each specialized agent handles a different aspect of development, working together seamlessly
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Design Agent */}
            <div className="bg-gradient-to-br from-blue-900/50 to-slate-900/50 rounded-2xl p-8 border border-blue-500/20 hover:border-blue-400/40 transition-all">
              <div className="bg-blue-500/20 rounded-xl p-3 w-fit mb-6">
                <Sparkles className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Design Agent</h3>
              <p className="text-slate-300 mb-6">
                Creates beautiful, responsive designs with Figma integration and design system compliance
              </p>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  Auto-generated wireframes
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  Responsive layouts
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  Brand consistency
                </li>
              </ul>
            </div>

            {/* Code Agent */}
            <div className="bg-gradient-to-br from-emerald-900/50 to-slate-900/50 rounded-2xl p-8 border border-emerald-500/20 hover:border-emerald-400/40 transition-all">
              <div className="bg-emerald-500/20 rounded-xl p-3 w-fit mb-6">
                <Code className="h-8 w-8 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Code Agent</h3>
              <p className="text-slate-300 mb-6">
                Generates clean, production-ready code with best practices and modern frameworks
              </p>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  TypeScript & React
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  API integration
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  Security best practices
                </li>
              </ul>
            </div>

            {/* Test Agent */}
            <div className="bg-gradient-to-br from-purple-900/50 to-slate-900/50 rounded-2xl p-8 border border-purple-500/20 hover:border-purple-400/40 transition-all">
              <div className="bg-purple-500/20 rounded-xl p-3 w-fit mb-6">
                <TestTube className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Test Agent</h3>
              <p className="text-slate-300 mb-6">
                Comprehensive testing with TestSprite integration for quality assurance
              </p>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  Unit & integration tests
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  E2E testing
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  Performance testing
                </li>
              </ul>
            </div>

            {/* Performance Agent */}
            <div className="bg-gradient-to-br from-orange-900/50 to-slate-900/50 rounded-2xl p-8 border border-orange-500/20 hover:border-orange-400/40 transition-all">
              <div className="bg-orange-500/20 rounded-xl p-3 w-fit mb-6">
                <BarChart3 className="h-8 w-8 text-orange-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Performance Agent</h3>
              <p className="text-slate-300 mb-6">
                Monitors and optimizes application performance with CoreSpeed analytics
              </p>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  Real-time monitoring
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  Performance insights
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  Auto-optimization
                </li>
              </ul>
            </div>

            {/* Pitch Agent */}
            <div className="bg-gradient-to-br from-pink-900/50 to-slate-900/50 rounded-2xl p-8 border border-pink-500/20 hover:border-pink-400/40 transition-all">
              <div className="bg-pink-500/20 rounded-xl p-3 w-fit mb-6">
                <Presentation className="h-8 w-8 text-pink-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Pitch Agent</h3>
              <p className="text-slate-300 mb-6">
                Creates compelling presentations with DeckSpeed integration for stakeholders
              </p>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  Auto-generated decks
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  Market analysis
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  ROI projections
                </li>
              </ul>
            </div>

            {/* Speed Agent */}
            <div className="bg-gradient-to-br from-yellow-900/50 to-slate-900/50 rounded-2xl p-8 border border-yellow-500/20 hover:border-yellow-400/40 transition-all">
              <div className="bg-yellow-500/20 rounded-xl p-3 w-fit mb-6">
                <Zap className="h-8 w-8 text-yellow-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Speed Agent</h3>
              <p className="text-slate-300 mb-6">
                Orchestrates all agents for maximum efficiency and rapid development cycles
              </p>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  Multi-agent coordination
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  Parallel processing
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  Smart prioritization
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Choose the plan that fits your development needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Starter Plan */}
            <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Starter</h3>
                <div className="text-4xl font-bold text-white mb-2">
                  $29<span className="text-lg text-slate-400">/month</span>
                </div>
                <p className="text-slate-400">Perfect for individual developers</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-400" />
                  <span className="text-slate-300">5 projects per month</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-400" />
                  <span className="text-slate-300">Basic AI agents</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-400" />
                  <span className="text-slate-300">Community support</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-400" />
                  <span className="text-slate-300">Basic templates</span>
                </li>
              </ul>
              <button className="w-full bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-xl font-semibold transition-colors">
                Get Started
              </button>
            </div>

            {/* Pro Plan */}
            <div className="bg-gradient-to-br from-emerald-900/50 to-blue-900/50 rounded-2xl p-8 border-2 border-emerald-500/50 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-emerald-500 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                  <Star className="h-4 w-4" />
                  Most Popular
                </div>
              </div>
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
                <div className="text-4xl font-bold text-white mb-2">
                  $99<span className="text-lg text-slate-400">/month</span>
                </div>
                <p className="text-slate-400">For growing teams and businesses</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-400" />
                  <span className="text-slate-300">Unlimited projects</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-400" />
                  <span className="text-slate-300">All AI agents</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-400" />
                  <span className="text-slate-300">Priority support</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-400" />
                  <span className="text-slate-300">Advanced templates</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-400" />
                  <span className="text-slate-300">Team collaboration</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-400" />
                  <span className="text-slate-300">API access</span>
                </li>
              </ul>
              <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-semibold transition-colors">
                Start Free Trial
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Enterprise</h3>
                <div className="text-4xl font-bold text-white mb-2">
                  Custom
                </div>
                <p className="text-slate-400">For large organizations</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-400" />
                  <span className="text-slate-300">Everything in Pro</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-400" />
                  <span className="text-slate-300">Custom AI agents</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-400" />
                  <span className="text-slate-300">Dedicated support</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-400" />
                  <span className="text-slate-300">On-premise deployment</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-400" />
                  <span className="text-slate-300">SLA guarantee</span>
                </li>
              </ul>
              <button className="w-full bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-xl font-semibold transition-colors">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 bg-gradient-to-r from-emerald-900/50 to-blue-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Ideas?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Join thousands of developers who are building faster with AI agents
          </p>
          <Link 
            to="/dashboard" 
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105"
          >
            Start Your Free Trial
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Sparkles className="h-6 w-6 text-emerald-400" />
              <span className="text-xl font-bold text-white">IdeaToApp</span>
            </div>
            <div className="flex space-x-6 text-slate-400">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Support</a>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2024 IdeaToApp. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}