import axios from 'axios'
import type { Task, TaskRequest } from '../types/task'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

export const taskApi = {
  /** 一覧取得 — completed=undefined で全件 */
  getAll: async (completed?: boolean): Promise<Task[]> => {
    const params = completed !== undefined ? { completed } : {}
    const { data } = await api.get<Task[]>('/tasks', { params })
    return data
  },

  /** 1件取得 */
  getById: async (id: number): Promise<Task> => {
    const { data } = await api.get<Task>(`/tasks/${id}`)
    return data
  },

  /** 新規作成 */
  create: async (request: TaskRequest): Promise<Task> => {
    const { data } = await api.post<Task>('/tasks', request)
    return data
  },

  /** 更新 */
  update: async (id: number, request: Partial<TaskRequest>): Promise<Task> => {
    const { data } = await api.put<Task>(`/tasks/${id}`, request)
    return data
  },

  /** 削除 */
  delete: async (id: number): Promise<void> => {
    await api.delete(`/tasks/${id}`)
  },
}
