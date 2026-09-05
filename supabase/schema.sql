-- Expert Parket og Mál: admin storage.
--
-- Run this once in the Supabase SQL editor, then set VITE_SUPABASE_URL and
-- VITE_SUPABASE_ANON_KEY in the environment. The app switches from browser
-- storage to these tables on the next build, with no code change.
--
-- Read the row level security section carefully: the anon key ships in the
-- browser bundle, so every rule below is what actually protects the data.

-- ---------------------------------------------------------------- admin list
-- Only the addresses in this table may write. Being signed in is not enough.
create table if not exists admin_emails (
  email text primary key,
  added_at timestamptz not null default now()
);

-- Row level security with NO policy at all, and that is the point. This table
-- decides who is an administrator, so nothing holding the anon key may read it
-- and, far more importantly, nothing may write to it: a project created with
-- "automatically expose new tables" left on would otherwise let any visitor
-- add their own address here and become an admin. is_admin() below is
-- security definer, so it still reads the table; the dashboard and the service
-- role still manage it. Everyone else sees an empty table.
alter table admin_emails enable row level security;

-- The address that may sign in to /admin. It must also exist as a user under
-- Authentication in the Supabase dashboard: this table says who is allowed,
-- Supabase Auth says who they are, and both are required.
insert into admin_emails (email) values ('verk@expertparket.is')
  on conflict (email) do nothing;

create or replace function is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from admin_emails
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

-- -------------------------------------------------------------------- posts
create table if not exists posts (
  id text primary key,
  status text not null default 'draft' check (status in ('draft', 'published')),
  source_lang text not null default 'is' check (source_lang in ('is', 'en', 'pl')),
  cover text,
  tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz,
  translations jsonb not null default '{}'::jsonb
);

create index if not exists posts_published_idx on posts (status, published_at desc);

alter table posts enable row level security;

drop policy if exists "published posts are public" on posts;
create policy "published posts are public"
  on posts for select
  using (status = 'published');

drop policy if exists "admins read every post" on posts;
create policy "admins read every post"
  on posts for select to authenticated
  using (is_admin());

drop policy if exists "admins write posts" on posts;
create policy "admins write posts"
  on posts for all to authenticated
  using (is_admin()) with check (is_admin());

-- ---------------------------------------------------------------- enquiries
-- The only table holding personal data. Note what is missing: there is no
-- public select policy, so the anon key can write a message and can never read
-- one back. Keep it that way.
-- The length limits are deliberate: the insert policy has to be open for
-- anonymous visitors, so the table itself bounds what a flood can cost.
create table if not exists enquiries (
  id text primary key,
  ts timestamptz not null default now(),
  name text not null default '' check (char_length(name) <= 200),
  contact text not null default '' check (char_length(contact) <= 200),
  service text not null default '' check (char_length(service) <= 120),
  message text not null default '' check (char_length(message) <= 5000),
  ref text,
  path text not null default '/',
  lang text not null default 'is',
  delivery text not null default 'email' check (delivery in ('email', 'formspree', 'mailto')),
  status text not null default 'new' check (status in ('new', 'open', 'done')),
  note text not null default ''
);

create index if not exists enquiries_ts_idx on enquiries (ts desc);
create index if not exists enquiries_status_idx on enquiries (status, ts desc);

alter table enquiries enable row level security;

drop policy if exists "anyone may send an enquiry" on enquiries;
create policy "anyone may send an enquiry"
  on enquiries for insert
  with check (true);

drop policy if exists "admins read enquiries" on enquiries;
create policy "admins read enquiries"
  on enquiries for select to authenticated
  using (is_admin());

drop policy if exists "admins update enquiries" on enquiries;
create policy "admins update enquiries"
  on enquiries for update to authenticated
  using (is_admin()) with check (is_admin());

drop policy if exists "admins delete enquiries" on enquiries;
create policy "admins delete enquiries"
  on enquiries for delete to authenticated
  using (is_admin());

-- Re-running this file on a database created before the mail route existed
-- has to widen the constraint too, or every enquiry the site sends is
-- rejected by the check rather than by anything the visitor did.
do $$
begin
  alter table enquiries drop constraint if exists enquiries_delivery_check;
  alter table enquiries add constraint enquiries_delivery_check
    check (delivery in ('email', 'formspree', 'mailto'));
end $$;

-- ------------------------------------------------------------ campaign links
create table if not exists tracked_links (
  id text primary key,
  code text not null unique,
  label text not null default '',
  target text not null default '/',
  note text not null default '',
  created_at timestamptz not null default now(),
  archived boolean not null default false
);

alter table tracked_links enable row level security;

-- /l/<code> has to resolve for visitors, so the row is readable. It holds no
-- personal data: a label, a destination path and a code.
drop policy if exists "links resolve for everyone" on tracked_links;
create policy "links resolve for everyone"
  on tracked_links for select
  using (true);

drop policy if exists "admins write links" on tracked_links;
create policy "admins write links"
  on tracked_links for all to authenticated
  using (is_admin()) with check (is_admin());

-- ------------------------------------------------------------------- visits
-- No IP, no cookie, no cross-site identifier. `session` is a random per-tab
-- string generated in the browser and thrown away when the tab closes.
create table if not exists visit_events (
  id text primary key,
  ts timestamptz not null default now(),
  path text not null check (char_length(path) <= 300),
  lang text not null check (lang in ('is', 'en', 'pl')),
  ref text,
  referrer text,
  device text not null,
  session text not null,
  entry boolean not null default false
);

create index if not exists visit_events_ts_idx on visit_events (ts desc);
create index if not exists visit_events_ref_idx on visit_events (ref);

alter table visit_events enable row level security;

-- Visitors are anonymous, so the insert has to be open. Nothing can be read
-- back, so a forged row costs a wrong number in the dashboard and nothing else.
-- Rate limiting belongs in front of this if it ever becomes a problem.
drop policy if exists "anyone may record a visit" on visit_events;
create policy "anyone may record a visit"
  on visit_events for insert
  with check (true);

drop policy if exists "admins read visits" on visit_events;
create policy "admins read visits"
  on visit_events for select to authenticated
  using (is_admin());

drop policy if exists "admins clear visits" on visit_events;
create policy "admins clear visits"
  on visit_events for delete to authenticated
  using (is_admin());

-- ------------------------------------------------------------- link clicks
create table if not exists link_clicks (
  id text primary key,
  ts timestamptz not null default now(),
  code text not null,
  referrer text,
  device text not null
);

create index if not exists link_clicks_code_idx on link_clicks (code, ts desc);

alter table link_clicks enable row level security;

drop policy if exists "anyone may record a click" on link_clicks;
create policy "anyone may record a click"
  on link_clicks for insert
  with check (true);

drop policy if exists "admins read clicks" on link_clicks;
create policy "admins read clicks"
  on link_clicks for select to authenticated
  using (is_admin());

drop policy if exists "admins clear clicks" on link_clicks;
create policy "admins clear clicks"
  on link_clicks for delete to authenticated
  using (is_admin());
