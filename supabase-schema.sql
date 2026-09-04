-- 1) Create the tables in Supabase SQL Editor.
create table if not exists public.admins (user_id uuid primary key references auth.users(id) on delete cascade);
create table if not exists public.categories (id uuid primary key default gen_random_uuid(), name text not null, icon text default '▦', sort_order int default 0, active boolean default true, created_at timestamptz default now());
create table if not exists public.products (id uuid primary key default gen_random_uuid(), name text not null, price numeric not null, old_price numeric, category uuid references public.categories(id), badge text, image text, description text, featured boolean default false, active boolean default true, created_at timestamptz default now());
create table if not exists public.banners (id uuid primary key default gen_random_uuid(), title text not null, subtitle text, button text, image text, sort_order int default 0, active boolean default true, created_at timestamptz default now());

alter table public.admins enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.banners enable row level security;

create or replace function public.is_admin() returns boolean language sql stable security definer set search_path=public as $$ select exists(select 1 from public.admins where user_id=auth.uid()); $$;

create policy "public read active categories" on public.categories for select using (active=true);
create policy "admins manage categories" on public.categories for all using (public.is_admin()) with check (public.is_admin());
create policy "public read active products" on public.products for select using (active=true);
create policy "admins manage products" on public.products for all using (public.is_admin()) with check (public.is_admin());
create policy "public read active banners" on public.banners for select using (active=true);
create policy "admins manage banners" on public.banners for all using (public.is_admin()) with check (public.is_admin());
create policy "admins read admins" on public.admins for select using (public.is_admin());

insert into public.categories(name,icon,sort_order) values
('الأجهزة الكهربائية','⚡',1),('أدوات ومعدات','🔧',2),('البناء ومواد البناء','▤',3),('الديكور والمنزل','⌂',4),('الحديقة والهواء الطلق','◒',5),('السباكة','♒',6),('الإضاءة','◉',7),('السلامة والحماية','⬡',8)
on conflict do nothing;

insert into public.banners(title,subtitle,button,sort_order) values ('كل ما تحتاجه لبناء وتجديد منزلك','جودة عالية، أسعار واضحة وتجربة شراء بسيطة.','تسوق الآن',1) on conflict do nothing;

-- 2) After creating your admin user in Authentication > Users, run:
-- insert into public.admins(user_id) values ('PUT-USER-UUID-HERE');

-- 3) Storage: create a public bucket named product-images from Storage UI.
-- Then add policies allowing admins to upload/delete and public users to read objects.
