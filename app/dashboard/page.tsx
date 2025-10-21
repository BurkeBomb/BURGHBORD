
'use client';
import { useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabaseBrowser';

type Row = { status: string; count: number };

export default function DashboardPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [byTag, setByTag] = useState<{ tag: string; count: number }[]>([]);

  useEffect(()=>{
    const supabase = supabaseBrowser();
    (async ()=>{
      const { data: s } = await supabase.from('tasks').select('status, count:id').group('status');
      setRows((s as any) ?? []);
      const { data: t } = await supabase.from('v_assigned_task_counts_by_tag').select('*');
      setByTag((t as any) ?? []);
    })();
  }, []);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="card">
        <h3 className="font-semibold mb-3">By Status</h3>
        <ul className="space-y-2">
          {rows.map(r => (
            <li key={r.status} className="flex justify-between">
              <span>{r.status.replace('_',' ')}</span>
              <span className="badge">{r.count}</span>
            </li>
          ))}
          {rows.length===0 && <p>No data yet.</p>}
        </ul>
      </div>
      <div className="card">
        <h3 className="font-semibold mb-3">Assigned Task Counts by Tag</h3>
        <ul className="space-y-2">
          {byTag.map(r => (
            <li key={r.tag} className="flex justify-between">
              <span>{r.tag}</span>
              <span className="badge">{r.count}</span>
            </li>
          ))}
          {byTag.length===0 && <p>No data yet.</p>}
        </ul>
      </div>
    </div>
  )
}
