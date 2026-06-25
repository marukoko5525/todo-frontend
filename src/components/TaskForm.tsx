import { useState, useEffect, useRef } from 'react'
import type { Task, TaskRequest } from '../types/task'

interface Props {
  onSubmit: (req: TaskRequest) => Promise<void>
  editingTask?: Task | null
  onCancelEdit?: () => void
}

export function TaskForm({ onSubmit, editingTask, onCancelEdit }: Props) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [titleError, setTitleError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title)
      setDescription(editingTask.description ?? '')
      inputRef.current?.focus()
    }
  }, [editingTask])

  const validate = () => {
    if (!title.trim()) {
      setTitleError('タイトルを入力してください')
      return false
    }
    if (title.length > 255) {
      setTitleError('255文字以内で入力してください')
      return false
    }
    setTitleError('')
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      await onSubmit({ title: title.trim(), description: description.trim() || undefined })
      setTitle('')
      setDescription('')
      setTitleError('')
    } finally {
      setSubmitting(false)
    }
  }

  const isEditing = !!editingTask

  return (
    <form onSubmit={handleSubmit} className={`task-form ${isEditing ? 'task-form--editing' : ''}`}>
      <div className="task-form__fields">
        <div className="task-form__field">
          <input
            ref={inputRef}
            type="text"
            className={`task-form__input ${titleError ? 'task-form__input--error' : ''}`}
            placeholder={isEditing ? 'タイトルを編集' : 'タスクを追加…'}
            value={title}
            onChange={(e) => {
              setTitle(e.target.value)
              if (titleError) setTitleError('')
            }}
            disabled={submitting}
            aria-label="タスクタイトル"
          />
          {titleError && <span className="task-form__error">{titleError}</span>}
        </div>
        <input
          type="text"
          className="task-form__input task-form__input--desc"
          placeholder="メモ（任意）"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={submitting}
          aria-label="メモ"
        />
      </div>
      <div className="task-form__actions">
        {isEditing && (
          <button
            type="button"
            className="btn btn--ghost"
            onClick={onCancelEdit}
            disabled={submitting}
          >
            キャンセル
          </button>
        )}
        <button
          type="submit"
          className={`btn ${isEditing ? 'btn--primary' : 'btn--add'}`}
          disabled={submitting}
        >
          {submitting ? '…' : isEditing ? '保存' : '追加'}
        </button>
      </div>
    </form>
  )
}
