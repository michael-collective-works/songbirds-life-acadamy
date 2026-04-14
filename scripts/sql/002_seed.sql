-- Optional seed
insert into events (title, date, time, description)
values
('Family Music Morning','2025-09-14','9:00–10:30 AM','Sing-alongs, movement, and classroom tours.')
on conflict do nothing;

insert into team_members (name, title, bio)
values
('Your Name','Director','Educator with a passion for music and early childhood development.')
on conflict do nothing;

insert into store_items (title, external_url, category)
values
('Uniform T-Shirt (Teal)','http://feathered-insights-by-songbirds.square.site/','uniform')
on conflict do nothing;
