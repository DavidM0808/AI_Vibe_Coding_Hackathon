/**
 * Authentication API routes with GitHub OAuth integration
 * Handle user authentication, session management, and GitHub OAuth flow
 */
import { Router, type Request, type Response } from 'express'
import { supabaseAdmin } from '../../supabase/config.js'

const router = Router()

/**
 * GitHub OAuth Login URL
 * GET /api/auth/github
 */
router.get('/github', async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabaseAdmin.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${process.env.CLIENT_URL || 'http://localhost:5173'}/auth/callback`
      }
    })

    if (error) {
      res.status(400).json({ error: error.message })
      return
    }

    res.json({ url: data.url })
  } catch (error) {
    console.error('GitHub OAuth error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

/**
 * Handle OAuth callback and exchange code for session
 * POST /api/auth/callback
 */
router.post('/callback', async (req: Request, res: Response): Promise<void> => {
  try {
    const { code } = req.body

    if (!code) {
      res.status(400).json({ error: 'Authorization code is required' })
      return
    }

    const { data, error } = await supabaseAdmin.auth.exchangeCodeForSession(code)

    if (error) {
      res.status(400).json({ error: error.message })
      return
    }

    res.json({
      access_token: data.session?.access_token,
      refresh_token: data.session?.refresh_token,
      user: data.user
    })
  } catch (error) {
    console.error('OAuth callback error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

/**
 * Get current user profile
 * GET /api/auth/user
 */
router.get('/user', async (req: Request, res: Response): Promise<void> => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'No authorization token provided' })
      return
    }

    const token = authHeader.substring(7)
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)

    if (error || !user) {
      res.status(401).json({ error: 'Invalid token' })
      return
    }

    res.json({ user })
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

/**
 * Refresh access token
 * POST /api/auth/refresh
 */
router.post('/refresh', async (req: Request, res: Response): Promise<void> => {
  try {
    const { refresh_token } = req.body

    if (!refresh_token) {
      res.status(400).json({ error: 'Refresh token is required' })
      return
    }

    const { data, error } = await supabaseAdmin.auth.refreshSession({
      refresh_token
    })

    if (error) {
      res.status(400).json({ error: error.message })
      return
    }

    res.json({
      access_token: data.session?.access_token,
      refresh_token: data.session?.refresh_token,
      user: data.user
    })
  } catch (error) {
    console.error('Token refresh error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

/**
 * User Logout
 * POST /api/auth/logout
 */
router.post('/logout', async (req: Request, res: Response): Promise<void> => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'No authorization token provided' })
      return
    }

    const token = authHeader.substring(7)
    
    // Verify the token first
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token)
    
    if (userError || !user) {
      res.status(401).json({ error: 'Invalid token' })
      return
    }

    // Sign out the user
    const { error } = await supabaseAdmin.auth.admin.signOut(user.id)

    if (error) {
      res.status(400).json({ error: error.message })
      return
    }

    res.json({ message: 'Logged out successfully' })
  } catch (error) {
    console.error('Logout error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
