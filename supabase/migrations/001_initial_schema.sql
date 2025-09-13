-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    github_username VARCHAR(100),
    display_name VARCHAR(100) NOT NULL,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_github ON users(github_username);

-- Create projects table
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'initializing' CHECK (status IN ('initializing', 'designing', 'coding', 'testing', 'optimizing', 'completed', 'failed')),
    config JSONB DEFAULT '{}',
    github_repo_url VARCHAR(500),
    deployment_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);

-- Create agent_config table
CREATE TABLE agent_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_type VARCHAR(50) NOT NULL UNIQUE,
    default_config JSONB NOT NULL DEFAULT '{}',
    schema_validation JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create agent_executions table
CREATE TABLE agent_executions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    agent_type VARCHAR(50) NOT NULL CHECK (agent_type IN ('browser-use', 'figma-mcp', 'trae-solo', 'github-mcp', 'testsprite', 'corespeed', 'deckspeed')),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed', 'cancelled')),
    input_data JSONB NOT NULL DEFAULT '{}',
    output_data JSONB DEFAULT '{}',
    error_message TEXT,
    execution_order INTEGER NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_agent_executions_project_id ON agent_executions(project_id);
CREATE INDEX idx_agent_executions_status ON agent_executions(status);
CREATE INDEX idx_agent_executions_order ON agent_executions(project_id, execution_order);

-- Create execution_log table
CREATE TABLE execution_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    execution_id UUID NOT NULL REFERENCES agent_executions(id) ON DELETE CASCADE,
    log_level VARCHAR(20) NOT NULL CHECK (log_level IN ('debug', 'info', 'warn', 'error')),
    message TEXT NOT NULL,
    context_data JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_execution_log_execution_id ON execution_log(execution_id);
CREATE INDEX idx_execution_log_level ON execution_log(log_level);
CREATE INDEX idx_execution_log_created_at ON execution_log(created_at DESC);

-- Create generated_code table
CREATE TABLE generated_code (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    file_path VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    language VARCHAR(50) NOT NULL,
    generator_agent VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_generated_code_project_id ON generated_code(project_id);
CREATE INDEX idx_generated_code_language ON generated_code(language);

-- Create test_result table
CREATE TABLE test_result (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    test_suite VARCHAR(100) NOT NULL,
    total_tests INTEGER NOT NULL DEFAULT 0,
    passed_tests INTEGER NOT NULL DEFAULT 0,
    failed_tests INTEGER NOT NULL DEFAULT 0,
    detailed_results JSONB DEFAULT '{}',
    executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_test_result_project_id ON test_result(project_id);
CREATE INDEX idx_test_result_executed_at ON test_result(executed_at DESC);

-- Create performance_metric table
CREATE TABLE performance_metric (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    metric_type VARCHAR(50) NOT NULL,
    value FLOAT NOT NULL,
    metadata JSONB DEFAULT '{}',
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_performance_metric_project_id ON performance_metric(project_id);
CREATE INDEX idx_performance_metric_type ON performance_metric(metric_type);
CREATE INDEX idx_performance_metric_recorded_at ON performance_metric(recorded_at DESC);

-- Insert initial agent configurations
INSERT INTO agent_config (agent_type, default_config, schema_validation, is_active) VALUES
('browser-use', '{"search_engines": ["google", "dribbble", "behance"], "max_results": 10}', '{"type": "object", "properties": {"query": {"type": "string"}}}', true),
('figma-mcp', '{"workspace_id": null, "component_library": "default"}', '{"type": "object", "properties": {"design_brief": {"type": "string"}}}', true),
('trae-solo', '{"framework": "react", "backend": "node", "database": "supabase"}', '{"type": "object", "properties": {"requirements": {"type": "array"}}}', true),
('testsprite', '{"test_types": ["unit", "integration", "e2e"], "browsers": ["chrome", "firefox"]}', '{"type": "object", "properties": {"codebase_path": {"type": "string"}}}', true),
('corespeed', '{"metrics": ["lcp", "fid", "cls"], "monitoring_interval": 300}', '{"type": "object", "properties": {"app_url": {"type": "string"}}}', true),
('deckspeed', '{"template": "startup", "slide_count": 10}', '{"type": "object", "properties": {"project_data": {"type": "object"}}}', true),
('github-mcp', '{"auto_commit": true, "branch_strategy": "feature"}', '{"type": "object", "properties": {"repo_name": {"type": "string"}}}', true);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE execution_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_code ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_result ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_metric ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_config ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Users can only see their own projects
CREATE POLICY "Users can view own projects" ON projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create projects" ON projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own projects" ON projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own projects" ON projects FOR DELETE USING (auth.uid() = user_id);

-- Users can only see executions for their projects
CREATE POLICY "Users can view own project executions" ON agent_executions FOR SELECT USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = agent_executions.project_id AND projects.user_id = auth.uid())
);
CREATE POLICY "Users can create executions for own projects" ON agent_executions FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = agent_executions.project_id AND projects.user_id = auth.uid())
);
CREATE POLICY "Users can update executions for own projects" ON agent_executions FOR UPDATE USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = agent_executions.project_id AND projects.user_id = auth.uid())
);

-- Similar policies for other tables
CREATE POLICY "Users can view logs for own executions" ON execution_log FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM agent_executions ae 
        JOIN projects p ON ae.project_id = p.id 
        WHERE ae.id = execution_log.execution_id AND p.user_id = auth.uid()
    )
);

CREATE POLICY "Users can view own project code" ON generated_code FOR SELECT USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = generated_code.project_id AND projects.user_id = auth.uid())
);

CREATE POLICY "Users can view own project tests" ON test_result FOR SELECT USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = test_result.project_id AND projects.user_id = auth.uid())
);

CREATE POLICY "Users can view own project metrics" ON performance_metric FOR SELECT USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = performance_metric.project_id AND projects.user_id = auth.uid())
);

-- Agent config is readable by all authenticated users
CREATE POLICY "Authenticated users can view agent config" ON agent_config FOR SELECT TO authenticated USING (true);