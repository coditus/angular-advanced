import { Routes } from '@angular/router';
import { BoardListComponent } from './features/board-management/board-list.component';
import { EditBoardPageComponent } from './features/board-management/edit-board-page/edit-board-page';
import { BoardViewer } from './features/board-viewer/board-viewer';

export const routes: Routes = [
  { path: '', redirectTo: 'boards', pathMatch: 'full' },
  { path: 'boards', component: BoardListComponent },
  { path: 'boards/:id/edit', component: EditBoardPageComponent },
  { path: 'board-viewer/:id', component: BoardViewer },
];