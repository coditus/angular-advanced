export interface Task {
  id: string;
  number: number; // Task number within the board
  title: string;
  assignee?: string;
  columnId: string; // Column where the task is located
  boardId: string;
}
