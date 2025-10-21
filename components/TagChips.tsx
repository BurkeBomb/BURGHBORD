
'use client';
import { useState } from 'react';
import { supabaseBrowser } from '@/lib/supabaseBrowser';

type Props = { taskId: string; initial: string[]; onChange?: (tags: string[]) => void };

export default function TagChips({ taskId, initial, onChange }: Props) {
  const [tags, setTags] = useState<string[]>(initial);
  const [input, setInput] = useState('');

  async function addTag(name: string) {
    const supabase = supabaseBrowser();
    const { error } = await supabase.rpc('fn_tag_task', { task_id: taskId, tag_name: name });
    if (!error) {
      const next = Array.from(new Set([...tags, name]));
      setTags(next);
      onChange?.(next);
    }
  }

  async function removeTag(name: string) {
    const supabase = supabaseBrowser();
    const { error } = await supabase.rpc('fn_untag_task', { task_id: taskId, tag_name: name });
    if (!error) {
      const next = tags.filter(t => t !== name);
      setTags(next);
      onChange?.(next);
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {tags.map(t => (
          <span key={t} className="badge">{t}
            <button className="ml-1 text-white/60 hover:text-white" onClick={()=>removeTag(t)}>×</button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input className="input" placeholder="Add tag (e.g., Discovery)" value={input} onChange={e=>setInput(e.target.value)} />
        <button className="btn" onClick={()=>{ if(input.trim()) { addTag(input.trim()); setInput(''); } }}>Add</button>
      </div>
    </div>
  )
}
