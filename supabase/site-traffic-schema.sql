DROP TABLE IF EXISTS site_traffic;

CREATE TABLE site_traffic (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    page_path text NOT NULL,
    user_agent text,
    referrer text,
    screen_width integer,
    screen_height integer,
    timestamp timestamptz DEFAULT now(),
    created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_site_traffic_timestamp ON site_traffic(timestamp DESC);
CREATE INDEX idx_site_traffic_page_path ON site_traffic(page_path);

ALTER TABLE site_traffic ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous inserts" ON site_traffic
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Staff can view traffic" ON site_traffic
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM staff WHERE staff.user_id = auth.uid()
        )
    );
