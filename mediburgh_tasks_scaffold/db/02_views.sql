
-- 02_views.sql
create or replace view public.v_tasks_browser as
select
  t.id, t.title, t.description, t.status, t.assignee, t.created_by, t.due_date, t.created_at,
  coalesce(array_agg(distinct tg.name) filter (where tg.name is not null), '{}') as tags
from public.tasks t
left join public.task_tags tt on tt.task_id = t.id
left join public.tags tg on tg.id = tt.tag_id
group by t.id;

create or replace view public.v_assigned_task_counts_by_tag as
select tg.name as tag, count(distinct t.id) as count
from public.tasks t
join public.task_tags tt on tt.task_id = t.id
join public.tags tg on tg.id = tt.tag_id
where t.assignee is not null
group by tg.name;
