import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bnpvryotcgvposlbbcbd.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJucHZyeW90Y2d2cG9zbGJiY2JkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0ODQwMTgsImV4cCI6MjA5MTA2MDAxOH0.sdQrAZtG9Wxe8y_tv5Z6M1vT8lOUy5IGGolok5h2Cyo'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
