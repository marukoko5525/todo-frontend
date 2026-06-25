import type { Task, TaskRequest } from '../types/task'
import { TaskItem } from './TaskItem'

interface Props {
  tasks: Task[]
  loading: boolean
  onToggle: (task: Task) => Promise<void>
  onEdit: (task: Task) => void
  onDelete: (id: number) => Promise<void>
}

export function TaskList({ tasks, loading, onToggle, onEdit, onDelete }: Props) {
  if (loading) {
    return (
      <div className="task-list__empty">
        <div className="spinner" aria-label="読み込み中" />
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="task-list__empty">
        <span className="task-list__empty-icon" aria-hidden="true">✓</span>
        <p className="task-list__empty-text">タスクはありません</p>
      </div>
    )
  }

  return (
    <ul className="task-list" aria-label="タスク一覧">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  )
}
