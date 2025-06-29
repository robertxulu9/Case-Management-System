-- Create enum for contact roles
CREATE TYPE contact_role AS ENUM (
    'opposing_counsel',
    'judge',
    'witness',
    'expert_witness',
    'mediator',
    'court_reporter',
    'investigator',
    'other'
);

-- Create case_contacts table
CREATE TABLE IF NOT EXISTS public.case_contacts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    case_id UUID NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
    firstname TEXT NOT NULL,
    lastname TEXT NOT NULL,
    role contact_role NOT NULL,
    organization TEXT,
    email TEXT,
    phone TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create updated_at trigger
CREATE TRIGGER set_case_contacts_updated_at
    BEFORE UPDATE ON public.case_contacts
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_case_contacts_case_id ON public.case_contacts(case_id);
CREATE INDEX IF NOT EXISTS idx_case_contacts_role ON public.case_contacts(role);
CREATE INDEX IF NOT EXISTS idx_case_contacts_lastname ON public.case_contacts(lastname);

-- Set up Row Level Security (RLS)
ALTER TABLE public.case_contacts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for authenticated users" ON public.case_contacts
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert access for authenticated users" ON public.case_contacts
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users" ON public.case_contacts
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Enable delete access for authenticated users" ON public.case_contacts
    FOR DELETE
    TO authenticated
    USING (true);

-- Grant permissions
GRANT ALL ON public.case_contacts TO authenticated;
GRANT ALL ON public.case_contacts TO service_role;

-- Add comment to table
COMMENT ON TABLE public.case_contacts IS 'Stores external contacts related to cases including opposing counsel, judges, witnesses, etc.'; 