-- Seed Events
insert into public.events (title, description, date, start_time, end_time, hero_image_url, is_published) values
('Back-to-School Open House', 'Meet our teachers and tour classrooms. Light snacks provided.', '2025-09-05', '16:00', '18:00', 'https://example.com/images/open-house.jpg', true),
('Family Music Day', 'A morning of rhythm and play. Parents and siblings welcome!', '2025-10-12', '10:00', '12:00', 'https://example.com/images/music-day.jpg', true),
('Teacher In-Service', 'School closed for staff training. We appreciate your support!', '2025-10-25', null, null, null, false),
('Fall Festival', 'Face painting, pumpkin crafts, and treats!', '2025-10-31', '15:00', '17:00', 'https://example.com/images/fall-fest.jpg', true),
('Parent-Teacher Meetings', 'Schedule your meeting with your child''s teacher.', '2025-11-15', null, null, null, true);

-- Seed Team Members
insert into public.team_members (name, title, headshot_url, bio, is_active) values
('Avery Johnson', 'Director', 'https://example.com/images/avery.jpg', 'Early childhood educator with 12+ years of experience in play-based learning.', true),
('Jordan Lee', 'Lead Teacher', 'https://example.com/images/jordan.jpg', 'Specializes in music and movement for early learners.', true),
('Sam Patel', 'Assistant Teacher', 'https://example.com/images/sam.jpg', 'Passionate about outdoor exploration and sensory play.', true),
('Casey Nguyen', 'Teacher''s Aide', 'https://example.com/images/casey.jpg', 'Supports centers and small group learning.', true),
('Morgan Smith', 'Program Coordinator', 'https://example.com/images/morgan.jpg', 'Coordinates family engagement and events.', true);

-- Seed Store Items
insert into public.store_items (title, image_url, external_url, category, is_active) values
('Teal Uniform T-shirt', 'https://example.com/images/teal-shirt.png', 'https://squareup.com/store/songbirds', 'uniform', true),
('Logo Cap', 'https://example.com/images/logo-cap.png', 'https://squareup.com/store/songbirds', 'merch', true),
('Music Tote', 'https://example.com/images/music-tote.png', 'https://squareup.com/store/songbirds', 'merch', true),
('Zip Hoodie', 'https://example.com/images/hoodie.png', 'https://squareup.com/store/songbirds', 'merch', true),
('Water Bottle', 'https://example.com/images/bottle.png', 'https://squareup.com/store/songbirds', 'merch', true),
('Polo Shirt', 'https://example.com/images/polo.png', 'https://squareup.com/store/songbirds', 'uniform', true);

-- Seed Applications
insert into public.applications (first_name, last_name, email, phone, kind, status) values
('Taylor', 'Morgan', 'taylor@example.com', '555-123-4567', 'employment', 'new'),
('Riley', 'Chen', 'riley@example.com', '555-222-3344', 'volunteer', 'reviewed'),
('Jamie', 'Brooks', 'jamie@example.com', '555-333-7788', 'employment', 'new'),
('Alex', 'Diaz', 'alex@example.com', '555-989-1212', 'volunteer', 'archived'),
('Sydney', 'Park', 'sydney@example.com', '555-444-9900', 'employment', 'new');
