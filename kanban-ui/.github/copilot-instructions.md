# Copilot Instructions for Kanban UI

## Project Overview
- **Framework:** Angular 21 (standalone components, Angular CLI)
- **Purpose:** Kanban board UI for managing boards, likely connecting to a backend at `http://localhost:3000`.
- **Structure:**
  - `src/app/features/board-management/`: Board CRUD UI, modals for add/edit/delete
  - `src/app/features/board-viewer/`: Board viewing
  - `src/app/services/board.service.ts`: Handles all board API calls
  - `src/app/models/board.model.ts`: Board data model
  - `src/environments/`: API URL and environment config

## Key Workflows
- **Start Dev Server:** `npm start` or `ng serve` (default: http://localhost:4200)
- **Build:** `npm run build` or `ng build` (output: `dist/`)
- **Unit Tests:** `npm test` or `ng test` (uses Vitest)
- **Scaffold Components:** `ng generate component <name>`

## Patterns & Conventions
- **Standalone Components:** Most components use `standalone: true` and import dependencies directly.
- **Signals:** State is managed with Angular signals (e.g., `signal<T>()`).
- **Dependency Injection:** Use `inject()` for services (e.g., `BoardService`).
- **API Integration:** All board data flows through `BoardService`, which uses the `environment.apiUrl`.
- **Styling:** Uses both global (`src/styles.css`) and component-level CSS. Some modals use Tailwind CSS.
- **Routing:** Configured in `app.routes.ts`.
- **Environment Switching:** Production/dev API URLs set in `src/environments/` files. Build config swaps files as needed.

## Examples
- To fetch boards: use `BoardService.getBoards()` (returns Observable<Board[]>).
- To add a board: open `AddBoardModal`, then call `BoardService.createBoard()`.
- To update/delete: use `BoardService.updateBoard()`/`deleteBoard()`.

## Integration Points
- **Backend:** Expects a REST API at `http://localhost:3000` (see `environment.ts`).
- **Testing:** Unit tests are in `*.spec.ts` files alongside components/services.

## Special Notes
- **Prettier:** HTML files use Angular parser; see `package.json` for formatting rules.
- **No e2e by default:** End-to-end tests are not set up; add your own if needed.

---
For more, see `README.md` and Angular CLI docs. Update this file if project structure or conventions change.
