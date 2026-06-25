import { useState } from 'react'
import type { Task } from '../types/task'

interface Props {
  task: Task
  onToggle: (task: Task) => Promise<void>
  onEdit: (task: Task) => void
  onDelete: (id: number) => Promise<void>
}

export function TaskItem({ task, onToggle, onEdit, onDelete }: Props) {
  const [toggling, setToggling] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleToggle = async () => {
    setToggling(true)
    await onToggle(task)
    setToggling(false)
  }

  const handleDelete = async () => {
    setDeleting(true)
    await onDelete(task.id)
    // コンポーネントがアンマウントされるので setDeleting(false) は不要
  }

  return (
    <li className={`task-item ${task.completed ? 'task-item--completed' : ''} ${deleting ? 'task-item--deleting' : ''}`}>
      <button
        className={`task-item__check ${toggling ? 'task-item__check--spinning' : ''}`}
        onClick={handleToggle}
        disabled={toggling}
        aria-label={task.completed ? '未完了に戻す' : '完了にする'}
        aria-pressed={task.completed}
      >
        {task.completed && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      <div className="task-item__body">
        <span className="task-item__title">{task.title}</span>
        {task.description && (
          <span className="task-item__desc">{task.description}</span>
        )}
      </div>

      <div className="task-item__actions">
        <button
          className="task-item__btn task-item__btn--edit"
          onClick={() => onEdit(task)}
          aria-label="編集"
          disabled={deleting}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M11.5 2.5a1.414 1.414 0 0 1 2 2L5 13H3v-2L11.5 2.5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          className="task-item__btn task-item__btn--delete"
          onClick={handleDelete}
          aria-label="削除"
          disabled={deleting}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M2 4h12M5 4V2h6v2M6 7v5M10 7v5M3 4l1 9a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1l1-9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </li>
  )
}
