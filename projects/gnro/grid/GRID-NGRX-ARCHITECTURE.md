# Grid NgRx State Architecture

This document describes the NgRx state management architecture for the `@gnro/ui/grid` component.

## Overview

The grid uses a **multi-feature isolated state architecture** where each grid instance gets its own NgRx feature slice, keyed by a configurable `gridName`. This enables:

- Multiple independent grid instances on the same page
- Clean state isolation between grids
- Dynamic feature registration at runtime
- Efficient selector memoization per grid

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      NgRx Store                                 │
├─────────────────────────────────────────────────────────────────┤
│  'grid-users'     │  'grid-orders'    │  'grid-products'        │
│  ┌─────────────┐  │  ┌─────────────┐  │  ┌─────────────┐        │
│  │ gridConfig  │  │  │ gridConfig  │  │  │ gridConfig  │        │
│  │ gridSetting │  │  │ gridSetting │  │  │ gridSetting │        │
│  │ columnsConf │  │  │ columnsConf │  │  │ columnsConf │        │
│  │ data[]      │  │  │ data[]      │  │  │ data[]      │        │
│  │ selection   │  │  │ selection   │  │  │ selection   │        │
│  │ modified[]  │  │  │ modified[]  │  │  │ modified[]  │        │
│  │ ...         │  │  │ ...         │  │  │ ...         │        │
│  └─────────────┘  │  └─────────────┘  │  └─────────────┘        │
└─────────────────────────────────────────────────────────────────┘
         ▲                   ▲                   ▲
         │                   │                   │
    ┌────┴────┐         ┌────┴────┐         ┌────┴────┐
    │ Reducer │         │ Reducer │         │ Reducer │
    │ Factory │         │ Factory │         │ Factory │
    └────┬────┘         └────┬────┘         └────┬────┘
         │                   │                   │
         └───────────────────┼───────────────────┘
                             │
                    ┌────────┴────────┐
                    │  Shared Actions │
                    │  (with gridName)  │
                    └────────┬────────┘
                             │
                    ┌────────┴────────┐
                    │  Shared Effects │
                    └────────┬────────┘
                             │
                    ┌────────┴────────┐
                    │  GnroGridFacade │
                    │  (Signal-based) │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
        ┌──────────┐   ┌──────────┐   ┌──────────┐
        │ Grid A   │   │ Grid B   │   │ Grid C   │
        │ users    │   │ orders   │   │ products │
        └──────────┘   └──────────┘   └──────────┘
```

## Core Components

### 1. State Model (`grid.model.ts`)

```typescript
interface GnroGridState<T> {
  gridConfig: GnroGridConfig;      // Grid configuration (gridName, columns, etc.)
  gridSetting: GnroGridSetting;    // Runtime settings (loading, pagination, etc.)
  columnsConfig: GnroColumnConfig[]; // Column definitions
  data: T[];                        // Current displayed data
  queryData: T[];                   // Query result data (before grouping)
  inMemoryData: T[];               // In-memory data source
  modified: T[];                   // Modified records for editing
  selection: GnroGridRowSelections<T>; // Row selection state
  rowGroups?: GnroRowGroups;       // Row grouping state
  formWindowConfig?: GnroFormWindowConfig; // Form window config
  totalCounts: number;             // Total record count
}
```

### 2. Feature Key Generation (`grid.reducer.ts`)

Each grid gets a unique feature key based on its `gridName`:

```typescript
export function getGridFeatureKey(gridName: string): string {
  return `grid-${gridName}`;
}
```

### 3. Reducer Factory (`grid.reducer.ts`)

Creates per-gridName reducers with action filtering:

```typescript
export function createGridReducerForFeature(gridName: string) {
  const initialState = getInitialGridState<unknown>(gridName);

  const gridReducer = createReducer(
    initialState,
    on(gridActions.initConfig, (state, action) => {
      if (action.gridName !== gridName) return state; // Filter by gridName
      // Always start from fresh state
      const freshState = getInitialGridState<unknown>(gridName);
      return { ...freshState, /* new config */ };
    }),
    // ... other action handlers with same gridName filtering
  );

  return (state, action) => gridReducer(state, action);
}
```

**Key Features:**
- Each reducer only handles actions matching its `gridName`
- Reducers are cached in `gridReducersByFeature` Map
- `initConfig` always starts from fresh state to prevent stale data

### 4. Selector Factory (`grid.selectors.ts`)

Creates per-gridName selectors with memoization:

```typescript
export function createGridSelectorsForFeature(gridName: string): GridSelectors {
  // Return cached selectors if available
  const cached = gridSelectorsByFeature.get(gridName);
  if (cached) return cached;

  const featureKey = getGridFeatureKey(gridName);
  const selectGridFeatureState = createFeatureSelector<GnroGridState>(featureKey);

  const selectGridConfig = createSelector(selectGridFeatureState,
    (state) => state?.gridConfig ?? defaultState().gridConfig
  );
  // ... other selectors

  gridSelectorsByFeature.set(gridName, selectors);
  return selectors;
}
```

**Key Features:**
- Selectors are cached per `gridName` for efficiency
- Each selector targets the specific feature slice
- Returns default values when state is undefined

### 5. Dynamic Feature Registration (`grid-state.module.ts`)

```typescript
@Injectable({ providedIn: 'root' })
export class GnroGridFeatureService {
  private readonly reducerManager = inject(ReducerManager);

  registerFeature(gridName: string): void {
    if (registeredGridFeatures.has(gridName)) return;

    const featureKey = getGridFeatureKey(gridName);
    const reducer = createGridReducerForFeature(gridName);

    this.reducerManager.addReducer(featureKey, reducer);
    createGridSelectorsForFeature(gridName); // Pre-create selectors
    registeredGridFeatures.add(gridName);
  }

  removeFeature(gridName: string): void {
    const featureKey = getGridFeatureKey(gridName);
    this.reducerManager.removeReducer(featureKey);
    registeredGridFeatures.delete(gridName);
  }
}
```

### 6. Shared Actions (`grid.actions.ts`)

All actions include `gridName` to identify the target grid:

```typescript
export const gridActions = createActionGroup({
  source: 'Grid',
  events: {
    'Init Config': props<{ gridName: string; gridConfig: GnroGridConfig; gridType: string }>(),
    'Get Data': props<{ gridName: string }>(),
    'Get Data Success': props<{ gridName: string; gridData: GnroGridData<T> }>(),
    'Set Select Row': props<{ gridName: string; record: T }>(),
    // ... other actions
  },
});
```

### 7. Shared Effects (`grid.effects.ts`)

Effects handle all grids using the `gridName` from actions:

```typescript
@Injectable()
export class GnroGridEffects {
  getGridData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(gridActions.getData),
      switchMap((action) => {
        const gridName = action.gridName;
        const gridConfig = this.gridFacade.getConfig(gridName)();
        return this.gridService.getGridData(gridConfig, columns).pipe(
          map((gridData) => gridActions.getDataSuccess({ gridName, gridData })),
        );
      }),
    ),
  );
}
```

### 8. Signal-Based Facade (`grid.facade.ts`)

Provides a reactive API for components:

```typescript
@Injectable({ providedIn: 'root' })
export class GnroGridFacade {
  private readonly gridFeatureService = inject(GnroGridFeatureService);

  initConfig(gridName: string, gridConfig: GnroGridConfig, gridType: string): void {
    this.gridFeatureService.registerFeature(gridName);
    this.store.dispatch(gridActions.initConfig({ gridName, gridConfig, gridType }));
    // Trigger config/data loading based on configuration
  }

  getConfig(gridName: string): Signal<GnroGridConfig> {
    const selectors = createGridSelectorsForFeature(gridName);
    return this.store.selectSignal(selectors.selectGridConfig);
  }

  getSignalData<T>(gridName: string): Signal<T[]> {
    const selectors = createGridSelectorsForFeature(gridName);
    return this.store.selectSignal(selectors.selectGridData);
  }

  // ... other signal getters and action dispatchers
}
```

## Component Integration

### Grid Component (`grid.component.ts`)

```typescript
@Component({ selector: 'gnro-grid' })
export class GnroGridComponent implements OnInit, OnDestroy {
  private readonly gridFacade = inject(GnroGridFacade);

  // Input with transform for initialization
  gridConfig = input(defaultGridConfig, {
    transform: (value: Partial<GnroGridConfig>) => {
      const config = { ...defaultGridConfig, ...value };
      this.initGridConfig(config);
      return config;
    },
  });

  // Computed signals for reactive data binding
  gridConfig$ = computed(() => this.gridFacade.getConfig(this.gridConfig().gridName)());
  gridData$ = computed(() => this.gridFacade.getSignalData(this.gridConfig().gridName)());

  private initGridConfig(config: GnroGridConfig): void {
    this.gridFacade.initConfig(config.gridName, config, 'grid');
  }

  ngOnDestroy(): void {
    this.gridFacade.clearStore(this.gridConfig().gridName);
  }
}
```

### Usage Example

```html
<!-- Single grid -->
<gnro-grid [gridConfig]="{ gridName: 'users', remoteGridData: true }">
</gnro-grid>

<!-- Multiple grids on same page -->
<gnro-grid [gridConfig]="{ gridName: 'users', ... }"></gnro-grid>
<gnro-grid [gridConfig]="{ gridName: 'orders', ... }"></gnro-grid>
```

## State Lifecycle

### Initialization Flow

```
Component Mount
      │
      ▼
gridConfig input transform
      │
      ▼
initGridConfig(config)
      │
      ▼
gridFacade.initConfig(gridName, config, 'grid')
      │
      ├─► registerFeature(gridName) ─► addReducer() + createSelectors()
      │
      └─► dispatch(initConfig) ─► Reducer creates fresh state
                │
                ▼
          dispatch(loadConfig) or dispatch(loadColumnsConfig)
                │
                ▼
          Effects fetch remote data
                │
                ▼
          dispatch(getDataSuccess) ─► State updated with data
```

### Cleanup Flow

```
Component Destroy
      │
      ▼
ngOnDestroy()
      │
      ▼
gridFacade.clearStore(gridName)
      │
      ▼
dispatch(clearStore)
      │
      ▼
Effect: saveGridConfigs() ─► dispatch(removeStore)
      │
      ▼
Reducer resets to initial state
```

## Key Design Decisions

### 1. Fresh State on Init
`initConfig` always creates fresh state to prevent stale data when reusing the same `gridName`:
```typescript
on(gridActions.initConfig, (state, action) => {
  const freshState = getInitialGridState<unknown>(gridName);
  return { ...freshState, /* new config */ };
});
```

### 2. Immediate Cleanup
`clearStore` immediately dispatches `removeStore` after saving configs (no delay) to prevent race conditions:
```typescript
clearGridDataStore$ = createEffect(() =>
  this.actions$.pipe(
    ofType(gridActions.clearStore),
    concatMap((action) => {
      return this.gridService.saveGridConfigs(...).pipe(
        map(() => gridActions.removeStore({ gridName })) // Immediate, no delay
      );
    }),
  ),
);
```

### 3. Action Filtering in Reducers
Each reducer filters actions by `gridName` to ensure only the correct grid's state is modified:
```typescript
on(gridActions.getData, (state, action) => {
  if (action.gridName !== gridName) return state;
  // Handle action...
});
```

### 4. Selector Caching
Selectors are cached per `gridName` to avoid recreating memoized selectors:
```typescript
const cached = gridSelectorsByFeature.get(gridName);
if (cached) return cached;
```

## File Structure

```
projects/gnro/grid/src/+state/
├── grid.actions.ts       # Shared actions with gridName
├── grid.reducer.ts       # Reducer factory + initial state
├── grid.selectors.ts     # Selector factory with caching
├── grid.effects.ts       # Shared effects
├── grid.facade.ts        # Signal-based facade
└── grid-state.module.ts  # Feature service + module
```

## Benefits

| Feature | Benefit |
|---------|---------|
| Per-gridName isolation | Multiple independent grids on same page |
| Factory pattern | Consistent reducer/selector creation |
| Selector caching | Efficient memoization |
| Dynamic registration | Lazy feature loading |
| Signal-based facade | Modern Angular reactivity |
| Fresh state on init | No stale data when reusing gridName |
| Immediate cleanup | No race conditions on navigation |
