import { useState, useEffect, useCallback } from 'react'
import { taskApi } from '../api/taskApi'
import type { Task, TaskRequest, FilterType } from '../types/task'

interface UseTasksReturn {
  tasks: Task[]
  filteredTasks: Task[]
  filter: FilterType
  loading: boolean
  error: string | null
  setFilter: (f: FilterType) => void
  addTask: (req: TaskRequest) => Promise<void>
  toggleComplete: (task: Task) => Promise<void>
  updateTask: (id: number, req: Partial<TaskRequest>) => Promise<void>
  deleteTask: (id: number) => Promise<void>
  clearError: () => void
}

export function useTasks(): UseTasksReturn {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filter, setFilter] = useState<FilterType>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true)
      const data = await taskApi.getAll()
      setTasks(data)
    } catch {
      setError('タスクの取得に失敗しました')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'active') return !t.completed
    if (filter === 'completed') return t.completed
    return true
  })

  const addTask = async (req: TaskRequest) => {
    try {
      const created = await taskApi.create(req)
      setTasks((prev) => [created, ...prev])
    } catch {
      setError('タスクの追加に失敗しました')
    }
  }

  const toggleComplete = async (task: Task) => {
    try {
      const updated = await taskApi.update(task.id, {
        title: task.title,
        completed: !task.completed,
      })
      setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)))
    } catch {
      setError('更新に失敗しました')
    }
  }

  const updateTask = async (id: number, req: Partial<TaskRequest>) => {
    try {
      const updated = await taskApi.update(id, req)
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)))
    } catch {
      setError('更新に失敗しました')
    }
  }

  const deleteTask = async (id: number) => {
    try {
      await taskApi.delete(id)
      setTasks((prev) => prev.filter((t) => t.id !== id))
    } catch {
      setError('削除に失敗しました')
    }
  }

  return {
    tasks,
    filteredTasks,
    filter,
    loading,
    error,
    setFilter,
    addTask,
    toggleComplete,
    updateTask,
    deleteTask,
    clearError: () => setError(null),
  }
}
