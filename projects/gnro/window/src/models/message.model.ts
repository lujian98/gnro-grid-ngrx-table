import { defaultWindowConfig, GnroWindowConfig } from './window.model';

export interface GnroMessageConfig extends GnroWindowConfig {
  showFooter: boolean;
  showOkButton: boolean;
  ok: string;
  showCancelButton: boolean;
  cancel: string;
  showCloseButton: boolean;
  close: string;
  message: string;
  autoClose: boolean;
  duration: number;
}

export const defaultMessageConfig: GnroMessageConfig = {
  ...defaultWindowConfig,
  showFooter: true,
  title: 'Message',
  showOkButton: false,
  ok: 'GNRO.UI.ACTIONS.OK',
  showCancelButton: false,
  cancel: 'GNRO.UI.ACTIONS.CANCEL',
  showCloseButton: false,
  close: 'GNRO.UI.ACTIONS.CLOSE',
  message: '',
  autoClose: false,
  duration: 3000,
  width: '400px',
};
