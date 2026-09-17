import { useCallback, useEffect, useMemo, useState } from 'react';
import { listTasks } from './api';

export function useTasks(status, query) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const load = useCallback(() => { setLoading(true); return listTasks(status).then(setTasks).finally(() => setLoading(false)); }, [status]);
  useEffect(() => { load(); }, [load]);
  const shown = useMemo(() => tasks.filter((task) => task.title.toLowerCase().includes(query.toLowerCase())), [tasks, query]);
  return { tasks, shown, loading, load };
}
