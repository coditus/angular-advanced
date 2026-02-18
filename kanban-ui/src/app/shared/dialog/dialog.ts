import { Component, HostListener, input, output } from '@angular/core';

@Component({
  selector: 'app-dialog',
  imports: [],
  templateUrl: './dialog.html',
  styleUrl: './dialog.css',
})
export class Dialog {
  isOpen = input.required<boolean>();
  title = input<string>('Notificación');
  showFooter = input<boolean>(true);

  closeEvent = output<void>();

  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.isOpen()) this.close();
  }

  close() {
    this.closeEvent.emit();
  }
}
