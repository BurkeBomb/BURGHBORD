
'use client';
import { useCallback, useState } from 'react';
import TaskForm from '@/components/TaskForm';
import TaskList from '@/components/TaskList';

export default function TasksPage() {
  const [refreshToken, setRefreshToken] = useState(0);
  const handleCreated = useCallback(() => {
    setRefreshToken((token) => token + 1);
  }, []);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <TaskForm onCreated={handleCreated} />
      <div>
        <TaskList refreshToken={refreshToken} />
      </div>
    </div>
  );
}
