import { randomUUID } from "node:crypto";

import { Board } from "../models/board.js";

const boards = new Map<string, Board>();

export function addColumn(
  boardId: string,
  input: { name: string; order: number }
): Board | undefined {
  const board = boards.get(boardId);
  if (!board) return undefined;
  
  const newColumn = {
    id: randomUUID(),
    name: input.name,
    order: input.order
  };
  
  const updated: Board = {
    ...board,
    columns: [...board.columns, newColumn],
    updatedAt: new Date().toISOString(),
  };
  
  boards.set(boardId, updated);
  return updated;
}

export function addTask(
  boardId: string,
  input: { assignedTo?: string; columnId: string; description?: string; title: string }
): Board | undefined {
  const board = boards.get(boardId);
  if (!board) return undefined;
  
  // Verificar que la columna existe
  const columnExists = board.columns.some(col => col.id === input.columnId);
  if (!columnExists) return undefined;
  
  const newTask = {
    assignedTo: input.assignedTo,
    columnId: input.columnId,
    description: input.description,
    id: randomUUID(),
    title: input.title
  };
  
  const updated: Board = {
    ...board,
    tasks: [...board.tasks, newTask],
    updatedAt: new Date().toISOString(),
  };
  
  boards.set(boardId, updated);
  return updated;
}

export function createBoard(input: {  description?: string; name: string; }): Board {
  const now = new Date().toISOString();
  const board: Board = {
    columns: [
      { id: randomUUID(), name: 'TODO', order: 0 },
      { id: randomUUID(), name: 'PROGRESS', order: 1 },
      { id: randomUUID(), name: 'DONE', order: 2 }
    ],
    createdAt: now,
    description: input.description,
    id: randomUUID(),
    name: input.name,
    tasks: [],
    updatedAt: now,
  };
  boards.set(board.id, board);
  return board;
}

export function deleteBoard(id: string): boolean {
  return boards.delete(id);
}

export function deleteColumn(
  boardId: string,
  columnId: string
): Board | undefined {
  const board = boards.get(boardId);
  if (!board) return undefined;
  
  const columnExists = board.columns.some(col => col.id === columnId);
  if (!columnExists) return undefined;
  
  const updated: Board = {
    ...board,
    columns: board.columns.filter(col => col.id !== columnId),
    updatedAt: new Date().toISOString(),
  };
  
  boards.set(boardId, updated);
  return updated;
}

export function deleteTask(
  boardId: string,
  taskId: string
): Board | undefined {
  const board = boards.get(boardId);
  if (!board) return undefined;
  
  const taskExists = board.tasks.some(task => task.id === taskId);
  if (!taskExists) return undefined;
  
  const updated: Board = {
    ...board,
    tasks: board.tasks.filter(task => task.id !== taskId),
    updatedAt: new Date().toISOString(),
  };
  
  boards.set(boardId, updated);
  return updated;
}

export function getBoard(id: string): Board | undefined {
  return boards.get(id);
}

export function listBoards(): Board[] {
  return Array.from(boards.values());
}

export function listTasks(boardId: string) {
  const board = boards.get(boardId);
  return board?.tasks;
}

export function updateBoard(
  id: string,
  input: Partial<Pick<Board, "description" |"name" >>
): Board | undefined {
  const existing = boards.get(id);
  if (!existing) return undefined;
  const updated: Board = {
    ...existing,
    ...("name" in input ? { name: input.name } : {}),
    ...("description" in input ? { description: input.description } : {}),
    updatedAt: new Date().toISOString(),
  };
  boards.set(id, updated);
  return updated;
}

export function updateColumn(
  boardId: string,
  columnId: string,
  input: Partial<{ name: string; order: number }>
): Board | undefined {
  const board = boards.get(boardId);
  if (!board) return undefined;
  
  const columnIndex = board.columns.findIndex(col => col.id === columnId);
  if (columnIndex === -1) return undefined;
  
  const updatedColumns = [...board.columns];
  updatedColumns[columnIndex] = {
    ...updatedColumns[columnIndex],
    ...("name" in input ? { name: input.name } : {}),
    ...("order" in input ? { order: input.order } : {}),
  };
  
  const updated: Board = {
    ...board,
    columns: updatedColumns,
    updatedAt: new Date().toISOString(),
  };
  
  boards.set(boardId, updated);
  return updated;
}

export function updateTask(
  boardId: string,
  taskId: string,
  input: Partial<{ assignedTo?: string; columnId: string; description?: string; title: string }>
): Board | undefined {
  const board = boards.get(boardId);
  if (!board) return undefined;
  
  const taskIndex = board.tasks.findIndex(task => task.id === taskId);
  if (taskIndex === -1) return undefined;
  
  // Si se está cambiando la columna, verificar que existe
  if (input.columnId && !board.columns.some(col => col.id === input.columnId)) {
    return undefined;
  }
  
  const updatedTasks = [...board.tasks];
  updatedTasks[taskIndex] = {
    ...updatedTasks[taskIndex],
    ...("title" in input ? { title: input.title } : {}),
    ...("description" in input ? { description: input.description } : {}),
    ...("assignedTo" in input ? { assignedTo: input.assignedTo } : {}),
    ...("columnId" in input ? { columnId: input.columnId } : {}),
  };
  
  const updated: Board = {
    ...board,
    tasks: updatedTasks,
    updatedAt: new Date().toISOString(),
  };
  
  boards.set(boardId, updated);
  return updated;
}
