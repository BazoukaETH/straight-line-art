## Sidebar overhaul

Three-part polish to the persistent tree sidebar (`SpaceTreeSidebar` + `AppShell`).

### 1. Functional navigation
- **Pillar header** → new route `/pillar/$pillarId` showing all tasks across spaces in that pillar, grouped by Space. Create `src/routes/pillar.$pillarId.tsx` + page component.
- **Space / Folder / List** rows: already `<Link>`s — verify and ensure the chevron toggle does NOT navigate (separate button, `stopPropagation`).
- **Right-click** every row → `ContextMenu` (shadcn) with Rename, Duplicate, Move, Archive, Add list/folder, Copy link, Star. Wire to existing `tasks-store` ops where available; toast for unimplemented.
- **Hover quick-add**: reveal a `+` button on the row's right edge that adds a child entity inline (Space→folder/list, Folder→list, List→task) using existing store actions.

### 2. Collapsible
- Add `sidebarCollapsed` state to `AppShell` persisted in `localStorage` (`wasla.sidebar.collapsed`).
- Collapse toggle: `ChevronsLeft`/`ChevronsRight` icon in the sidebar header, next to search.
- Collapsed = 48px rail: workspace logo, search icon (opens command palette), pillar color dots. Main content expands.
- Hover a pillar dot when collapsed → floating popover with full sub-tree (re-use existing tree fragment), click outside closes.
- Keyboard shortcut `⌘/Ctrl+B` toggles globally (listener in `AppShell`).

### 3. Intelligent extras
- **Recent**: new `src/lib/recents.ts` (localStorage, max 5) with `useRecents()` + `pushRecent()`. Call `pushRecent` from each space/folder/list/task route on mount. Render "RECENT" section in sidebar.
- **Favorites**: already exists (`useFavorites`). Promote section above SPACES with empty-state copy, drag-to-reorder (HTML5 DnD).
- **Smart Search**: upgrade the existing search input to open a dropdown with grouped results (Tasks/Lists/Folders/Spaces/People), 3 per group + "See all", arrow-key nav, Esc/Enter. Natural-language phrases parsed via simple keyword heuristics ("assigned to me", "due this week", "blocked", pillar/space names).
- **Badges**:
  - Pillar header: right-aligned count of open tasks across its spaces.
  - Space row: red dot if any task is overdue or blocked.
  - "My Work": count of tasks assigned to current user due today/overdue.

### Files
- **New**: `src/routes/pillar.$pillarId.tsx`, `src/lib/recents.ts`, `src/components/wasla/SidebarRow.tsx` (row with context menu + quick-add + hover affordances), `src/components/wasla/SidebarSearch.tsx`.
- **Edit**: `src/components/wasla/SpaceTreeSidebar.tsx` (Recent + Favorites sections, badges, collapse state, rail render), `src/components/wasla/AppShell.tsx` (collapse state + width + ⌘B), route files for space/folder/list/task to call `pushRecent`.

### Keep intact
Workspace switcher, Founder button, Coming Soon rail section, all existing routes/data.
