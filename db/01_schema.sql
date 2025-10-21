
-- 01_schema.sql
-- Enable pgcrypto for gen_random_uuid (Supabase usually has this)
create extension if not exists pgcrypto;

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  status text not null default 'OPEN' check (status in ('OPEN','IN_PROGRESS','AWAITING_FEEDBACK','CLOSED')),
  assignee uuid references auth.users(id) on delete set null,
  created_by uuid references auth.users(id) on delete set null,
  due_date date,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists public.tags (
  id bigserial primary key,
  name text unique not null
);

create table if not exists public.task_tags (
  task_id uuid references public.tasks(id) on delete cascade,
  tag_id bigint references public.tags(id) on delete cascade,
  created_at timestamp with time zone default now(),
  primary key (task_id, tag_id)
);

-- triggers
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end$$;

drop trigger if exists trg_tasks_updated on public.tasks;
create trigger trg_tasks_updated before update on public.tasks
for each row execute procedure public.set_updated_at();

-- RLS
alter table public.tasks enable row level security;
alter table public.tags enable row level security;
alter table public.task_tags enable row level security;

-- Policies: tasks
drop policy if exists "tasks_select_own_or_assigned" on public.tasks;
create policy "tasks_select_own_or_assigned" on public.tasks
for select using (
  auth.role() = 'service_role' or
  created_by = auth.uid() or assignee = auth.uid()
);

drop policy if exists "tasks_insert_auth" on public.tasks;
create policy "tasks_insert_auth" on public.tasks
for insert with check (auth.role() = 'service_role' or created_by = auth.uid());

drop policy if exists "tasks_update_own_or_assigned" on public.tasks;
create policy "tasks_update_own_or_assigned" on public.tasks
for update using (auth.role() = 'service_role' or created_by = auth.uid() or assignee = auth.uid());

drop policy if exists "tasks_delete_admin_only" on public.tasks;
create policy "tasks_delete_admin_only" on public.tasks
for delete using (false); -- lock deletes in phase 1

-- Policies: tags (read all, insert via RPC)
drop policy if exists "tags_select_all" on public.tags;
create policy "tags_select_all" on public.tags for select using (true);

drop policy if exists "tags_insert_auth" on public.tags;
create policy "tags_insert_auth" on public.tags for insert with check (auth.uid() is not null);

-- Policies: task_tags
drop policy if exists "task_tags_select_related" on public.task_tags;
create policy "task_tags_select_related" on public.task_tags
for select using (
  exists (select 1 from public.tasks t where t.id = task_id and (t.created_by = auth.uid() or t.assignee = auth.uid() or auth.role()='service_role'))
);

drop policy if exists "task_tags_insert_related" on public.task_tags;
create policy "task_tags_insert_related" on public.task_tags
for insert with check (
  exists (select 1 from public.tasks t where t.id = task_id and (t.created_by = auth.uid() or t.assignee = auth.uid() or auth.role()='service_role'))
);

drop policy if exists "task_tags_delete_related" on public.task_tags;
create policy "task_tags_delete_related" on public.task_tags
for delete using (
  exists (select 1 from public.tasks t where t.id = task_id and (t.created_by = auth.uid() or t.assignee = auth.uid() or auth.role()='service_role'))
);
