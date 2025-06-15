import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IccSelectFieldConfig, IccSelectFieldComponent, defaultSelectFieldConfig } from '@icc/ui/fields';
import { State, STATES } from '../../../../data/states';

@Component({
  selector: 'app-simple-select',
  templateUrl: './simple-select.component.html',
  styleUrls: ['./simple-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, IccSelectFieldComponent],
})
export class AppSimpleSelectComponent {
  states = STATES;
  listStates = [...STATES].map((state) => state.state);

  defaultSelection: Partial<IccSelectFieldConfig> = {
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

  singleSelection: Partial<IccSelectFieldConfig> = {
    fieldLabel: 'Single Selection (Object)',
    optionLabel: 'state',
    optionKey: 'abbr',
    placeholder: 'Select One...',
  };

  multiSelection: IccSelectFieldConfig = {
    ...defaultSelectFieldConfig,
    multiSelection: true,
    fieldLabel: 'Multi Selection (Object)',
    optionLabel: 'state',
    optionKey: 'abbr',
    placeholder: 'Select One or More...',
  };

  singleAutocomplete: IccSelectFieldConfig = {
    ...defaultSelectFieldConfig,
    selectOnly: false,
    fieldLabel: 'Single Autocomplete (Object)',
    optionLabel: 'state',
    optionKey: 'abbr',
    placeholder: 'Select One...',
  };

  multiAutocomplete: IccSelectFieldConfig = {
    ...defaultSelectFieldConfig,
    multiSelection: true,
    selectOnly: false,
    fieldLabel: 'Multi Autocomplete (Object)',
    optionLabel: 'state',
    optionKey: 'abbr',
    placeholder: 'Select One or More...',
  };

  singleSelectionList: IccSelectFieldConfig = {
    ...defaultSelectFieldConfig,
    fieldLabel: 'Single Selection (list)',
    placeholder: 'Select One...',
  };

  multiSelectionList: IccSelectFieldConfig = {
    ...defaultSelectFieldConfig,
    multiSelection: true,
    fieldLabel: 'Multi Selection (list)',
    placeholder: 'Select One or More...',
  };

  singleAutocompleteList: IccSelectFieldConfig = {
    ...defaultSelectFieldConfig,
    selectOnly: false,
    fieldLabel: 'Single Autocomplete (list)',
    placeholder: 'Select One...',
  };

  multiAutocompleteList: IccSelectFieldConfig = {
    ...defaultSelectFieldConfig,
    multiSelection: true,
    selectOnly: false,
    fieldLabel: 'Multi Autocomplete (list)',
    placeholder: 'Select One or More...',
  };

  singleSelectionRemote: IccSelectFieldConfig = {
    ...defaultSelectFieldConfig,
    remoteOptions: true,
    urlKey: 'usa',
    fieldName: 'state',
    fieldLabel: 'Single Selection (Object)',
    optionLabel: 'state',
    optionKey: 'abbr',
    placeholder: 'Select One...',
  };

  multiSelectionRemote: IccSelectFieldConfig = {
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

  singleAutocompleteRemote: IccSelectFieldConfig = {
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

  multiAutocompleteRemote: IccSelectFieldConfig = {
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
  singleRemoteList: IccSelectFieldConfig = {
    ...defaultSelectFieldConfig,
    remoteOptions: true,
    urlKey: 'usa',
    fieldName: 'statelist',
    fieldLabel: 'Single Selection (list)',
    placeholder: 'Select One...',
  };

  multiRemoteList: IccSelectFieldConfig = {
    ...defaultSelectFieldConfig,
    remoteOptions: true,
    urlKey: 'usa',
    fieldName: 'statelist',
    multiSelection: true,
    fieldLabel: 'Multi Selection (list)',
    placeholder: 'Select One or More...',
  };

  singleAutocompleteRemoteList: IccSelectFieldConfig = {
    ...defaultSelectFieldConfig,
    remoteOptions: true,
    urlKey: 'usa',
    fieldName: 'statelist',
    selectOnly: false,
    fieldLabel: 'Single Autocomplete (list)',
    placeholder: 'Select One...',
  };

  multiAutocompleteRemoteList: IccSelectFieldConfig = {
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
  singleRemote: IccSelectFieldConfig = {
    ...defaultSelectFieldConfig,
    remoteConfig: true,
    urlKey: 'usa',
    fieldName: 'SingleRemote',
  };

  multiRemote: IccSelectFieldConfig = {
    ...defaultSelectFieldConfig,
    remoteConfig: true,
    urlKey: 'usa',
    fieldName: 'MultiRemote',
  };

  singleAutocompleteRemotes: IccSelectFieldConfig = {
    ...defaultSelectFieldConfig,
    remoteConfig: true,
    urlKey: 'usa',
    fieldName: 'SingleAutocompleteRemotes',
  };

  multiAutocompleteRemotes: IccSelectFieldConfig = {
    ...defaultSelectFieldConfig,
    remoteConfig: true,
    urlKey: 'usa',
    fieldName: 'MultiAutocompleteRemotes',
  };

  // all remotes
  singleAllRemoteList: IccSelectFieldConfig = {
    ...defaultSelectFieldConfig,
    remoteConfig: true,
    urlKey: 'usa',
    fieldName: 'SingleAllRemoteList',
  };

  multiAllRemoteList: IccSelectFieldConfig = {
    ...defaultSelectFieldConfig,
    remoteConfig: true,
    urlKey: 'usa',
    fieldName: 'MultiAllRemoteList',
  };

  singleAllAutocompleteRemoteList: IccSelectFieldConfig = {
    ...defaultSelectFieldConfig,
    remoteConfig: true,
    urlKey: 'usa',
    fieldName: 'SingleAllAutocompleteRemoteList',
  };

  multiAllAutocompleteRemotes: IccSelectFieldConfig = {
    ...defaultSelectFieldConfig,
    remoteConfig: true,
    urlKey: 'usa',
    fieldName: 'MultiAllAutocompleteRemotes',
  };

  constructor() {}
}
