/**
 * Project management API routes
 * Handle project CRUD operations and agent execution management
 */
import { Router, type Request, type Response } from 'express'
import { supabase } from '../../supabase/config.js'
import { authenticateToken } from '../middleware/auth.js'

const router = Router()

// Apply authentication middleware to all routes
router.use(authenticateToken)

/**
 * Get all projects for the authenticated user
 * GET /api/projects
 */
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { data: projects, error } = await supabase
      .from('projects')
      .select(`
        *,
        agent_executions(
          id,
          agent_id,
          execution_type,
          status,
          created_at,
          agent_config(
            agent_name,
            agent_type
          )
        )
      `)
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })

    if (error) {
      res.status(400).json({ error: error.message })
      return
    }

    res.json({ projects })
  } catch (error) {
    console.error('Get projects error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

/**
 * Get a specific project by ID
 * GET /api/projects/:id
 */
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params

    const { data: project, error } = await supabase
      .from('projects')
      .select(`
        *,
        agent_executions(
          *,
          agent_config(
            agent_name,
            agent_type,
            description
          ),
          execution_log(
            id,
            log_level,
            message,
            created_at
          )
        ),
        generated_code(
          id,
          file_path,
          file_type,
          language,
          version,
          is_active,
          created_at
        ),
        test_result(
          id,
          test_type,
          test_name,
          status,
          duration_ms,
          created_at
        ),
        performance_metric(
          id,
          metric_type,
          metric_name,
          value,
          unit,
          status,
          measured_at
        )
      `)
      .eq('id', id)
      .eq('user_id', req.user.id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        res.status(404).json({ error: 'Project not found' })
        return
      }
      res.status(400).json({ error: error.message })
      return
    }

    res.json({ project })
  } catch (error) {
    console.error('Get project error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

/**
 * Create a new project
 * POST /api/projects
 */
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, idea_input, github_repo_url, figma_design_url } = req.body

    if (!name || !idea_input) {
      res.status(400).json({ error: 'Name and idea input are required' })
      return
    }

    const { data: project, error } = await supabase
      .from('projects')
      .insert({
        user_id: req.user.id,
        name,
        description,
        idea_input,
        github_repo_url,
        figma_design_url,
        status: 'draft'
      })
      .select()
      .single()

    if (error) {
      res.status(400).json({ error: error.message })
      return
    }

    res.status(201).json({ project })
  } catch (error) {
    console.error('Create project error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

/**
 * Update a project
 * PUT /api/projects/:id
 */
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const { name, description, idea_input, github_repo_url, figma_design_url, status } = req.body

    const updateData: any = { updated_at: new Date().toISOString() }
    
    if (name !== undefined) updateData.name = name
    if (description !== undefined) updateData.description = description
    if (idea_input !== undefined) updateData.idea_input = idea_input
    if (github_repo_url !== undefined) updateData.github_repo_url = github_repo_url
    if (figma_design_url !== undefined) updateData.figma_design_url = figma_design_url
    if (status !== undefined) updateData.status = status

    const { data: project, error } = await supabase
      .from('projects')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', req.user.id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        res.status(404).json({ error: 'Project not found' })
        return
      }
      res.status(400).json({ error: error.message })
      return
    }

    res.json({ project })
  } catch (error) {
    console.error('Update project error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

/**
 * Delete a project
 * DELETE /api/projects/:id
 */
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
      .eq('user_id', req.user.id)

    if (error) {
      res.status(400).json({ error: error.message })
      return
    }

    res.json({ message: 'Project deleted successfully' })
  } catch (error) {
    console.error('Delete project error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router