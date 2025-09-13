-- Grant permissions for IdeaToApp tables to anon and authenticated roles

-- Grant SELECT permissions to anon role (for public data)
GRANT SELECT ON projects TO anon;
GRANT SELECT ON agent_config TO anon;
GRANT SELECT ON agent_executions TO anon;
GRANT SELECT ON execution_log TO anon;
GRANT SELECT ON generated_code TO anon;
GRANT SELECT ON test_result TO anon;
GRANT SELECT ON performance_metric TO anon;

-- Grant full permissions to authenticated role
GRANT ALL PRIVILEGES ON projects TO authenticated;
GRANT ALL PRIVILEGES ON agent_config TO authenticated;
GRANT ALL PRIVILEGES ON agent_executions TO authenticated;
GRANT ALL PRIVILEGES ON execution_log TO authenticated;
GRANT ALL PRIVILEGES ON generated_code TO authenticated;
GRANT ALL PRIVILEGES ON test_result TO authenticated;
GRANT ALL PRIVILEGES ON performance_metric TO authenticated;

-- Grant USAGE on sequences (for INSERT operations)
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;