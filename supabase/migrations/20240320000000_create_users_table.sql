-- Create a table for user profiles
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  role TEXT CHECK (role IN ('admin', 'lawyer', 'staff', 'client')) NOT NULL DEFAULT 'client',
  phone_number TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Admins can view all profiles" ON users;
DROP POLICY IF EXISTS "Admins can update all profiles" ON users;
DROP POLICY IF EXISTS "Allow insert during signup" ON users;

-- Create a single policy for SELECT that covers both admin and user cases
CREATE POLICY "Users can view profiles"
  ON users
  FOR SELECT
  USING (
    auth.uid() = id -- Users can view their own profile
    OR 
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin' -- Admins can view all profiles
  );

-- Create a single policy for UPDATE that covers both admin and user cases
CREATE POLICY "Users can update profiles"
  ON users
  FOR UPDATE
  USING (
    auth.uid() = id -- Users can update their own profile
    OR 
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin' -- Admins can update all profiles
  );

-- Create a policy for INSERT that allows new user creation
CREATE POLICY "Allow insert during signup"
  ON users
  FOR INSERT
  WITH CHECK (
    auth.uid() = id -- User can only insert their own record
    OR
    auth.uid() IN ( -- Or if they're an admin
      SELECT id FROM users WHERE role = 'admin'
    )
  );

-- Create a policy for DELETE (admin only)
CREATE POLICY "Admins can delete profiles"
  ON users
  FOR DELETE
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

-- Function to handle new user creation (as a backup)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Only insert if the record doesn't exist
  IF NOT EXISTS (SELECT 1 FROM users WHERE id = new.id) THEN
    INSERT INTO public.users (id, email, role)
    VALUES (new.id, new.email, 'client');
  END IF;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create user profile on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update the updated_at column
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column(); 