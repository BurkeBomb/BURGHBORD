
'use client';
import { FormEvent, useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabaseBrowser';

export default function TaskForm({ onCreated }: { onCreated: () => void }) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [due, setDue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    let ignore = false;
    async function loadUser() {
      const supabase = supabaseBrowser();
      const { data } = await supabase.auth.getUser();
      if (!ignore) {
        setIsAuthenticated(Boolean(data.user));
      }
    }
    loadUser();
    return () => {
      ignore = true;
    };
  }, []);

  async function createTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }
    if (isAuthenticated === false) {
      setError('You must be signed in to create a task.');
      return;
    }
    setIsSubmitting(true);
    const supabase = supabaseBrowser();
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    if (!userId) {
      setIsSubmitting(false);
      setError('You must be signed in to create a task.');
      return;
    }
    const { error: insertError } = await supabase
      .from('tasks')
      .insert({
        title: title.trim(),
        description: desc.trim() || null,
        status: 'OPEN',
        created_by: userId,
        assignee: userId,
        due_date: due || null
      });
    if (insertError) {
      setError(insertError.message);
    } else {
      setTitle('');
      setDesc('');
      setDue('');
      onCreated();
    }
    setIsSubmitting(false);
  }

  return (
    <form className="card space-y-3" onSubmit={createTask} aria-describedby="task-form-error" noValidate>
      <h3 className="font-semibold">Create Task</h3>
      <div>
        <label className="label" htmlFor="task-title">Title</label>
        <input
          id="task-title"
          className="input"
          value={title}
          onChange={e=>setTitle(e.target.value)}
          placeholder="Follow up with Discovery on claim 123..."
          required
        />
      </div>
      <div>
        <label className="label" htmlFor="task-desc">Description</label>
        <textarea
          id="task-desc"
          className="input"
          rows={3}
          value={desc}
          onChange={e=>setDesc(e.target.value)}
          placeholder="Notes, context, claim numbers..."
        />
      </div>
      <div>
        <label className="label" htmlFor="task-due">Due date</label>
        <input
          id="task-due"
          className="input"
          type="date"
          value={due}
          onChange={e=>setDue(e.target.value)}
        />
      </div>
      <button
        className="btn btn-primary"
        type="submit"
        disabled={isSubmitting || isAuthenticated === false}
      >
        {isSubmitting ? 'Adding…' : 'Add Task'}
      </button>
      <p id="task-form-error" className="text-red-300" aria-live="polite">
        {error}
      </p>
    </form>
  )
}
