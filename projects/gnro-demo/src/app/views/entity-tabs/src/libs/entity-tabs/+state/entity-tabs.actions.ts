import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { AppEntityTab } from '../models/entity-tabs.model';
import { FEATURE_NAME } from '../models/feature-name.enum';

/**
 * Shared actions for all entity tabs features.
 * Each action includes featureName to identify the target feature slice.
 */
export const entityTabsActions = createActionGroup({
  source: 'EntityTabs',
  events: {
    // Data Loading Actions
    'Load Tabs': props<{ featureName: FEATURE_NAME | string }>(),
    'Load Tabs Success': props<{ featureName: FEATURE_NAME | string; tabs: AppEntityTab[] }>(),
    'Load Tabs Failure': props<{ featureName: FEATURE_NAME | string; error: string }>(),

    // Tab Selection
    'Set Active Tab': props<{ featureName: FEATURE_NAME | string; tabId: string }>(),
    'Clear Active Tab': props<{ featureName: FEATURE_NAME | string }>(),

    // CRUD Operations - Add
    'Add Tab': props<{ featureName: FEATURE_NAME | string; tab: AppEntityTab }>(),
    'Add Tab Success': props<{ featureName: FEATURE_NAME | string; tab: AppEntityTab }>(),
    'Add Tab Failure': props<{ featureName: FEATURE_NAME | string; error: string }>(),

    // CRUD Operations - Update
    'Update Tab': props<{ featureName: FEATURE_NAME | string; tab: AppEntityTab }>(),
    'Update Tab Success': props<{ featureName: FEATURE_NAME | string; tab: AppEntityTab }>(),
    'Update Tab Failure': props<{ featureName: FEATURE_NAME | string; error: string }>(),

    // CRUD Operations - Remove
    'Remove Tab': props<{ featureName: FEATURE_NAME | string; tabId: string }>(),
    'Remove Tab Success': props<{ featureName: FEATURE_NAME | string; tabId: string }>(),
    'Remove Tab Failure': props<{ featureName: FEATURE_NAME | string; error: string }>(),

    // Bulk Operations
    'Remove All Tabs': props<{ featureName: FEATURE_NAME | string }>(),
    'Remove All Tabs Success': props<{ featureName: FEATURE_NAME | string }>(),

    // Save Operations
    'Save Tab': props<{ featureName: FEATURE_NAME | string; tab: AppEntityTab }>(),
    'Save Tab Success': props<{ featureName: FEATURE_NAME | string; tab: AppEntityTab }>(),
    'Save Tab Failure': props<{ featureName: FEATURE_NAME | string; error: string }>(),

    'Save All Dirty Tabs': props<{ featureName: FEATURE_NAME | string }>(),
    'Save All Dirty Tabs Success': props<{ featureName: FEATURE_NAME | string; tabs: AppEntityTab[] }>(),
    'Save All Dirty Tabs Failure': props<{ featureName: FEATURE_NAME | string; error: string }>(),

    // Tab State Management
    'Mark Tab Dirty': props<{ featureName: FEATURE_NAME | string; tabId: string; isDirty: boolean }>(),
    'Set Tab Editing': props<{ featureName: FEATURE_NAME | string; tabId: string; isEditing: boolean }>(),
    'Set Tab Invalid': props<{ featureName: FEATURE_NAME | string; tabId: string; isInvalid: boolean }>(),
    'Set Subtab Index': props<{ featureName: FEATURE_NAME | string; tabId: string; subtabIndex: number }>(),
    'Update Tab Values': props<{
      featureName: FEATURE_NAME | string;
      tabId: string;
      values: Record<string, unknown>;
    }>(),
    'Revert Tab Changes': props<{ featureName: FEATURE_NAME | string; tabId: string }>(),

    // Error Handling
    'Clear Error': props<{ featureName: FEATURE_NAME | string }>(),

    // State Reset
    'Reset State': props<{ featureName: FEATURE_NAME | string }>(),
  },
});
