# Grid Views NgRx State Management Architecture

## 📋 Overview

The **Grid Views** library provides a scalable, multi-feature NgRx state management solution for managing user-defined grid view configurations across the application. It enables users to save, load, modify, and share custom views for list-based entities with persistent configuration including filters, sorting, column visibility, and layout preferences.

**Key Characteristics:**

- Multi-feature isolated state architecture
- Feature-scoped selectors and reducers
- Shared actions and effects
- Signal-based reactive API
- Comprehensive CRUD operations for views
- Dirty state tracking for unsaved changes

---

- Architecture:
- - Single shared actions (no per-feature factories)
- - Single reducer factory (created once per feature)
- - Single effects class (handles all features)
- - Per-feature selector factories (for feature-specific state slicing)

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     GridViewsModule (Module)                    │
│  - Initializes feature slices (circuits, items, locations, etc) │
│  - Registers reducers, effects, and selectors                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┼─────────────┐
                │             │             │
                ▼             ▼             ▼
        ┌──────────────┐ ┌─────────────┐ ┌──────────────┐
        │   Actions    │ │  Selectors  │ │  Reducers    │
        │  (Shared)    │ │(Per Feature)│ │(Per Feature) │
        └──────────────┘ └─────────────┘ └──────────────┘
                │             │             │
                └─────────────┼─────────────┘
                              │
                              ▼
                    ┌──────────────────────┐
                    │  GridViewEffects     │
                    │  (Shared, Handles    │
                    │   all features)      │
                    └──────────────────────┘
                              │
                              ▼
                    ┌──────────────────────┐
                    │  GridViewFacade      │
                    │  (Signal-based API)  │
                    └──────────────────────┘
                              │
                              ▼
            ┌──────────────────────────────────────┐
            │  UserDefSettingsApiService           │
            │  (HTTP API Integration)              │
            └──────────────────────────────────────┘
```

---

## 📦 Core Components

### 1. **State Model** (`grid-view-state.model.ts`)

#### EntityGridViewState

Defines the shape of the grid view state for each feature:

```typescript
interface EntityGridViewState extends EntityState<UserConfigSetting> {
  featureName: string; // Feature identifier (circuits, items, etc)
  currentViewId: number; // ID of currently active view
  listApiPayload: ListApiPayload; // Current filter/column configuration

  // Loading states
  isLoading: boolean;
  isDeleting: boolean;
  isSaving: boolean;

  // Error handling
  error: string | null;

  // UI states
  isDirty: boolean; // View has unsaved changes
  sortBy: string;
  searchTerm: string;
}
```

**Key Features:**

- Extends NgRx EntityState for normalized entity storage
- Separate loading flags for different operations
- Dirty state tracking for unsaved changes
- Search/filter/sort UI state

#### Entity Adapter

```typescript
const gridViewAdapter = createEntityAdapter<UserConfigSetting>({
  selectId: (view) => view.pgListSettingId,
  sortComparer: (a, b) => (a.displaySettingName ?? '').localeCompare(b.displaySettingName ?? ''),
});
```

---

### 2. **Actions** (`grid-view.actions.ts`)

Comprehensive action group using NgRx `createActionGroup`:

#### Data Loading Actions

- `loadGridViews` - Load all views for a feature
- `loadGridViewsSuccess` - Success callback with loaded views
- `loadGridViewsFailure` - Error callback
- `loadViewDetails` - Load full details of a specific view
- `loadViewDetailsSuccess/Failure` - Success/error callbacks
- `keepCurrentView` - Preserve current view without reload

#### CRUD Operations

- `createView` - Create new view from current state
- `createViewSuccess/Failure` - Create operation result
- `saveView` - Save changes to existing view
- `saveViewSuccess/Failure` - Save operation result
- `cloneView` - Clone existing view with new name
- `cloneViewSuccess/Failure` - Clone operation result
- `renameView` - Rename existing view
- `renameViewSuccess/Failure` - Rename operation result
- `deleteView` - Delete view by ID
- `deleteViewSuccess/Failure` - Delete operation result

#### View Management

- `setAsDefaultView` - Mark view as default
- `setAsDefaultViewSuccess/Failure` - Default setting result
- `shareView` - Share/unshare view with others
- `shareViewSuccess/Failure` - Share operation result

#### UI Actions

- `openEditViewWindow` - Open modal for creating/editing views
- `closeSaveViewWindow` - Close edit modal
- `markViewDirty` - Mark view state as dirty (unsaved changes)
- `setListApiPayload` - Update current filter/column configuration
- `setSearchTerm` - Update search filter text
- `setSortBy` - Update sort column
- `clearError` - Clear error message
- `resetGridViewState` - Reset to initial state

**Action Structure:**

```typescript
export const gridViewActions = createActionGroup({
  source: 'GridView',
  events: {
    /* ... */
  },
});
```

---

### 3. **Reducers** (`grid-view.reducer.ts`)

Factory function creates per-feature reducers:

```typescript
export function createGridViewReducerForFeature(featureName: string) {
  const gridViewReducer = createReducer(
    getInitialGridViewState(featureName),
    on(gridViewActions.loadGridViews, ...),
    on(gridViewActions.loadGridViewsSuccess, ...),
    // ... more handlers
  );

  return (state: EntityGridViewState | undefined, action: Action): EntityGridViewState => {
    return gridViewReducer(state, action);
  };
}
```

#### Key Reducer Handlers

| Action                    | Behavior                                                    |
| ------------------------- | ----------------------------------------------------------- |
| `loadGridViews`           | Set `isLoading = true`, clear error                         |
| `loadGridViewsSuccess`    | Populate entities, set `currentViewId`, `isLoading = false` |
| `loadGridViewsFailure`    | Set error message, `isLoading = false`                      |
| `createViewSuccess`       | Add new view, update `currentViewId`                        |
| `deleteViewSuccess`       | Remove view using adapter                                   |
| `setAsDefaultViewSuccess` | Update both new default and previous default view           |
| `saveViewSuccess`         | Update existing view, set `isDirty = false`                 |
| `markViewDirty`           | Track unsaved changes                                       |
| `setSearchTerm`           | Update search filter for UI                                 |

#### State Mutations

- Uses `gridViewAdapter` methods for entity operations:
  - `setAll()` - Replace all entities
  - `addOne()` - Add single entity
  - `updateOne()` - Update single entity
  - `updateMany()` - Update multiple entities
  - `removeOne()` - Remove single entity

---

### 4. **Selectors** (`grid-view.selectors.ts`)

Factory function creates per-feature selectors with memoization:

```typescript
export function createGridViewSelectorsForFeature(featureName: string) {
  const featureKey = `gridView_${featureName}`;
  const selectGridViewFeatureState =
    createFeatureSelector<EntityGridViewState>(featureKey);

  // ... create selectors

  const selectorSet = { selectAllViews, selectCurrentView, ... };
  gridViewSelectorsByFeature.set(featureName, selectorSet);
  return selectorSet;
}
```

#### Available Selectors

**Entity Selectors:**

- `selectAllViews` - All views with current filters applied
- `selectGridViewEntitiesMap` - Normalized entity map (ID → Entity)
- `selectDisplayViews` - Views filtered by search term

**Current State:**

- `selectCurrentViewId` - ID of active view
- `selectCurrentView` - Full active view object
- `selectListApiPayload` - Current filter/column configuration
- `selectIsDirty` - Has unsaved changes flag

**Loading States:**

- `selectIsLoading` - Fetching/processing data
- `selectIsSaving` - Saving view changes
- `selectIsDeleting` - Deleting view

**UI States:**

- `selectSearchTerm` - Current search text
- `selectError` - Error message if any

**Caching:**

- Selectors stored in `gridViewSelectorsByFeature` Map
- Retrieved per-feature to avoid recreation

---

### 5. **Effects** (`grid-view.effects.ts`)

Handles side effects for all features with feature-aware action dispatching:

#### Effect Chains

**Load Views Chain:**

```
loadGridViews$ → API call (getUserConfigSettingList)
  ├─ Success → loadGridViewsSuccess + loadViewDetails
  └─ Error → loadGridViewsFailure
```

**Load View Details:**

```
loadViewDetails$ → API call (getUserConfigSettingDetail)
  ├─ Success → loadViewDetailsSuccess
  └─ Error → loadViewDetailsFailure
```

**Create View Chain:**

```
openEditViewWindow$ → Show Modal Dialog
  → User enters view name/settings
  → createView | cloneView | renameView
    → API call (create/update view)
    ├─ Success → [Create|Clone|Rename]ViewSuccess
    └─ Error → [Create|Clone|Rename]ViewFailure
```

**View Operations:**

- `saveView$` - Update existing view properties
- `cloneView$` - Duplicate view with new name
- `renameView$` - Change view name
- `setAsDefaultView$` - Mark as default view
- `deleteView$` - Remove view, switch to alternate if current deleted
- `shareView$` - Toggle view sharing status

**Special Logic:**

- Automatic current view switching on deletion
- Modal dialog integration for view naming
- Error handling with user notifications

#### Operator Patterns

- `switchMap` - Cancel previous operations (load operations)
- `concatMap` - Maintain order for sequential operations (saves)
- `exhaustMap` - Ignore new requests while processing (modal dialog)
- `mergeMap` - Parallel processing (delete with view switch)

---

### 6. **Facade** (`grid-view.facade.ts`)

Provides high-level Signal-based API for components:

#### Initialization

```typescript
initializeFeature(featureName: string): void
getCurrentFeature(): string | null
```

#### Data Accessors (Returns Signals)

```typescript
getViews(): Signal<UserConfigSettingDetail[]>
getCurrentViewId(): Signal<number>
getCurrentView(): Signal<UserConfigSettingDetail>
getListApiPayload(): Signal<ListApiPayload | null>
getIsDirty(): Signal<boolean>
```

#### View Operations (Dispatch Actions)

```typescript
loadGridViews(shallow?: boolean, reload?: boolean): void
loadViewDetails(currentViewId: number): void
createView(): void                          // Create from current state
saveView(data: UserConfigSetting): void    // Save changes to view
```

#### View Management

```typescript
cloneView(view: UserConfigSettingDetail): void
remainView(view: UserConfigSettingDetail): void  // Rename
setAsDefaultView(viewId: number): void
deleteView(viewId: number): void
shareView(viewId: number, sharedView: boolean): void
```

#### State Management

```typescript
setListApiPayload(listApiPayload: ListApiPayload): void
markViewDirty(isDirty: boolean): void
setSearchTerm(searchTerm: string): void
clearError(): void
resetState(): void
```

**Design Pattern:**

- Validates feature initialization before operations
- Throws error if feature not initialized
- Shields components from direct store access
- Signal-based reactive updates

---

## 🔄 Data Models

### UserConfigSetting (Base View Model)

```typescript
interface UserConfigSetting {
  pgListSettingName: string; // Internal name (user-defined)
  pgListSettingId: number; // Unique identifier
  sysDefault?: boolean; // System default flag
  sysView?: boolean; // System/built-in view
  sharedView?: boolean; // Shared with other users
  sharedPublic?: boolean; // Shared publicly
  editable?: boolean; // User can edit
  displaySettingName?: string; // Display name (localized)
}
```

### UserConfigSettingDetail (Full View Model)

```typescript
interface UserConfigSettingDetail extends UserConfigSetting {
  columnFilterRequestJSON: ListApiPayload; // Filters and columns
}
```

### ListApiPayload (View Configuration)

```typescript
interface ListApiPayload {
  columns: FilterColumnProps[]; // Filter conditions
  selectedColumns?: ColumnProps[]; // Visible columns
  orColumns?: ColumnProps[]; // OR filter conditions
  maxRowsPerPage: number; // Pagination size
  searchString?: string; // Search text

  // Feature-specific flags
  oneHopAway?: boolean;
  inSameRow?: boolean;
  inSameCabinet?: boolean;
  directConnects?: boolean;
  // ... more options
}
```

### FilterColumnProps

```typescript
interface FilterColumnProps {
  name: string; // Column name
  displayValue?: string; // Display label
  filter?: Filter; // Filter conditions
  orFilter?: Filter; // OR filter
  sortOrder?: number;
  sortType?: SortType;
}
```

---

## 🚀 Multi-Feature Architecture

### Feature Registration Pattern

Each feature (circuits, items, locations, models) gets isolated state:

```typescript
// In GridViewsModule
createGridViewSelectorsForFeature('circuits'); // Pre-create selectors
createGridViewSelectorsForFeature('items');
createGridViewSelectorsForFeature('locations');
createGridViewSelectorsForFeature('models');

StoreModule.forFeature('gridView_circuits', createGridViewReducerForFeature('circuits')),
  StoreModule.forFeature('gridView_items', createGridViewReducerForFeature('items')),
  // ...

  EffectsModule.forFeature([GridViewEffects]); // Single effects class
```

### Feature State Keys

- `gridView_circuits` - Circuits view state
- `gridView_items` - Items view state
- `gridView_locations` - Locations view state
- `gridView_models` - Models view state

### State Isolation

- Each feature has independent entity collection
- Separate loading/error states
- Own current view ID
- Shared actions dispatch with feature name
- Per-feature selectors via factory

---

## 📊 Data Flow Diagrams

### Load Views Flow

```
Component                    Facade                 Store              API
   │                          │                       │                │
   ├─ Initialize ────────────>│                       │                │
   │  (featureName)           │                       │                │
   │                          │                       │                │
   │                          ├─ loadGridViews   ────>│                │
   │                          │  (action)             │                │
   │                          │                       ├─ Effect ──────>│
   │                          │                       │ /list          │
   │                          │                       │                │
   │<────────────────────────────────────────────────┤<── GridViews──│
   │   Views Signal            │                      │                │
   │   (via selector)          │                      │                │
   │                          │<─ Success Action ──│
   │                          │ (loadGridViewsSuccess)
```

### Create/Clone/Rename Flow

```
Component          Facade           Reducer     Effects          Dialog/API
   │                 │                 │           │              │
   ├─ createView ──>│                 │           │              │
   │                 │─ openEdit ───────────────>│              │
   │                 │  ViewWindow                │─ modal ────>│
   │                 │                           │              │
   │                 │<────────────── viewName ──┤<──user input─┤
   │                 │                           │              │
   │                 ├─ createView ────────────────────────────>│
   │                 │ (action)        │         │   POST /     │
   │                 │                 │         │              │
   │                 │                 │         │              │
   │                 │<─ Success ──────────────│<──new View ───┤
   │                 │                 │         │              │
   │<─ currentView ──┤                 │         │
   │  (Signal)       │                 │         │
```

### Delete with Fallback Flow

```
Component          Facade           Effects            API
   │                 │                 │                 │
   ├─ deleteView ───>│                 │                 │
   │  (viewId)       │                 │                 │
   │                 ├─ deleteView ──────────────────── │
   │                 │  (action)        │                DELETE
   │                 │                 │                 │
   │                 │                 │<─ response ────│
   │                 │                 │                 │
   │                 │                 ├─ Check if currentView
   │                 │                 │  == deleted viewId
   │                 │                 │                 │
   │                 │                 ├─ loadViewDetails
   │                 │                 │  (nextView)     │
   │                 │                 │                 │
   │                 │<─ Success ──────────────────────│
   │<─ currentView ──┤                 │                 │
   │  (next view)    │                 │                 │
```

---

## 🔌 Integration Points

### Module Integration

```typescript
@NgModule({
  imports: [GridViewsModule],
})
export class FeatureModule {}
```

### Component Usage Pattern

1. **Initialize Feature:**

```typescript
export class GridViewsComponent implements OnInit {
  constructor(private facade: GridViewFacade) {}

  ngOnInit() {
    this.facade.initializeFeature('circuits');
    this.facade.loadGridViews();
  }
}
```

2. **Consume Data:**

```typescript
views$ = this.facade.getViews(); // Signal, auto-updates
currentView$ = this.facade.getCurrentView();
isDirty$ = this.facade.getIsDirty();
```

3. **Dispatch Actions:**

```typescript
saveCurrentView() {
  this.facade.saveView(this.currentView());
}

cloneView(view: UserConfigSettingDetail) {
  this.facade.cloneView(view);
}
```

### API Service Integration

- `UserDefSettingsApiService` provides HTTP methods
- Feature-agnostic API endpoints use URL parameters
- Response data shaped into NgRx entities

---

## 📈 State Evolution Example

### Initial State

```typescript
{
  ids: [],
  entities: {},
  featureName: 'circuits',
  currentViewId: -1,
  listApiPayload: null,
  isLoading: false,
  isDeleting: false,
  isSaving: false,
  error: null,
  isDirty: false,
  sortBy: 'displaySettingName',
  searchTerm: ''
}
```

### After Load Success

```typescript
{
  ids: [1, 2, 3],
  entities: {
    1: { pgListSettingId: 1, displaySettingName: 'All Circuits', ... },
    2: { pgListSettingId: 2, displaySettingName: 'My Views', ... },
    3: { pgListSettingId: 3, displaySettingName: 'Shared', ... }
  },
  currentViewId: 1,  // Auto-selected
  isLoading: false,
  error: null,
  // ... other properties
}
```

### After Save

```typescript
{
  // ... same entities, but:
  isDirty: false,    // Changes saved
  isSaving: false,
  error: null
}
```

---

## 🛡️ Error Handling

### Error Sources

1. **API Errors** - HTTP failures
2. **Validation Errors** - Backend validation failures
3. **State Errors** - Feature not initialized

### Error Handling Strategy

**In Reducers:**

- Set `error` property with message
- Set loading flags to `false`
- Preserve current state

**In Effects:**

- Catch HTTP errors
- Show confirmation dialog with error message
- Dispatch failure actions

**In Components:**

- Subscribe to `selectError` selector
- Display error notifications
- Provide retry options

```typescript
// In Effects
catchError((error) => {
  this.confirmationDialogService.showMessage(error.error?.errorList.join('\n'), 'DCT_LABELS.AN_ERROR_OCCURRED');
  return of(gridViewActions.loadGridViewsFailure({ featureName, error }));
});
```

---

## ⚙️ Performance Considerations

### Memoization

- Selectors use `createSelector` for automatic memoization
- Prevent unnecessary component re-renders
- Reuse cached computation results

### Entity Adapter

- Normalized state reduces payload size
- Efficient updates via adapter methods
- O(1) lookups by ID

### Signal Updates

- Fine-grained change detection
- Only affected signals recompute
- Reduced change detection cycles

### Effect Operators

- `switchMap` cancels previous loading requests
- `concatMap` prevents concurrent saves
- `exhaustMap` ignores rapid modal interactions

---

## 🧪 Testing Patterns

### Unit Tests

```typescript
// Reducer tests
it('should set isLoading=true on loadGridViews', () => {
  const state = createGridViewReducerForFeature('test')(
    initialState,
    gridViewActions.loadGridViews({ featureName: 'test', ... })
  );
  expect(state.isLoading).toBe(true);
});

// Selector tests
it('should select current view', () => {
  const selectors = createGridViewSelectorsForFeature('test');
  const result = selectors.selectCurrentView(state);
  expect(result).toEqual(expectedView);
});

// Effects tests
it('should dispatch success on loadGridViews', () => {
  const action = gridViewActions.loadGridViews({...});
  const completion = gridViewActions.loadGridViewsSuccess({...});

  actions$ = hot('-a', { a: action });
  const result = hot('-a', { a: completion });

  expect(effects.loadGridViews$).toBeObservable(result);
});
```

### Integration Tests

- Test feature registration
- Verify multi-feature isolation
- Test state persistence across features

---

## 🔐 Security Considerations

### User Permissions

- API enforces view access control
- Frontend respects `editable` flag
- Share permissions handled by backend

### Data Privacy

- Views contain sensitive filter configurations
- Client-side validation only
- Server-side authorization required for all operations

---

## 📚 File Structure

```
grid-views/
├── +state/                          # NgRx state management
│   ├── grid-view-state.model.ts     # State interface & adapter
│   ├── grid-view.actions.ts         # Action group definition
│   ├── grid-view.reducer.ts         # Reducer factory
│   ├── grid-view.selectors.ts       # Selector factories
│   ├── grid-view.effects.ts         # Side effects
│   ├── grid-view.facade.ts          # Public API facade
│   └── *.spec.ts                    # Unit tests
│
├── data/                            # Data layer
│   ├── models/
│   │   └── grid-views.model.ts      # TypeScript interfaces
│   ├── services/
│   │   └── user-def-settings-api.service.ts  # HTTP client
│   └── list-type.token.ts           # Injection token
│
├── feature-views-button/            # UI component (feature)
│   ├── grid-views-button.component.ts
│   ├── ui/                          # Sub-components
│   └── README.md
│
├── grid-views.module.ts             # Module definition
├── index.ts                         # Public API
├── ARCHITECTURE.md                  # This file
└── README.md
```

---

## 🎯 Future Enhancements

1. **View History** - Track view modifications over time
2. **Collaborative Editing** - Multiple users editing same view
3. **View Templates** - Pre-built view configurations
4. **Advanced Filtering UI** - Visual filter builder
5. **View Import/Export** - Backup and share configurations
6. **Performance Metrics** - Track view performance characteristics

---

## 📖 References

- [NgRx Documentation](https://ngrx.io/)
- [NgRx Entity Guide](https://ngrx.io/guide/entity)
- [NgRx Effects Guide](https://ngrx.io/guide/effects)
- [Angular Signals Guide](https://angular.io/guide/signals)
- [DCT List View Architecture](../core/list-view/README.md)

---

**Last Updated:** January 5, 2026
**Version:** 1.0
**Maintainers:** DCTrack Team
