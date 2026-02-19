import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddTaskModal } from './add-task-modal/add-task-modal';
import { ActivatedRoute } from '@angular/router';
import { BoardService } from '../../services/board.service';
import { Board, Task } from '../../models/board.model';

@Component({
  selector: 'app-board-viewer',
  standalone: true,
  imports: [CommonModule, AddTaskModal],
  templateUrl: './board-viewer.html',
  styleUrl: './board-viewer.css',
})
export class BoardViewer {

  private route = inject(ActivatedRoute);
  private boardService = inject(BoardService);
  board = signal<Board | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  showAddTaskModal = signal(false);

  history = window.history;

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.boardService.getBoard(id).subscribe({
        next: (b) => {
          if (!b) {
            this.error.set('El tablero no existe o fue eliminado.');
            this.loading.set(false);
            return;
          }
          this.board.set(b);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('No se pudo cargar el board.');
          this.loading.set(false);
        }
      });
    } else {
      this.error.set('ID de board no válido.');
      this.loading.set(false);
    }
  }


  columns = computed(() =>
    this.board()?.columns?.slice().sort((a, b) => a.order - b.order) ?? []
  );

  tasksByColumn = computed(() => {
    const tasks = this.board()?.tasks ?? [];
    const map: Record<string, Task[]> = {};
    for (const col of this.columns()) {
      map[col.id] = [];
    }
    for (const t of tasks) {
      if (map[t.columnId]) {
        map[t.columnId].push(t);
      }
    }
    return map;
  });

  getFirstColumnId(): string | null {
    const cols = this.columns();
    return cols.length > 0 ? cols[0].id : null;
  }

  openAddTaskModal() {
    this.showAddTaskModal.set(true);
  }

  closeAddTaskModal() {
    this.showAddTaskModal.set(false);
  }

  handleTaskCreated({ title, assignee }: { title: string; assignee: string }) {
    const board = this.board();
    const columnId = this.getFirstColumnId();
    if (!board || !columnId) return;
    this.boardService.createTask(board.id, {
      title,
      assignee,
      columnId,
      boardId: board.id
    }).subscribe({
      next: (board) => {
        this.board.set(board);
        this.closeAddTaskModal();
      },
      error: () => {
        alert('No se pudo agregar la tarea.');
      }
    });
  }
}
