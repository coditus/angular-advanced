import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Board } from '../models/board.model';
import { Task } from '../models/task.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/boards`;

  getBoards(): Observable<Board[]> {
    return this.http.get<Board[]>(this.apiUrl);
  }

  getBoard(id: string): Observable<Board> {
    return this.http.get<Board>(`${this.apiUrl}/${id}`);
  }

  createBoard(board: { name: string; description?: string }): Observable<Board> {
    return this.http.post<Board>(this.apiUrl, board);
  }

  updateBoard(id: string, board: Partial<{ name: string; description: string }>): Observable<Board> {
    return this.http.patch<Board>(`${this.apiUrl}/${id}`, board);
  }

  deleteBoard(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // --- Task methods ---
  getTasks(boardId: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/${boardId}/tasks`);
  }

  createTask(boardId: string, task: Partial<Task>): Observable<Board> {
    return this.http.post<Board>(`${this.apiUrl}/${boardId}/tasks`, task);
  }
}
