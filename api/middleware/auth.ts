/**
 * Authentication middleware for protecting API routes
 */
import { Request, Response, NextFunction } from 'express'
import { supabaseAdmin } from '../../supabase/config.js'

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: any
    }
  }
}

/**
 * Middleware to verify JWT token and attach user to request
 */
export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'No authorization token provided' })
      return
    }

    const token = authHeader.substring(7)
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)

    if (error || !user) {
      res.status(401).json({ error: 'Invalid or expired token' })
      return
    }

    // Attach user to request object
    req.user = user
    next()
  } catch (error) {
    console.error('Authentication middleware error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

/**
 * Optional authentication middleware - doesn't fail if no token
 */
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
      
      if (!error && user) {
        req.user = user
      }
    }
    
    next()
  } catch (error) {
    console.error('Optional auth middleware error:', error)
    next() // Continue even if there's an error
  }
}