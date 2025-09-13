/**
 * Agent execution API routes
 * Handle agent execution management, monitoring, and results
 */
import { Router, type Request, type Response } from 'express'
import { supabase } from '../../supabase/config.js'
import { authenticateToken } from '../middleware/auth.js'

const router = Router()

// Apply authentication middleware to all routes
router.use(authenticateToken)

/**
 * Get all available agent configurations
 * GET /api/agents/config
 */
router.get('/config', async (req: Request, res: Response): Promise<void> => {
  try {
    const { data: agents, error } = await supabase
      .from('agent_config')
      .select('*')
      .eq('is_active', true)
      .order('agent_type')

    if (error) {
      res.status(400).json({ error: error.message })
      return
    }

    res.json({ agents })
  } catch (error) {
    console.error('Get agent config error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

/**
 * Start agent execution for a project
 * POST /api/agents/execute
 */
router.post('/execute', async (req: Request, res: Response): Promise<void> => {
  try {
    const { project_id, agent_id, execution_type, input_data } = req.body

    if (!project_id || !agent_id || !execution_type) {
      res.status(400).json({ error: 'Project ID, agent ID, and execution type are required' })
      return
    }

    // Verify project belongs to user
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id')
      .eq('id', project_id)
      .eq('user_id', req.user.id)
      .single()

    if (projectError || !project) {
      res.status(404).json({ error: 'Project not found or access denied' })
      return
    }

    // Create agent execution record
    const { data: execution, error } = await supabase
      .from('agent_executions')
      .insert({
        project_id,
        agent_id,
        execution_type,
        status: 'pending',
        input_data: input_data || {},
        started_at: new Date().toISOString()
      })
      .select(`
        *,
        agent_config(
          agent_name,
          agent_type,
          description
        )
      `)
      .single()

    if (error) {
      res.status(400).json({ error: error.message })
      return
    }

    // TODO: Trigger actual agent execution (WebSocket notification, queue system, etc.)
    // For now, we'll simulate by updating status to 'running'
    setTimeout(async () => {
      await supabase
        .from('agent_executions')
        .update({ status: 'running' })
        .eq('id', execution.id)
    }, 1000)

    res.status(201).json({ execution })
  } catch (error) {
    console.error('Execute agent error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

/**
 * Get execution status and logs
 * GET /api/agents/executions/:id
 */
router.get('/executions/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params

    const { data: execution, error } = await supabase
      .from('agent_executions')
      .select(`
        *,
        agent_config(
          agent_name,
          agent_type,
          description
        ),
        projects!inner(
          id,
          name,
          user_id
        ),
        execution_log(
          id,
          log_level,
          message,
          metadata,
          created_at
        ),
        generated_code(
          id,
          file_path,
          file_type,
          content,
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
          error_message,
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
      .eq('projects.user_id', req.user.id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        res.status(404).json({ error: 'Execution not found' })
        return
      }
      res.status(400).json({ error: error.message })
      return
    }

    res.json({ execution })
  } catch (error) {
    console.error('Get execution error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

/**
 * Cancel agent execution
 * POST /api/agents/executions/:id/cancel
 */
router.post('/executions/:id/cancel', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params

    // Verify execution belongs to user's project
    const { data: execution, error: fetchError } = await supabase
      .from('agent_executions')
      .select(`
        id,
        status,
        projects!inner(
          user_id
        )
      `)
      .eq('id', id)
      .eq('projects.user_id', req.user.id)
      .single()

    if (fetchError || !execution) {
      res.status(404).json({ error: 'Execution not found or access denied' })
      return
    }

    if (execution.status === 'completed' || execution.status === 'failed' || execution.status === 'cancelled') {
      res.status(400).json({ error: 'Cannot cancel execution in current status' })
      return
    }

    const { data: updatedExecution, error } = await supabase
      .from('agent_executions')
      .update({
        status: 'cancelled',
        completed_at: new Date().toISOString(),
        error_message: 'Cancelled by user'
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      res.status(400).json({ error: error.message })
      return
    }

    // Log cancellation
    await supabase
      .from('execution_log')
      .insert({
        execution_id: id,
        log_level: 'info',
        message: 'Execution cancelled by user'
      })

    res.json({ execution: updatedExecution })
  } catch (error) {
    console.error('Cancel execution error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

/**
 * Add log entry to execution
 * POST /api/agents/executions/:id/logs
 */
router.post('/executions/:id/logs', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const { log_level, message, metadata } = req.body

    if (!log_level || !message) {
      res.status(400).json({ error: 'Log level and message are required' })
      return
    }

    // Verify execution belongs to user's project
    const { data: execution, error: fetchError } = await supabase
      .from('agent_executions')
      .select(`
        id,
        projects!inner(
          user_id
        )
      `)
      .eq('id', id)
      .eq('projects.user_id', req.user.id)
      .single()

    if (fetchError || !execution) {
      res.status(404).json({ error: 'Execution not found or access denied' })
      return
    }

    const { data: logEntry, error } = await supabase
      .from('execution_log')
      .insert({
        execution_id: id,
        log_level,
        message,
        metadata: metadata || {}
      })
      .select()
      .single()

    if (error) {
      res.status(400).json({ error: error.message })
      return
    }

    res.status(201).json({ log: logEntry })
  } catch (error) {
    console.error('Add log error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router