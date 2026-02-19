
import { Component, input, output, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Dialog } from '../../../shared/dialog/dialog';

@Component({
  selector: 'app-add-task-modal',
  standalone: true,
  imports: [FormsModule, Dialog],
  templateUrl: './add-task-modal.html',
})
export class AddTaskModal {
  isOpen = input.required<boolean>();
  closed = output<void>();
  taskCreated = output<{ title: string, assignee: string }>();

  title = model('');
  assignee = model('');

  handleSave() {
    if (this.title().trim()) {
      this.taskCreated.emit({
        title: this.title(),
        assignee: this.assignee()
      });
      this.resetAndClose();
    }
  }

  resetAndClose() {
    this.title.set('');
    this.assignee.set('');
    this.closed.emit();
  }
}
