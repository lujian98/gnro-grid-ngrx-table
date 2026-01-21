# Entity Tabs Architecture

## Overview

The Entity Tabs feature provides a **multi-feature NgRx state management solution** for managing tabbed entity views. It supports multiple entity tab details simultaneously, with each tab containing form data that can be tracked for dirty state, validation, and persistence.

## Core Concepts

### Multi-Feature Support
- Each feature (e.g., `locations`, `circuits`, `items`, `models`) has its own isolated state slice
- Features are identified by `FEATURE_NAME` enum
- State keys follow pattern: `entityTabs_<featureName>`

### Entity Tab Model
```typescript
interface AppEntityTab {
  id: string;           // Unique identifier
  name: string;         // Tab name
  title: string;        // Display title
  values: object;       // Current form values
  originalValues: object; // Original values for dirty comparison
  dirty: boolean;       // True if form has unsaved changes
  editing: boolean;     // True if form is being edited
  invalid: boolean; // true if the tab form is invalid
  subtabIndex: number; // index of the subtab
}
```

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Component Layer                              │
│  ┌─────────────────────┐    ┌─────────────────────┐                │
│  │  LocationTabsComponent│    │  LocationEntityComponent│           │
│  │  - tabs$ (computed)  │    │  - form: FormGroup      │           │
│  │  - newTab()          │    │  - activeTab signal     │           │
│  │  - onSelectedIndex() │    │  - form sync to store   │           │
│  └──────────┬──────────┘    └──────────┬──────────────┘           │
│             │                          │                            │
│             └──────────┬───────────────┘                            │
│                        ▼                                            │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    EntityTabsFacade                          │   │
│  │  - initializeFeature(featureName)                           │   │
│  │  - getTabs() / getActiveTab() / getTabById()               │   │
│  │  - addTab() / updateTab() / removeTab()                    │   │
│  │  - updateTabValues() / setActiveTab()                      │   │
│  │  - markTabDirty() / setTabValid()                          │   │
│  └──────────────────────────┬──────────────────────────────────┘   │
└─────────────────────────────┼───────────────────────────────────────┘
                              │
┌─────────────────────────────┼───────────────────────────────────────┐
│                        NgRx Layer                                    │
│                              ▼                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    Actions (Shared)                          │   │
│  │  entityTabsActions.loadTabs({ featureName })                │   │
│  │  entityTabsActions.addTab({ featureName, tab })             │   │
│  │  entityTabsActions.updateTabValues({ featureName, tabId, values })│
│  │  entityTabsActions.setActiveTab({ featureName, tabId })     │   │
│  └──────────────────────────┬──────────────────────────────────┘   │
│                              │                                       │
│         ┌────────────────────┼────────────────────┐                 │
│         ▼                    ▼                    ▼                 │
│  ┌────────────┐      ┌────────────┐      ┌────────────┐           │
│  │  Reducer   │      │  Reducer   │      │  Reducer   │           │
│  │ (circuits) │      │ (locations)│      │  (items)   │           │
│  └─────┬──────┘      └─────┬──────┘      └─────┬──────┘           │
│        │                   │                   │                    │
│        ▼                   ▼                   ▼                    │
│  ┌────────────┐      ┌────────────┐      ┌────────────┐           │
│  │   State    │      │   State    │      │   State    │           │
│  │ entityTabs │      │ entityTabs │      │ entityTabs │           │
│  │ _circuits  │      │ _locations │      │ _items     │           │
│  └────────────┘      └────────────┘      └────────────┘           │
│                              │                                       │
│                              ▼                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    Selectors (Per-Feature)                   │   │
│  │  createEntityTabsSelectorsForFeature(featureName)           │   │
│  │  - selectAllTabs / selectActiveTab / selectTabById          │   │
│  │  - selectIsLoading / selectIsSaving / selectHasDirtyTabs   │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    Effects (Single Class)                    │   │
│  │  - Handles all features via featureName filtering           │   │
│  │  - loadTabs$ / addTab$ / saveTab$ / saveAllDirtyTabs$      │   │
│  └─────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────┘
```

## File Structure

```
+state/
├── entity-tabs-state.model.ts    # State interface, EntityAdapter, initial state
├── entity-tabs.actions.ts        # Shared actions with featureName payload
├── entity-tabs.reducer.ts        # Factory function for per-feature reducers
├── entity-tabs.selectors.ts      # Factory function for per-feature selectors
├── entity-tabs.effects.ts        # Single effects class for all features
├── entity-tabs.facade.ts         # Signal-based API for components
├── entity-tabs-state.module.ts   # NgModule for store registration
└── index.ts                      # Public API exports

models/
├── entity-tabs.model.ts          # AppEntityTab interface
└── feature-name.enum.ts          # FEATURE_NAME enum
```

## State Structure

```typescript
interface EntityTabsState extends EntityState<AppEntityTab> {
  featureName: FEATURE_NAME | string;
  activeTabId: string | null;
  isLoading: boolean;
  isSaving: boolean;
  isDeleting: boolean;
  error: string | null;
  hasDirtyTabs: boolean;
}
```

## Key Patterns

### 1. Shared Actions with Feature Filtering
All actions include `featureName` in their payload. Reducers filter actions by matching `featureName` to their state's `featureName`.

```typescript
// Action
entityTabsActions.addTab({ featureName: FEATURE_NAME.LOCATIONS, tab })

// Reducer
on(entityTabsActions.addTab, (state, action) => {
  if (action.featureName !== state.featureName) return state;
  // Handle action...
});
```

### 2. Per-Feature Reducer Factory
```typescript
export function createEntityTabsReducerForFeature(featureName: FEATURE_NAME | string) {
  const initialState = getInitialEntityTabsState(featureName);
  const reducer = createReducer(initialState, /* ... */);
  return (state, action) => reducer(state, action);
}
```

### 3. Cached Selectors Factory
```typescript
const selectorCache = new Map<string, EntityTabsSelectors>();

export function createEntityTabsSelectorsForFeature(featureName) {
  if (selectorCache.has(featureName)) return selectorCache.get(featureName);
  // Create and cache selectors...
}
```

### 4. Signal-Based Facade
```typescript
@Injectable({ providedIn: 'root' })
export class EntityTabsFacade {
  getTabs(): Signal<AppEntityTab[]> {
    return this.store.selectSignal(this.selectors.selectAllTabs);
  }

  addTab(tab: AppEntityTab): void {
    this.store.dispatch(entityTabsActions.addTab({ featureName, tab }));
  }
}
```

### 5. Form-Store Synchronization
```typescript
// Load from store → form
effect(() => {
  const tab = this.activeTab();
  if (tab) {
    this.form.patchValue(tab.values, { emitEvent: false });
  }
});

// Sync form → store
this.form.valueChanges.pipe(debounceTime(300)).subscribe(values => {
  this.facade.updateTabValues(tabId, values);
});
```

## Usage

### Module Registration
```typescript
@Component({
  imports: [EntityTabsStateModule],
})
export class MyComponent {}
```

### Component Implementation
```typescript
export class LocationTabsComponent {
  private facade = inject(EntityTabsFacade);

  tabs$ = computed(() => {
    return this.facade.getTabs(FEATURE_NAME.LOCATIONS)();
  });

  constructor() {
    this.facade.initializeFeature(FEATURE_NAME.LOCATIONS);
  }

  addTab(tab: AppEntityTab) {
    this.facade.addTab(tab);
  }

  onTabChange(index: number) {
    const tabs = this.tabs$();
    this.facade.setActiveTab(tabs[index].id);
  }
}
```

### Child Panel Pattern
```typescript
// Parent passes form and values to child
<app-identity-panel [form]="form" [values]="tabValues()"></app-identity-panel>

// Child adds its controls with initial values
@Component({...})
export class IdentityPanelComponent implements OnInit {
  @Input() form!: FormGroup;
  @Input() values: Record<string, unknown> = {};

  ngOnInit() {
    const initialValue = this.values['fieldName'] ?? '';
    this.form.addControl('fieldName', new FormControl(initialValue));
  }
}
```

## Features

| Feature | Description |
|---------|-------------|
| Multi-Tab Support | Multiple tabs can be open simultaneously |
| Dirty State Tracking | Automatic dirty detection by comparing values with originalValues |
| Form Validation | Track valid state per tab |
| Tab Persistence | Form values preserved when switching tabs |
| Active Tab Management | Store tracks and syncs active tab selection |
| Feature Isolation | Each feature has independent state slice |
| Signal-Based API | Reactive signals for component integration |

## Actions Reference

| Action | Purpose |
|--------|---------|
| `loadTabs` | Load tabs from backend |
| `addTab` / `addTabSuccess` | Add new tab |
| `updateTab` | Update tab entity |
| `removeTab` | Remove tab |
| `setActiveTab` | Set active tab by ID |
| `updateTabValues` | Update tab form values (auto-sets dirty) |
| `markTabDirty` | Manually set dirty state |
| `setTabEditing` | Set editing state |
| `setTabValid` | Set validation state |
| `saveTab` | Save single tab |
| `saveAllDirtyTabs` | Save all dirty tabs |
| `revertTabChanges` | Revert to originalValues |
| `resetState` | Reset feature state |
