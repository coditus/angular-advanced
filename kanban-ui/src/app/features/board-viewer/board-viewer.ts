import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { BoardService } from '../../services/board.service';
import { Board, Column } from '../../models/board.model';

@Component({
  selector: 'app-board-viewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './board-viewer.html',
  styleUrl: './board-viewer.css',
})
export class BoardViewer {
  private route = inject(ActivatedRoute);
  private boardService = inject(BoardService);
  board = signal<Board | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
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

  getColumns(): Column[] {
    return this.board()?.columns?.slice().sort((a, b) => a.order - b.order) ?? [];
  }
}
