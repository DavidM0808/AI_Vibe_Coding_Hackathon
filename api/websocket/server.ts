/**
 * WebSocket server for real-time updates
 * Handles agent execution status, project updates, and live collaboration
 */
import { WebSocketServer, WebSocket } from 'ws'
import { IncomingMessage } from 'http'
import jwt from 'jsonwebtoken'
import { supabaseAdmin } from '../../supabase/config.js'

interface AuthenticatedWebSocket extends WebSocket {
  userId?: string
  projectId?: string
  isAlive?: boolean
}

interface WebSocketMessage {
  type: string
  payload: any
  timestamp: string
}

class WebSocketManager {
  private wss: WebSocketServer
  private clients: Map<string, Set<AuthenticatedWebSocket>> = new Map()
  private projectClients: Map<string, Set<AuthenticatedWebSocket>> = new Map()

  constructor(port: number = 8080) {
    this.wss = new WebSocketServer({ port })
    this.setupWebSocketServer()
    this.startHeartbeat()
    console.log(`WebSocket server running on port ${port}`)
  }

  private setupWebSocketServer(): void {
    this.wss.on('connection', (ws: AuthenticatedWebSocket, req: IncomingMessage) => {
      console.log('New WebSocket connection')
      
      ws.isAlive = true
      ws.on('pong', () => {
        ws.isAlive = true
      })

      ws.on('message', async (data: Buffer) => {
        try {
          const message: WebSocketMessage = JSON.parse(data.toString())
          await this.handleMessage(ws, message)
        } catch (error) {
          console.error('WebSocket message error:', error)
          this.sendError(ws, 'Invalid message format')
        }
      })

      ws.on('close', () => {
        this.removeClient(ws)
        console.log('WebSocket connection closed')
      })

      ws.on('error', (error) => {
        console.error('WebSocket error:', error)
        this.removeClient(ws)
      })

      // Send welcome message
      this.sendMessage(ws, {
        type: 'connection',
        payload: { status: 'connected', message: 'Welcome to IdeaToApp WebSocket' },
        timestamp: new Date().toISOString()
      })
    })
  }

  private async handleMessage(ws: AuthenticatedWebSocket, message: WebSocketMessage): Promise<void> {
    switch (message.type) {
      case 'authenticate':
        await this.authenticateClient(ws, message.payload.token)
        break
      
      case 'subscribe_project':
        await this.subscribeToProject(ws, message.payload.projectId)
        break
      
      case 'unsubscribe_project':
        this.unsubscribeFromProject(ws, message.payload.projectId)
        break
      
      case 'agent_status_update':
        await this.handleAgentStatusUpdate(ws, message.payload)
        break
      
      case 'project_update':
        await this.handleProjectUpdate(ws, message.payload)
        break
      
      case 'ping':
        this.sendMessage(ws, {
          type: 'pong',
          payload: { timestamp: message.payload.timestamp },
          timestamp: new Date().toISOString()
        })
        break
      
      default:
        this.sendError(ws, `Unknown message type: ${message.type}`)
    }
  }

  private async authenticateClient(ws: AuthenticatedWebSocket, token: string): Promise<void> {
    try {
      if (!token) {
        this.sendError(ws, 'Authentication token required')
        return
      }

      // Verify JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any
      
      // Verify user exists in Supabase
      const { data: user, error } = await supabaseAdmin.auth.getUser(token)
      
      if (error || !user.user) {
        this.sendError(ws, 'Invalid authentication token')
        return
      }

      ws.userId = user.user.id
      
      // Add to authenticated clients
      if (!this.clients.has(ws.userId)) {
        this.clients.set(ws.userId, new Set())
      }
      this.clients.get(ws.userId)!.add(ws)

      this.sendMessage(ws, {
        type: 'authenticated',
        payload: { userId: ws.userId, status: 'authenticated' },
        timestamp: new Date().toISOString()
      })

      console.log(`Client authenticated: ${ws.userId}`)
    } catch (error) {
      console.error('Authentication error:', error)
      this.sendError(ws, 'Authentication failed')
    }
  }

  private async subscribeToProject(ws: AuthenticatedWebSocket, projectId: string): Promise<void> {
    if (!ws.userId) {
      this.sendError(ws, 'Authentication required')
      return
    }

    try {
      // Verify user has access to project
      const { data: project, error } = await supabaseAdmin
        .from('projects')
        .select('id')
        .eq('id', projectId)
        .eq('user_id', ws.userId)
        .single()

      if (error || !project) {
        this.sendError(ws, 'Project not found or access denied')
        return
      }

      ws.projectId = projectId
      
      // Add to project clients
      if (!this.projectClients.has(projectId)) {
        this.projectClients.set(projectId, new Set())
      }
      this.projectClients.get(projectId)!.add(ws)

      this.sendMessage(ws, {
        type: 'project_subscribed',
        payload: { projectId, status: 'subscribed' },
        timestamp: new Date().toISOString()
      })

      console.log(`Client ${ws.userId} subscribed to project ${projectId}`)
    } catch (error) {
      console.error('Project subscription error:', error)
      this.sendError(ws, 'Failed to subscribe to project')
    }
  }

  private unsubscribeFromProject(ws: AuthenticatedWebSocket, projectId: string): void {
    if (ws.projectId === projectId) {
      ws.projectId = undefined
      
      const projectClients = this.projectClients.get(projectId)
      if (projectClients) {
        projectClients.delete(ws)
        if (projectClients.size === 0) {
          this.projectClients.delete(projectId)
        }
      }

      this.sendMessage(ws, {
        type: 'project_unsubscribed',
        payload: { projectId, status: 'unsubscribed' },
        timestamp: new Date().toISOString()
      })

      console.log(`Client ${ws.userId} unsubscribed from project ${projectId}`)
    }
  }

  private async handleAgentStatusUpdate(ws: AuthenticatedWebSocket, payload: any): Promise<void> {
    if (!ws.userId || !ws.projectId) {
      this.sendError(ws, 'Authentication and project subscription required')
      return
    }

    // Broadcast to all clients subscribed to this project
    this.broadcastToProject(ws.projectId, {
      type: 'agent_status_updated',
      payload: {
        executionId: payload.executionId,
        status: payload.status,
        progress: payload.progress,
        message: payload.message,
        updatedBy: ws.userId
      },
      timestamp: new Date().toISOString()
    })
  }

  private async handleProjectUpdate(ws: AuthenticatedWebSocket, payload: any): Promise<void> {
    if (!ws.userId || !ws.projectId) {
      this.sendError(ws, 'Authentication and project subscription required')
      return
    }

    // Broadcast to all clients subscribed to this project
    this.broadcastToProject(ws.projectId, {
      type: 'project_updated',
      payload: {
        projectId: ws.projectId,
        updateType: payload.updateType,
        data: payload.data,
        updatedBy: ws.userId
      },
      timestamp: new Date().toISOString()
    })
  }

  private removeClient(ws: AuthenticatedWebSocket): void {
    if (ws.userId) {
      const userClients = this.clients.get(ws.userId)
      if (userClients) {
        userClients.delete(ws)
        if (userClients.size === 0) {
          this.clients.delete(ws.userId)
        }
      }
    }

    if (ws.projectId) {
      const projectClients = this.projectClients.get(ws.projectId)
      if (projectClients) {
        projectClients.delete(ws)
        if (projectClients.size === 0) {
          this.projectClients.delete(ws.projectId)
        }
      }
    }
  }

  private sendMessage(ws: WebSocket, message: WebSocketMessage): void {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message))
    }
  }

  private sendError(ws: WebSocket, error: string): void {
    this.sendMessage(ws, {
      type: 'error',
      payload: { error },
      timestamp: new Date().toISOString()
    })
  }

  private broadcastToProject(projectId: string, message: WebSocketMessage): void {
    const projectClients = this.projectClients.get(projectId)
    if (projectClients) {
      projectClients.forEach(client => {
        this.sendMessage(client, message)
      })
    }
  }

  private broadcastToUser(userId: string, message: WebSocketMessage): void {
    const userClients = this.clients.get(userId)
    if (userClients) {
      userClients.forEach(client => {
        this.sendMessage(client, message)
      })
    }
  }

  private startHeartbeat(): void {
    setInterval(() => {
      this.wss.clients.forEach((ws: AuthenticatedWebSocket) => {
        if (ws.isAlive === false) {
          this.removeClient(ws)
          return ws.terminate()
        }
        
        ws.isAlive = false
        ws.ping()
      })
    }, 30000) // 30 seconds
  }

  // Public methods for external use
  public notifyAgentExecution(projectId: string, executionData: any): void {
    this.broadcastToProject(projectId, {
      type: 'agent_execution_update',
      payload: executionData,
      timestamp: new Date().toISOString()
    })
  }

  public notifyProjectChange(projectId: string, changeData: any): void {
    this.broadcastToProject(projectId, {
      type: 'project_change',
      payload: changeData,
      timestamp: new Date().toISOString()
    })
  }

  public notifyUser(userId: string, notification: any): void {
    this.broadcastToUser(userId, {
      type: 'notification',
      payload: notification,
      timestamp: new Date().toISOString()
    })
  }
}

// Export singleton instance
export const wsManager = new WebSocketManager()
export default wsManager