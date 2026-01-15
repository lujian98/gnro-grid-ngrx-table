import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, concatMap, take } from 'rxjs/operators';
import { entityTabsActions } from './entity-tabs.actions';
import { getEntityTabsSelectorsForFeature } from './entity-tabs.selectors';
import { AppEntityTab } from '../models/entity-tabs.model';

/**
 * Single effects class that handles all entity tabs features.
 * Actions are filtered by featureName to target specific feature slices.
 *
 * NOTE: This is a template effects class. You should inject your own
 * API service to handle the actual HTTP calls for loading and saving tabs.
 */
@Injectable()
export class EntityTabsEffects {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store);

  /**
   * Effect for loading tabs.
   * Replace the mock implementation with actual API call.
   */
  loadTabs$ = createEffect(() =>
    this.actions$.pipe(
      ofType(entityTabsActions.loadTabs),
      switchMap(({ featureName }) => {
        // TODO: Replace with actual API service call
        // Example: return this.apiService.getTabs(featureName).pipe(...)
        return of([]).pipe(
          map((tabs) => entityTabsActions.loadTabsSuccess({ featureName, tabs })),
          catchError((error) =>
            of(
              entityTabsActions.loadTabsFailure({
                featureName,
                error: error.message || 'Failed to load tabs',
              }),
            ),
          ),
        );
      }),
    ),
  );

  /**
   * Effect for adding a tab.
   * Replace the mock implementation with actual API call if needed.
   */
  addTab$ = createEffect(() =>
    this.actions$.pipe(
      ofType(entityTabsActions.addTab),
      concatMap(({ featureName, tab }) => {
        // TODO: Replace with actual API service call if server-side persistence needed
        // For client-side only, dispatch success immediately
        return of(entityTabsActions.addTabSuccess({ featureName, tab }));
      }),
    ),
  );

  /**
   * Effect for updating a tab.
   */
  updateTab$ = createEffect(() =>
    this.actions$.pipe(
      ofType(entityTabsActions.updateTab),
      concatMap(({ featureName, tab }) => {
        // TODO: Replace with actual API service call if server-side persistence needed
        return of(entityTabsActions.updateTabSuccess({ featureName, tab }));
      }),
    ),
  );

  /**
   * Effect for removing a tab.
   */
  removeTab$ = createEffect(() =>
    this.actions$.pipe(
      ofType(entityTabsActions.removeTab),
      concatMap(({ featureName, tabId }) => {
        // TODO: Replace with actual API service call if server-side persistence needed
        return of(entityTabsActions.removeTabSuccess({ featureName, tabId }));
      }),
    ),
  );

  /**
   * Effect for removing all tabs.
   */
  removeAllTabs$ = createEffect(() =>
    this.actions$.pipe(
      ofType(entityTabsActions.removeAllTabs),
      concatMap(({ featureName }) => {
        // TODO: Replace with actual API service call if server-side persistence needed
        return of(entityTabsActions.removeAllTabsSuccess({ featureName }));
      }),
    ),
  );

  /**
   * Effect for saving a single tab.
   */
  saveTab$ = createEffect(() =>
    this.actions$.pipe(
      ofType(entityTabsActions.saveTab),
      concatMap(({ featureName, tab }) => {
        // TODO: Replace with actual API service call
        // Example: return this.apiService.saveTab(featureName, tab).pipe(...)
        return of(entityTabsActions.saveTabSuccess({ featureName, tab })).pipe(
          catchError((error) =>
            of(
              entityTabsActions.saveTabFailure({
                featureName,
                error: error.message || 'Failed to save tab',
              }),
            ),
          ),
        );
      }),
    ),
  );

  /**
   * Effect for saving all dirty tabs.
   */
  saveAllDirtyTabs$ = createEffect(() =>
    this.actions$.pipe(
      ofType(entityTabsActions.saveAllDirtyTabs),
      mergeMap(({ featureName }) => {
        const selectors = getEntityTabsSelectorsForFeature(featureName);
        if (!selectors) {
          return of(
            entityTabsActions.saveAllDirtyTabsFailure({
              featureName,
              error: 'Feature not initialized',
            }),
          );
        }

        return this.store.select(selectors.selectDirtyTabs).pipe(
          take(1),
          switchMap((dirtyTabs: AppEntityTab[]) => {
            if (dirtyTabs.length === 0) {
              return of(
                entityTabsActions.saveAllDirtyTabsSuccess({
                  featureName,
                  tabs: [],
                }),
              );
            }

            // TODO: Replace with actual batch API call
            // Example: return this.apiService.saveTabs(featureName, dirtyTabs).pipe(...)
            return of(
              entityTabsActions.saveAllDirtyTabsSuccess({
                featureName,
                tabs: dirtyTabs,
              }),
            );
          }),
          catchError((error) =>
            of(
              entityTabsActions.saveAllDirtyTabsFailure({
                featureName,
                error: error.message || 'Failed to save tabs',
              }),
            ),
          ),
        );
      }),
    ),
  );
}
