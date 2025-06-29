-- Add new personal information fields to clients table
ALTER TABLE clients
ADD COLUMN IF NOT EXISTS nrc VARCHAR(50),
ADD COLUMN IF NOT EXISTS passport VARCHAR(50),
ADD COLUMN IF NOT EXISTS gender VARCHAR(10),
ADD COLUMN IF NOT EXISTS dateofbirth DATE,
ADD COLUMN IF NOT EXISTS placeofbirth VARCHAR(100),
ADD COLUMN IF NOT EXISTS nationality VARCHAR(50),
ADD COLUMN IF NOT EXISTS maritalstatus VARCHAR(20),
ADD COLUMN IF NOT EXISTS occupation VARCHAR(100);

-- Update existing records with a placeholder NRC value
UPDATE clients 
SET nrc = 'LEGACY-' || id 
WHERE nrc IS NULL;

-- Now make NRC required for all records
ALTER TABLE clients
ALTER COLUMN nrc SET NOT NULL;

-- Add a constraint to ensure NRC is unique
ALTER TABLE clients
ADD CONSTRAINT unique_nrc UNIQUE (nrc); 