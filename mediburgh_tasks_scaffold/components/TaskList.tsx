
'use client';
import { useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabaseBrowser';
import TagChips from './TagChips';

type Task = {
  id: string;
  title: string;
  description: string | null;
  status: 'OPEN'|'IN_PROGRESS'|'AWAITING_FEEDBACK'|'CLOSED';
  assignee: string | null;
  created_by: string | null;
  due_date: string | null;
  tags: string[];
};

export default function TaskList() {
  const [items, setItems] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  async function load() {
    setLoading(true);
    const supabase = supabaseBrowser();
    const query = supabase.from('v_tasks_browser').select('*').order('created_at', { ascending: false });
    const { data, error } = await query;
    if (!error && data) setItems(data as any);
    setLoading(false);
  }

  useEffect(()=>{ load(); }, []);

  async function updateStatus(id: string, status: string) {
    const supabase = supabaseBrowser();
    await supabase.from('tasks').update({ status }).eq('id', id);
    await load();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <select className="select" value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}>
          <option value="ALL">All</option>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="AWAITING_FEEDBACK">Awaiting Feedback</option>
          <option value="CLOSED">Closed</option>
        </select>
        <button className="btn" onClick={load}>Refresh</button>
      </div>

      {loading && <p>Loading...</p>}
      {!loading && items
        .filter(t => statusFilter==='ALL' ? true : t.status===statusFilter)
        .map(t => (
        <div key={t.id} className="card space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{t.title}</h3>
            <select className="select" value={t.status} onChange={e=>updateStatus(t.id, e.target.value)}>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="AWAITING_FEEDBACK">Awaiting Feedback</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>
          {t.description && <p className="text-white/80">{t.description}</p>}
          <div className="text-sm text-white/60">Due: {t.due_date ?? '—'}</div>
          <TagChips taskId={t.id} initial={t.tags ?? []} onChange={()=>{}} />
        </div>
      ))}
      {!loading && items.length===0 && <p>No tasks yet.</p>}
    </div>
  )
}
