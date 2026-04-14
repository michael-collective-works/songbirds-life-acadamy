-- Seed demo data (idempotent-ish via unique titles could be added)
insert into events (title, description, date, start_time, end_time, hero_image_url, is_published) values
('Back-to-School Open House','Meet our teachers and tour classrooms. Light snacks provided.','2025-09-05','16:00','18:00',null,true),
('Family Music Day','A morning of rhythm and play. Parents and siblings welcome!','2025-10-12','10:00','12:00',null,true),
('Teacher In-Service','School closed for staff training. We appreciate your support!','2025-10-25',null,null,null,false)
on conflict do nothing;

insert into team_members (name, title, headshot_url, bio, is_active) values
('Avery Johnson','Director',null,'Early childhood educator with 12+ years of experience in play-based learning.',true),
('Jordan Lee','Lead Teacher',null,'Specializes in music and movement for early learners.',true),
('Sam Patel','Assistant Teacher',null,'Passionate about outdoor exploration and sensory play.',true)
on conflict do nothing;

insert into store_items (title, image_url, external_url, category, is_active) values
('Teal Uniform T-shirt','/teal-uniform-shirt.png','https://squareup.com/store/songbirds','uniform',true),
('Logo Cap','/teal-cap-with-logo.png','https://squareup.com/store/songbirds','merch',true),
('Music Tote','/cream-music-tote.png','https://squareup.com/store/songbirds','merch',true)
on conflict do nothing;
