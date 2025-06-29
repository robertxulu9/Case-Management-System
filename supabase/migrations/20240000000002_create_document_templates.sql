-- Create enum for template categories
CREATE TYPE template_category AS ENUM (
    'client_forms',
    'agreements',
    'authorizations',
    'court_documents',
    'general'
);

-- Create document_templates table
CREATE TABLE IF NOT EXISTS public.document_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category template_category NOT NULL,
    content TEXT NOT NULL,
    variables JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id)
);

-- Create updated_at trigger
CREATE TRIGGER set_document_templates_updated_at
    BEFORE UPDATE ON public.document_templates
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_document_templates_category ON public.document_templates(category);
CREATE INDEX IF NOT EXISTS idx_document_templates_is_active ON public.document_templates(is_active);

-- Set up Row Level Security (RLS)
ALTER TABLE public.document_templates ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for authenticated users" ON public.document_templates
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert access for authenticated users" ON public.document_templates
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users" ON public.document_templates
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Enable delete access for authenticated users" ON public.document_templates
    FOR DELETE
    TO authenticated
    USING (true);

-- Grant permissions
GRANT ALL ON public.document_templates TO authenticated;
GRANT ALL ON public.document_templates TO service_role;

-- Add comment to table
COMMENT ON TABLE public.document_templates IS 'Stores document templates with TinyMCE content and variable placeholders';

-- Insert default templates
INSERT INTO public.document_templates (title, description, category, content, variables) VALUES
(
    'Client Instruction Form',
    'Standard form for collecting initial client information and instructions',
    'client_forms',
    E'<h2>Client Instruction Form</h2>\n\n
<p><strong>Date:</strong> {current_date}</p>\n\n
<h3>1. Client Information</h3>\n
<p><strong>Full Name:</strong> {client_name}<br>\n
<strong>Contact Number:</strong> {client_phone}<br>\n
<strong>Email:</strong> {client_email}<br>\n
<strong>Address:</strong> {client_address}</p>\n\n
<h3>2. Matter Details</h3>\n
<p><strong>Type of Matter:</strong> {matter_type}<br>\n
<strong>Brief Description:</strong><br>\n
{matter_description}</p>\n\n
<h3>3. Instructions</h3>\n
<p>{client_instructions}</p>\n\n
<h3>4. Documents Provided</h3>\n
<p>{documents_list}</p>\n\n
<h3>5. Deadlines and Important Dates</h3>\n
<p>{important_dates}</p>',
    '["client_name", "client_phone", "client_email", "client_address", "matter_type", "matter_description", "client_instructions", "documents_list", "important_dates", "current_date"]'
),
(
    'Retainer Agreement',
    'Standard retainer agreement template',
    'agreements',
    E'<h2>RETAINER AGREEMENT</h2>\n\n
<p>THIS AGREEMENT made this {current_date}</p>\n\n
<p><strong>BETWEEN:</strong></p>\n
<p>{firm_name}<br>\n
{firm_address}<br>\n
(hereinafter referred to as the "Firm")</p>\n\n
<p><strong>AND:</strong></p>\n
<p>{client_name}<br>\n
{client_address}<br>\n
(hereinafter referred to as the "Client")</p>\n\n
<h3>1. SCOPE OF SERVICES</h3>\n
<p>The Client hereby retains the Firm to provide legal services in connection with {matter_description}.</p>\n\n
<h3>2. FEES AND BILLING</h3>\n
<p>{fee_structure}</p>\n\n
<h3>3. RETAINER</h3>\n
<p>The Client agrees to pay an initial retainer of {retainer_amount}.</p>\n\n
<h3>4. SIGNATURES</h3>\n\n
<p>_____________________<br>\n
{firm_representative}<br>\n
For the Firm</p>\n\n
<p>_____________________<br>\n
{client_name}<br>\n
Client</p>',
    '["firm_name", "firm_address", "client_name", "client_address", "matter_description", "fee_structure", "retainer_amount", "firm_representative", "current_date"]'
),
(
    'Power of Attorney',
    'General Power of Attorney template',
    'authorizations',
    E'<h2>POWER OF ATTORNEY</h2>\n\n
<p>I, {client_name}, of {client_address}, do hereby appoint {attorney_name} as my true and lawful attorney for the following purposes:</p>\n\n
<h3>1. POWERS GRANTED</h3>\n
<p>{powers_granted}</p>\n\n
<h3>2. DURATION</h3>\n
<p>This Power of Attorney shall become effective on {effective_date} and shall {duration_terms}.</p>\n\n
<h3>3. SIGNATURES</h3>\n
<p>Executed this {current_date}</p>\n\n
<p>_____________________<br>\n
{client_name}<br>\n
Principal</p>\n\n
<p>WITNESSES:</p>\n
<p>1. _____________________<br>\n
Name: {witness1_name}</p>\n\n
<p>2. _____________________<br>\n
Name: {witness2_name}</p>',
    '["client_name", "client_address", "attorney_name", "powers_granted", "effective_date", "duration_terms", "witness1_name", "witness2_name", "current_date"]'
),
(
    'General Affidavit',
    'Template for general purpose affidavit',
    'court_documents',
    E'<h2>AFFIDAVIT</h2>\n\n
<p>I, {deponent_name}, of {deponent_address}, {occupation}, make oath and say as follows:</p>\n\n
<ol>\n
<li>I am the {relationship_to_matter} and have personal knowledge of the matters hereinafter deposed to.</li>\n\n
<li>{affidavit_content}</li>\n</ol>\n\n
<p>SWORN before me at {location}<br>\n
this {current_date}</p>\n\n
<p>_____________________<br>\n
Commissioner for Oaths</p>\n\n
<p>_____________________<br>\n
{deponent_name}</p>',
    '["deponent_name", "deponent_address", "occupation", "relationship_to_matter", "affidavit_content", "location", "current_date"]'
),
(
    'Notice of Appointment to Act',
    'Template for notice of appointment',
    'court_documents',
    E'<h2>NOTICE OF APPOINTMENT TO ACT</h2>\n\n
<p>TO: The Court and All Parties</p>\n\n
<p>TAKE NOTICE that {firm_name} has been appointed to act as legal representative for {client_name} in this proceeding.</p>\n\n
<p>The address for service is:</p>\n
<p>{firm_address}</p>\n\n
<p>Dated: {current_date}</p>\n\n
<p>_____________________<br>\n
{lawyer_name}<br>\n
{firm_name}</p>',
    '["firm_name", "client_name", "firm_address", "lawyer_name", "current_date"]'
),
(
    'Authority to Represent',
    'Client authorization template',
    'authorizations',
    E'<h2>AUTHORITY TO REPRESENT</h2>\n\n
<p>I, {client_name}, hereby authorize {firm_name} to act as my legal representative in connection with {matter_description}.</p>\n\n
<p>This authority includes:</p>\n
<p>{scope_of_authority}</p>\n\n
<p>Dated: {current_date}</p>\n\n
<p>_____________________<br>\n
{client_name}</p>\n\n
<p>WITNESS:</p>\n
<p>_____________________<br>\n
{witness_name}</p>',
    '["client_name", "firm_name", "matter_description", "scope_of_authority", "witness_name", "current_date"]'
),
(
    'Request for Adjournment',
    'Template for adjournment requests',
    'court_documents',
    E'<h2>REQUEST FOR ADJOURNMENT</h2>\n\n
<p>COURT FILE NO: {court_file_number}</p>\n\n
<p>IN THE MATTER OF: {case_name}</p>\n\n
<p>I, {lawyer_name}, counsel for {party_name}, request an adjournment of the {hearing_type} scheduled for {scheduled_date} for the following reasons:</p>\n\n
<p>{reasons_for_adjournment}</p>\n\n
<p>Dated: {current_date}</p>\n\n
<p>_____________________<br>\n
{lawyer_name}<br>\n
Counsel for {party_name}</p>',
    '["court_file_number", "case_name", "lawyer_name", "party_name", "hearing_type", "scheduled_date", "reasons_for_adjournment", "current_date"]'
),
(
    'Certificate of Urgency',
    'Template for urgent matters',
    'court_documents',
    E'<h2>CERTIFICATE OF URGENCY</h2>\n\n
<p>COURT FILE NO: {court_file_number}</p>\n\n
<p>IN THE MATTER OF: {case_name}</p>\n\n
<p>I, {lawyer_name}, hereby certify that this matter is urgent for the following reasons:</p>\n\n
<ol>\n
<li>{urgency_reasons}</li>\n
</ol>\n\n
<p>The following prejudice will result if this matter is not heard urgently:</p>\n
<p>{potential_prejudice}</p>\n\n
<p>Dated: {current_date}</p>\n\n
<p>_____________________<br>\n
{lawyer_name}<br>\n
Counsel for {party_name}</p>',
    '["court_file_number", "case_name", "lawyer_name", "urgency_reasons", "potential_prejudice", "party_name", "current_date"]'
),
(
    'Chronology of Events',
    'Template for creating event timelines',
    'general',
    E'<h2>CHRONOLOGY OF EVENTS</h2>\n\n
<p><strong>Matter:</strong> {matter_name}</p>\n
<p><strong>Period:</strong> {start_date} to {end_date}</p>\n\n
<table style="width:100%; border-collapse: collapse;">\n
<tr>\n
<th style="border: 1px solid black; padding: 8px;">Date</th>\n
<th style="border: 1px solid black; padding: 8px;">Event</th>\n
<th style="border: 1px solid black; padding: 8px;">Documents</th>\n
<th style="border: 1px solid black; padding: 8px;">Notes</th>\n
</tr>\n
{events_table}\n
</table>\n\n
<p>Prepared by: {prepared_by}<br>\n
Date: {current_date}</p>',
    '["matter_name", "start_date", "end_date", "events_table", "prepared_by", "current_date"]'
); 