import { createSelector } from '@ngrx/store';
import { SelectionModel } from '@angular/cdk/collections';
import { GnroRowGroup } from '../utils/row-group/row-group';
import { GridState } from '../models/grid.model';
import { defaultState } from '../models/default-grid';

export interface AppGridState {
  gnroGrid: GridState;
}

export const featureSelector = (state: AppGridState) => state.gnroGrid;

export const selectGridConfig = (gridId: string) =>
  createSelector(featureSelector, (state: GridState) => {
    return state && state[gridId] ? state[gridId].gridConfig : defaultState.gridConfig;
  });

export const selectGridSetting = (gridId: string) =>
  createSelector(featureSelector, (state: GridState) => {
    return state && state[gridId] ? state[gridId].gridSetting : defaultState.gridSetting;
  });

export const selectColumnsConfig = (gridId: string) =>
  createSelector(featureSelector, (state: GridState) => {
    return state && state[gridId] ? state[gridId].columnsConfig : [];
  });

export const selectGridData = (gridId: string) =>
  createSelector(featureSelector, (state: GridState) => {
    return state && state[gridId] ? state[gridId].data : [];
  });

export const selectGridModifiedRecords = (gridId: string) =>
  createSelector(featureSelector, (state: GridState) => {
    return state && state[gridId] ? state[gridId].modified : [];
  });

export const selectRowSelection = (gridId: string) =>
  createSelector(featureSelector, (state: GridState) => {
    return state && state[gridId] ? state[gridId].selection : new SelectionModel<object>(false, []);
  });

export const selectRowSelections = (gridId: string) =>
  createSelector(featureSelector, (state: GridState) => {
    if (state && state[gridId]) {
      const oldState = state[gridId];
      const selection = oldState.selection;
      const dataCounts = oldState.data.filter((item) => item && !(item instanceof GnroRowGroup)).length;
      const allSelected = selection.selected.length === dataCounts && dataCounts > 0;
      return {
        selection,
        allSelected,
        indeterminate: selection.hasValue() && !allSelected,
      };
    } else {
      return {
        selection: new SelectionModel<object>(false, []),
        allSelected: false,
        indeterminate: false,
      };
    }
  });

export const selectRowGroups = (gridId: string) =>
  createSelector(featureSelector, (state: GridState) => {
    return state && state[gridId].rowGroups ? state[gridId].rowGroups : true;
  });

export const selectGridInMemoryData = (gridId: string) =>
  createSelector(featureSelector, (state: GridState) => {
    return state && state[gridId] ? state[gridId].inMemoryData : [];
  });
