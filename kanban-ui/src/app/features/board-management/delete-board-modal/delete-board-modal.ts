import { Component, input, output } from '@angular/core';
import { Dialog } from '../../../shared/dialog/dialog';

@Component({
  selector: 'app-delete-board-modal',
  standalone: true,
  imports: [Dialog],
  templateUrl: './delete-board-modal.html',
  styleUrls: ['./delete-board-modal.tailwind.css']
})
export class DeleteBoardModalComponent {
  isOpen = input.required<boolean>();
  closed = output<void>();
  confirmed = output<void>();

  handleConfirm() {
    this.confirmed.emit();
  }

  handleCancel() {
    this.closed.emit();
  }
}
