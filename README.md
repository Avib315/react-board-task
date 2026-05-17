# React Board — Angular → React Migration

> **Deliverable:** A standalone React 18 app that fully replicates the Kanban Board of ProjectHub, originally built with Angular 21.

---

## Short Summary

This project migrates the **Board page** of an Angular 21 Kanban app to **React 18 + TypeScript**, preserving every piece of logic, every UI feature, and every visual detail. Each Angular concept has a deliberate React equivalent — no libraries were added without reason.

---

## Getting Started

```bash
cd react-board
npm install
npm run dev           # → http://localhost:5173
npm run test:run      # 39 unit tests
npm run test:e2e      # Playwright E2E
```

The **Angular app** (Dashboard, Tasks) runs separately at `http://localhost:4200`. The React Navbar links to it.

---

## Checklist — Everything Migrated and Verified

| Feature | Status |
|---|---|
| 4 Kanban columns (To Do / In Progress / Review / Done) | ✅ |
| Task cards — priority badge, project tag, assignee, due date, tags | ✅ |
| Drag & drop — cross-column move + same-column reorder | ✅ |
| Search filter (live, case-insensitive) | ✅ |
| Priority dropdown filter | ✅ |
| Both filters combined + subtitle updates live | ✅ |
| Add / Edit modal with full validation | ✅ |
| Done cards dimmed to opacity 0.6 | ✅ |
| Overdue cards — red border + red due date | ✅ |
| localStorage persistence across page refreshes | ✅ |
| 20 seeded tasks on first load (same as Angular) | ✅ |
| Date objects restored after JSON.parse (reviveDates) | ✅ |
| Navbar with SVG logo, active link, stat chips | ✅ |
| External links (Dashboard, Tasks) to Angular at localhost:4200 | ✅ |
| SCSS design tokens extracted from Angular CSS | ✅ |
| Global reset mirroring Tailwind preflight (Angular relies on it) | ✅ |
| All UI strings in i18n/en.json (typed, interpolatable) | ✅ |
| Smooth drag animation — DragOverlay + displaced-card CSS transition | ✅ |
| Form scroll — body scrolls, Create Task button inside scroll area | ✅ |
| Unit tests — stores, utils, components | ✅ (39 tests) |
| Playwright E2E scaffold | ✅ |

---

## Tech Stack

| Concern | Angular | React |
|---|---|---|
| Framework | Angular 21 | React 18 + Vite |
| State | `signal<T>()` + `@Injectable` | Zustand + `persist` middleware |
| Drag & Drop | Angular CDK | `@dnd-kit/core` + `@dnd-kit/sortable` |
| Forms | `ReactiveFormsModule` | `react-hook-form` |
| Routing | `RouterModule` | `react-router-dom` |
| Styling | Scoped CSS + Tailwind | SCSS Modules + design tokens |
| Unit tests | — | Vitest + React Testing Library |
| E2E tests | — | Playwright |
| i18n | hardcoded strings | `src/i18n/en.json` typed accessor |

---

## Project Structure

```
react-board/src/
├── models/           # All types + constants — exact copy from Angular
├── store/            # Zustand stores replacing Angular Services
│   ├── taskStore.ts           # Replaces TaskService
│   ├── activityStore.ts       # Replaces ActivityService
│   └── __tests__/
├── hooks/            # Typed selector hooks — replace service injection
│   ├── useTaskStore.ts
│   ├── useActivityStore.ts    # setInterval replaces RxJS interval(4000)
│   └── useTimeAgo.ts          # TimeAgoPipe → auto-refreshing hook
├── utils/            # Angular pipes/directives → pure functions
│   ├── timeAgo.ts             # TimeAgoPipe logic
│   ├── highlight.ts           # HighlightDirective → splitHighlight()
│   └── __tests__/
├── pages/BoardPage/  # Thin page shell — filter state, DnD context, modal
├── components/
│   ├── Navbar/                # SVG logo, nav links, stat chips
│   ├── KanbanColumn/          # useDroppable + SortableContext
│   ├── TaskCard/              # useSortable + TaskCardOverlay for DragOverlay
│   └── TaskForm/              # react-hook-form + validators
├── i18n/
│   ├── en.json                # All UI strings
│   └── index.ts               # Typed t accessor + interp() helper
├── styles/
│   ├── _variables.scss        # All color/spacing/radius tokens from Angular
│   ├── _mixins.scss           # input-base, icon-btn, scrollbar
│   └── main.scss              # Global reset (mirrors Tailwind preflight)
└── test/setup.ts              # @testing-library/jest-dom setup
```

---

## Angular → React Migration Map

### State

| Angular | React |
|---|---|
| `signal<Task[]>(loadFromStorage())` | `create()(persist((set, get) => ({...}), { name: 'pm_tasks' }))` |
| `readonly tasks = _tasks.asReadonly()` | `useTaskStore(s => s.tasks)` |
| `computed(() => tasksByStatus)` | `selectTasksByStatus(tasks)` + `useMemo` in hook |
| `computed(() => stats)` | `selectStats(tasks)` + `useMemo` in hook |
| `effect(() => saveToStorage(...))` | `persist` middleware — automatic |
| `_tasks.update(fn)` | `set(state => ...)` inside Zustand actions |
| `@Injectable({ providedIn: 'root' })` | Single Zustand store importable anywhere |
| `BehaviorSubject` + `interval(4000)` | Zustand atom + `setInterval` in `useEffect` |
| `combineLatest([feed$, filterQuery$])` | `selectFilteredFeed()` pure selector + `useMemo` |

### Components

| Angular | React |
|---|---|
| `NavbarComponent` | `Navbar.tsx` — same SVG logo, stat chips, active link |
| `BoardComponent` | `BoardPage.tsx` — filter state, DnD context, modal wiring |
| Column template `@for` | `KanbanColumn.tsx` — `useDroppable` + `SortableContext` |
| Task card (inline template) | `TaskCard.tsx` — `useSortable` + `TaskCardOverlay` |
| `TaskFormComponent` | `TaskForm.tsx` — same fields, validators, error messages |

### Directives and Pipes

| Angular | React |
|---|---|
| `TimeAgoPipe` (impure, NgZone) | `timeAgo()` pure function + `useTimeAgo()` with `setInterval` |
| `HighlightDirective` (innerHTML) | `splitHighlight()` returns `TextSegment[]` for safe rendering |

### Template Syntax

| Angular | React |
|---|---|
| `@for (item of list; track item.id)` | `array.map(item => <El key={item.id} />)` |
| `@if (condition)` | `{condition && <El />}` |
| `[ngClass]` | `clsx(styles.a, condition && styles.b)` |
| `{{ value }}` | `{value}` |

---

## Drag and Drop Architecture

```
DndContext (BoardPage)
  ├── closestCenter collision detection
  ├── onDragStart → setActiveTask (for DragOverlay)
  ├── onDragOver  → moveTask() cross-column (getState() — avoids stale closure)
  ├── onDragEnd   → reorderInColumn() same-column (getState())
  └── DragOverlay → <TaskCardOverlay> floating visual copy

KanbanColumn
  └── useDroppable({ id: status })
      └── SortableContext
          └── TaskCard → useSortable({ id: task.id })
```

**Bugs found and fixed:**

| Bug | Root cause | Fix |
|---|---|---|
| Cards not draggable | `{...listeners}` only on invisible handle span | Moved to the whole card div |
| Cross-column not working | `handleDragOver` used stale React closure | `useTaskStore.getState().tasks` |
| Infinite re-render | `useTaskActions` returned new `{}` each render | Wrapped with `useShallow` |
| Done opacity not applying | Inline `opacity: 1` overriding CSS class | Set `opacity: undefined` when not dragging |
| No smooth animation | No `DragOverlay`, no CSS transform transition | Added `DragOverlay` + `transform 250ms` |
| Cross-column detection missing | `pointerWithin` misses multi-container | Back to `closestCenter` |

---

## Form Validation

Mirrors Angular validators exactly — same error messages, same rules:

| Field | Rule | Message |
|---|---|---|
| Title | required | `Title is required.` |
| Title | minLength(3) | `Title must be at least 3 characters.` |
| Title | maxLength(120) | `Title cannot exceed 120 characters.` |
| Title | noWhitespace | `Title is required.` |
| Description | maxLength(500) | `Description cannot exceed 500 characters.` |
| Due Date | invalidDate | `Please enter a valid date.` |

---

## Styling System

Design tokens in `src/styles/_variables.scss` — all values sourced from Angular CSS:

- **Backgrounds:** `$color-bg #0f172a` / `$color-surface #1e293b`
- **Status accents:** todo `#64748b` / in-progress `#6366f1` / review `#f59e0b` / done `#22c55e`
- **Priority badges:** each with its own background and text color pair
- **Semantic:** `$color-primary #6366f1` / `$color-overdue #ef4444`

`main.scss` adds Tailwind-preflight equivalents Angular relies on:
- `line-height: 1.5` on body
- `margin: 0; padding: 0` on all block elements (`h1`–`h6`, `p`, `ul`, etc.)
- `display: block` on `img`, `svg`
- `font: inherit` on `button`, `input`, `select`, `textarea`

---

## Translations (i18n)

All UI text in `src/i18n/en.json`. Zero dependency — pure TypeScript import:

```ts
import { t, interp } from '../../i18n';

t.taskForm.addHeading                                    // "New Task"
interp(t.board.subtitle, { total: 20, columns: 4 })     // "20 tasks across 4 columns"
```

To add Hebrew or any other language — create a new JSON file with the same shape, swap one import line.

---

## Testing

**39 unit tests across 8 files — all passing.**

| File | Coverage |
|---|---|
| `taskStore.test.ts` | `selectTasksByStatus`, `selectStats`, `moveTask`, `reorderInColumn`, `deleteTask`, `addTask` |
| `activityStore.test.ts` | `selectFilteredFeed` — by title, by actor, slice to 20 |
| `timeAgo.test.ts` | All time buckets with fake timers |
| `highlight.test.ts` | No match, single, multi, case-insensitive |
| `Navbar.test.tsx` | Brand renders |
| `KanbanColumn.test.tsx` | Label, count, empty message |
| `TaskCard.test.tsx` | Title, priority, assignee, callbacks, done/overdue classes, overdue date |
| `TaskForm.test.tsx` | Headings, button labels, placeholders, cancel |

**Vitest config notes:**
- `classNameStrategy: 'non-scoped'` — allows `toHaveClass('done')` without importing CSS Module object
- `environment: 'jsdom'` — DOM available in all tests
- `globals: true` — no need to import `describe`/`it`/`expect`

---

---

# גרסה עברית — React Board

## סיכום קצר

פרויקט זה מעביר את **דף לוח הקנבן** של ProjectHub מ-Angular 21 ל-React 18 + TypeScript.  
המטרה: כל לוגיקה, כל פיצ'ר ויזואלי, וכל פרט עיצובי — זהה לאפליקציית המקור.

---

## התחלה מהירה

```bash
cd react-board
npm install
npm run dev           # → http://localhost:5173
npm run test:run      # 39 בדיקות
npm run test:e2e      # Playwright
```

**האפליקציה ב-Angular** (Dashboard, Tasks) פועלת בנפרד בכתובת `http://localhost:4200`.  
ה-Navbar של React מקשר אליה ישירות.

---

## רשימת תיוג — כל מה שהומר ואומת

| פיצ'ר | סטטוס |
|---|---|
| 4 עמודות קנבן (ממתין / בביצוע / סקירה / הושלם) | ✅ |
| כרטיסי משימה — תג עדיפות, פרויקט, אחראי, תאריך יעד, תגיות | ✅ |
| גרירה ושחרור — בין עמודות + סידור מחדש בעמודה | ✅ |
| פילטר חיפוש (חי, case-insensitive) | ✅ |
| פילטר עדיפות | ✅ |
| שני הפילטרים ביחד + כותרת משנה מתעדכנת | ✅ |
| מודאל הוספה / עריכה עם ולידציה מלאה | ✅ |
| כרטיסים שהושלמו — שקיפות 0.6 | ✅ |
| כרטיסים שפג תוקפם — גבול אדום + תאריך אדום | ✅ |
| שמירה ב-localStorage (שורד רענון) | ✅ |
| 20 משימות זרע בטעינה ראשונה | ✅ |
| שחזור Date לאחר JSON.parse | ✅ |
| Navbar עם לוגו SVG, קישור פעיל, תגי סטטיסטיקה | ✅ |
| קישורים חיצוניים לאפליקציית Angular | ✅ |
| Design tokens ב-SCSS (ממקור Angular CSS) | ✅ |
| Reset גלובלי המקביל ל-Tailwind preflight | ✅ |
| כל טקסט UI בקובץ i18n/en.json | ✅ |
| אנימציית גרירה חלקה — DragOverlay + CSS transition | ✅ |
| גלילה בטופס — כפתור "Create Task" בתוך אזור הגלילה | ✅ |
| בדיקות יחידה — stores, utils, components | ✅ (39 בדיקות) |
| Playwright E2E scaffold | ✅ |

---

## מיפוי Angular → React

### ניהול מצב

| Angular | React |
|---|---|
| `signal<Task[]>()` | Zustand `create()` עם `persist` middleware |
| `computed(() => tasksByStatus)` | `selectTasksByStatus()` + `useMemo` |
| `computed(() => stats)` | `selectStats()` + `useMemo` |
| `effect(() => localStorage.setItem(...))` | `persist` middleware — אוטומטי |
| `@Injectable({ providedIn: 'root' })` | Store Zustand יחיד, נגיש מכל מקום |
| `BehaviorSubject` + `interval(4000)` | Zustand atom + `setInterval` ב-`useEffect` |
| `combineLatest([feed$, filterQuery$])` | `selectFilteredFeed()` + `useMemo` |

### Directives ו-Pipes

| Angular | React |
|---|---|
| `TimeAgoPipe` | `timeAgo()` פונקציה טהורה + `useTimeAgo()` hook |
| `HighlightDirective` | `splitHighlight()` מחזירה מערך סגמנטים |

---

## גרירה ושחרור

**באגים שנמצאו ותוקנו:**

| באג | סיבת שורש | פתרון |
|---|---|---|
| כרטיסים לא ניתנים לגרירה | `listeners` היו רק על ידית הגרירה הבלתי נראית | הועברו לכרטיס שלם |
| גרירה בין עמודות לא עבדה | `handleDragOver` השתמש ב-stale closure | `useTaskStore.getState().tasks` |
| לולאת רינדור אינסופית | `useTaskActions` החזיר `{}` חדש בכל רינדור | `useShallow` |
| שקיפות 0.6 לא הוחלה | `opacity: 1` inline ביטל את קלאס ה-CSS | הוגדר `opacity: undefined` |
| אין אנימציה | אין `DragOverlay`, אין CSS transition | נוסף `DragOverlay` + `transform 250ms` |

---

## ולידציה בטופס

הודעות שגיאה זהות ל-Angular (כולל נקודות):

| שדה | כלל | הודעה |
|---|---|---|
| כותרת | חובה | `Title is required.` |
| כותרת | minLength(3) | `Title must be at least 3 characters.` |
| כותרת | maxLength(120) | `Title cannot exceed 120 characters.` |
| כותרת | no-whitespace | `Title is required.` |
| תיאור | maxLength(500) | `Description cannot exceed 500 characters.` |
| תאריך יעד | תאריך לא תקין | `Please enter a valid date.` |

---

## מערכת העיצוב

כל ערכי הצבעים ב-`_variables.scss` — נלקחו מקובצי CSS של Angular:

- **רקעים:** `$color-bg #0f172a` / `$color-surface #1e293b`
- **עמודות:** todo `#64748b` / in-progress `#6366f1` / review `#f59e0b` / done `#22c55e`
- **עדיפויות:** כל רמה עם צבע רקע וטקסט ייחודיים
- **Reset גלובלי:** `line-height: 1.5`, `margin: 0` על כותרות ופסקאות, `font: inherit` על כפתורים

---

## בדיקות

**39 בדיקות יחידה ב-8 קבצים — כולן עוברות.**

| קובץ | מה נבדק |
|---|---|
| `taskStore.test.ts` | כל פעולות ה-store + סלקטורים |
| `activityStore.test.ts` | פילטור feed |
| `timeAgo.test.ts` | כל טווחי הזמן |
| `highlight.test.ts` | פיצול לסגמנטים |
| `Navbar.test.tsx` | שם המותג |
| `KanbanColumn.test.tsx` | תווית, ספירה, הודעת ריקנות |
| `TaskCard.test.tsx` | כרטיס מלא + callbacks + classes |
| `TaskForm.test.tsx` | כותרות, כפתורים, placeholders |
