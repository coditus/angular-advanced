import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BoardService } from '../../services/board.service';
import { Board } from '../../models/board.model';
import { AddBoardModal } from './add-board-modal/add-board-modal';

@Component({
  selector: 'app-board-list',
  standalone: true,
  imports: [CommonModule, RouterModule, AddBoardModal],
  templateUrl: './board-list.component.html',
  styleUrl: './board-list.component.css',
})
export class BoardListComponent implements OnInit {
  private boardService = inject(BoardService);
  boards = signal<Board[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  showAddBoardModal = signal<boolean>(false);

  ngOnInit(): void {
    this.loadBoards();
  }

  loadBoards(): void {
    this.loading.set(true);
    this.error.set(null);
    this.boardService.getBoards().subscribe({
      next: (boards) => {
        this.boards.set(boards);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Error al cargar los boards. Por favor, intenta nuevamente.');
        this.loading.set(false);
      },
    });
  }

  addBoard(): void {
    this.showAddBoardModal.set(!this.showAddBoardModal());
  }

  closeAddBoardModal(): void {
    this.showAddBoardModal.set(false);
  }

  onAddBoard(data: { name: string; description: string }) {
    this.loading.set(true);
    this.boardService.createBoard(data).subscribe({
      next: () => {
        this.loadBoards();
        this.showAddBoardModal.set(false);
      },
      error: () => {
        this.error.set('No se pudo crear el board.');
        this.loading.set(false);
      }
    });
  }
}
