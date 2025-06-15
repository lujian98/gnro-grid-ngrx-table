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
  listStates = [...STATES].map((state) => state.state);

  defaultSelection: Partial<GnroSelectFieldConfig> = {
    ...defaultSelectFieldConfig,
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
  multiObjectStates = [STATES[2], STATES[32], STATES[36]];
  singleListState = 'Louisiana';
  multiListStates = ['Louisiana', 'Nevada'];

  singleSelection: Partial<GnroSelectFieldConfig> = {
    fieldLabel: 'Single Selection (Object)',
    optionLabel: 'state',
    optionKey: 'abbr',
    placeholder: 'Select One...',
  };

  multiSelection: GnroSelectFieldConfig = {
    ...defaultSelectFieldConfig,
    multiSelection: true,
    fieldLabel: 'Multi Selection (Object)',
    optionLabel: 'state',
    optionKey: 'abbr',
    placeholder: 'Select One or More...',
  };

  singleAutocomplete: GnroSelectFieldConfig = {
    ...defaultSelectFieldConfig,
    selectOnly: false,
    fieldLabel: 'Single Autocomplete (Object)',
    optionLabel: 'state',
    optionKey: 'abbr',
    placeholder: 'Select One...',
  };

  multiAutocomplete: GnroSelectFieldConfig = {
    ...defaultSelectFieldConfig,
    multiSelection: true,
    selectOnly: false,
    fieldLabel: 'Multi Autocomplete (Object)',
    optionLabel: 'state',
    optionKey: 'abbr',
    placeholder: 'Select One or More...',
  };

  singleSelectionList: GnroSelectFieldConfig = {
    ...defaultSelectFieldConfig,
    fieldLabel: 'Single Selection (list)',
    placeholder: 'Select One...',
  };

  multiSelectionList: GnroSelectFieldConfig = {
    ...defaultSelectFieldConfig,
    multiSelection: true,
    fieldLabel: 'Multi Selection (list)',
    placeholder: 'Select One or More...',
  };

  singleAutocompleteList: GnroSelectFieldConfig = {
    ...defaultSelectFieldConfig,
    selectOnly: false,
    fieldLabel: 'Single Autocomplete (list)',
    placeholder: 'Select One...',
  };

  multiAutocompleteList: GnroSelectFieldConfig = {
    ...defaultSelectFieldConfig,
    multiSelection: true,
    selectOnly: false,
    fieldLabel: 'Multi Autocomplete (list)',
    placeholder: 'Select One or More...',
  };

  singleSelectionRemote: GnroSelectFieldConfig = {
    ...defaultSelectFieldConfig,
    remoteOptions: true,
    urlKey: 'usa',
    fieldName: 'state',
    fieldLabel: 'Single Selection (Object)',
    optionLabel: 'state',
    optionKey: 'abbr',
    placeholder: 'Select One...',
  };

  multiSelectionRemote: GnroSelectFieldConfig = {
    ...defaultSelectFieldConfig,
    remoteOptions: true,
    urlKey: 'usa',
    fieldName: 'state',
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
    fieldName: 'state',
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
    fieldName: 'state',
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
    fieldName: 'statelist',
    fieldLabel: 'Single Selection (list)',
    placeholder: 'Select One...',
  };

  multiRemoteList: GnroSelectFieldConfig = {
    ...defaultSelectFieldConfig,
    remoteOptions: true,
    urlKey: 'usa',
    fieldName: 'statelist',
    multiSelection: true,
    fieldLabel: 'Multi Selection (list)',
    placeholder: 'Select One or More...',
  };

  singleAutocompleteRemoteList: GnroSelectFieldConfig = {
    ...defaultSelectFieldConfig,
    remoteOptions: true,
    urlKey: 'usa',
    fieldName: 'statelist',
    selectOnly: false,
    fieldLabel: 'Single Autocomplete (list)',
    placeholder: 'Select One...',
  };

  multiAutocompleteRemoteList: GnroSelectFieldConfig = {
    ...defaultSelectFieldConfig,
    remoteOptions: true,
    urlKey: 'usa',
    fieldName: 'statelist',
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
