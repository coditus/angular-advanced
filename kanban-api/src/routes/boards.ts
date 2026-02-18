/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Request, Router } from "express";

import type { Board } from "../models/board.js";

import { addColumn, addTask, createBoard, deleteBoard, deleteColumn, deleteTask, getBoard, listBoards, listTasks, updateBoard, updateColumn, updateTask } from "../store/boards.js";

const router = Router();

router.get("/", (req, res) => {
  const items: Board[] = listBoards();
  res.json(items);
});

interface CreateBoardBody { description?: string; name: string }
router.post("/", (req: Request<Record<string, string>, unknown, CreateBoardBody>, res) => {
  const { description, name } = req.body;
  if (!name || typeof name !== "string") {
    return res.status(400).json({ error: "'name' is required and must be a string" });
  }
  const board: Board = createBoard({ description, name });
  res.status(201).json(board);
});

router.get("/:id", (req, res) => {
  const b: Board | undefined = getBoard(req.params.id);
  if (!b) return res.status(404).json({ error: "Board not found" });
  res.json(b);
});

interface ReplaceBoardBody { description?: string; name: string }
router.put("/:id", (req: Request<{ id: string }, unknown, ReplaceBoardBody>, res) => {
  const { description, name } = req.body;
  if (!name || typeof name !== "string") {
    return res.status(400).json({ error: "'name' is required and must be a string" });
  }
  const existing: Board | undefined = getBoard(req.params.id);
  if (!existing) return res.status(404).json({ error: "Board not found" });
  const updated: Board | undefined = updateBoard(req.params.id, { description, name });
  res.json(updated);
});

type UpdateBoardBody = Partial<{ description: string; name: string }>;
router.patch("/:id", (req: Request<{ id: string }, unknown, UpdateBoardBody>, res) => {
  const { description, name } = req.body;
  const existing: Board | undefined = getBoard(req.params.id);
  if (!existing) return res.status(404).json({ error: "Board not found" });
  if (name !== undefined && typeof name !== "string") {
    return res.status(400).json({ error: "'name' must be a string when provided" });
  }
  if (description !== undefined && typeof description !== "string") {
    return res.status(400).json({ error: "'description' must be a string when provided" });
  }
  const updated: Board | undefined = updateBoard(req.params.id, { description, name });
  res.json(updated);
});

router.delete("/:id", (req, res) => {
  const ok = deleteBoard(req.params.id);
  if (!ok) return res.status(404).json({ error: "Board not found" });
  res.status(204).send();
});

interface AddColumnBody { name: string; order: number }
router.post("/:id/columns", (req: Request<{ id: string }, unknown, AddColumnBody>, res) => {
  const { name, order } = req.body;
  if (!name || typeof name !== "string") {
    return res.status(400).json({ error: "'name' is required and must be a string" });
  }
  if (typeof order !== "number") {
    return res.status(400).json({ error: "'order' is required and must be a number" });
  }
  const updated = addColumn(req.params.id, { name, order });
  if (!updated) return res.status(404).json({ error: "Board not found" });
  res.status(201).json(updated);
});

type UpdateColumnBody = Partial<{ name: string; order: number }>;
router.patch("/:id/columns/:columnId", (req: Request<{ columnId: string; id: string }, unknown, UpdateColumnBody>, res) => {
  const { name, order } = req.body;
  if (name !== undefined && typeof name !== "string") {
    return res.status(400).json({ error: "'name' must be a string when provided" });
  }
  if (order !== undefined && typeof order !== "number") {
    return res.status(400).json({ error: "'order' must be a number when provided" });
  }
  const updated = updateColumn(req.params.id, req.params.columnId, { name, order });
  if (!updated) return res.status(404).json({ error: "Board or column not found" });
  res.json(updated);
});

router.delete("/:id/columns/:columnId", (req: Request<{ columnId: string; id: string }>, res) => {
  const updated = deleteColumn(req.params.id, req.params.columnId);
  if (!updated) return res.status(404).json({ error: "Board or column not found" });
  res.json(updated);
});

router.get("/:id/tasks", (req: Request<{ id: string }>, res) => {
  const tasks = listTasks(req.params.id);
  if (tasks === undefined) return res.status(404).json({ error: "Board not found" });
  res.json(tasks);
});

interface AddTaskBody { assignedTo?: string; columnId: string; description?: string; title: string }
router.post("/:id/tasks", (req: Request<{ id: string }, unknown, AddTaskBody>, res) => {
  const { assignedTo, columnId, description, title } = req.body;
  if (!title || typeof title !== "string") {
    return res.status(400).json({ error: "'title' is required and must be a string" });
  }
  if (!columnId || typeof columnId !== "string") {
    return res.status(400).json({ error: "'columnId' is required and must be a string" });
  }
  if (description !== undefined && typeof description !== "string") {
    return res.status(400).json({ error: "'description' must be a string when provided" });
  }
  if (assignedTo !== undefined && typeof assignedTo !== "string") {
    return res.status(400).json({ error: "'assignedTo' must be a string when provided" });
  }
  const updated = addTask(req.params.id, { assignedTo, columnId, description, title });
  if (!updated) return res.status(404).json({ error: "Board not found or column does not exist" });
  res.status(201).json(updated);
});

type UpdateTaskBody = Partial<{ assignedTo?: string; columnId: string; description?: string; title: string }>;
router.patch("/:id/tasks/:taskId", (req: Request<{ id: string; taskId: string }, unknown, UpdateTaskBody>, res) => {
  const { assignedTo, columnId, description, title } = req.body;
  if (title !== undefined && typeof title !== "string") {
    return res.status(400).json({ error: "'title' must be a string when provided" });
  }
  if (columnId !== undefined && typeof columnId !== "string") {
    return res.status(400).json({ error: "'columnId' must be a string when provided" });
  }
  if (description !== undefined && typeof description !== "string") {
    return res.status(400).json({ error: "'description' must be a string when provided" });
  }
  if (assignedTo !== undefined && typeof assignedTo !== "string") {
    return res.status(400).json({ error: "'assignedTo' must be a string when provided" });
  }
  const updated = updateTask(req.params.id, req.params.taskId, { assignedTo, columnId, description, title });
  if (!updated) return res.status(404).json({ error: "Board, task, or column not found" });
  res.json(updated);
});

router.delete("/:id/tasks/:taskId", (req: Request<{ id: string; taskId: string }>, res) => {
  const updated = deleteTask(req.params.id, req.params.taskId);
  if (!updated) return res.status(404).json({ error: "Board or task not found" });
  res.json(updated);
});

export default router;
