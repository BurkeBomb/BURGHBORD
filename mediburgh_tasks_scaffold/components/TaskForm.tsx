
'use client';
import { useState } from 'react';
import { supabaseBrowser } from '@/lib/supabaseBrowser';

export default function TaskForm({ onCreated }: { onCreated: () => void }) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [due, setDue] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function createTask() {
    setError(null);
    const supabase = supabaseBrowser();
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    const { error } = await supabase.from('tasks').insert({
      title, description: desc, status: 'OPEN', created_by: userId, assignee: userId, due_date: due || null
    });
    if (error) setError(error.message);
    else {
      setTitle(''); setDesc(''); setDue(''); onCreated();
    }
  }

  return (
    <div className="card space-y-3">
      <h3 className="font-semibold">Create Task</h3>
      <div>
        <div className="label">Title</div>
        <input className="input" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Follow up with Discovery on claim 123..." />
      </div>
      <div>
        <div className="label">Description</div>
        <textarea className="input" rows={3} value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Notes, context, claim numbers..." />
      </div>
      <div>
        <div className="label">Due date</div>
        <input className="input" type="date" value={due} onChange={e=>setDue(e.target.value)} />
      </div>
      <button className="btn btn-primary" onClick={createTask}>Add Task</button>
      {error && <p className="text-red-300">{error}</p>}
    </div>
  )
}
