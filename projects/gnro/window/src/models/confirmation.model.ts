import { defaultWindowConfig, GnroWindowConfig } from './window.model';

export interface GnroConfirmationConfig extends GnroWindowConfig {
  showFooter: boolean;
  showOkButton: boolean;
  ok: string;
  showCancelButton: boolean;
  cancel: string;
  showCloseButton: boolean;
  close: string;
  message: string;
}

export const defaultConfirmationConfig: GnroConfirmationConfig = {
  ...defaultWindowConfig,
  showFooter: true,
  title: 'Confirmation',
  showOkButton: false,
  ok: 'GNRO.UI.ACTIONS.OK',
  showCancelButton: false,
  cancel: 'GNRO.UI.ACTIONS.CANCEL',
  showCloseButton: false,
  close: 'GNRO.UI.ACTIONS.CLOSE',
  message: '',
  width: '400px',
};
