import { NgModule } from '@angular/core';
import { IccIconLibraries } from './icon-libraries';

@NgModule({})
export class IccFontAwesomeIconsModule {
  constructor(iconLibrary: IccIconLibraries) {
    iconLibrary.registerFontPack('fa', { packClass: 'fa', iconClassPrefix: 'fa' });
    // Font Awesome 5 solid icons
    // iconLibrary.registerFontPack('fas', { packClass: 'fas', iconClassPrefix: 'fa' });
    // Font Awesome 5 regular icons
    iconLibrary.registerFontPack('far', { packClass: 'far', iconClassPrefix: 'fa' });
    iconLibrary.setDefaultPack('fa');
  }
}
