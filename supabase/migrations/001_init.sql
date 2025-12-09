-- Create exhibitors table
create table if not exists exhibitors (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  type text not null,
  products text,
  city text not null,
  business_volume numeric not null default 0,
  visitors integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create gallery_photos table
create table if not exists gallery_photos (
  id text primary key default gen_random_uuid()::text,
  url text not null,
  title text not null,
  category text not null,
  date text not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS (Row Level Security)
alter table exhibitors enable row level security;
alter table gallery_photos enable row level security;

-- Create policies for public access (você pode restringir depois com autenticação)
create policy "Allow public read access" on exhibitors
  for select using (true);

create policy "Allow public insert access" on exhibitors
  for insert with check (true);

create policy "Allow public update access" on exhibitors
  for update using (true);

create policy "Allow public delete access" on exhibitors
  for delete using (true);

create policy "Allow public read access" on gallery_photos
  for select using (true);

create policy "Allow public insert access" on gallery_photos
  for insert with check (true);

create policy "Allow public delete access" on gallery_photos
  for delete using (true);

-- Create indexes for better performance
create index if not exists idx_exhibitors_city on exhibitors(city);
create index if not exists idx_exhibitors_type on exhibitors(type);
create index if not exists idx_gallery_photos_date on gallery_photos(date);
