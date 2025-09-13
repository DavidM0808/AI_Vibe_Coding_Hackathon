-- Grant permissions to anon role for public access
GRANT SELECT ON public.users TO anon;
GRANT SELECT ON public.messages TO anon;
GRANT SELECT ON public.user_sessions TO anon;
GRANT SELECT ON public.contacts TO anon;

-- Grant full permissions to authenticated role
GRANT ALL PRIVILEGES ON public.users TO authenticated;
GRANT ALL PRIVILEGES ON public.messages TO authenticated;
GRANT ALL PRIVILEGES ON public.user_sessions TO authenticated;
GRANT ALL PRIVILEGES ON public.contacts TO authenticated;

-- Grant usage on sequences
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;