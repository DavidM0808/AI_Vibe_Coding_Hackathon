-- IdeaToApp Database Schema
-- Create tables for the IdeaToApp application

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    idea_input TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'in_progress', 'completed', 'failed')),
    github_repo_url TEXT,
    figma_design_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agent configurations table
CREATE TABLE IF NOT EXISTS agent_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_name VARCHAR(100) NOT NULL UNIQUE,
    agent_type VARCHAR(50) NOT NULL CHECK (agent_type IN ('design', 'frontend', 'backend', 'testing', 'performance', 'pitch')),
    description TEXT,
    config_data JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agent executions table
CREATE TABLE IF NOT EXISTS agent_executions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    agent_id UUID NOT NULL REFERENCES agent_config(id),
    execution_type VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed', 'cancelled')),
    input_data JSONB DEFAULT '{}',
    output_data JSONB DEFAULT '{}',
    error_message TEXT,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Execution logs table
CREATE TABLE IF NOT EXISTS execution_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    execution_id UUID NOT NULL REFERENCES agent_executions(id) ON DELETE CASCADE,
    log_level VARCHAR(20) DEFAULT 'info' CHECK (log_level IN ('debug', 'info', 'warn', 'error')),
    message TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Generated code table
CREATE TABLE IF NOT EXISTS generated_code (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    execution_id UUID REFERENCES agent_executions(id),
    file_path VARCHAR(500) NOT NULL,
    file_type VARCHAR(50),
    content TEXT NOT NULL,
    language VARCHAR(50),
    version INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Test results table
CREATE TABLE IF NOT EXISTS test_result (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    execution_id UUID REFERENCES agent_executions(id),
    test_type VARCHAR(50) NOT NULL CHECK (test_type IN ('unit', 'integration', 'e2e', 'performance')),
    test_name VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'passed', 'failed', 'skipped')),
    duration_ms INTEGER,
    error_message TEXT,
    test_data JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Performance metrics table
CREATE TABLE IF NOT EXISTS performance_metric (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    execution_id UUID REFERENCES agent_executions(id),
    metric_type VARCHAR(50) NOT NULL,
    metric_name VARCHAR(100) NOT NULL,
    value DECIMAL(10,4) NOT NULL,
    unit VARCHAR(20),
    threshold_min DECIMAL(10,4),
    threshold_max DECIMAL(10,4),
    status VARCHAR(20) DEFAULT 'normal' CHECK (status IN ('normal', 'warning', 'critical')),
    metadata JSONB DEFAULT '{}',
    measured_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert initial agent configurations
INSERT INTO agent_config (agent_name, agent_type, description, config_data) VALUES
('Figma Designer', 'design', 'AI agent for creating UI/UX designs using Figma API', '{"api_version": "v1", "max_components": 50}'),
('React Developer', 'frontend', 'AI agent for generating React frontend code', '{"framework": "react", "typescript": true, "styling": "tailwind"}'),
('Node.js Developer', 'backend', 'AI agent for creating Node.js backend services', '{"framework": "express", "database": "supabase", "auth": "supabase-auth"}'),
('TestSprite', 'testing', 'AI agent for automated testing and quality assurance', '{"test_types": ["unit", "integration", "e2e"], "coverage_threshold": 80}'),
('CoreSpeed', 'performance', 'AI agent for performance monitoring and optimization', '{"metrics": ["load_time", "bundle_size", "lighthouse_score"]}'),
('DeckSpeed', 'pitch', 'AI agent for generating pitch decks and presentations', '{"template": "startup", "slides_count": 12}');

-- Enable Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE execution_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_code ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_result ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_metric ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Projects policies
CREATE POLICY "Users can view their own projects" ON projects
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own projects" ON projects
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects" ON projects
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects" ON projects
    FOR DELETE USING (auth.uid() = user_id);

-- Agent config policies (read-only for authenticated users)
CREATE POLICY "Authenticated users can view agent configs" ON agent_config
    FOR SELECT TO authenticated USING (true);

-- Agent executions policies
CREATE POLICY "Users can view executions for their projects" ON agent_executions
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM projects WHERE projects.id = agent_executions.project_id AND projects.user_id = auth.uid()
    ));

CREATE POLICY "Users can create executions for their projects" ON agent_executions
    FOR INSERT WITH CHECK (EXISTS (
        SELECT 1 FROM projects WHERE projects.id = agent_executions.project_id AND projects.user_id = auth.uid()
    ));

CREATE POLICY "Users can update executions for their projects" ON agent_executions
    FOR UPDATE USING (EXISTS (
        SELECT 1 FROM projects WHERE projects.id = agent_executions.project_id AND projects.user_id = auth.uid()
    ));

-- Execution log policies
CREATE POLICY "Users can view logs for their project executions" ON execution_log
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM agent_executions ae
        JOIN projects p ON p.id = ae.project_id
        WHERE ae.id = execution_log.execution_id AND p.user_id = auth.uid()
    ));

CREATE POLICY "System can create execution logs" ON execution_log
    FOR INSERT WITH CHECK (true);

-- Generated code policies
CREATE POLICY "Users can view code for their projects" ON generated_code
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM projects WHERE projects.id = generated_code.project_id AND projects.user_id = auth.uid()
    ));

CREATE POLICY "System can create generated code" ON generated_code
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update code for their projects" ON generated_code
    FOR UPDATE USING (EXISTS (
        SELECT 1 FROM projects WHERE projects.id = generated_code.project_id AND projects.user_id = auth.uid()
    ));

-- Test result policies
CREATE POLICY "Users can view test results for their projects" ON test_result
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM projects WHERE projects.id = test_result.project_id AND projects.user_id = auth.uid()
    ));

CREATE POLICY "System can create test results" ON test_result
    FOR INSERT WITH CHECK (true);

-- Performance metric policies
CREATE POLICY "Users can view performance metrics for their projects" ON performance_metric
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM projects WHERE projects.id = performance_metric.project_id AND projects.user_id = auth.uid()
    ));

CREATE POLICY "System can create performance metrics" ON performance_metric
    FOR INSERT WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_agent_executions_project_id ON agent_executions(project_id);
CREATE INDEX IF NOT EXISTS idx_agent_executions_status ON agent_executions(status);
CREATE INDEX IF NOT EXISTS idx_execution_log_execution_id ON execution_log(execution_id);
CREATE INDEX IF NOT EXISTS idx_generated_code_project_id ON generated_code(project_id);
CREATE INDEX IF NOT EXISTS idx_test_result_project_id ON test_result(project_id);
CREATE INDEX IF NOT EXISTS idx_performance_metric_project_id ON performance_metric(project_id);

-- Grant permissions to anon and authenticated roles
GRANT SELECT ON agent_config TO anon, authenticated;
GRANT ALL PRIVILEGES ON projects TO authenticated;
GRANT ALL PRIVILEGES ON agent_executions TO authenticated;
GRANT ALL PRIVILEGES ON execution_log TO authenticated;
GRANT ALL PRIVILEGES ON generated_code TO authenticated;
GRANT ALL PRIVILEGES ON test_result TO authenticated;
GRANT ALL PRIVILEGES ON performance_metric TO authenticated;