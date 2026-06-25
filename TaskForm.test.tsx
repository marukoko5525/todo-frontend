import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TaskForm } from '../components/TaskForm'

describe('TaskForm', () => {
  it('タイトルを入力して追加できる', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(<TaskForm onSubmit={onSubmit} />)

    await userEvent.type(screen.getByLabelText('タスクタイトル'), '買い物をする')
    fireEvent.submit(screen.getByRole('button', { name: '追加' }).closest('form')!)

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({ title: '買い物をする', description: undefined })
    })
  })

  it('タイトルが空のときはエラーを表示する', async () => {
    render(<TaskForm onSubmit={vi.fn()} />)

    fireEvent.submit(screen.getByRole('button', { name: '追加' }).closest('form')!)

    expect(await screen.findByText('タイトルを入力してください')).toBeInTheDocument()
  })

  it('送信後にフォームがリセットされる', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(<TaskForm onSubmit={onSubmit} />)

    const input = screen.getByLabelText('タスクタイトル') as HTMLInputElement
    await userEvent.type(input, 'テスト')
    fireEvent.submit(input.closest('form')!)

    await waitFor(() => expect(input.value).toBe(''))
  })

  it('編集モードでは「保存」ボタンが表示される', () => {
    const task = {
      id: 1, title: '既存タスク', description: null,
      completed: false, createdAt: '', updatedAt: '',
    }
    render(<TaskForm onSubmit={vi.fn()} editingTask={task} onCancelEdit={vi.fn()} />)

    expect(screen.getByRole('button', { name: '保存' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'キャンセル' })).toBeInTheDocument()
  })
})
