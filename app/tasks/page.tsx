
'use client';
import TaskForm from '@/components/TaskForm';
import TaskList from '@/components/TaskList';

export default function TasksPage() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <TaskForm onCreated={()=>{}} />
      <div>
        <TaskList />
      </div>
    </div>
  );
}
