-- Supabase Tabellendefinition für cars
-- Diese SQL-Befehle müssen in Ihrem Supabase-Dashboard ausgeführt werden

-- Erstelle die cars Tabelle
CREATE TABLE IF NOT EXISTS cars (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    title VARCHAR(200) NOT NULL,
    price INTEGER NOT NULL,
    year INTEGER NOT NULL,
    mileage INTEGER NOT NULL,
    fuel VARCHAR(50),
    transmission VARCHAR(50),
    power VARCHAR(50),
    displacement VARCHAR(50),
    color VARCHAR(50),
    doors INTEGER DEFAULT 4,
    seats INTEGER DEFAULT 5,
    images TEXT[] DEFAULT '{}',
    equipment JSONB DEFAULT '{"comfort":[],"safety":[],"multimedia":[],"exterior":[],"engineTransmission":[]}',
    description TEXT,
    condition VARCHAR(50),
    warranty VARCHAR(100),
    financing VARCHAR(100),
    previousOwners INTEGER DEFAULT 0,
    accidentFree BOOLEAN DEFAULT true,
    nonsmoker BOOLEAN DEFAULT true,
    inspectionDate DATE,
    registrationDate DATE,
    tuv VARCHAR(50),
    location VARCHAR(100),
    contactPerson VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Erstelle einen Index für bessere Performance
CREATE INDEX IF NOT EXISTS idx_cars_brand ON cars(brand);
CREATE INDEX IF NOT EXISTS idx_cars_model ON cars(model);
CREATE INDEX IF NOT EXISTS idx_cars_price ON cars(price);
CREATE INDEX IF NOT EXISTS idx_cars_year ON cars(year);

-- RLS (Row Level Security) aktivieren falls gewünscht
-- ALTER TABLE cars ENABLE ROW LEVEL SECURITY;

-- Beispiel-Policy für öffentlichen Lese-Zugriff (anpassen nach Bedarf)
-- CREATE POLICY "Public cars are viewable by everyone" ON cars
--     FOR SELECT USING (true);

-- Beispiel-Policy für Admin-Schreibzugriff (anpassen nach Bedarf)
-- CREATE POLICY "Authenticated users can insert cars" ON cars
--     FOR INSERT WITH CHECK (auth.role() = 'authenticated');
