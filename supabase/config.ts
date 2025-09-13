import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || 'https://mkymsangsdhxrycggmog.supabase.co'
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1reW1zYW5nc2RoeHJ5Y2dnbW9nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3OTI4MzcsImV4cCI6MjA3MzM2ODgzN30.8mAfBfQnQNe0eJ1XX-DC20-jjUbkwx4DNMtqRwUYXCg'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1reW1zYW5nc2RoeHJ5Y2dnbW9nIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Nzc5MjgzNywiZXhwIjoyMDczMzY4ODM3fQ.6Fu82Eqr4WbgfjDmXlagXQ4Lf7y3DmPCHbsztdud39A'

// Client for frontend (anon key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin client for backend (service role key)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export { supabaseUrl, supabaseAnonKey, supabaseServiceKey }