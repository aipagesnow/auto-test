import { createClient } from '@supabase/supabase-js'

// These should be in .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co"
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder"

// Create a single supabase client for interacting with your database
// using the service role key for backend operations (admin access)
export const supabaseAdmin = createClient(supabaseUrl, supabaseKey)
