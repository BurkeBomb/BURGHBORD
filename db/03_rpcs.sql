
-- 03_rpcs.sql
create or replace function public.fn_tag_task(task_id uuid, tag_name text)
returns void language plpgsql security definer as $$
declare
  v_tag_id bigint;
begin
  -- ensure caller has rights via RLS on task_tags insert (policy checks task ownership/assignment)
  insert into public.tags(name)
  values (tag_name)
  on conflict (name) do update set name = excluded.name
  returning id into v_tag_id;

  insert into public.task_tags(task_id, tag_id)
  values (task_id, v_tag_id)
  on conflict do nothing;
end$$;

create or replace function public.fn_untag_task(task_id uuid, tag_name text)
returns void language plpgsql security definer as $$
declare
  v_tag_id bigint;
begin
  select id into v_tag_id from public.tags where name = tag_name;
  if v_tag_id is not null then
    delete from public.task_tags tt
    where tt.task_id = fn_untag_task.task_id and tt.tag_id = v_tag_id;
  end if;
end$$;
