import { createSelector } from '@ngrx/store';
import { defaultState } from '../models/default-grid';
import { GridState } from '../models/grid.model';

export interface AppGridState<T> {
  gnroGrid: GridState<T>;
}

export const featureSelector = <T>(state: AppGridState<T>) => state.gnroGrid;

export const selectGridConfig = (gridId: string) =>
  createSelector(featureSelector, (state) => {
    return state && state[gridId] ? state[gridId].gridConfig : defaultState().gridConfig;
  });

export const selectGridSetting = (gridId: string) =>
  createSelector(featureSelector, (state) => {
    return state && state[gridId] ? state[gridId].gridSetting : defaultState().gridSetting;
  });

export const selectColumnsConfig = (gridId: string) =>
  createSelector(featureSelector, (state) => {
    return state && state[gridId] ? state[gridId].columnsConfig : [];
  });

export const selectGridData = (gridId: string) =>
  createSelector(featureSelector, (state) => {
    return state && state[gridId] ? state[gridId].data : [];
  });

export const selectGridModifiedRecords = (gridId: string) =>
  createSelector(featureSelector, (state) => {
    return state && state[gridId] ? state[gridId].modified : [];
  });

export const selectRowSelection = (gridId: string) =>
  createSelector(featureSelector, (state) => {
    return state && state[gridId] ? state[gridId].selection : undefined;
  });

export const selectRowGroups = (gridId: string) =>
  createSelector(featureSelector, (state) => {
    return state && state[gridId]?.rowGroups ? state[gridId].rowGroups : true;
  });

export const selectGridInMemoryData = (gridId: string) =>
  createSelector(featureSelector, (state) => {
    return state && state[gridId] ? state[gridId].inMemoryData : [];
  });

export const selectFormWindowConfig = (gridId: string) =>
  createSelector(featureSelector, (state) => {
    return state && state[gridId] ? state[gridId].formWindowConfig : undefined;
  });
