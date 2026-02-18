export interface Board {
  columns: Column[];
  createdAt: string;
  description?: string;
  id: string;
  name: string;
  tasks: Task[];
  updatedAt: string;
};

export interface Column {
  id: string;
  name: string;
  order: number;
}

export interface Task {
  assignedTo?: string;
  columnId: string;
  description?: string;
  id: string;
  title: string;
}
