-- Check if resume_button_text and resume_link columns exist in hero_section table
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'hero_section' AND column_name = 'resume_button_text'
    ) THEN
        ALTER TABLE hero_section ADD COLUMN resume_button_text VARCHAR(255) DEFAULT 'Resume';
    END IF;

    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'hero_section' AND column_name = 'resume_link'
    ) THEN
        ALTER TABLE hero_section ADD COLUMN resume_link VARCHAR(255) DEFAULT '';
    END IF;
END $$;
