import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TaskItem } from '../components/TaskItem'
import type { Task } from '../types/task'

const baseTask: Task = {
  id: 1,
  title: 'テストタスク',
  description: 'メモ',
  completed: false,
  createdAt: '2024-01-01T00:00:00',
  updatedAt: '2024-01-01T00:00:00',
}

describe('TaskItem', () => {
  it('タイトルとメモを表示する', () => {
    render(
      <ul>
        <TaskItem
          task={baseTask}
          onToggle={vi.fn()}
          onEdit={vi.fn()}
          onDelete={vi.fn()}
        />
      </ul>
    )
    expect(screen.getByText('テストタスク')).toBeInTheDocument()
    expect(screen.getByText('メモ')).toBeInTheDocument()
  })

  it('完了ボタンをクリックすると onToggle が呼ばれる', () => {
    const onToggle = vi.fn().mockResolvedValue(undefined)
    render(
      <ul>
        <TaskItem task={baseTask} onToggle={onToggle} onEdit={vi.fn()} onDelete={vi.fn()} />
      </ul>
    )
    fireEvent.click(screen.getByLabelText('完了にする'))
    expect(onToggle).toHaveBeenCalledWith(baseTask)
  })

  it('完了済みタスクは aria-pressed=true', () => {
    render(
      <ul>
        <TaskItem
          task={{ ...baseTask, completed: true }}
          onToggle={vi.fn()}
          onEdit={vi.fn()}
          onDelete={vi.fn()}
        />
      </ul>
    )
    expect(screen.getByLabelText('未完了に戻す')).toHaveAttribute('aria-pressed', 'true')
  })

  it('編集ボタンをクリックすると onEdit が呼ばれる', () => {
    const onEdit = vi.fn()
    render(
      <ul>
        <TaskItem task={baseTask} onToggle={vi.fn()} onEdit={onEdit} onDelete={vi.fn()} />
      </ul>
    )
    fireEvent.click(screen.getByLabelText('編集'))
    expect(onEdit).toHaveBeenCalledWith(baseTask)
  })
})
