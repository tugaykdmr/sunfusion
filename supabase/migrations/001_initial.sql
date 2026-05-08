-- SunFusion initial schema
-- Multi-tenant foundations with RLS policies.

create extension if not exists pgcrypto;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type public.user_role as enum (
      'SUPERADMIN',
      'MUDUR',
      'YONETICI',
      'KULLANICI',
      'GOZLEMCI'
    );
  end if;
end $$;

create or replace function public.current_tenant_id()
returns uuid
language sql
stable
as $$
  select nullif(
    coalesce(
      (current_setting('request.jwt.claims', true)::jsonb ->> 'tenant_id'),
      (current_setting('request.jwt.claims', true)::jsonb -> 'app_metadata' ->> 'tenant_id')
    ),
    ''
  )::uuid;
$$;

create or replace function public.current_user_role()
returns text
language sql
stable
as $$
  select coalesce(
    current_setting('request.jwt.claims', true)::jsonb ->> 'role',
    current_setting('request.jwt.claims', true)::jsonb -> 'app_metadata' ->> 'role',
    ''
  );
$$;

create table if not exists public.tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text,
  contract_start date not null,
  contract_end date not null,
  active_modules text[] not null default '{}'::text[],
  supported_languages text[] not null default '{"tr"}'::text[],
  theme text not null default 'default',
  created_at timestamptz not null default now()
);

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  full_name text not null,
  username text not null,
  password_hash text not null,
  email text not null,
  phone text,
  role public.user_role not null default 'KULLANICI',
  unit text,
  title text,
  created_at timestamptz not null default now(),
  constraint users_tenant_username_key unique (tenant_id, username),
  constraint users_tenant_email_key unique (tenant_id, email)
);

create table if not exists public.user_permissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  permission_name text not null,
  created_at timestamptz not null default now(),
  constraint user_permissions_user_permission_key unique (user_id, permission_name)
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete set null,
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  action text not null,
  details jsonb not null default '{}'::jsonb,
  ip_address text,
  created_at timestamptz not null default now()
);

create index if not exists idx_users_tenant_id on public.users (tenant_id);
create index if not exists idx_user_permissions_user_id on public.user_permissions (user_id);
create index if not exists idx_audit_logs_tenant_id on public.audit_logs (tenant_id);
create index if not exists idx_audit_logs_user_id on public.audit_logs (user_id);
create index if not exists idx_audit_logs_created_at on public.audit_logs (created_at desc);

alter table public.tenants enable row level security;
alter table public.users enable row level security;
alter table public.user_permissions enable row level security;
alter table public.audit_logs enable row level security;

drop policy if exists tenants_select_policy on public.tenants;
create policy tenants_select_policy
on public.tenants
for select
to authenticated
using (
  id = public.current_tenant_id()
  or public.current_user_role() = 'SUPERADMIN'
);

drop policy if exists tenants_insert_policy on public.tenants;
create policy tenants_insert_policy
on public.tenants
for insert
to authenticated
with check (public.current_user_role() = 'SUPERADMIN');

drop policy if exists tenants_update_policy on public.tenants;
create policy tenants_update_policy
on public.tenants
for update
to authenticated
using (
  id = public.current_tenant_id()
  or public.current_user_role() = 'SUPERADMIN'
)
with check (
  id = public.current_tenant_id()
  or public.current_user_role() = 'SUPERADMIN'
);

drop policy if exists tenants_delete_policy on public.tenants;
create policy tenants_delete_policy
on public.tenants
for delete
to authenticated
using (public.current_user_role() = 'SUPERADMIN');

-- Tenant isolation for users table is based on users.tenant_id.
drop policy if exists users_select_policy on public.users;
create policy users_select_policy
on public.users
for select
to authenticated
using (
  tenant_id = public.current_tenant_id()
  or public.current_user_role() = 'SUPERADMIN'
);

drop policy if exists users_insert_policy on public.users;
create policy users_insert_policy
on public.users
for insert
to authenticated
with check (
  tenant_id = public.current_tenant_id()
  or public.current_user_role() = 'SUPERADMIN'
);

drop policy if exists users_update_policy on public.users;
create policy users_update_policy
on public.users
for update
to authenticated
using (
  tenant_id = public.current_tenant_id()
  or public.current_user_role() = 'SUPERADMIN'
)
with check (
  tenant_id = public.current_tenant_id()
  or public.current_user_role() = 'SUPERADMIN'
);

drop policy if exists users_delete_policy on public.users;
create policy users_delete_policy
on public.users
for delete
to authenticated
using (
  tenant_id = public.current_tenant_id()
  or public.current_user_role() = 'SUPERADMIN'
);

drop policy if exists user_permissions_select_policy on public.user_permissions;
create policy user_permissions_select_policy
on public.user_permissions
for select
to authenticated
using (
  exists (
    select 1
    from public.users u
    where u.id = user_permissions.user_id
      and (
        u.tenant_id = public.current_tenant_id()
        or public.current_user_role() = 'SUPERADMIN'
      )
  )
);

drop policy if exists user_permissions_insert_policy on public.user_permissions;
create policy user_permissions_insert_policy
on public.user_permissions
for insert
to authenticated
with check (
  exists (
    select 1
    from public.users u
    where u.id = user_permissions.user_id
      and (
        u.tenant_id = public.current_tenant_id()
        or public.current_user_role() = 'SUPERADMIN'
      )
  )
);

drop policy if exists user_permissions_update_policy on public.user_permissions;
create policy user_permissions_update_policy
on public.user_permissions
for update
to authenticated
using (
  exists (
    select 1
    from public.users u
    where u.id = user_permissions.user_id
      and (
        u.tenant_id = public.current_tenant_id()
        or public.current_user_role() = 'SUPERADMIN'
      )
  )
)
with check (
  exists (
    select 1
    from public.users u
    where u.id = user_permissions.user_id
      and (
        u.tenant_id = public.current_tenant_id()
        or public.current_user_role() = 'SUPERADMIN'
      )
  )
);

drop policy if exists user_permissions_delete_policy on public.user_permissions;
create policy user_permissions_delete_policy
on public.user_permissions
for delete
to authenticated
using (
  exists (
    select 1
    from public.users u
    where u.id = user_permissions.user_id
      and (
        u.tenant_id = public.current_tenant_id()
        or public.current_user_role() = 'SUPERADMIN'
      )
  )
);

drop policy if exists audit_logs_select_policy on public.audit_logs;
create policy audit_logs_select_policy
on public.audit_logs
for select
to authenticated
using (
  tenant_id = public.current_tenant_id()
  or public.current_user_role() = 'SUPERADMIN'
);

drop policy if exists audit_logs_insert_policy on public.audit_logs;
create policy audit_logs_insert_policy
on public.audit_logs
for insert
to authenticated
with check (
  tenant_id = public.current_tenant_id()
  or public.current_user_role() = 'SUPERADMIN'
);

drop policy if exists audit_logs_update_policy on public.audit_logs;
create policy audit_logs_update_policy
on public.audit_logs
for update
to authenticated
using (
  tenant_id = public.current_tenant_id()
  or public.current_user_role() = 'SUPERADMIN'
)
with check (
  tenant_id = public.current_tenant_id()
  or public.current_user_role() = 'SUPERADMIN'
);

drop policy if exists audit_logs_delete_policy on public.audit_logs;
create policy audit_logs_delete_policy
on public.audit_logs
for delete
to authenticated
using (
  tenant_id = public.current_tenant_id()
  or public.current_user_role() = 'SUPERADMIN'
);
