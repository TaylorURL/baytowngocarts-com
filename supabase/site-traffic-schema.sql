DROP TABLE IF EXISTS site_traffic;

CREATE TABLE site_traffic (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    page_path text NOT NULL,
    user_agent text,
    referrer text,
    screen_width integer,
    screen_height integer,
    city text,
    region text,
    country text,
    country_code text,
    latitude decimal(10, 8),
    longitude decimal(11, 8),
    timestamp timestamptz DEFAULT now(),
    created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_site_traffic_timestamp ON site_traffic(timestamp DESC);
CREATE INDEX idx_site_traffic_page_path ON site_traffic(page_path);
CREATE INDEX idx_site_traffic_country ON site_traffic(country);
CREATE INDEX idx_site_traffic_city ON site_traffic(city);

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
