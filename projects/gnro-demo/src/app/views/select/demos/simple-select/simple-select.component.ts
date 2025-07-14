import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GnroSelectFieldConfig, GnroSelectFieldComponent, defaultSelectFieldConfig } from '@gnro/ui/fields';
import { State, STATES } from '../../../../data/states';

@Component({
  selector: 'app-simple-select',
  templateUrl: './simple-select.component.html',
  styleUrls: ['./simple-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, GnroSelectFieldComponent],
})
export class AppSimpleSelectComponent {
  states = STATES;
  states2 = [...STATES];
  listStates = [...STATES].map((state) => state.state);

  defaultSelection1: Partial<GnroSelectFieldConfig> = {
    ...defaultSelectFieldConfig,
    fieldName: 'defaultSelection1',
  };

  defaultSelection2: Partial<GnroSelectFieldConfig> = {
    ...defaultSelectFieldConfig,
    fieldName: 'defaultSelection2',
  };

  defaultStateValue = [{ name: 'Nevada', title: 'Nevada' }];
  listDefaultStates = [...STATES].map((state) => {
    return {
      name: state.state,
      title: state.state,
    };
  });
  singleListState2 = 'Louisiana';

  singleObjectState = [STATES[32]];
  multiObjectStates = [STATES[32], STATES[33], STATES[36]];
  multiObjectStates2 = [STATES[8], STATES[32], STATES[36]];

  multiObjectStates3 = [STATES[31], STATES[32], STATES[36]];
  multiObjectStates4 = [STATES[8], STATES[32], STATES[36]];

  multiObjectStates5 = [STATES[8], STATES[32], STATES[36]];
  multiObjectStates6 = [STATES[8], STATES[32], STATES[36]];

  singleListState = 'Louisiana';
  multiListStates7 = ['Louisiana', 'Nevada'];
  multiListStates8 = ['New York', 'Ohio'];
  multiListStates9 = ['Louisiana', 'Nevada'];
  multiListStates10 = ['Louisiana', 'Nevada'];
  multiListStates11 = ['Louisiana', 'Nevada'];
  multiListStates12 = ['Louisiana', 'Nevada'];

  singleSelection: Partial<GnroSelectFieldConfig> = {
    fieldLabel: 'Single Selection (Object)',
    fieldName: 'singleSelection',
    optionLabel: 'state',
    optionKey: 'abbr',
    placeholder: 'Select One...',
  };

  multiSelection: GnroSelectFieldConfig = {
    ...defaultSelectFieldConfig,
    fieldName: 'multiSelection',
    multiSelection: true,
    fieldLabel: 'Multi Selection (Object)',
    optionLabel: 'state',
    optionKey: 'abbr',
    placeholder: 'Select One or More...',
  };

  singleAutocomplete: GnroSelectFieldConfig = {
    ...defaultSelectFieldConfig,
    fieldName: 'singleAutocomplete',
    selectOnly: false,
    fieldLabel: 'Single Autocomplete (Object)',
    optionLabel: 'state',
    optionKey: 'abbr',
    placeholder: 'Select One...',
  };

  multiAutocomplete: GnroSelectFieldConfig = {
    ...defaultSelectFieldConfig,
    fieldName: 'multiAutocomplete',
    multiSelection: true,
    selectOnly: false,
    fieldLabel: 'Multi Autocomplete (Object)',
    optionLabel: 'state',
    optionKey: 'abbr',
    placeholder: 'Select One or More...',
  };

  singleSelectionList: GnroSelectFieldConfig = {
    ...defaultSelectFieldConfig,
    fieldName: 'singleSelectionList',
    fieldLabel: 'Single Selection (list)',
    placeholder: 'Select One...',
  };

  multiSelectionList: GnroSelectFieldConfig = {
    ...defaultSelectFieldConfig,
    fieldName: 'multiSelectionList',
    multiSelection: true,
    fieldLabel: 'Multi Selection (list)',
    placeholder: 'Select One or More...',
  };

  singleAutocompleteList: GnroSelectFieldConfig = {
    ...defaultSelectFieldConfig,
    fieldName: 'singleAutocompleteList',
    selectOnly: false,
    fieldLabel: 'Single Autocomplete (list)',
    placeholder: 'Select One...',
  };

  multiAutocompleteList: GnroSelectFieldConfig = {
    ...defaultSelectFieldConfig,
    fieldName: 'multiAutocompleteList',
    multiSelection: true,
    selectOnly: false,
    fieldLabel: 'Multi Autocomplete (list)',
    placeholder: 'Select One or More...',
  };

  singleSelectionRemote: GnroSelectFieldConfig = {
    ...defaultSelectFieldConfig,
    remoteOptions: true,
    urlKey: 'usa',
    fieldName: 'singleSelectionRemote',
    fieldLabel: 'Single Selection (Object)',
    optionLabel: 'state',
    optionKey: 'abbr',
    placeholder: 'Select One...',
  };

  multiSelectionRemote: GnroSelectFieldConfig = {
    ...defaultSelectFieldConfig,
    remoteOptions: true,
    urlKey: 'usa',
    fieldName: 'multiSelectionRemote',
    multiSelection: true,
    fieldLabel: 'Multi Selection (Object)',
    optionLabel: 'state',
    optionKey: 'abbr',
    placeholder: 'Select One or More...',
  };

  singleAutocompleteRemote: GnroSelectFieldConfig = {
    ...defaultSelectFieldConfig,
    remoteOptions: true,
    urlKey: 'usa',
    fieldName: 'singleAutocompleteRemote',
    selectOnly: false,
    fieldLabel: 'Single Autocomplete (Object)',
    optionLabel: 'state',
    optionKey: 'abbr',
    placeholder: 'Select One...',
  };

  multiAutocompleteRemote: GnroSelectFieldConfig = {
    ...defaultSelectFieldConfig,
    remoteOptions: true,
    urlKey: 'usa',
    fieldName: 'singleAutocompleteRemote',
    multiSelection: true,
    selectOnly: false,
    fieldLabel: 'Multi Autocomplete (Object)',
    optionLabel: 'state',
    optionKey: 'abbr',
    placeholder: 'Select One or More...',
  };

  // ******************
  singleRemoteList: GnroSelectFieldConfig = {
    ...defaultSelectFieldConfig,
    remoteOptions: true,
    urlKey: 'usa',
    fieldName: 'singleRemoteList',
    fieldLabel: 'Single Selection (list)',
    placeholder: 'Select One...',
  };

  multiRemoteList: GnroSelectFieldConfig = {
    ...defaultSelectFieldConfig,
    remoteOptions: true,
    urlKey: 'usa',
    fieldName: 'multiRemoteList',
    multiSelection: true,
    fieldLabel: 'Multi Selection (list)',
    placeholder: 'Select One or More...',
  };

  singleAutocompleteRemoteList: GnroSelectFieldConfig = {
    ...defaultSelectFieldConfig,
    remoteOptions: true,
    urlKey: 'usa',
    fieldName: 'singleAutocompleteRemoteList',
    selectOnly: false,
    fieldLabel: 'Single Autocomplete (list)',
    placeholder: 'Select One...',
  };

  multiAutocompleteRemoteList: GnroSelectFieldConfig = {
    ...defaultSelectFieldConfig,
    remoteOptions: true,
    urlKey: 'usa',
    fieldName: 'multiAutocompleteRemoteList',
    multiSelection: true,
    selectOnly: false,
    fieldLabel: 'Multi Autocomplete (list)',
    placeholder: 'Select One or More...',
  };

  // all remotes
  singleRemote: GnroSelectFieldConfig = {
    ...defaultSelectFieldConfig,
    remoteConfig: true,
    urlKey: 'usa',
    fieldName: 'SingleRemote',
  };

  multiRemote: GnroSelectFieldConfig = {
    ...defaultSelectFieldConfig,
    remoteConfig: true,
    urlKey: 'usa',
    fieldName: 'MultiRemote',
  };

  singleAutocompleteRemotes: GnroSelectFieldConfig = {
    ...defaultSelectFieldConfig,
    remoteConfig: true,
    urlKey: 'usa',
    fieldName: 'SingleAutocompleteRemotes',
  };

  multiAutocompleteRemotes: GnroSelectFieldConfig = {
    ...defaultSelectFieldConfig,
    remoteConfig: true,
    urlKey: 'usa',
    fieldName: 'MultiAutocompleteRemotes',
  };

  // all remotes
  singleAllRemoteList: GnroSelectFieldConfig = {
    ...defaultSelectFieldConfig,
    remoteConfig: true,
    urlKey: 'usa',
    fieldName: 'SingleAllRemoteList',
  };

  multiAllRemoteList: GnroSelectFieldConfig = {
    ...defaultSelectFieldConfig,
    remoteConfig: true,
    urlKey: 'usa',
    fieldName: 'MultiAllRemoteList',
  };

  singleAllAutocompleteRemoteList: GnroSelectFieldConfig = {
    ...defaultSelectFieldConfig,
    remoteConfig: true,
    urlKey: 'usa',
    fieldName: 'SingleAllAutocompleteRemoteList',
  };

  multiAllAutocompleteRemotes: GnroSelectFieldConfig = {
    ...defaultSelectFieldConfig,
    remoteConfig: true,
    urlKey: 'usa',
    fieldName: 'MultiAllAutocompleteRemotes',
  };

  constructor() {}
}
