// ============ 成长待办（纯函数） ============
import type { GrowthTodo } from './types';

let seq = 0;
function uid(): string {
  seq = (seq + 1) % 1e6;
  return `t_${Date.now().toString(36)}_${seq}${Math.random().toString(36).slice(2, 6)}`;
}

export interface TodoInput {
  title: string;
  note?: string;
  priority?: 1 | 2 | 3;
  /** 本地 yyyy-MM-dd */
  dueDate?: string;
}

export function createTodo(input: TodoInput, now: Date = new Date()): GrowthTodo {
  const title = input.title.trim();
  if (!title) throw new Error('待办标题不能为空');
  return {
    id: uid(),
    title,
    note: input.note?.trim() || undefined,
    priority: input.priority ?? 2,
    dueDate: input.dueDate || undefined,
    done: false,
    createdAt: now,
  };
}

/** 勾选完成 / 取消完成 */
export function toggleDone(todo: GrowthTodo, now: Date = new Date()): GrowthTodo {
  if (todo.done) return { ...todo, done: false, doneAt: undefined };
  return { ...todo, done: true, doneAt: now };
}

/** 待办是否已逾期（未完成且截止日早于今天） */
export function isOverdue(todo: GrowthTodo, todayKey: string): boolean {
  return !todo.done && !!todo.dueDate && todo.dueDate < todayKey;
}

/**
 * 排序：未完成在前（优先级升序 → 有截止日优先且越早越前 → 新建优先），
 * 已完成在后（最近完成在前）。
 */
export function sortTodos(todos: GrowthTodo[]): GrowthTodo[] {
  return [...todos].sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    if (!a.done && !b.done) {
      if (a.priority !== b.priority) return a.priority - b.priority;
      if (a.dueDate || b.dueDate) {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        if (a.dueDate !== b.dueDate) return a.dueDate < b.dueDate ? -1 : 1;
      }
      return b.createdAt.getTime() - a.createdAt.getTime();
    }
    return (b.doneAt?.getTime() || 0) - (a.doneAt?.getTime() || 0);
  });
}
