import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Dialog } from '../../../shared/dialog/dialog';

@Component({
  selector: 'app-add-board-modal',
  standalone: true,
  imports: [FormsModule, Dialog],
  templateUrl: './add-board-modal.html',
  styleUrl: './add-board-modal.css',
})
export class AddBoardModal {
  isOpen = input.required<boolean>();
  
  closed = output<void>();
  boardCreated = output<{ name: string, description: string }>();

  // Estado local del formulario
  name = signal('');
  description = signal('');

  handleSave() {
    if (this.name().trim()) {
      this.boardCreated.emit({
        name: this.name(),
        description: this.description()
      });
      this.resetAndClose();
    }
  }

  resetAndClose() {
    this.name.set('');
    this.description.set('');
    this.closed.emit();
  }
}
