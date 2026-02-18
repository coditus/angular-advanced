import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BoardService } from '../../../services/board.service';
import { Board } from '../../../models/board.model';
import { FormsModule } from '@angular/forms';
import { DeleteBoardModalComponent } from '../delete-board-modal/delete-board-modal';

@Component({
  selector: 'app-edit-board-page',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    DeleteBoardModalComponent
  ],
  templateUrl: './edit-board-page.html',
  styleUrls: ['./edit-board-page.tailwind.css']
})
export class EditBoardPageComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private boardService = inject(BoardService);

  board = signal<Board | null>(null);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  editedBoard = signal<Partial<Board>>({});
  showDeleteModal = signal<boolean>(false);

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.boardService.getBoard(id).subscribe({
        next: (b) => {
          this.board.set(b);
          this.editedBoard.set({ ...b });
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

  onSave() {
    if (!this.board()) return;
    this.loading.set(true);
    this.boardService.updateBoard(this.board()!.id, this.editedBoard()).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: () => {
        this.error.set('No se pudo actualizar el board.');
        this.loading.set(false);
      }
    });
  }

  onCancel() {
    this.router.navigate(['/']);
  }

  onDelete() {
    this.showDeleteModal.set(true);
  }

  onDeleteCancel() {
    this.showDeleteModal.set(false);
  }

  onDeleteConfirm() {
    if (!this.board()) return;
    this.loading.set(true);
    this.boardService.deleteBoard(this.board()!.id).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: () => {
        this.error.set('No se pudo eliminar el board.');
        this.loading.set(false);
      }
    });
    this.showDeleteModal.set(false);
  }
}
